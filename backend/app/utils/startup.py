from sqlalchemy.orm import Session
from app.database.db import SessionLocal
from app.models.album import Album

def ensure_gallery_exists():
    db: Session = SessionLocal()

    try:
        gallery = db.query(Album).filter(Album.is_master == True).first()

        if not gallery:
            gallery = Album(
                title="Gallery",
                description="All uploaded images live here",
                owner_user_id=1,  # system/admin user
                is_master=True,
            )
            db.add(gallery)
            db.commit()
    finally:
        db.close()
