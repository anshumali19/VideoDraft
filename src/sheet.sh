#!/bin/bash
# usage: src/sheet.sh <name> t1,t2,... -> build/preview/sheet_<name>.png
cd "$(dirname "$0")/.." && node src/render.js "$1" --preview "$2" && python3 -c "
from PIL import Image; import sys
n,ts=sys.argv[1],sys.argv[2].split(',')
ims=[Image.open(f'build/preview/{n}_{float(x):g}.png'.replace('.0.png','.png') if False else f'build/preview/{n}_{x}.png').resize((270,480)) for x in ts]
out=Image.new('RGB',(270*len(ims),480)); [out.paste(im,(i*270,0)) for i,im in enumerate(ims)]; out.save(f'build/preview/sheet_{n}.png')" "$1" "$2"
