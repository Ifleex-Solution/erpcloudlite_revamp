from PIL import Image

img = Image.open('public/favicon.ico')
frames = []
try:
    while True:
        frames.append(img.copy().convert('RGBA'))
        img.seek(img.tell() + 1)
except EOFError:
    pass

best = max(frames, key=lambda f: f.size[0]) if frames else img.convert('RGBA')
best = best.resize((512, 512), Image.LANCZOS)
best.save('public/icon-512.png', 'PNG')
print('icon-512.png generated successfully')
