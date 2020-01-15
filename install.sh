#!/bin/bash
rm -rf node_modules/pathwatcher

if [ "$1" = "--from-source" ]; then
	npm -g --production install
else
	npm -g --production --use-pre-compiled install
fi