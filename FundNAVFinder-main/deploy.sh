docker-compose -p p1 -f docker-compose-dev.yml -f docker-compose-dev.override.yml build --no-cache $1
sudo docker-compose -p p1 -f docker-compose-dev.yml -f docker-compose-dev.override.yml push $1
docker rm -f $1
docker-compose -p p1 -f docker-compose-dev.yml -f docker-compose-dev.override.yml up -d $1
docker logs -f $1