# PGinator

PGinator is a PostgreSQL database client designed as a full-stack portfolio project. It allows DB admins to interact with a PostgreSQL database through a web interface and allows CRUD operations on datbase tables and their data.

## Technical Features

- `React`-based frontend written in `TypeScript` and using `Vite` tooling 
- `Flask` backend to handle `RESTful API` requests and connect to the `PostgreSQL` database
- Developed with separate `Docker` containers for the frontend, backend, and database
- Application testing with `pytest`, `Vitest`, `Testing Library` and `Mock Service Worker`

## Setup and Installation

1. Clone the repository: `git clone https://github.com/monocle/pginator.git`
2. Navigate to the project directory: `cd pginator`
3. (Optional) Edit any necessary configuration settings, such as database credentials or application ports.
4. Run the Makefile to set up the project (once available).
5. Start the application with Docker Compose: `docker-compose up`
6. Go to `http://localhost:5173` in a browser to interact with your PostgreSQL database.

## Usage

Once the application is up and running, you can use the web interface to:

- View a list of all tables in the connected PostgreSQL database
- Create, edit, and delete tables
- Click on a table to view its rows
- Perform CRUD operations on rows within a table

## Limitations

This project is intended to serve as a portfolio piece to demonstrate technical abilities and skills. Because of that, it offers a limited subset of PostreSQL functionality.
