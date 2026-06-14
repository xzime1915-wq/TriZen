#!/usr/bin/env python3
"""TRIZEN Publish — VPS deploy: password field, then auto-runs deploy in CMD."""
from __future__ import annotations

import os
import subprocess
import sys
import threading
import tkinter as tk
from pathlib import Path
from tkinter import messagebox, ttk


ROOT = Path(__file__).resolve().parent.parent
REMOTE_SCRIPT = ROOT / "scripts" / "vps-deploy-remote.py"


def bring_window_to_front(root: tk.Tk) -> None:
    root.update_idletasks()
    root.deiconify()
    root.lift()
    root.focus_force()
    root.attributes("-topmost", True)
    root.after(300, lambda: root.attributes("-topmost", False))

    if sys.platform == "win32":
        try:
            import ctypes

            hwnd = ctypes.windll.user32.GetParent(root.winfo_id())
            ctypes.windll.user32.SetForegroundWindow(hwnd)
        except Exception:
            pass


def python_launcher() -> list[str]:
    for candidate in (["py", "-3"], ["python"]):
        try:
            subprocess.run(
                [*candidate, "--version"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                check=True,
            )
            return list(candidate)
        except (OSError, subprocess.CalledProcessError):
            continue
    return ["python"]


def spawn_deploy_cmd(password: str) -> None:
    env = os.environ.copy()
    env["VPS_PASSWORD"] = password

    launcher = python_launcher()
    py_cmd = " ".join(launcher)
    cmd_line = (
        f'cd /d "{ROOT}" && {py_cmd} "{REMOTE_SCRIPT}" && echo. && pause'
    )

    subprocess.Popen(
        ["cmd.exe", "/k", cmd_line],
        env=env,
        creationflags=getattr(subprocess, "CREATE_NEW_CONSOLE", 0),
    )


def ensure_paramiko() -> bool:
    try:
        import paramiko  # noqa: F401
        return True
    except ImportError:
        messagebox.showerror(
            "TRIZEN Publish",
            "paramiko missing.\n\nRun in CMD:\n  pip install paramiko",
        )
        return False


def on_deploy(
    password: str,
    status: ttk.Label,
    deploy_btn: ttk.Button,
    root: tk.Tk,
) -> None:
    if not password.strip():
        messagebox.showwarning("TRIZEN Publish", "VPS password likhun.")
        return

    if not ensure_paramiko():
        return

    deploy_btn.config(state=tk.DISABLED)
    status.config(text="CMD window khulche…")

    try:
        spawn_deploy_cmd(password)
        status.config(text="Deploy CMD e cholche…")
        messagebox.showinfo(
            "TRIZEN Publish",
            "Deploy CMD window khule geche.\n\n"
            "Shekhane log dekhte paben.\n"
            "Shesh hole: https://trizenstore.com.bd",
        )
        root.destroy()
    except Exception as exc:
        messagebox.showerror("TRIZEN Publish", str(exc))
        deploy_btn.config(state=tk.NORMAL)
        status.config(text="Ready")


def main() -> None:
    root = tk.Tk()
    root.title("TRIZEN Publish — VPS Deploy")
    root.resizable(False, False)
    root.configure(padx=20, pady=16)

    frm = ttk.Frame(root, padding=0)
    frm.grid(row=0, column=0, sticky="nsew")

    ttk.Label(
        frm,
        text="VPS password",
        font=("Segoe UI", 10, "bold"),
    ).grid(row=0, column=0, columnspan=2, sticky="w", pady=(0, 8))

    ttk.Label(
        frm,
        text="Deploy click korle CMD automatic khulbe.",
        foreground="#666",
    ).grid(row=1, column=0, columnspan=2, sticky="w", pady=(0, 10))

    pwd_var = tk.StringVar()
    pwd = ttk.Entry(frm, textvariable=pwd_var, show="•", width=34)
    pwd.grid(row=2, column=0, columnspan=2, sticky="ew", pady=(0, 12))
    pwd.focus_set()

    status = ttk.Label(frm, text="Ready", foreground="#666")
    status.grid(row=3, column=0, columnspan=2, sticky="w", pady=(0, 10))

    def start_deploy() -> None:
        threading.Thread(
            target=on_deploy,
            args=(pwd_var.get(), status, deploy_btn, root),
            daemon=True,
        ).start()

    deploy_btn = ttk.Button(frm, text="Deploy", command=start_deploy)
    deploy_btn.grid(row=4, column=0, sticky="w")

    ttk.Button(frm, text="Cancel", command=root.destroy).grid(
        row=4, column=1, sticky="e", padx=(8, 0)
    )

    root.bind("<Return>", lambda _e: start_deploy())
    root.eval("tk::PlaceWindow . center")
    bring_window_to_front(root)
    root.mainloop()


if __name__ == "__main__":
    main()
