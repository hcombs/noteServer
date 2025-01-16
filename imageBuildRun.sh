#!/bin/bash

sudo docker build -t noteserver .
sudo docker run --network=host -d -v $(pwd)/notes:/app/notes noteserver
