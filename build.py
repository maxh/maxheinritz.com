import os
import shutil
from jinja2 import FileSystemLoader, environment

BUILD_DIR = 'build'

base_dir = os.path.dirname(os.path.abspath(__file__))
templates_dir = os.path.join(base_dir, 'templates')
env = environment.Environment()
env.loader = FileSystemLoader(templates_dir)

def prep_build_dir():
  # Don't delete the root build/ folder to keep server running.
  if not os.path.isdir(BUILD_DIR):
    os.mkdir(BUILD_DIR)
  for f in os.listdir(BUILD_DIR):
    fpath = os.path.join(BUILD_DIR, f)
    if os.path.isfile(fpath):
      os.remove(fpath)
    elif os.path.isdir(fpath):
      shutil.rmtree(fpath)

if __name__ == '__main__':
  prep_build_dir()

  template = env.get_template('index.html')
  html = template.render()
  with open(os.path.join(BUILD_DIR, 'index.html'), 'w') as f:
    f.write(html)

  for d in ['assets', 'style.css', 'favicon.ico']:
    if os.path.isdir(d):
      shutil.copytree(d, '%s/%s' % (BUILD_DIR, d))
    else:
      shutil.copy(d, '%s/%s' % (BUILD_DIR, d))
