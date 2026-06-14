#!/usr/bin/env python3
"""TRIZEN Publish — password diye ek click e commit + push + deploy."""
from __future__ import annotations

import subprocess
import threading
import time
import tkinter as tk
from pathlib import Path
from tkinter import scrolledtext, ttk

ROOT = Path(__file__).resolve().parent.parent
HOST = "144.79.133.209"
USER = "root"
REMOTE_CMD = "cd /var/www/trizen && bash scripts/vps-update.sh"
COMMIT_MSG = "Update website"


class PublishApp:
    def __init__(self) -> None:
        self.root = tk.Tk()
        self.root.title("TRIZEN Publish")
        self.root.resizable(False, False)
        self.root.geometry("520x420")
        self.root.configure(padx=18, pady=16)

        self.busy = False
        self._build_ui()
        self._bring_to_front()

    def _build_ui(self) -> None:
        ttk.Label(
            self.root,
            text="TRIZEN Publish",
            font=("Segoe UI", 15, "bold"),
        ).pack(anchor="w")

        ttk.Label(
            self.root,
            text="Password dao — baki shob automatic (commit, push, deploy)",
            foreground="#555",
            wraplength=460,
        ).pack(anchor="w", pady=(6, 14))

        row = ttk.Frame(self.root)
        row.pack(fill="x")
        ttk.Label(row, text="VPS password", width=14).pack(side="left")
        self.pwd_var = tk.StringVar()
        self.pwd_entry = ttk.Entry(row, textvariable=self.pwd_var, show="•", width=34)
        self.pwd_entry.pack(side="left", fill="x", expand=True)
        self.pwd_entry.focus_set()

        self.go_btn = ttk.Button(
            self.root,
            text="Publish",
            command=self.start,
        )
        self.go_btn.pack(anchor="w", pady=(12, 8))

        self.status = ttk.Label(self.root, text="Ready", foreground="#666")
        self.status.pack(anchor="w", pady=(0, 6))

        self.log = scrolledtext.ScrolledText(
            self.root,
            height=14,
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
        def append() -> None:
            self.log.configure(state="normal")
            self.log.insert("end", text)
            self.log.see("end")
            self.log.configure(state="disabled")

        self.root.after(0, append)

    def _clear(self) -> None:
        self.log.configure(state="normal")
        self.log.delete("1.0", "end")
        self.log.configure(state="disabled")

    def _set_busy(self, busy: bool, msg: str) -> None:
        self.busy = busy
        self.go_btn.configure(state=tk.DISABLED if busy else tk.NORMAL)
        self.pwd_entry.configure(state=tk.DISABLED if busy else tk.NORMAL)
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
        self._set_busy(True, "Publishing…")
        self._clear()
        self._log("=== TRIZEN Publish ===\n\n")

        if not self._git_push():
            self._set_busy(False, "Failed")
            return

        self._log("\n--- VPS Deploy (2–5 min) ---\n\n")
        self._deploy(password)

    def _git_push(self) -> bool:
        try:
            branch = (
                subprocess.check_output(
                    ["git", "branch", "--show-current"],
                    cwd=ROOT,
                    text=True,
                ).strip()
                or "main"
            )
            dirty = subprocess.check_output(
                ["git", "status", "--porcelain"], cwd=ROOT, text=True
            ).strip()

            if dirty:
                n = len(dirty.splitlines())
                self._log(f">>> {n} file commit hocche…\n")
                if not self._git(["git", "add", "-A"]):
                    return False
                if not self._git(["git", "commit", "-m", COMMIT_MSG]):
                    return False
                self._log("[OK] Commit done.\n")
            else:
                self._log("No new changes to commit.\n")

            self._log(f"\n>>> GitHub e push ({branch})…\n")
            if not self._git(["git", "push", "-u", "origin", branch]):
                return False

            left = subprocess.check_output(
                ["git", "status", "--porcelain"], cwd=ROOT, text=True
            ).strip()
            if left:
                self._log("[FAILED] Push hoy ni — local file ache.\n")
                return False

            self._log("[OK] GitHub push done.\n")
            return True
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
            self._log(f"Connecting {HOST}…\n")
            client.connect(
                HOST,
                username=USER,
                password=password,
                timeout=45,
                allow_agent=False,
                look_for_keys=False,
            )
            self._log("Connected. Building on VPS…\n\n")
            _, stdout, stderr = client.exec_command(REMOTE_CMD, get_pty=True)
            ch = stdout.channel
            while True:
                while ch.recv_ready():
                    self._log(ch.recv(4096).decode("utf-8", errors="replace"))
                if ch.exit_status_ready():
                    break
                time.sleep(0.1)
            while ch.recv_ready():
                self._log(ch.recv(4096).decode("utf-8", errors="replace"))

            err = stderr.read().decode("utf-8", errors="replace")
            if err.strip():
                self._log(err)
            code = ch.recv_exit_status()
            if code == 0:
                self._log("\n[OK] LIVE: https://trizenstore.com.bd\n")
                self._set_busy(False, "Done!")
            else:
                self._log(f"\n[FAILED] Deploy exit {code}\n")
                self._set_busy(False, "Deploy failed")
        except Exception as exc:
            self._log(f"\n[ERROR] {exc}\n")
            self._set_busy(False, "Failed")
        finally:
            client.close()

    def run(self) -> None:
        self.root.mainloop()


def main() -> None:
    PublishApp().run()


if __name__ == "__main__":
    main()
