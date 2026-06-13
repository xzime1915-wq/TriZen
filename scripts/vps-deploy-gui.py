#!/usr/bin/env python3
"""VPS deploy — password dialog only, then runs vps-update.sh on server."""
import os
import sys
import threading
import tkinter as tk
from tkinter import messagebox, ttk


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

try:
    import paramiko
except ImportError:
    root = tk.Tk()
    root.withdraw()
    messagebox.showerror(
        "TriZen Deploy",
        "paramiko missing. Run: pip install paramiko",
    )
    raise SystemExit(1)

HOST = os.environ.get("VPS_HOST", "144.79.133.209")
USER = os.environ.get("VPS_USER", "root")
REMOTE_CMD = "cd /var/www/trizen && bash scripts/vps-update.sh"


def run_deploy(password: str, status: ttk.Label, root: tk.Tk, deploy_btn: ttk.Button) -> None:
    deploy_btn.config(state=tk.DISABLED)
    status.config(text="Connecting…")

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        client.connect(
            HOST,
            username=USER,
            password=password,
            timeout=30,
            allow_agent=False,
            look_for_keys=False,
        )
        status.config(text="Deploying… (2–5 min)")
        stdin, stdout, stderr = client.exec_command(REMOTE_CMD, get_pty=True)
        del stdin

        for line in stdout:
            status.config(text=line.strip()[:72] or "Deploying…")

        code = stdout.channel.recv_exit_status()
        err = stderr.read().decode().strip()

        if code == 0:
            messagebox.showinfo(
                "TriZen Deploy",
                "Done!\n\nhttps://trizenstore.com.bd\nHard refresh: Ctrl+Shift+R",
            )
            root.destroy()
            return

        messagebox.showerror(
            "TriZen Deploy failed",
            err or f"Exit code {code}",
        )
    except Exception as exc:
        messagebox.showerror("TriZen Deploy failed", str(exc))
    finally:
        client.close()
        deploy_btn.config(state=tk.NORMAL)
        status.config(text="Ready")


def main() -> None:
    root = tk.Tk()
    root.title("TriZen VPS Deploy")
    root.resizable(False, False)
    root.configure(padx=20, pady=16)

    frm = ttk.Frame(root, padding=0)
    frm.grid(row=0, column=0, sticky="nsew")

    ttk.Label(frm, text="VPS password", font=("Segoe UI", 10, "bold")).grid(
        row=0, column=0, columnspan=2, sticky="w", pady=(0, 8)
    )

    pwd_var = tk.StringVar()
    pwd = ttk.Entry(frm, textvariable=pwd_var, show="•", width=32)
    pwd.grid(row=1, column=0, columnspan=2, sticky="ew", pady=(0, 12))
    pwd.focus_set()

    status = ttk.Label(frm, text="Ready", foreground="#666")
    status.grid(row=2, column=0, columnspan=2, sticky="w", pady=(0, 10))

    def on_deploy() -> None:
        password = pwd_var.get()
        if not password.strip():
            messagebox.showwarning("TriZen Deploy", "Password likhun.")
            return
        threading.Thread(
            target=run_deploy,
            args=(password, status, root, deploy_btn),
            daemon=True,
        ).start()

    deploy_btn = ttk.Button(frm, text="Deploy", command=on_deploy)
    deploy_btn.grid(row=3, column=0, sticky="w")

    ttk.Button(frm, text="Cancel", command=root.destroy).grid(
        row=3, column=1, sticky="e", padx=(8, 0)
    )

    root.bind("<Return>", lambda _e: on_deploy())
    root.eval("tk::PlaceWindow . center")
    bring_window_to_front(root)
    root.mainloop()


if __name__ == "__main__":
    main()
