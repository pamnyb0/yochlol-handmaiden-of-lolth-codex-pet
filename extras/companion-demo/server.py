"""Serve the companion on loopback only; no installation or internet required."""
import argparse
import functools
import socket
import threading
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--no-open', action='store_true')
parser.add_argument('--port', type=int, default=8765)
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent

class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()
    def list_directory(self, path):
        self.send_error(404)
    def log_message(self, *values):
        pass

server = None
for port in range(args.port, args.port + 10):
    try:
        server = ThreadingHTTPServer(('127.0.0.1', port), functools.partial(Handler, directory=str(root)))
        break
    except OSError:
        continue
if server is None:
    raise SystemExit('No available local port; close another companion window and try again.')
url = f'http://127.0.0.1:{server.server_port}/yochlol-companion/'
print(url, flush=True)
if not args.no_open:
    threading.Timer(0.5, lambda: webbrowser.open(url)).start()
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
