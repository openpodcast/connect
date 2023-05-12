SHELL := /bin/bash
.DEFAULT_GOAL := help

.PHONY: help
help: ## help message, list all command
	@echo -e "$$(grep -hE '^\S+.*:.*##' $(MAKEFILE_LIST) | sed -e 's/:.*##\s*/:/' -e 's/^\(.\+\):\(.*\)/\\x1b[36m\1\\x1b[m:\2/' | column -c2 -t -s :)"

.PHONY: build
build: ## Build the js code as a static project
	npm run generate

.PHONY: dev
dev: ## Starts the api development server
	npm run dev

.PHONY: init
init: install

.PHONY: install
install: ## Installs dependencies
	npm install
