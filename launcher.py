#!/usr/bin/env python3
"""
Business Card Generator Launcher
Automatically starts the web server and opens the browser
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import time
import threading
from pathlib import Path

def find_free_port(start_port=8000, max_port=8100):
    """Find a free port starting from start_port"""
    import socket
    for port in range(start_port, max_port):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('localhost', port))
                return port
        except OSError:
            continue
    return None

def start_server(port, directory):
    """Start the HTTP server in a separate thread"""
    os.chdir(directory)
    handler = http.server.SimpleHTTPRequestHandler
    
    class QuietHTTPServer(socketserver.TCPServer):
        def log_message(self, format, *args):
            # Suppress server logs for cleaner output
            pass
    
    handler.log_message = lambda self, format, *args: None
    
    with QuietHTTPServer(("", port), handler) as httpd:
        print(f"✅ Server started on http://localhost:{port}")
        httpd.serve_forever()

def main():
    print("🎯 Business Card Generator Launcher")
    print("=" * 50)
    
    # Get the directory where the script is located
    script_dir = Path(__file__).parent.absolute()
    
    # Check if required files exist
    required_files = ['index.html', 'script.js', 'styles.css']
    missing_files = []
    
    for file in required_files:
        if not (script_dir / file).exists():
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ ERROR: Missing required files: {', '.join(missing_files)}")
        print(f"📁 Looking in: {script_dir}")
        input("Press Enter to exit...")
        return
    
    # Find a free port
    port = find_free_port()
    if not port:
        print("❌ ERROR: Could not find a free port")
        input("Press Enter to exit...")
        return
    
    try:
        # Start server in background thread
        server_thread = threading.Thread(
            target=start_server, 
            args=(port, script_dir),
            daemon=True
        )
        server_thread.start()
        
        # Wait a moment for server to start
        time.sleep(2)
        
        # Open browser
        url = f"http://localhost:{port}"
        print(f"🌐 Opening browser: {url}")
        webbrowser.open(url)
        
        print("\n✅ Business Card Generator is now running!")
        print("📝 Upload your CSV file to generate business cards")
        print("\n⚠️  Keep this window open to keep the server running")
        print("❌ Close this window or press Ctrl+C to stop")
        print("-" * 50)
        
        # Keep the main thread alive
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n\n👋 Shutting down Business Card Generator...")
            print("Thank you for using our app!")
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        input("Press Enter to exit...")

if __name__ == "__main__":
    main()
