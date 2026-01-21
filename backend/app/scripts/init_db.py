from app.database.db import Base, engine, SessionLocal
from app.models.user import User
from app.models.album import Album
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
# CREATE MASTER GALLERY ALBUM
# =========================
master_album = Album(
    title="Master Gallery",
    description="All uploaded images live here",
    owner_user_id=dev_user.id,
    is_master=True,
)

db.add(master_album)
db.commit()
db.refresh(master_album)

print("✅ Master Gallery created (album_id =", master_album.id, ")")

db.close()


