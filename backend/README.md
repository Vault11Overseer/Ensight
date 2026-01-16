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



cd backend
python -m scripts.init_db





USERS
-----
id (PK)
username
email
role (admin/user)
created_at
updated_at

IMAGES
------
id (PK)
user_id (FK → USERS.id)
s3_key (string)
metadata (JSON)
created_at
updated_at

ALBUMS
------
id (PK)
user_id (FK → USERS.id)
title
description
created_at
updated_at

GALLERY
-------
id (PK)
created_by (FK → USERS.id)
title
description
sort_order (int)
is_master (bool)          -- true for master gallery
created_at
updated_at

ALBUM_IMAGES (many-to-many)
---------------------------
album_id (FK → ALBUMS.id)
image_id (FK → IMAGES.id)

GALLERY_ALBUMS (many-to-many)
-----------------------------
gallery_id (FK → GALLERY.id)
album_id (FK → ALBUMS.id)

IMAGE_ACCESS_RULES
------------------
image_id (FK → IMAGES.id)
watermark_required (bool)
manual_tags (JSON)        -- tags added by uploader
rekognition_tags (JSON)   -- tags added by AWS Rekognition
favorite (bool)           -- optional future feature
created_at
updated_at

SHARE_LINKS
-----------
id (PK)
gallery_id (FK → GALLERY.id, nullable)
album_id (FK → ALBUMS.id, nullable)
image_id (FK → IMAGES.id, nullable)
link (string)
expires_at (datetime)
created_at
updated_at
