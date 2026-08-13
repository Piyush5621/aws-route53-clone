# DNS Record Schemas
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


SUPPORTED_RECORD_TYPES = {
    "A",
    "AAAA",
    "CNAME",
    "TXT",
    "MX",
    "NS",
    "SOA",
    "PTR",
    "SRV",
    "CAA",
}


class DNSRecordBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    record_type: str
    ttl: int = Field(default=300, ge=0)
    value: str
    routing_policy: Optional[str] = "Simple"
    alias: bool = False


class DNSRecordCreate(DNSRecordBase):
    pass


class DNSRecordUpdate(BaseModel):
    name: Optional[str] = None
    record_type: Optional[str] = None
    ttl: Optional[int] = Field(default=None, ge=0)
    value: Optional[str] = None
    routing_policy: Optional[str] = None
    alias: Optional[bool] = None


class DNSRecordResponse(DNSRecordBase):
    id: int
    hosted_zone_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)