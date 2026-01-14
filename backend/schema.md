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
