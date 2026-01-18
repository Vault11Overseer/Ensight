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


Database overview (no code yet, just structure)
This is your correct mental model 👇

USERS
id
username
email
cognito_sub (future)
role (admin / user)
first_name
last_name
profile_metadata
created_at
updated_at

ALBUMS
One-to-many (User → Albums)
id
title
description
owner_user_id (FK → users.id)
is_master (bool, default False)
share_link
created_at
updated_at
Rules:
Every user can CRUD their albums
Admin can CRUD any album
Albums are public-readable

IMAGES
One-to-many (User → Images)
Many-to-many (Images ↔ Albums)
Many-to-many (Images ↔ Tags)
id
uploader_user_id (FK)
s3_key
preview_key
metadata
aws_tags
user_tags
watermark_enabled
created_at
updated_at

TAGS
Reusable and normalized:
id
name
source (user | aws)
created_at

IMAGE_ALBUMS (join table)
image_id
album_id

IMAGE_FAVORITES (per-user)
user_id
image_id
created_at

SHARE_LINKS
Reusable for albums and images:
id
resource_type (album | image)
resource_id
owner_user_id
token
expires_at
created_at
updated_at







Step 2
Create Album model + schema
No image logic yet
Just ownership + permissions

✅ Step 3
Create Image model
Without AWS integration at first
Just metadata + ownership

✅ Step 4
Add many-to-many tables
image_albums
image_tags
image_favorites

✅ Step 5
Only then:
S3 upload
AWS Rekognition
Share links
✅ Step 6 (LAST)
Replace dev auth with Cognito
Remove password_hash
Use cognito_sub
Verify JWTs

