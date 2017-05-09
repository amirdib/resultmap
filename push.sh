#!/bin/bash
git fetch
if [[ $(git diff --name-only HEAD origin/master) != "" ]]; then
    git pull origin master
    bower install --allow-root --config.interactive=false
fi
