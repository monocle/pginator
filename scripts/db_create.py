from time import sleep
import psycopg
from db import Postgres

pg = Postgres()
db_online = False

while not db_online:
    try:
        pg.connect()
        db_online = True
    except Exception as e:
        sleep(1)

needed_db_names = pg.app_db_names - set(pg.database_names)
if needed_db_names:
    print("\nCreating databases:")

    for name in needed_db_names:
        pg.create_database(name)
        print(name)
else:
    print("\nAll databases already exist.")

print(f'\nDatabases for the Postgres user "{pg.user}":')
for db in pg.database_names:
    print(db)

print()
