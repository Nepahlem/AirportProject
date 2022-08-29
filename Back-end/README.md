## Initial Installation
You would need python >= 3.7 installed on your system.


### Run these commands from the terminal

Install virtualenv
```shell
pip install virtualenv
```

From the project root folder, in terminal create a virtual enviroment 
```shell
virtualenv env 
```
Activate the virtual enviroment created 
If you are on windows run
```shell
env/scripts/activate
```
If you are on linux run
```shell
source env/bin/activate
```

Install project requirements
```shell
pip install -r requirements.txt
```

### Running the project 
Type in the command
```shell
python manage.py runserver
```
This will start the server at http://127.0.0.1:8000
this is where your backend API will be listening locally.
this url should be provided in the `.env` file of the airline-frontend.

To access the administrator panel, go to http://127.0.0.1:8000/admin/


### Deploying to heroku
The project already has configurations to deploy to heroku directly.
Just link your github account under a heroku app and enable automatic deployments from the master branch.
Once done, scroll down to and hit `deploy this branch` button.

Once deployment is successful, You'll have to go to `more` options in the heroku apps,
select run console, and type in `bash` to access the heroku terminal. Once there, 
type in `python manage.py migrate` to apply migrations to the heroku database.
since a new database is configured by heroku you'll also have to create a superuser to access the admin panel.
for that type in `python manage.py createsuperuser` and follow according to the prompt.

Once everything is done, you can exit out from the heroku terminal, and click on open app. 
Add a /admin/ succeeding the heroku app domain and you'll be able to access the admin panel. 
