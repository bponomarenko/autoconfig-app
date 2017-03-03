#!/bin/bash
set -ev

npm i @angular/cli -g --silent
npm i angular-cli-ghpages -g --silent

if [[ $TARGET_OS == 'win' ]]; then
  brew update
  brew install wine --without-x11
  brew install mono
fi
