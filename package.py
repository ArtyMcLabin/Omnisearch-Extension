#!/usr/bin/env python3
"""
Omnisearch Extension Packaging Script
Creates a ZIP file for Chrome Web Store submission
"""

import json
import shutil
import zipfile
import sys
from pathlib import Path

def main():
    print("🔍 Omnisearch Extension - Chrome Store Packaging")
    print("=================================================")
    
    # Read version from manifest.json
    try:
        with open("manifest.json", "r") as f:
            manifest = json.load(f)
        version = manifest["version"]
        print(f"📋 Version: {version}")
    except (FileNotFoundError, KeyError, json.JSONDecodeError) as e:
        print(f"❌ Error reading manifest.json: {e}")
        sys.exit(1)
    
    # Files to include
    files = [
        "manifest.json",
        "popup.html", 
        "popup.js",
        "settings.html",
        "settings.js",
        "icon-16.png",
        "icon-32.png",
        "icon-48.png", 
        "icon-128.png"
    ]
    
    # Create ZIP
    zip_name = f"omnisearch-extension-v{version}.zip"
    
    print(f"\n📦 Creating {zip_name}...")
    
    with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file_name in files:
            if Path(file_name).exists():
                zipf.write(file_name)
                print(f"  ✓ {file_name}")
            else:
                print(f"  ✗ {file_name} (not found)")
    
    # Show result
    zip_size = Path(zip_name).stat().st_size
    zip_size_kb = round(zip_size / 1024, 2)
    
    print(f"\n✅ Created {zip_name} ({zip_size_kb} KB)")
    print(f"\n📋 Next: Upload to https://chrome.google.com/webstore/devconsole/")

if __name__ == "__main__":
    main() 