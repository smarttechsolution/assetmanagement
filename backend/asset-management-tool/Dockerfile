# pull official base image
FROM python:3.8.12-alpine3.14

# set work directory
WORKDIR ./asset-management-tool

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev jpeg-dev zlib-dev libffi-dev cairo-dev pango-dev gdk-pixbuf-dev build-base linux-headers

# install dependencies
RUN pip install --upgrade setuptools
RUN pip install --upgrade pip
COPY ./requirement.txt .
RUN pip install -r requirement.txt

# copy project
COPY . .
