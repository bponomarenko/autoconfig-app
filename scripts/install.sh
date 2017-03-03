#!/bin/bash
set -ev

npm i @angular/cli -g --silent
npm i angular-cli-ghpages -g --silent

# if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
#   brew update
#   brew install gnu-tar graphicsmagick xz
# fi
