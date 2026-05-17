import sys
from PIL import Image

def get_best_frame(path):
    img = Image.open(path)
    frames = []
    try:
        while True:
            frames.append(img.copy().convert('RGBA'))
            img.seek(img.tell() + 1)
    except EOFError:
        pass
    return max(frames, key=lambda f: f.size[0]) if frames else img.convert('RGBA')

platform = sys.argv[1] if len(sys.argv) > 1 else 'mac'
best = get_best_frame('public/favicon.ico')

if platform == 'win':
    icon = best.resize((256, 256), Image.LANCZOS)
    icon.save('public/icon-256.ico', format='ICO', sizes=[(256, 256)])
    print('icon-256.ico generated for Windows')
else:
    icon = best.resize((512, 512), Image.LANCZOS)
    icon.save('public/icon-512.png', 'PNG')
    print('icon-512.png generated for macOS')
