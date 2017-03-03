#!/bin/bash
set -ev

# Build and deploy web version only on osx
if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
  npm run build:web -- -bh /autoconfig-app/
  ngh --dir=dist/web --repo=https://$GH_TOKEN@github.com/bponomarenko/autoconfig-app.git --name="Borys Ponomarenko" --email=bponomarenko@gmail.com
fi

# Build web source for electron app
npm run build:web4app

# Build for OSX
if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
  npm run build -- -m -p onTagOrDraft
fi

# Build for Linux
if [[ $TRAVIS_OS_NAME == 'linux' ]]; then
  npm run build -- -l -p onTagOrDraft
fi
