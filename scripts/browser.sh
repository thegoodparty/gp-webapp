#!/bin/bash
options=("chrome" "firefox" "edge" "safari")
RANDOM_CHOICE="${options[$RANDOM % ${#options[@]}]}"
export BROWSER="$RANDOM_CHOICE"
echo "BROWSER=$BROWSER" >> $GITHUB_ENV