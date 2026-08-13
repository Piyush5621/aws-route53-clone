from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.dns_record import (
    DNSRecordCreate,
    DNSRecordUpdate,
    DNSRecordResponse,
)
from app.services.record_service import RecordService

router = APIRouter(
    tags=["DNS Records"]
)

@router.post(
    "/api/hosted-zones/{zone_id}/records",
    response_model=DNSRecordResponse,
    status_code=status.HTTP_201_CREATED
)
def create_record(
    zone_id: int,
    data: DNSRecordCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return RecordService.create_record(
            db=db,
            user_id=current_user.id,
            hosted_zone_id=zone_id,
            name=data.name,
            record_type=data.record_type,
            ttl=data.ttl,
            value=data.value,
            routing_policy=data.routing_policy,
            alias=data.alias
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )

@router.get(
    "/api/hosted-zones/{zone_id}/records",
    response_model=List[DNSRecordResponse]
)
def list_records(
    zone_id: int,
    search: Optional[str] = Query(default=None),
    record_type: Optional[str] = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    records = RecordService.get_records_by_zone(
        db=db,
        user_id=current_user.id,
        hosted_zone_id=zone_id,
        search=search,
        record_type=record_type
    )

    if records is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hosted zone not found"
        )

    return records

@router.get(
    "/api/records/{record_id}",
    response_model=DNSRecordResponse
)
def get_record(
    record_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = RecordService.get_record(
        db=db,
        user_id=current_user.id,
        record_id=record_id
    )

    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DNS Record not found"
        )

    return record

@router.put(
    "/api/records/{record_id}",
    response_model=DNSRecordResponse
)
def update_record(
    record_id: int,
    data: DNSRecordUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = RecordService.get_record(
        db=db,
        user_id=current_user.id,
        record_id=record_id
    )

    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DNS Record not found"
        )

    try:
        return RecordService.update_record(
            db=db,
            record=record,
            name=data.name,
            record_type=data.record_type,
            ttl=data.ttl,
            value=data.value,
            routing_policy=data.routing_policy,
            alias=data.alias
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )

@router.delete(
    "/api/records/{record_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_record(
    record_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = RecordService.get_record(
        db=db,
        user_id=current_user.id,
        record_id=record_id
    )

    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DNS Record not found"
        )

    RecordService.delete_record(db=db, record=record)
    return None
