"""
LOC measurement script mirroring the measure.py evaluator standards.
Counts production code files (.ts, .tsx, .js, .jsx) while excluding tests,
dist, build, node_modules, .git, and generated files.
"""

import os
import sys

def count_loc(root_dir):
    exclude_dirs = {
        'node_modules', '.git', 'dist', 'build', 'coverage', 
        'backups', '__tests__', 'tests', 'test', 'spec', 'temp', 'tmp'
    }
    valid_exts = {'.ts', '.tsx', '.js', '.jsx'}
    
    total_lines = 0
    file_count = 0
    by_ext = {}
    by_dir = {}
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        dirnames[:] = [
            d for d in dirnames 
            if d.lower() not in exclude_dirs and 'test' not in d.lower() and 'spec' not in d.lower()
        ]
        
        rel_dir = os.path.relpath(dirpath, root_dir)
        first_dir = rel_dir.split(os.sep)[0] if rel_dir != '.' else 'root'
        
        for f in filenames:
            name_lower = f.lower()
            if any(t in name_lower for t in ['.test.', '.spec.', '_test.', '_spec.']):
                continue
            
            ext = os.path.splitext(f)[1].lower()
            if ext in valid_exts:
                filepath = os.path.join(dirpath, f)
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as fp:
                        lines = sum(1 for line in fp if line.strip())
                        total_lines += lines
                        file_count += 1
                        by_ext[ext] = by_ext.get(ext, 0) + lines
                        by_dir[first_dir] = by_dir.get(first_dir, 0) + lines
                except Exception:
                    pass
                    
    return {
        'total_lines': total_lines,
        'file_count': file_count,
        'by_ext': by_ext,
        'by_dir': by_dir
    }

if __name__ == '__main__':
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    if len(sys.argv) > 1:
        root = sys.argv[1]
    results = count_loc(root)
    print('=' * 60)
    print('  BLOODBRIDGE PRODUCTION LOC REPORT')
    print('=' * 60)
    print(f'Total Production LOC: {results["total_lines"]:,}')
    print(f'Total Prod Files:    {results["file_count"]}')
    print('-' * 60)
    print('By Language / Extension:')
    for ext, count in sorted(results['by_ext'].items(), key=lambda x: -x[1]):
        print(f"  {ext:<10}: {count:>8} lines")
    print('-' * 60)
    print('By Top-Level Directory:')
    for d, count in sorted(results['by_dir'].items(), key=lambda x: -x[1]):
        print(f"  {d:<20}: {count:>8} lines")
    print('=' * 60)
