PATH_DISPLAY_TRIGGER=../../displayTrigger/display/src

help:
	# stageViewer
	#  - install
	#  - run
	#  - test
	#  - clean

node_modules:
	npm install

ext:
	mkdir -p ext
ext/displayTrigger: ext
	ln -s $(PATH_DISPLAY_TRIGGER) $@

.PHONY: install
install: node_modules ext/displayTrigger

run: install
	npm run start

test: install
	npm run validate

clean:
	rm -rf dist/
	rm -rf ext/
	rm -rf node_modules/
	rm -rf *.log
