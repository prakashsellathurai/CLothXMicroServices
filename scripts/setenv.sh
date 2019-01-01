#!/usr/bin/env bash
DEPLOY_ENV_FILE="./functions/shared/environment/.deployenv"
if [ "$#" -lt 1 ]; then 
    echo 'provide an environment'
fi
if [ "$#" -gt 1 ]; then
   echo 'provide a single environment'
fi
if [[ "$#" -eq 1 ]]; then
  [[ "$@" == "clothxnet" ]] && production=true || production=false
   obj="{
      production: $production,
      storage: {
        bucket: $@.appspot.com
      }
    }"
  if [ -e "$DEPLOY_ENV_FILE" ]; then
      echo $obj > $DEPLOY_ENV_FILE 
  else 
      echo $obj >> $DEPLOY_ENV_FILE 
  fi 
  echo "environment set successfully : $@"
fi