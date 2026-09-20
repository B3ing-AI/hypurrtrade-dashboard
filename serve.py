import http.server
import socketserver
import webbrowser
import os
import sys
import json
import urllib.request
import urllib.error

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and disable caching for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        # Handle /api/rates
        if self.path.startswith('/api/rates'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"rates": {}}')
            return
        super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/public/ai-proxy') or self.path.startswith('/api/ai-proxy'):
            try:
                length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(length).decode('utf-8')
                data = json.loads(body)
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': f'Invalid JSON body: {str(e)}', 'status': 400}).encode('utf-8'))
                return

            provider = data.get('provider', 'gemini')
            api_key = (data.get('apiKey') or '').strip()
            model = (data.get('model') or '').strip()
            system = data.get('system', '')
            prompt = data.get('prompt', '')

            if not api_key:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"error": "Missing API key", "status": 400}')
                return

            # Dispatch to provider
            print(f"Proxy request: provider={provider}, model={model}, key_len={len(api_key)}")
            try:
                res = self.call_provider(provider, api_key, model, system, prompt)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(res).encode('utf-8'))
            except urllib.error.HTTPError as e:
                err_body = e.read().decode('utf-8', errors='ignore')
                err_msg = f'HTTP {e.code}'
                try:
                    err_json = json.loads(err_body)
                    if 'error' in err_json:
                        if isinstance(err_json['error'], dict):
                            err_msg = err_json['error'].get('message', err_msg)
                        else:
                            err_msg = str(err_json['error'])
                except Exception:
                    if err_body:
                        err_msg = err_body[:160]

                # Specific friendly advice for common errors
                if 'API_KEY_INVALID' in err_body or 'API key not valid' in err_msg or (provider == 'gemini' and e.code == 400):
                    err_msg = "Gemini API key is invalid. Free keys from Google AI Studio (aistudio.google.com) start with 'AIzaSy...'. Please check your key."
                elif e.code == 404:
                    err_msg = f"Model '{model}' not found (404). Please pick a model from the dropdown."
                elif e.code in (401, 403):
                    err_msg = f'Key rejected ({e.code}) — check your API key permissions'

                print(f"Provider HTTPError {e.code}: {err_msg}")
                self.send_response(e.code if 400 <= e.code < 600 else 500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': err_msg, 'status': e.code}).encode('utf-8'))
            except Exception as e:
                import traceback
                print(f"Proxy internal error: {e}")
                traceback.print_exc()
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e), 'status': 500}).encode('utf-8'))
            return

        self.send_response(404)
        self.end_headers()

    def call_provider(self, provider, api_key, model, system, prompt):
        import urllib.parse
        model = (model or '').strip()
        api_key = api_key.strip()
        if provider == 'gemini':
            model = model or 'gemini-2.5-flash'
            encoded_model = urllib.parse.quote(model)
            encoded_key = urllib.parse.quote(api_key)
            url = f'https://generativelanguage.googleapis.com/v1beta/models/{encoded_model}:generateContent?key={encoded_key}'
            full_text = (system + "\n\n" + prompt).strip() if system else prompt
            payload = {
                'contents': [
                    {'role': 'user', 'parts': [{'text': full_text}]}
                ],
                'generationConfig': {
                    'maxOutputTokens': 1200
                }
            }
            headers = {'Content-Type': 'application/json'}
        elif provider == 'openai':
            model = model or 'gpt-4o-mini'
            url = 'https://api.openai.com/v1/chat/completions'
            payload = {
                'model': model,
                'max_tokens': 600,
                'messages': [
                    {'role': 'system', 'content': system},
                    {'role': 'user', 'content': prompt}
                ]
            }
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {api_key}'
            }
        elif provider == 'anthropic':
            model = model or 'claude-3-5-haiku-20241022'
            url = 'https://api.anthropic.com/v1/messages'
            payload = {
                'model': model,
                'max_tokens': 600,
                'system': system,
                'messages': [{'role': 'user', 'content': prompt}]
            }
            headers = {
                'Content-Type': 'application/json',
                'x-api-key': api_key,
                'anthropic-version': '2023-06-01'
            }
        elif provider == 'openrouter':
            model = model or 'google/gemini-2.0-flash-001'
            url = 'https://openrouter.ai/api/v1/chat/completions'
            payload = {
                'model': model,
                'max_tokens': 600,
                'messages': [
                    {'role': 'system', 'content': system},
                    {'role': 'user', 'content': prompt}
                ]
            }
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {api_key}',
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'HypurrTrade'
            }
        else:
            raise Exception(f'Unknown provider: {provider}')

        req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers)
        with urllib.request.urlopen(req, timeout=25) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if provider == 'gemini':
                candidates = data.get('candidates', [{}])
                if candidates:
                    parts = candidates[0].get('content', {}).get('parts', [])
                    # Filter out thinking process parts in Gemini 2.5
                    text_parts = [p.get('text', '') for p in parts if not p.get('thought', False) and 'text' in p]
                    if text_parts:
                        text = ''.join(text_parts)
                    elif parts and 'text' in parts[-1]:
                        text = parts[-1]['text']
                    else:
                        text = ''
                else:
                    text = ''
            elif provider in ('openai', 'openrouter'):
                text = data.get('choices', [{}])[0].get('message', {}).get('content', '')
            elif provider == 'anthropic':
                content = data.get('content', [])
                text = content[0].get('text', '') if content else ''
            print(f"AI response received ({len(text)} chars): {text[:100]}...")
            return {'text': text}

os.chdir(os.path.dirname(os.path.abspath(__file__)))

target = "signal-dashboard.html" if len(sys.argv) > 1 and "signal" in sys.argv[1].lower() else "prep-dashboard.html?coin=ZEC"

# Find available port
for port in [3000, 3001, 8000, 8080]:
    try:
        with socketserver.TCPServer(("", port), Handler) as httpd:
            print(f"==================================================")
            print(f"  HypurrTrade Dashboard Local Server")
            print(f"  Running at: http://localhost:{port}/")
            print(f"  AI Proxy active at: http://localhost:{port}/api/public/ai-proxy")
            print(f"  Prep Dashboard: http://localhost:{port}/prep-dashboard.html?coin=ZEC")
            print(f"  Signal Dashboard: http://localhost:{port}/signal-dashboard.html")
            print(f"  Landing Page: http://localhost:{port}/index.html")
            print(f"==================================================")
            if len(sys.argv) <= 1 or "nobrowse" not in sys.argv:
                webbrowser.open(f"http://localhost:{port}/{target}")
            httpd.serve_forever()
            break
    except OSError:
        continue
