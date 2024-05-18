FROM python:3.7-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt

# Update pip and install dependencies
RUN python3 -m pip install --upgrade pip \
    && python3 -m pip install -r requirements.txt

COPY . .

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]