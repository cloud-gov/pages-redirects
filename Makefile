
all: docker

.PHONY: docker-nginx.conf docker clean

docker-nginx.conf:
	node build-config.js --docker

docker: docker-nginx.conf
	docker-compose build

clean:
	rm out/*.conf
