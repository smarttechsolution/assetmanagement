How to setup with Docker

1)Docker should be installed

2) Go to project dir cd asset-management

2) Run the command in terminal

	sudo sh run_ams.sh

3) If you want to creat superuser manually

	docker-compose exec web python manage.py createsuperuser

Congratulation!! its Done.

To down the docker container

docker-compose  down --rmi all