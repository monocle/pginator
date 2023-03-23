#!/bin/bash

old_project_name="reaskgres"
files_to_update=(
    "frontend/package.json"
    "frontend/package-lock.json"
    "Makefile"
    "compose.yml"
)

echo
read -p "Enter the name of your project: " project_name
project_name=$(echo $project_name | tr -d '[:space:]' | tr '[:upper:]' '[:lower:]')

for file_path in "${files_to_update[@]}"
do
    echo "Updating project name in: $file_path"

    contents=$(cat "$file_path")
    new_contents=$(echo "$contents" | sed "s/$old_project_name/$project_name/g")

    echo "$new_contents" > "$file_path"
done

echo "Project name updated to: $project_name"
echo
