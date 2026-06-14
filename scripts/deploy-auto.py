#!/usr/bin/env python3
"""Silent VPS deploy — reads VPS_SSH_PASSWORD from .env.vps (gitignored)."""
from __future__ import annotations

import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENV_VPS = ROOT / ".env.vps"
HOST = "144.79.133.209"
USER = "root"
REMOTE_CMD = "cd /var/www/trizen && bash scripts/vps-update.sh"


def load_vps_password() -> str:
    if not ENV_VPS.is_file():
        print(f"[ERROR] {ENV_VPS.name} file nei.", file=sys.stderr)
        sys.exit(1)
    text = ENV_VPS.read_text(encoding="utf-8")
    match = re.search(r'^VPS_SSH_PASSWORD="?([^"\n#]+)"?\s*$', text, re.M)
    if not match or not match.group(1).strip():
        print(
            "[ERROR] .env.vps e VPS_SSH_PASSWORD= তোমার Contabo root password likho.",
            file=sys.stderr,
        )
        sys.exit(1)
    return match.group(1).strip()


def git_push() -> None:
    dirty = subprocess.check_output(
        ["git", "status", "--porcelain"], cwd=ROOT, text=True
    ).strip()
    branch = (
        subprocess.check_output(
            ["git", "branch", "--show-current"], cwd=ROOT, text=True
        ).strip()
        or "main"
    )
    if dirty:
        print(f">>> {len(dirty.splitlines())} file commit…")
        subprocess.run(["git", "add", "-A"], cwd=ROOT, check=True)
        subprocess.run(
            ["git", "commit", "-m", "Update website"], cwd=ROOT, check=True
        )
    print(f">>> git push origin/{branch}…")
    subprocess.run(["git", "push", "-u", "origin", branch], cwd=ROOT, check=True)
    print("[OK] GitHub push done.")


def vps_deploy(password: str) -> int:
    import paramiko

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print(f">>> SSH {USER}@{HOST}…")
    client.connect(
        HOST,
        username=USER,
        password=password,
        timeout=60,
        allow_agent=False,
        look_for_keys=False,
    )
    print(">>> VPS deploy (2–5 min)…")
    _, stdout, stderr = client.exec_command(REMOTE_CMD, get_pty=True)
    ch = stdout.channel
    while True:
        while ch.recv_ready():
            sys.stdout.write(ch.recv(4096).decode("utf-8", errors="replace"))
            sys.stdout.flush()
        if ch.exit_status_ready():
            break
        time.sleep(0.1)
    while ch.recv_ready():
        sys.stdout.write(ch.recv(4096).decode("utf-8", errors="replace"))
        sys.stdout.flush()
    err = stderr.read().decode("utf-8", errors="replace")
    if err.strip():
        print(err, file=sys.stderr)
    code = ch.recv_exit_status()
    client.close()
    return code


def main() -> int:
    password = load_vps_password()
    git_push()
    code = vps_deploy(password)
    if code == 0:
        print("\n[OK] LIVE: https://trizenstore.com.bd")
    else:
        print(f"\n[FAILED] exit {code}", file=sys.stderr)
    return code


if __name__ == "__main__":
    raise SystemExit(main())
