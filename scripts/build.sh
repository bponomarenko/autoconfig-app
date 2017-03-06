#!/bin/bash
set -ev

# Build and deploy web version only on osx
if [[ $TARGET_OS == 'osx' ]]; then
  npm run build:web -- -bh /autoconfig-app/
  ngh --dir=dist/web --repo=https://$GH_TOKEN@github.com/bponomarenko/autoconfig-app.git --name="Borys Ponomarenko" --email=bponomarenko@gmail.com
fi

# Build web source for electron app
npm run build:web4app

# Build for OSX
if [[ $TARGET_OS == 'osx' ]]; then
  npm run build -- -m -p onTagOrDraft
fi

# Build for Linux
if [[ $TARGET_OS == 'linux' ]]; then
  npm run build -- -l -p onTagOrDraft
fi

# Build for Windows
if [[ $TARGET_OS == 'win' ]]; then
  npm run build -- -w -p onTagOrDraft | /dev/null
fi
