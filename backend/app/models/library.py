# app/models/library.py
class Library(Base):
    __tablename__ = "libraries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    images = relationship("Image", back_populates="library")
    user = relationship("User", back_populates="libraries")