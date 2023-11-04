#!/usr/bin/env bash

docker run -v ./bingo_board:/app/bingo_board -p 8080:8080 -p 8000:8000 -it bingo-board
