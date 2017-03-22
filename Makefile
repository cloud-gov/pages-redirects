
.PHONY: docker-nginx.conf docker docker-run

docker-nginx.conf:
	node build-config.js --docker

docker: docker-nginx.conf
	docker-compose build
