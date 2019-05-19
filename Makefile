PATH_DISPLAY_TRIGGER=../displayTrigger/display
PATH_LIBS=../libs


help:
	# stageViewer
	#   - install  - Install node_modules and link to $(PATH_DISPLAY_TRIGGER)
	#   - run      - Dev server
	#   - test     - Karama tests in chrome
	#   - clean    - Reset to clean checkout

node_modules:
	npm install
node_modules/calaldees_libs:
	npm link $(PATH_LIBS)
node_modules/displayTrigger:
	npm link $(PATH_DISPLAY_TRIGGER)
.editorconfig:
	ln -s $(PATH_DISPLAY_TRIGGER)/$@ $@

.PHONY: install
install: node_modules node_modules/calaldees_libs node_modules/displayTrigger .editorconfig

run: install
	npm run start

build: install
	npm run build

test: install
	npm run test

clean:
	rm -rf node_modules/
	rm -rf static/
	rm -rf *.log
	rm .editorconfig
