#!/usr/bin/env python3
"""
Omnisearch Extension Packaging Script v2.0
Cross-platform Python packaging for Chrome Web Store
"""

import sys
import subprocess
from pathlib import Path

def main():
    # Run the actual packaging script
    script_path = Path("scripts") / "package.py"
    
    if not script_path.exists():
        print("❌ Packaging script not found at scripts/package.py")
        sys.exit(1)
    
    try:
        result = subprocess.run([sys.executable, str(script_path)], check=True)
        sys.exit(result.returncode)
    except subprocess.CalledProcessError as e:
        sys.exit(e.returncode)
    except KeyboardInterrupt:
        print("\n❌ Packaging cancelled by user")
        sys.exit(1)

if __name__ == "__main__":
    main() 