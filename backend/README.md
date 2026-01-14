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
    http://127.0.0.1:8000

<!-- SWAGGER ENDPOINT -->
<!-- http://localhost:8000/docs -->


<!-- DATABASE -->
Name: DATABASE_URL
Value: postgresql://<insightadmin>:<kixxMXTVAiVAASXBBBLRnJxX22E1DJCa>@<dpg-d5i4c3idbo4c73ebsos0-a>:<5432>/<insightdb_603m>

<!-- START DB -->
psql "postgresql://insightadmin:kixxMXTVAiVAASXBBBLRnJxX22E1DJCa@dpg-d5i4c3idbo4c73ebsos0-a.oregon-postgres.render.com:5432/insightdb_603m"



<!-- POSTGRES -->

<!-- SHOW TABLES -->
\dt

<!-- SHOW SCHEMS -->
\dn

<!-- SHOW ALL DATA -->
SELECT * FROM library

<!-- EXIT -->
\q


<!-- OLD PYTHON DEPENDENCIES -->
requires-python = ">=3.11"
dependencies = [
    "aiofiles>=24.1.0",
    "aiosqlite>=0.20.0",
    "bcrypt==4.0.1",
    "boto3>=1.37.38",
    "email-validator>=2.3.0",
    "fastapi[all]>=0.116.2",
    "passlib[bcrypt,bycrypt]>=1.7.4",
    "pillow>=10.4.0",
    "pydantic-settings==2.9",
    "pydantic[email]>=2.10.6",
    "pyjwt>=2.10.1",
    "python-dotenv>=1.0.1",
    "python-jose[cryptography]>=3.4.0",
    "python-multipart>=0.0.20",
    "requests>=2.32.5",
    "sqlalchemy>=2.0.43",
    "uvicorn>=0.33.0",
]


backend/
├─ app/
│  ├─ main.py
│  ├─ database/
│  │  ├─ db.py
│  │  └─ __init__.py
│  ├─ models/
│  │  ├─ user.py
│  │  ├─ image.py
│  │  ├─ album.py
│  │  ├─ gallery.py
│  │  ├─ image_access.py
│  │  ├─ share_link.py
│  │  └─ __init__.py
│  ├─ schemas/
│  │  └─ <pydantic schemas here>
│  ├─ routes/
│  │  └─ <routes for users, images, albums, galleries>
│  └─ utils/
│     └─ auth.py  # placeholder for Cognito integration later
├─ venv/
├─ .env
├─ requirements.txt
└─ scripts/
   └─ test_db.py
