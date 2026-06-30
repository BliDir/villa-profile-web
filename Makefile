IMAGE_NAME = villa-profile-web
IMAGE_TAG  = latest

.PHONY: install run build docker-build docker-run

install:
	npm install

run:
	npm run dev

build:
	npm run build

docker-build:
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

docker-run:
	docker run --rm -p 8080:8080 $(IMAGE_NAME):$(IMAGE_TAG)
