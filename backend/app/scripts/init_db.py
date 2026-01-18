from app.database.db import Base, engine, SessionLocal
from app.models.user import User
from app.utils.auth import hash_password

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# CREATE DEV USER
dev_user = User(
    username="bciadmin",
    first_name="BCI",          # NEW
    last_name="Admin",          # NEW
    email="jmatta@bcimedia.com",
    password_hash=hash_password("devpassword"),
    role="admin",
    profile_metadata={"is_dev": True}
)

db.add(dev_user)
db.commit()
db.refresh(dev_user)
print("✅ Dev user created:", dev_user.username)
db.close()

