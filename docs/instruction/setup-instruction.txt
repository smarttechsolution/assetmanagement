How to setup with Docker
1) Clone the project to local 
	git clone -b master https://github.com/smarttechsolution/assetmanagement.git

2) Docker should be installed
	https://docs.docker.com/engine/install/

3) Go to project root directory i.e asset-management

4) Run the command in terminal

	sudo sh run_ams.sh
  
  and wait until the the image is ready.

5) If you want to create superuser manually

	docker-compose exec web python manage.py createsuperuser

Congratulation!! its Done.

	API will run on: localhost:8000
	Fronted will run on: localhost:3000

	Go to localhost:8000/main-config/login to create new water system.

To down the docker containers

	docker-compose  down --rmi all