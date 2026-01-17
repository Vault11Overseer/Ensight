# app/scripts/init_db.py
from app.database.db import Base, engine, SessionLocal
from app.models.user import User
from app.utils.auth import hash_password

def create_tables():
    Base.metadata.create_all(bind=engine)

def seed_dev_user():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == "bciadmin").first()

        if not user:
            user = User(
                username="bciadmin",
                email="jmatta@bcimedia.com",
                password_hash=hash_password("devpassword"),
                role="admin",
                profile_metadata={"is_dev": True}
            )
            db.add(user)
            db.commit()
            print("✅ Dev user created")
        else:
            print("✅ Dev user already exists (no password re-hash)")
    finally:
        db.close()

if __name__ == "__main__":
    create_tables()
    seed_dev_user()
