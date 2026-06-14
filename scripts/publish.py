#!/usr/bin/env python3
"""TRIZEN Publish — password → deploy (log file e error dekhabe)."""
from __future__ import annotations

import subprocess
import threading
import time
import tkinter as tk
from datetime import datetime
from pathlib import Path
from tkinter import scrolledtext, ttk

ROOT = Path(__file__).resolve().parent.parent
LOG_FILE = ROOT / "last-deploy.log"
HOST = "144.79.133.209"
USER = "root"
REMOTE_CMD = "cd /var/www/trizen && bash scripts/vps-update.sh"


class PublishApp:
    def __init__(self) -> None:
        self.root = tk.Tk()
        self.root.title("TRIZEN Deploy")
        self.root.resizable(False, False)
        self.root.geometry("560x460")
        self.root.configure(padx=18, pady=16)
        self.busy = False
        self._build_ui()
        self._bring_to_front()

    def _build_ui(self) -> None:
        ttk.Label(self.root, text="TRIZEN Deploy", font=("Segoe UI", 15, "bold")).pack(
            anchor="w"
        )
        ttk.Label(
            self.root,
            text="VPS password dao → Deploy click. Sob log niche + last-deploy.log",
            foreground="#555",
            wraplength=500,
        ).pack(anchor="w", pady=(6, 12))

        row = ttk.Frame(self.root)
        row.pack(fill="x")
        ttk.Label(row, text="VPS password", width=14).pack(side="left")
        self.pwd_var = tk.StringVar()
        self.pwd_entry = ttk.Entry(row, textvariable=self.pwd_var, show="•", width=36)
        self.pwd_entry.pack(side="left", fill="x", expand=True)
        self.pwd_entry.focus_set()

        self.push_first = tk.BooleanVar(value=True)
        ttk.Checkbutton(
            self.root,
            text="Age commit + push kore deploy (unchecked = shudhu VPS deploy)",
            variable=self.push_first,
        ).pack(anchor="w", pady=(10, 8))

        btn_row = ttk.Frame(self.root)
        btn_row.pack(fill="x", pady=(0, 8))
        self.go_btn = ttk.Button(btn_row, text="Deploy", command=self.start)
        self.go_btn.pack(side="left")

        self.status = ttk.Label(self.root, text="Ready", foreground="#666")
        self.status.pack(anchor="w", pady=(0, 6))

        self.log = scrolledtext.ScrolledText(
            self.root,
            height=16,
            wrap="word",
            font=("Consolas", 9),
            bg="#111",
            fg="#eee",
            relief="flat",
        )
        self.log.pack(fill="both", expand=True)
        self.log.configure(state="disabled")
        self.root.bind("<Return>", lambda _e: self.start())

    def _bring_to_front(self) -> None:
        self.root.update_idletasks()
        self.root.lift()
        self.root.attributes("-topmost", True)
        self.root.after(200, lambda: self.root.attributes("-topmost", False))
        self.pwd_entry.focus_set()

    def _log(self, text: str) -> None:
        with LOG_FILE.open("a", encoding="utf-8") as f:
            f.write(text)

        def append() -> None:
            self.log.configure(state="normal")
            self.log.insert("end", text)
            self.log.see("end")
            self.log.configure(state="disabled")

        self.root.after(0, append)

    def _clear(self) -> None:
        LOG_FILE.write_text(
            f"=== TRIZEN Deploy {datetime.now().isoformat(timespec='seconds')} ===\n",
            encoding="utf-8",
        )
        self.log.configure(state="normal")
        self.log.delete("1.0", "end")
        self.log.configure(state="disabled")

    def _set_busy(self, busy: bool, msg: str) -> None:
        self.busy = busy
        state = tk.DISABLED if busy else tk.NORMAL
        self.go_btn.configure(state=state)
        self.pwd_entry.configure(state=state)
        self.status.configure(text=msg)

    def start(self) -> None:
        if self.busy:
            return
        pwd = self.pwd_var.get().strip()
        if not pwd:
            self._log("[ERROR] Password likhun.\n")
            return
        threading.Thread(target=lambda: self._run(pwd), daemon=True).start()

    def _run(self, password: str) -> None:
        self._set_busy(True, "Deploying…")
        self._clear()

        if self.push_first.get():
            self._log(">>> Step 1: Git push\n\n")
            if not self._git_push():
                self._set_busy(False, "Push failed")
                return
            self._log("\n>>> Step 2: VPS deploy\n\n")
        else:
            self._log(">>> VPS deploy only\n\n")

        self._deploy(password)

    def _git_push(self) -> bool:
        try:
            branch = (
                subprocess.check_output(
                    ["git", "branch", "--show-current"], cwd=ROOT, text=True
                ).strip()
                or "main"
            )
            dirty = subprocess.check_output(
                ["git", "status", "--porcelain"], cwd=ROOT, text=True
            ).strip()
            if dirty:
                self._log(f"{len(dirty.splitlines())} file commit…\n")
                if not self._git(["git", "add", "-A"]):
                    return False
                if not self._git(["git", "commit", "-m", "Update website"]):
                    return False
            self._log(f"Push origin/{branch}…\n")
            return self._git(["git", "push", "-u", "origin", branch])
        except Exception as exc:
            self._log(f"[ERROR] {exc}\n")
            return False

    def _git(self, cmd: list[str]) -> bool:
        proc = subprocess.Popen(
            cmd,
            cwd=ROOT,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
        assert proc.stdout is not None
        for line in proc.stdout:
            self._log(line)
        proc.wait()
        return proc.returncode == 0

    def _deploy(self, password: str) -> None:
        try:
            import paramiko
        except ImportError:
            self._log("[ERROR] pip install paramiko\n")
            self._set_busy(False, "paramiko missing")
            return

        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            self._log(f"SSH connect {USER}@{HOST}…\n")
            client.connect(
                HOST,
                username=USER,
                password=password,
                timeout=60,
                banner_timeout=60,
                auth_timeout=60,
                allow_agent=False,
                look_for_keys=False,
            )
            self._log("Connected OK.\nRunning vps-update.sh (2–5 min)…\n\n")
            _, stdout, stderr = client.exec_command(REMOTE_CMD, get_pty=True)
            ch = stdout.channel
            while True:
                while ch.recv_ready():
                    self._log(ch.recv(4096).decode("utf-8", errors="replace"))
                if ch.exit_status_ready():
                    break
                time.sleep(0.15)
            while ch.recv_ready():
                self._log(ch.recv(4096).decode("utf-8", errors="replace"))

            err = stderr.read().decode("utf-8", errors="replace")
            if err.strip():
                self._log(f"\nSTDERR:\n{err}")
            code = ch.recv_exit_status()
            if code == 0:
                self._log("\n[OK] LIVE: https://trizenstore.com.bd\n")
                self._set_busy(False, "Deploy done!")
            else:
                self._log(f"\n[FAILED] VPS script exit code: {code}\n")
                self._set_busy(False, f"Failed (exit {code})")
        except paramiko.AuthenticationException:
            self._log("\n[ERROR] Password vul — VPS root password check koro.\n")
            self._set_busy(False, "Wrong password")
        except Exception as exc:
            self._log(f"\n[ERROR] {type(exc).__name__}: {exc}\n")
            self._set_busy(False, "Failed")
        finally:
            client.close()

    def run(self) -> None:
        self.root.mainloop()


def main() -> None:
    PublishApp().run()


if __name__ == "__main__":
    main()
