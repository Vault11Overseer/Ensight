<!-- ENSIGHT BACKEND -->

<!-- UV SERVER START -->

uv run -m app.main

<!-- SQLITE 3 DATABASE STARTUP -->
<!-- sqlite3 ./test.db
sqlite> .tables
users -->

<!-- SCRIPTS RUN FROM BACKEND DIRECTORY -->

python -m app.scripts.reset_users_table

<!-- SWAGGER ENDPOINT -->
<!-- http://localhost:8000/docs -->

THINGS TO DO CHECKLIST:
/backend/app

<!-- /auth/ -->

/core/
/db/
/migrations/
/models/
/routers/
/schemas/
/scripts/
/services/

<!-- .env -->

main.py

<!-- /static/ -->
<!-- /db/ -->

LOOK INTO CURL CALLS
