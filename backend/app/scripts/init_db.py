from app.database.db import Base, engine, SessionLocal
from app.models import User, Album, Image, Tag, ImageFavorite, ShareLink
from app.models.image_album import image_albums
from app.models.image_tag import image_tags
from app.utils.auth import hash_password

# =========================
# RESET DATABASE
# =========================
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# =========================
# CREATE DEV ADMIN USER
# =========================
dev_user = User(
    username="bciadmin",
    first_name="BCI",
    last_name="Admin",
    email="jmatta@bcimedia.com",
    password_hash=hash_password("devpassword"),
    role="admin",
    profile_metadata={"is_dev": True},
)

db.add(dev_user)
db.commit()
db.refresh(dev_user)

print("✅ Dev user created:", dev_user.username)

# =========================
# NOTE: Gallery is now a virtual collection
# All images are automatically in the Gallery
# No need to create a special album for it
# =========================

db.close()
print("✅ Database initialized successfully")


