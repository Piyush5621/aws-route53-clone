
from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Text
)

from sqlalchemy.orm import relationship

from app.database import Base


class HostedZone(Base):
    __tablename__ = "hosted_zones"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(255),
        nullable=False,
        index=True
    )

    zone_type = Column(
        String(20),
        nullable=False,
        default="PUBLIC"
    )

    comment = Column(
        Text,
        nullable=True
    )

    private = Column(
        Boolean,
        nullable=False,
        default=False
    )

    record_count = Column(
        Integer,
        nullable=False,
        default=0
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="hosted_zones"
    )

    records = relationship(
        "DNSRecord",
        back_populates="hosted_zone",
        cascade="all, delete-orphan"
    )