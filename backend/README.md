<!-- INSIGHT BACKEND -->

<!-- CREATING A VIRTUAL ENVIROMENT -->
    python3 -m venv venv
<!-- FIRST ACCESS THE VIRTUAL ENVIROMENT -->
    source venv/bin/activate

<!-- COMMANDS SHOWING WHCIH ENVIROMENT -->
    which python3 
<!-- /path/to/backend/venv/bin/python -->
    which pip3
<!-- /path/to/backend/venv/bin/pip -->


<!-- START THE FAST API SERVER -->
    uvicorn app.main:app --reload

<!-- LOCAL ENDPOINT -->
    <!-- http://127.0.0.1:8000 -->

<!-- SWAGGER ENDPOINT -->
<!-- http://localhost:8000/docs -->

<!-- DB TEMPLATE FOR POSTGRES -->
postgresql://<username>:<password>@<host>:<port>/<database>?<options>

<!-- NEW DB -->
DATABASE_URL=postgresql://insight_db_admin:uLV2f6EMAuNtU5eECAsK0YNaubGwHcUl@dpg-d5laodkmrvns73ebk340-a.oregon-postgres.render.com:5432/insight_db_rfy7?sslmode=require

<!-- NEW START DB -->
psql "postgresql://insight_db_admin:uLV2f6EMAuNtU5eECAsK0YNaubGwHcUl@dpg-d5laodkmrvns73ebk340-a.oregon-postgres.render.com:5432/insight_db_rfy7"


<!-- POSTGRES -->

<!-- SHOW TABLES -->
\dt

<!-- SHOW SCHEMS -->
\dn

<!-- SHOW ALL DATA -->
SELECT * FROM library

<!-- EXIT -->
\q

<!-- CHECK USERS IN USER TABLE -->
SELECT id, username, email, role, profile_metadata
FROM users;

<!-- RUNNING DB SCRIPT -->
python -m app.scripts.init_db



BACKEND
- [ ] Python
- [ ] FastApi
- [ ] SQLalchemy
- [ ] Postgres
- [ ] Gunicorn
- [ ] Boto3
- [ ] Unicorn
- [ ] Pydantic



