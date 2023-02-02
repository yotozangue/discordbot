include .env

.PHONY: up

up:
	docker-compose -f docker-compose.yml up -d

.PHONY: down

down:
	docker-compose -f docker-compose.yml down

.PHONY: logs

logs:
	docker-compose logs -f
