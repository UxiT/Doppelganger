setup:
	docker network create doppelganger-app && cp .env.example .env

run:
	docker compose --env-file .env -f ./.docker/docker-compose.yml up -d $(if $(filter 1, $(BUILD)), --build,)

stop:
	@docker ps --filter "name=doppelganger-" --format "{{.ID}}" | xargs -r docker stop

.PHONY: setup run stop