
import json
import sys

def summarize_lint():
    try:
        # Read the file as bytes first
        with open('lint-results.json', 'rb') as f:
            rawdata = f.read()

        # Try to decode with common encodings
        encodings = ['utf-8-sig', 'utf-16', 'utf-16le', 'utf-16be', 'utf-8']
        data = None
        for enc in encodings:
            try:
                text = rawdata.decode(enc)
                data = json.loads(text)
                break
            except Exception:
                continue
        
        if data is None:
            print("Error: Could not decode lint-results.json with any common encoding.")
            return

        summary = {}
        for result in data:
            file_path = result.get('filePath', 'unknown')
            messages = result.get('messages', [])
            errors = [m for m in messages if m.get('severity') == 2]
            if errors:
                summary[file_path] = len(errors)
        
        sorted_summary = sorted(summary.items(), key=lambda x: x[1], reverse=True)
        for path, count in sorted_summary:
            print(f"{count} errors: {path}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    summarize_lint()
