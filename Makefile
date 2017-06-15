PATH_DISPLAY_TRIGGER=../displayTrigger/display


help:
	# stageViewer
	#   - install  - Install node_modules and link to $(PATH_DISPLAY_TRIGGER)
	#   - run      - Dev server
	#   - test     - Karama tests in chrome
	#   - clean    - Reset to clean checkout

node_modules:
	npm install

node_modules/displayTrigger:
	npm link $(PATH_DISPLAY_TRIGGER)

.PHONY: install
install: node_modules node_modules/displayTrigger

run: install
	npm run start

test: install
	npm run test

clean:
	rm -rf dist/
	rm -rf ext/
	rm -rf node_modules/
	rm -rf static/
	rm -rf *.log
