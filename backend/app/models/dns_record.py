# DNS Record Model
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


class DNSRecord(Base):
    __tablename__ = "dns_records"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    hosted_zone_id = Column(
        Integer,
        ForeignKey(
            "hosted_zones.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    name = Column(
        String(255),
        nullable=False,
        index=True
    )

    record_type = Column(
        String(10),
        nullable=False,
        index=True
    )

    ttl = Column(
        Integer,
        nullable=False,
        default=300
    )

    value = Column(
        Text,
        nullable=False
    )

    routing_policy = Column(
        String(50),
        nullable=True,
        default="Simple"
    )

    alias = Column(
        Boolean,
        nullable=False,
        default=False
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

    hosted_zone = relationship(
        "HostedZone",
        back_populates="records"
    )