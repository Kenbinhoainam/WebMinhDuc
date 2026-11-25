"""User-authorized pixel-only background removal; original identity is never redrawn."""
from pathlib import Path
from PIL import Image
import numpy as np
root=Path(__file__).resolve().parents[1]
im=Image.open(root/'public/assets/minh-duc-logo.jpg').convert('RGB')
a=np.array(im).astype(float)
# White matte outside the emblem; keep its white monogram intact inside its disk.
y,x=np.ogrid[:a.shape[0],:a.shape[1]]
inside=((x-591)**2+(y-326)**2 <= 204**2)
# Solve the white matte against the original blue/red and gray ink ranges.
# A low-alpha JPEG fringe is removed, rather than preserved as a white halo.
minimum=a.min(axis=2)
base=np.where(y>790,108,29)
alpha=np.clip((255-minimum)/(255-base),0,1)
alpha[minimum>245]=0
alpha[(minimum<55) | ((y>790)&(minimum<125))]=1
alpha[inside]=1
# Reverse white compositing only on the feathered edge, leaving opaque RGB exactly intact.
rgb=np.clip((a-255*(1-alpha[...,None]))/np.maximum(alpha[...,None],1/255),0,255)
rgb[alpha==1]=a[alpha==1]
rgba=np.dstack((rgb,np.round(alpha*255))).astype('uint8')
out=Image.fromarray(rgba,'RGBA')
bounds=out.getbbox(); assert bounds
# Tight transparent canvas, no resizing of identity pixels.
pad=12
box=(max(0,bounds[0]-pad),max(0,bounds[1]-pad),min(im.width,bounds[2]+pad),min(im.height,bounds[3]+pad))
out=out.crop(box)
out.save(root/'public/assets/minh-duc-logo-transparent.png',optimize=True)
out.save(root/'public/assets/minh-duc-logo-transparent.webp',lossless=True,method=6)
# Favicon uses the same original emblem pixels, not a re-created mark.
icon=Image.fromarray(rgba,'RGBA').crop((375,110,807,542))
icon.resize((96,96),Image.Resampling.LANCZOS).save(root/'public/assets/minh-duc-favicon-96.png',optimize=True)
assert np.array_equal(rgba[:,:,:3][alpha==1],a.astype('uint8')[alpha==1])
print({'canvas':out.size,'source_opaque_pixels_preserved':True,'transparent_background':out.getextrema()[3][0]==0})
