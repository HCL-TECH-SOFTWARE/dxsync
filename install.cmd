@echo off
rmdir node_modules\pathwatcher /s /q 2>null

IF /I "%~1"=="--from-source" (
	npm -g --production install
) ELSE (
	npm -g --production --use-pre-compiled install
)