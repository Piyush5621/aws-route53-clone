# Hosted Zone Schemas
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class HostedZoneBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    zone_type: str = "PUBLIC"
    comment: Optional[str] = None
    private: bool = False


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