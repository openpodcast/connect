SHELL := /bin/bash
.DEFAULT_GOAL := help

.PHONY: help
help: ## help message, list all command
	@echo -e "$$(grep -hE '^\S+.*:.*##' $(MAKEFILE_LIST) | sed -e 's/:.*##\s*/:/' -e 's/^\(.\+\):\(.*\)/\\x1b[36m\1\\x1b[m:\2/' | column -c2 -t -s :)"

.PHONY: build
build: ## Build the js code as a static project
	npm run generate

.PHONY: docker-build
docker-build: ## Build the docker image
	docker build -t openpodcast/webapp .

.PHONY: dev
dev: ## Starts the api development server
	npm run dev

.PHONY: install init
install init: ## Installs dependencies
	npm install
