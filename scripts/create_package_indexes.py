import os

pkg_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'packages'))
for pkg in os.listdir(pkg_root):
    src_dir = os.path.join(pkg_root, pkg, 'src')
    if os.path.isdir(src_dir):
        files = [f for f in os.listdir(src_dir) if f.endswith('.ts') and f != 'index.ts']
        index_lines = [f"export * from './{os.path.splitext(f)[0]}';" for f in sorted(files)]
        with open(os.path.join(src_dir, 'index.ts'), 'w', encoding='utf-8') as idx:
            idx.write('\n'.join(index_lines) + '\n')
        print(f"Generated index.ts for {pkg} ({len(files)} exports)")
