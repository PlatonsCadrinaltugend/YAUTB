import subprocess
import time
import os
import signal

while True:
    try:
        p = subprocess.run(["node", "main.js"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=1.5)
        print("Error: " + p.stderr.decode())
    except subprocess.TimeoutExpired:
        print("Timeout")