===========Steps to get the Backend up and running=================
1. Install Anaconda Navigator on your local operating system
2. Run a terminal in Anaconda navigator
3. cd to this directory
4. run the command conda env create -f environment.yml
5. run the command conda activate conda activate home_prediction_backend
6. run the command cd djangoMain
7. run the command python manage.py runserver
8. The server will run by default on 127.0.0.1:8000


The AI model was trained on a deep learning neural network with the Zillow Home Value Index for all 50
US states and Washington DC.


You can do the following POST and GET requests

-POST http://127.0.0.1:8000/api/predict/
body(JSON): 
{
	"date": "2022-10-13",
	"state": "Texas"
}
This will run the predict_home_value function located at: djangoMain\django_churn_model_app\views.py
This will return a predicted home price value for the date and state based on the trained model.
example:
{
    "state": "Texas",
    "date": "2022-10-13",
    "predicted_value": 277207.65625
}

-POST http://127.0.0.1:8000/api/median-growth/
body:
{
	"date1": "2022-10-13",
	"date2": "2024-12-23",
	"state": "Texas"
}
This will return data related to these two predictions. 
Example:
{
    "state": "Texas",
    "date1": "2022-10-13",
    "date2": "2024-12-23",
    "predicted_value1": 277207.65625,
    "predicted_value2": 311116.84375,
    "amount_change": 33909.1875,
    "percent_change": 12.23241376472624
}

-GET http://127.0.0.1:8000/api/train/
NOTE: This is VERY computationally expensive and can take hours depending on your machine.
This will run the train_model function in djangoMain\django_churn_model_app\views.py
This will train the model using the charicteristics defined. This is generally not recommended as
the model has already been trained. However, this function exists.
