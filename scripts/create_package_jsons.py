import os
import json

pkg_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'packages'))
for pkg in os.listdir(pkg_root):
    pkg_dir = os.path.join(pkg_root, pkg)
    if os.path.isdir(pkg_dir):
        pkg_json = {
            "name": f"@bloodbridge/{pkg}",
            "version": "1.0.0",
            "description": f"BloodBridge Healthcare Core Module — {pkg.replace('-', ' ').title()}",
            "main": "src/index.ts",
            "types": "src/index.ts",
            "private": True,
            "license": "UNLICENSED"
        }
        with open(os.path.join(pkg_dir, 'package.json'), 'w', encoding='utf-8') as f:
            json.dump(pkg_json, f, indent=2)
        print(f"Created package.json for @bloodbridge/{pkg}")
