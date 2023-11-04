#!/usr/bin/env bash

docker buildx build -t bingo-board -f ./Dockerfile-dev .
