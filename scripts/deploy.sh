#!/bin/sh

#           _        _        _______  _______  _______          
# |\     /|( (    /|( \      (  ____ \(  ___  )(  ____ \|\     /|
# | )   ( ||  \  ( || (      | (    \/| (   ) || (    \/| )   ( |
# | |   | ||   \ | || |      | (__    | (___) || (_____ | (___) |
# | |   | || (\ \) || |      |  __)   |  ___  |(_____  )|  ___  |
# | |   | || | \   || |      | (      | (   ) |      ) || (   ) |
# | (___) || )  \  || (____/\| (____/\| )   ( |/\____) || )   ( |
# (_______)|/    )_)(_______/(_______/|/     \|\_______)|/     \|
# 
# Deployment script

CHANNEL="#unleash-interface"
USERNAME="unleash-bot"
TEXT="Deployment has completed: <http://unleash-app.firebaseapp.com>"
ICON=":sparkles:"
URL="https://hooks.slack.com/services/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"

grunt build \
&& ./node_modules/firebase-cli/bin/firebase deploy \
&& curl -X POST --data-urlencode "payload={\"channel\": \"$CHANNEL\", \"username\": \"$USERNAME\", \"text\": \"$TEXT\", \"icon_emoji\": \"$ICON\"}" $URL