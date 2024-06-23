# AI Home Price Predictor

## Purpose of this project

The AI model was trained using a deep learning neural network. It was trained on the Zillow Home Value Index data.
This application provides the user the ability to access the predictions of the pretrained model to gather interesting insights.


## Project Development

### Front End Development

The front end was built with React/TS. This provides the user with an ability to provide inputs to the model in a user-friendly manner.
Styling and layout required the use of HTML/CSS and bootstrap.

### Back End Development

The back end was built with django/python and several AI building libraries. The sci-kit learn library was used to design the neural network. A specific model was built for each state. This model was trained for 24 hours under rigourous load.

### Project Deployment

This project is currently deployed live [here](https://aihomepredictor.com)
This project was deployed on an AWS EC-2 Instance.
The front end and back end were individually containerized in docker.
Certbot and NGINX were used to setup certification and route traffic to the corresponding application depending on url endpoint.


