#!/bin/bash

# https://unix.stackexchange.com/questions/230673/how-to-generate-a-random-string
generate_password() {
  local length=$1
  local password=$(LC_ALL=C tr -dc A-Za-z0-9 </dev/urandom | head -c $length ; echo '')
  echo "$password"
}

postgres_user="postgres"
suggested_password=$(generate_password 13)
postgres_host="localhost"
postgres_port="5432"
suggested_secret_key=$(generate_password 64)

echo
echo "The following will setup your .env file."
echo
echo "What should the PostgreSQL password be?"
echo "(Hit <Enter> to use: '$suggested_password')"
read -p "> " postgres_password
echo
echo "What should the Flask secret key be?"
echo "(Hit <Enter> to use '$suggested_secret_key')"
read -p "> " flask_secret_key

if [[ -z "$postgres_password" ]]; then
  postgres_password="$suggested_password"
fi
if [[ -z "$flask_secret_key" ]]; then
  flask_secret_key="$suggested_secret_key"
fi

file_contents="# If POSTGRES_USER is changed after the database container has
# already been created, then delete the Docker volume for the Postrgres
# container and restart the container. This will re-initialize Postres so that
# the new POSTRGRES_USER is admin.
POSTGRES_USER=postgres
POSTGRES_PASSWORD=$postgres_password
POSTGRES_HOST=database
POSTGRES_PORT=5432

FLASK_SECRET_KEY=$flask_secret_key"

echo "$file_contents" > .env

echo
echo "New .env file created with:"
echo
echo "$file_contents"
echo
