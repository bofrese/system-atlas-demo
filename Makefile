.PHONY: install dev validate check build preview clean

install:
	npm install

dev:
	npm run dev

validate:
	npm run validate-data

check:
	npm run check

build:
	npm run build

preview:
	npm run preview

clean:
	rm -rf dist
