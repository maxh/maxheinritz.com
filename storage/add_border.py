# https://stackoverflow.com/a/11143078

import numpy as np
from PIL import Image, ImageSequence, ImageOps, ImageDraw

img = Image.open("/Users/max/projects/maxheinritz.com/images/infinity.gif")
h,w=img.size

# Create same size alpha layer with circle
alpha = Image.new('L', img.size,0)
draw = ImageDraw.Draw(alpha)
w = w + 0
h = h - 12
r = 68
coords = [
  w / 2 - r,
  h / 2 - r,
  w / 2 + r,
  h / 2 + r,
]
draw.pieslice(coords,0,360,fill=255)
#npAlpha=np.array(alpha)

new_frames = []
i = 0
for old_frame in ImageSequence.Iterator(img):
  i += 1
 # npImage=np.array(old_frame.convert('RGB'))
  #npImage=np.dstack((npImage,npAlpha))
  new_frame = Image.new("RGB", img.size, "#000000")
  new_image = Image.composite(img,new_frame,alpha)
  name = "/Users/max/tmp/new_out-%i.png" % i
  new_image.save(name)
  new_image = Image.open(name)
  # new_frame.paste(new_image, (int(w / 2 - r), int(h / 2 - r)))
  # new_frame.save(name)

# old_size = old_im.size
# new_size = (old_size[0] * 3, old_size[1] * 3)

# alpha = Image.new('L', old_im.size,0)
# draw = ImageDraw.Draw(alpha)
# h,w = old_size
# draw.pieslice([0,0,h,w],0,360,fill=255)
# npAlpha=np.array(alpha)

# def transform(old_frame):
#   # npImage=np.array(old_frame)
#   # npImage=np.dstack((npImage,npAlpha))
#   # old_frame = Image.fromarray(npImage)
#   new_frame = Image.new("RGB", new_size, "#FF0000")
#   new_frame.paste(old_frame, old_size)
#   return new_frame

# new_frames = []
# i = 0
# for old_frame in ImageSequence.Iterator(old_im):
#   i += 1
#   if i > 1:
#     break
#   name = "tmp/new_out-%i.png" % i
#   transform(old_frame).save(name)
#   new_frames.append(Image.open(name))

# new_frames[0].save("tmp/new_out.png")
# new_frames[0].save(
#   "out.gif",
#   format="GIF",
#   save_all=True,
#   append_images=new_frames[1:],
#   duration=100,
#   loop=1,
#   quality=100,
#   subsampling=0,
# )
