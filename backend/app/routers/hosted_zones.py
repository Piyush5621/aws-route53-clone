from typing import Optional
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.hosted_zone import (
    HostedZoneCreate,
    HostedZoneResponse,
    HostedZoneUpdate,
)
from app.services.hosted_zone_service import HostedZoneService


router = APIRouter(
    prefix="/api/hosted-zones",
    tags=["Hosted Zones"],
)


@router.post(
    "",
    response_model=HostedZoneResponse,
    status_code=201,
)
def create_hosted_zone(
    data: HostedZoneCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return HostedZoneService.create_hosted_zone(
            db=db,
            user_id=current_user.id,
            name=data.name,
            zone_type=data.zone_type,
            comment=data.comment,
            private=data.private,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=409,
            detail=str(error),
        )


@router.get(
    "",
    response_model=list[HostedZoneResponse],
)
def list_hosted_zones(
    search: Optional[str] = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return HostedZoneService.get_hosted_zones(
        db=db,
        user_id=current_user.id,
        search=search,
    )


@router.get(
    "/{zone_id}",
    response_model=HostedZoneResponse,
)
def get_hosted_zone(
    zone_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    hosted_zone = HostedZoneService.get_hosted_zone(
        db=db,
        zone_id=zone_id,
        user_id=current_user.id,
    )

    if not hosted_zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found",
        )

    return hosted_zone


@router.put(
    "/{zone_id}",
    response_model=HostedZoneResponse,
)
def update_hosted_zone(
    zone_id: int,
    data: HostedZoneUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    hosted_zone = HostedZoneService.get_hosted_zone(
        db=db,
        zone_id=zone_id,
        user_id=current_user.id,
    )

    if not hosted_zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found",
        )

    return HostedZoneService.update_hosted_zone(
        db=db,
        hosted_zone=hosted_zone,
        comment=data.comment,
    )


@router.delete(
    "/{zone_id}",
    status_code=204,
)
def delete_hosted_zone(
    zone_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    hosted_zone = HostedZoneService.get_hosted_zone(
        db=db,
        zone_id=zone_id,
        user_id=current_user.id,
    )

    if not hosted_zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found",
        )

    HostedZoneService.delete_hosted_zone(
        db=db,
        hosted_zone=hosted_zone,
    )

    return None