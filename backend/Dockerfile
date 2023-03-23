# https://pythonspeed.com/docker/
# Use a multi-staged build assuming a package with build artifacts
# is needed in the future.
# First stage build
FROM python:3.11.2-slim-bullseye AS compile-image

# If a new package is needed use:
# apt-get -y install --no-install-recommends [package]
RUN apt-get update && \
    apt-get -y upgrade && \
    apt-get -y install --no-install-recommends make

# Activate the Python virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /home/appuser/src/backend

# Use pip-tools to generate requirements.txt outside of Docker first
COPY requirements.txt /home/appuser/src/backend/
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt


# Second stage build to remove any build artifacts for smaller build
FROM python:3.11.2-slim-bullseye AS build-image
COPY --from=compile-image /usr/bin/make /usr/bin/make
COPY --from=compile-image /opt/venv /opt/venv

# Activate the venv just by adding its PATH
ENV PATH="/opt/venv/bin:$PATH"
ENV FLASK_APP=/home/appuser/src/backend/src/app

EXPOSE 5000

# Don't run the container as root for security reasons.
RUN useradd --create-home appuser
WORKDIR /home/appuser/src
USER appuser

CMD ["flask", "run", "--host=0.0.0.0", "--debug"]
