#!/bin/bash

# platform
platform_options=("windows" "mac" "ios" "android")
RANDOM_PLATFORM="${platform_options[$RANDOM % ${#platform_options[@]}]}"

# if the platform is ios we specify a device
if [ "$RANDOM_PLATFORM" == "ios" ]; then
  device_options=("f06" "f07" "a33" "a34" "a35" "a36" "a37" "a38")
  RANDOM_DEVICE="${device_options[$RANDOM % ${#device_options[@]}]}"
  export ENDTEST_OPTIONS="&platform=$RANDOM_PLATFORM&os=$RANDOM_DEVICE&resolution=portrait&geolocation=sanfrancisco&cases=all&notes="
  echo "ENDTEST_OPTIONS=$ENDTEST_OPTIONS" >> $GITHUB_ENV
  exit 0
fi

# if the platform is android we specify a device
if [ "$RANDOM_PLATFORM" == "android" ]; then 
  device_options=("a933" "a934" "a935" "a936" "a0167" "a0168" "a23" "a24" "a25")
  RANDOM_DEVICE="${device_options[$RANDOM % ${#device_options[@]}]}"
  export ENDTEST_OPTIONS="&platform=$RANDOM_PLATFORM&os=$RANDOM_DEVICE&resolution=portrait&geolocation=sanfrancisco&cases=all&notes="
  echo "ENDTEST_OPTIONS=$ENDTEST_OPTIONS" >> $GITHUB_ENV
  exit 0
fi

# if the platform is windows we specify a browser
if [ "$RANDOM_PLATFORM" == "windows" ]; then
  browser_options=("chrome" "firefox" "edge" "ie11")
  RANDOM_BROWSER="${browser_options[$RANDOM % ${#browser_options[@]}]}"
  export ENDTEST_OPTIONS="&platform=$RANDOM_PLATFORM&os=windows10&browser=$RANDOM_BROWSER&browserVersion=latest&geolocation=sanfrancisco&cases=all&notes="
  echo "ENDTEST_OPTIONS=$ENDTEST_OPTIONS" >> $GITHUB_ENV
  exit 0
fi

# if the platform is mac we specify a browser
if [ "$RANDOM_PLATFORM" == "mac" ]; then
  browser_options=("chrome" "firefox" "safari")
  RANDOM_BROWSER="${browser_options[$RANDOM % ${#browser_options[@]}]}"
  export ENDTEST_OPTIONS="&platform=$RANDOM_PLATFORM&os=bigsur&browser=$RANDOM_BROWSER&browserVersion=latest&geolocation=sanfrancisco&cases=all&notes="
  echo "ENDTEST_OPTIONS=$ENDTEST_OPTIONS" >> $GITHUB_ENV
  exit 0
fi