# Genera la versión nocturna del mapa a partir de la maestra: oscurece y azula la escena
# y conserva encendidas las luces cálidas (ventanas y faroles) con un halo suave.
import sys
from PIL import Image, ImageFilter
import numpy as np
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB').resize((1400, 2662), Image.LANCZOS)
a = np.asarray(im).astype(np.float32) / 255
r, g, b = a[..., 0], a[..., 1], a[..., 2]
lum = 0.299 * r + 0.587 * g + 0.114 * b
luz = np.clip((r - 0.74) / 0.18, 0, 1) * np.clip((g - 0.82) / 0.1, 0, 1) * np.clip((r - b - 0.3) / 0.15, 0, 1) * np.clip(((r - b) / (r + 1e-3) - 0.38) / 0.1, 0, 1)
noche = (0.55 * a + 0.45 * lum[..., None]) * np.array([0.30, 0.34, 0.58]) + np.array([0.03, 0.025, 0.07])
L = Image.fromarray((luz * 255).astype(np.uint8))
m = np.asarray(L.filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32)[..., None] / 255
halo = np.asarray(L.filter(ImageFilter.GaussianBlur(14))).astype(np.float32)[..., None] / 255
out = noche * (1 - m) + a * m * 1.05 + halo * np.array([1.0, 0.78, 0.35]) * 0.6
Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8)).save(dst, quality=80, method=6)
