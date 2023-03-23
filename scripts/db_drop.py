from db import Postgres

pg = Postgres()
to_drop_db_names = pg.app_db_names.intersection(set(pg.database_names))

if to_drop_db_names:
    print("\nDropping databases:")

    for name in to_drop_db_names:
        pg.drop_database(name)
        print(name)
else:
    print("\nNo development or test database to drop.")

print(f'\nDatabases for the Postgres user "{pg.user}":')
for db in pg.database_names:
    print(db)

print()
