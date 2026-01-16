from app.database.db import engine, SessionLocal, Base
from app.models import user, gallery, image, album, image_access, share_link
from app.models.gallery import Gallery
from sqlalchemy import select

def seed_master_gallery(db):
    MASTER_GALLERY_ID = 1
    exists = db.execute(
        select(Gallery).where(Gallery.id == MASTER_GALLERY_ID)
    ).scalar()
    if not exists:
        db.add(
            Gallery(
                id=MASTER_GALLERY_ID,
                created_by=None,
                title="Master Gallery",
                description="System-wide gallery containing all images",
            )
        )
        db.commit()
        print("✅ Master Gallery created")

def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_master_gallery(db)
    finally:
        db.close()

if __name__ == "__main__":
    main()
