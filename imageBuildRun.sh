#!/bin/bash

sudo docker build -t noteserver .
sudo docker run --network=host -d noteserver
