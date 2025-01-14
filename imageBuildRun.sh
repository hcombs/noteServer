#!/bin/bash

sudo docker build -t noteserver .
sudo docker run -d noteserver
