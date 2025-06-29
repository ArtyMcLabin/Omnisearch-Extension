#!/usr/bin/env python3
"""
Omnisearch Extension Packaging Script v2.0
Cross-platform Python version of the packaging script
"""

import json
import os
import shutil
import zipfile
import sys
from pathlib import Path

def print_colored(text, color="white"):
    """Print colored text to console"""
    colors = {
        "blue": "\033[94m",
        "green": "\033[92m", 
        "yellow": "\033[93m",
        "red": "\033[91m",
        "cyan": "\033[96m",
        "white": "\033[97m",
        "reset": "\033[0m"
    }
    print(f"{colors.get(color, colors['white'])}{text}{colors['reset']}")

def get_version():
    """Read version from manifest.json"""
    try:
        with open("manifest.json", "r") as f:
            manifest = json.load(f)
        return manifest["version"]
    except (FileNotFoundError, KeyError, json.JSONDecodeError) as e:
        print_colored(f"✗ Error reading manifest.json: {e}", "red")
        sys.exit(1)

def create_package():
    """Create extension package"""
    print_colored("🔍 Omnisearch Extension - Chrome Store Packaging", "blue")
    print_colored("=================================================", "blue")
    
    # Get version
    version = get_version()
    print_colored(f"📋 Detected version: {version}", "cyan")
    
    # Setup paths
    output_dir = Path("store-package")
    zip_name = f"omnisearch-extension-v{version}.zip"
    zip_path = Path(zip_name)
    
    # Clean existing package directory
    if output_dir.exists():
        shutil.rmtree(output_dir)
        print_colored("✓ Cleaned existing package directory", "green")
    
    output_dir.mkdir(exist_ok=True)
    print_colored("✓ Created package directory", "green")
    
    # Files to include
    files_to_include = [
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
    
    # Copy files
    print_colored("\n📦 Copying extension files...", "yellow")
    copied_files = []
    
    for file_name in files_to_include:
        file_path = Path(file_name)
        if file_path.exists():
            shutil.copy2(file_path, output_dir / file_name)
            print_colored(f"  ✓ {file_name}", "green")
            copied_files.append(file_name)
        else:
            print_colored(f"  ✗ {file_name} (not found)", "red")
    
    if not copied_files:
        print_colored("✗ No files were copied!", "red")
        sys.exit(1)
    
    # Create ZIP
    print_colored("\n📦 Creating ZIP package...", "yellow")
    
    if zip_path.exists():
        zip_path.unlink()
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file_name in copied_files:
            zipf.write(output_dir / file_name, file_name)
    
    # Get ZIP size
    zip_size = zip_path.stat().st_size
    zip_size_kb = round(zip_size / 1024, 2)
    
    print_colored(f"✓ Created {zip_name} ({zip_size_kb} KB)", "green")
    
    # Cleanup
    shutil.rmtree(output_dir)
    print_colored("✓ Cleaned up temporary files", "green")
    
    # Display results
    print_colored("\n🚀 Package Ready for Chrome Web Store!", "blue")
    print_colored("=======================================", "blue")
    print_colored(f"📁 Package file: {zip_name}", "white")
    print_colored(f"📏 Size: {zip_size_kb} KB", "white")
    
    # Verify contents
    print_colored("\n🔍 Package Contents Verification:", "yellow")
    with zipfile.ZipFile(zip_path, 'r') as zipf:
        for file_info in zipf.filelist:
            print_colored(f"  ✓ {file_info.filename}", "green")
    
    print_colored("\n✅ Packaging complete!", "green")
    
    return str(zip_path)

if __name__ == "__main__":
    create_package() 