"""Draws the app icon (icon.ico) with no dependencies: a dark tile, the orange
reading marker, and a few lines of 'text' - the top one greyed out as if spoken."""

import struct
import zlib
from pathlib import Path

BG = (17, 17, 17, 255)
ACCENT = (255, 140, 26, 255)
TEXT = (242, 242, 242, 255)
DONE = (92, 92, 92, 255)
SS = 4  # supersampling factor for smooth edges


def in_round_rect(x, y, x0, y0, x1, y1, r):
    if not (x0 <= x < x1 and y0 <= y < y1):
        return False
    cx = min(max(x, x0 + r), x1 - r)
    cy = min(max(y, y0 + r), y1 - r)
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r


def shapes(u):
    """(colour, x0, y0, x1, y1, radius) in a 0..u coordinate space, drawn in order."""
    bar_h, gap = u * 0.085, u * 0.16
    rows = [(DONE, 0.62), (TEXT, 0.72), (TEXT, 0.55), (TEXT, 0.66)]
    items = [(BG, 0, 0, u, u, u * 0.2)]
    top = u * 0.22
    for i, (colour, length) in enumerate(rows):
        y = top + i * gap
        items.append((colour, u * 0.26, y, u * (0.26 + length * 0.9), y + bar_h, bar_h / 2))
    marker_y = top + gap  # the marker sits beside the current (second) line
    items.append((ACCENT, u * 0.12, marker_y - u * 0.03, u * 0.17, marker_y + bar_h + u * 0.03, u * 0.025))
    return items


def render(size):
    u = size * SS
    items = shapes(u)
    px = []
    for y in range(size):
        row = bytearray([0])  # PNG filter: none
        for x in range(size):
            acc = [0, 0, 0, 0]
            for sy in range(SS):
                for sx in range(SS):
                    X, Y = x * SS + sx + 0.5, y * SS + sy + 0.5
                    c = (0, 0, 0, 0)
                    for colour, *box in items:
                        if in_round_rect(X, Y, *box):
                            c = colour
                    for k in range(4):
                        acc[k] += c[k]
            n = SS * SS
            a = acc[3] / n
            # un-premultiply so edges don't darken
            rgb = [int(acc[k] / acc[3] * 255) if acc[3] else 0 for k in range(3)]
            row += bytes(rgb + [int(a)])
        px.append(bytes(row))
    return png(size, b"".join(px))


def png(size, raw):
    def chunk(tag, data):
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data))
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")


def ico(images):
    header = struct.pack("<HHH", 0, 1, len(images))
    offset = 6 + 16 * len(images)
    entries, blobs = b"", b""
    for size, data in images:
        dim = 0 if size >= 256 else size
        entries += struct.pack("<BBBBHHII", dim, dim, 0, 0, 1, 32, len(data), offset + len(blobs))
        blobs += data
    return header + entries + blobs


if __name__ == "__main__":
    sizes = [16, 24, 32, 48, 64, 128, 256]
    out = Path(__file__).resolve().parent / "icon.ico"
    out.write_bytes(ico([(s, render(s)) for s in sizes]))
    print("wrote", out)
