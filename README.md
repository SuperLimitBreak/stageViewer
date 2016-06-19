# stageViewer

Currently a mockup

Goals:

1. Listen to the lighting system events, play those events in sync
   with video and audio
2. Be able to edit the lighting system events

The demo song uses three videos, not committed to the repo because they're
not important, just dump any random videos into the folder and name them
background.mp4 / countdown.mp4 / foreground.mkv


The .stage.js files contain a list of objects (lights, projectors, screens,
speakers, etc). The .song.js files then contain a list of timed instructions
like "on the third bar, tell all lights tagged with 'top' to turn blue and
all lights tagged with 'bottom' to turn green"
