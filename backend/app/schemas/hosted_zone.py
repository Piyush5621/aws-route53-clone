# Hosted Zone Schemas
import re
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator

DOMAIN_REGEX = re.compile(
    r"^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}\.?$"
)

class HostedZoneBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    zone_type: str = "PUBLIC"
    comment: Optional[str] = None
    private: bool = False

    @field_validator("name")
    @classmethod
    def validate_domain_name(cls, v: str) -> str:
        clean = v.strip().lower()
        if not DOMAIN_REGEX.match(clean):
            raise ValueError(f"Invalid domain name format: '{v}'. Must be a valid domain like 'example.com'.")
        return clean

    @field_validator("zone_type")
    @classmethod
    def validate_zone_type(cls, v: str) -> str:
        upper = v.upper()
        if upper not in ["PUBLIC", "PRIVATE"]:
            raise ValueError("zone_type must be either 'PUBLIC' or 'PRIVATE'")
        return upper


class HostedZoneCreate(HostedZoneBase):
    pass


class HostedZoneUpdate(BaseModel):
    comment: Optional[str] = None


class HostedZoneResponse(HostedZoneBase):
    id: int
    user_id: int
    record_count: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)