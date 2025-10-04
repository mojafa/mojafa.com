#!/usr/bin/env python3
"""
Mohamed Jaafar Portfolio Server
Simple HTTP server for static site hosting on Replit
"""

import http.server
import socketserver
import os
import sys

# Configuration
PORT = 8000
HOST = "0.0.0.0"

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler to serve index.html for root requests"""
    
    def do_GET(self):
        # If requesting root, serve index.html
        if self.path == '/':
            self.path = '/index.html'
        
        # Add MIME type for .js files
        if self.path.endswith('.js'):
            self.send_response(200)
            self.send_header('Content-type', 'application/javascript')
            self.end_headers()
            with open(self.path[1:], 'rb') as f:
                self.wfile.write(f.read())
            return
            
        # Default behavior for other files
        return super().do_GET()

def main():
    """Start the web server"""
    print(f"🚀 Starting Mohamed Jaafar Portfolio Server...")
    print(f"📁 Serving files from: {os.getcwd()}")
    print(f"🌐 Server running on: http://{HOST}:{PORT}")
    print(f"📱 Portfolio URL: https://your-repl-name.your-username.repl.co")
    print("Press Ctrl+C to stop the server")
    
    try:
        with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
