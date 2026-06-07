import http.server
import os
import sys

PORT = 3000
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
FRAMES_DIR = r"C:\Users\USER\Downloads\ezgif-540be4fbff4088dc-jpg"

class ScrollCinemaHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        """Route /frames/* to the external frames directory."""
        # Strip query string
        path = path.split('?')[0]

        if path.startswith('/frames/'):
            frame_name = path[len('/frames/'):]
            return os.path.join(FRAMES_DIR, frame_name)

        # Default: serve from project directory
        return os.path.join(PROJECT_DIR, path.lstrip('/'))

    def log_message(self, format, *args):
        # Suppress individual request logs for cleanliness
        pass

    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        # Only cache images aggressively; HTML/CSS/JS get no-cache for dev
        if hasattr(self, 'path') and '/frames/' in self.path:
            self.send_header('Cache-Control', 'public, max-age=31536000')
        else:
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

if __name__ == '__main__':
    os.chdir(PROJECT_DIR)
    with http.server.HTTPServer(('', PORT), ScrollCinemaHandler) as httpd:
        print(f"\n  World Cup Scroll Cinema is live!")
        print(f"  -> http://localhost:{PORT}\n")
        sys.stdout.flush()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
