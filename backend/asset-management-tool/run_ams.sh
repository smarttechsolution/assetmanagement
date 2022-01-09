# chmod +x entrypoint.sh
docker-compose  down --rmi all
docker-compose up -d --build db
echo "Waiting for DB to run....."
sleep 20
docker-compose up -d --build web


#for migration
#docker-compose exec web python manage.py flush --no-input
docker-compose exec web python manage.py migrate
echo -n "Do you want to create superuser (y/n)? "
read answer

if [ "$answer" != "${answer#[Yy]}" ] ;then # this grammar (the #[] operator) means that the variable $answer where any Y or y in 1st position will be dropped if they exist.
    docker-compose exec web python manage.py createsuperuser
else
    echo No
fi
docker-compose up -d --build redis
sleep 20
docker-compose up -d --build celery
sleep 30
docker-compose exec celery celery -A config_pannel worker -B -l INFO --detach
echo "Congratulation!!!"
echo "Go to browser and open localhost:8000/main-config/login"
