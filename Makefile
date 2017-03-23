
all: build-conf

.PHONY: build-conf docker clean

build-conf:
	node build-nginx-configs.js

docker: build-conf
	docker-compose build

clean:
	rm out/*.conf
