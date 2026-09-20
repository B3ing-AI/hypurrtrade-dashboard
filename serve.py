import http.server
import socketserver
import webbrowser
import os
import sys

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and disable caching for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

target = "signal-dashboard.html" if len(sys.argv) > 1 and "signal" in sys.argv[1].lower() else "prep-dashboard.html?coin=ZEC"

# Find available port
for port in [3000, 3001, 8000, 8080]:
    try:
        with socketserver.TCPServer(("", port), Handler) as httpd:
            print(f"==================================================")
            print(f"  HypurrTrade Dashboard Local Server")
            print(f"  Running at: http://localhost:{port}/")
            print(f"  Prep Dashboard: http://localhost:{port}/prep-dashboard.html?coin=ZEC")
            print(f"  Signal Dashboard: http://localhost:{port}/signal-dashboard.html")
            print(f"  Landing Page: http://localhost:{port}/index.html")
            print(f"==================================================")
            webbrowser.open(f"http://localhost:{port}/{target}")
            httpd.serve_forever()
            break
    except OSError:
        continue
