#!/usr/bin/env python3
"""Deploy to VPS from local PC: git already pushed, then run vps-update.sh on server."""
import os
import sys

import paramiko

HOST = os.environ.get("VPS_HOST", "144.79.133.209")
USER = os.environ.get("VPS_USER", "root")
PASSWORD = os.environ.get("VPS_PASSWORD", "")
REMOTE_CMD = "cd /var/www/trizen && bash scripts/vps-update.sh"


def main() -> int:
    if not PASSWORD:
        print("Set VPS_PASSWORD env var.", file=sys.stderr)
        return 1

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        print(f"Connecting to {USER}@{HOST}...")
        client.connect(
            HOST,
            username=USER,
            password=PASSWORD,
            timeout=30,
            allow_agent=False,
            look_for_keys=False,
        )

        print("Running vps-update.sh (2-5 min)...")
        stdin, stdout, stderr = client.exec_command(REMOTE_CMD, get_pty=True)
        del stdin

        for line in stdout:
            print(line, end="")

        err = stderr.read().decode()
        if err.strip():
            print(err, file=sys.stderr)

        code = stdout.channel.recv_exit_status()
        if code == 0:
            print("\n=== Deploy done: https://trizenstore.com.bd ===")
        else:
            print(f"\nDeploy failed (exit {code})", file=sys.stderr)
        return code
    finally:
        client.close()


if __name__ == "__main__":
    raise SystemExit(main())
