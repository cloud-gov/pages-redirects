
all: docker

.PHONY: docker clean

clean:
	rm out/*.conf

docker:
	./build-cf-docker.sh
	node build-config.js

	# TODO: this isn't working :(
	docker-compose build
