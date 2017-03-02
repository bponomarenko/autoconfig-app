#!/bin/bash
set -ev

#Build and deploy web version only on osx
npm run build:web -- -bh /autoconfig-app/
ngh --dir=dist/web --repo=https://$GH_TOKEN@github.com/bponomarenko/autoconfig-app.git --name="Borys Ponomarenko" --email=bponomarenko@gmail.com

#Build web source for electron app
npm run build:web4app
npm run build -- -wml -p onTagOrDraft
