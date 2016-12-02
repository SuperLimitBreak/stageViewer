PATH_DISPLAY_TRIGGER=../../displayTrigger/display/src

help:
	# stageViewer
	#  - install
	#  - run
	#  - test
	#  - clean

node_modules:
	npm install

#ext:
#	mkdir -p ext
#ext/displayTrigger: ext
#	ln -s $(PATH_DISPLAY_TRIGGER) $@
node_modules/displayTrigger:
	npm link ../displayTrigger/display

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
