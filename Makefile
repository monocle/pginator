PROJ_NAME := pginator
BACKEND := backend
FRONTEND := frontend
DATABASE := database
POSTGRES_USER := postgres
POSTGRES_VOLUME := postgres-data
FRONTEND_NODE_VOLUME := node-modules

init:
	/bin/bash scripts/set_project_name.sh
	/bin/bash scripts/create_env_file.sh
	@$(MAKE) up
	@$(MAKE) db_create
	@echo "Setup is complete. Docker containers are ready to be used."
	@echo

up:
	docker compose up -d

down:
	docker compose down

clean:
	docker compose down
	docker rmi $(PROJ_NAME)-$(BACKEND) $(PROJ_NAME)-$(FRONTEND)
	docker volume rm $(PROJ_NAME)_$(POSTGRES_VOLUME) $(PROJ_NAME)_$(FRONTEND_NODE_VOLUME)

backend_build:
	docker compose stop $(BACKEND)
	docker compose rm $(BACKEND)
	docker rmi $(PROJ_NAME)-$(BACKEND)
	docker compose up -d $(BACKEND)

backend_logs:
	docker compose logs -f $(BACKEND)

backend_restart:
	docker compose stop $(BACKEND)
	docker compose up -d $(BACKEND)

backend_shell:
	docker exec -it $(PROJ_NAME)-$(BACKEND)-1 /bin/bash

backend_test:
	docker exec -it $(PROJ_NAME)-$(BACKEND)-1 python scripts/auto_run_tests.py

backend_test_cov:
	docker exec -it $(PROJ_NAME)-$(BACKEND)-1 pytest --cov=backend/src/app --cov-report=term-missing 

db_create:
	docker exec $(PROJ_NAME)-$(BACKEND)-1 python scripts/db_create.py

db_drop:
	docker exec $(PROJ_NAME)-$(BACKEND)-1 python scripts/db_drop.py

db_shell:
	docker exec -it $(PROJ_NAME)-$(DATABASE)-1 psql -E -U $(POSTGRES_USER)

frontend_logs:
	docker compose logs -f $(FRONTEND)

frontend_shell:
	docker exec -it $(PROJ_NAME)-$(FRONTEND)-1 /bin/sh

frontend_test:
	docker exec -it $(PROJ_NAME)-$(FRONTEND)-1 npm run test

frontend_tsc:
	docker exec -it $(PROJ_NAME)-$(FRONTEND)-1 npx tsc

list:
	@echo
	@echo "Available targets:"
	@make -qp | awk -F':' '/^[a-zA-Z0-9][^$#\/\t=]*:([^=]|$$)/ && !/^\./ && !/%$$/ {split($$1,A,/ /); for(i in A) if (A[i] != "Makefile") print A[i]}' | sort | uniq
	@echo
