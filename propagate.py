"""unit1-4.html are one course; only the <title>, the header .title, and const DAY
differ. Edit unit4.html, then run this to push those edits into the other three.

Refuses to propagate if unit4.html's script block does not parse, so a syntax
error cannot be copied into all four files.

Usage:  python propagate.py
"""
import io, re, os, subprocess, sys, tempfile

sys.stdout.reconfigure(encoding='utf-8')

TITLES = {
    '1': 'Unit 1: Welcome, Portfolio & Readiness',
    '2': 'Unit 2: Designing Learning',
    '3': 'Unit 3: Building Content',
    '4': 'Unit 4: Quality & Capstone',
}

base = io.open('unit4.html', encoding='utf-8').read()

# ---- gate: the source must parse before anything is copied ----------------
script = re.findall(r'<script>(.*?)</script>', base, re.S)[-1]
fd, tmp = tempfile.mkstemp(suffix='.js')
os.close(fd)
io.open(tmp, 'w', encoding='utf-8').write(script)
r = subprocess.run(['node', '--check', tmp], capture_output=True, text=True)
os.unlink(tmp)
if r.returncode != 0:
    print('ABORTED: unit4.html does not parse. Nothing was written.\n')
    print(r.stderr.strip()[:1200])
    sys.exit(1)
print('unit4.html parses')

assert base.count('const DAY="4";') == 1
assert base.count('<div class="title">Unit 4: Quality & Capstone</div>') == 1

for day, title in TITLES.items():
    s = re.sub(r'<title>Unit 4: Quality & Capstone( &middot;| ·) Per Scholas</title>',
               lambda m: '<title>%s%s Per Scholas</title>' % (title, m.group(1)),
               base, count=1)
    s = s.replace('<div class="title">Unit 4: Quality & Capstone</div>',
                  '<div class="title">%s</div>' % title, 1)
    s = s.replace('const DAY="4";', 'const DAY="%s";' % day, 1)
    io.open('unit%s.html' % day, 'w', encoding='utf-8', newline='').write(s)
    print('unit%s.html <- %s' % (day, title))

# ---- confirm the four files differ only in the three expected places ------
for day in ('1', '2', '3'):
    a = io.open('unit%s.html' % day, encoding='utf-8').read().split('\n')
    b = base.split('\n')
    diff = sum(1 for x, y in zip(a, b) if x != y)
    status = 'ok' if diff == 3 else 'UNEXPECTED (%d differing lines, expected 3)' % diff
    print('  unit%s vs unit4: %s' % (day, status))
