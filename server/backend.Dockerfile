FROM python:3.9-slim

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# set default shell
SHELL [ "/bin/bash", "-c" ]

# set container default working directory
WORKDIR /app

# update/upgrade container & install git
RUN apt update && apt upgrade -y

# copy code files into container
COPY . .

# install required packages
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 3000

CMD ["python", "app.py"]