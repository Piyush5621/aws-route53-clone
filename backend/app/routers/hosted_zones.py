from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)
from sqlalchemy.orm import Session

from app.database import get_db
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


# Temporary mocked user.
# Authentication will replace this later.
MOCK_USER_ID = 1


@router.post(
    "",
    response_model=HostedZoneResponse,
    status_code=201,
)
def create_hosted_zone(
    data: HostedZoneCreate,
    db: Session = Depends(get_db),
):

    try:

        return HostedZoneService.create_hosted_zone(
            db=db,
            user_id=MOCK_USER_ID,
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
    search: Optional[str] = Query(
        default=None
    ),
    db: Session = Depends(get_db),
):

    return HostedZoneService.get_hosted_zones(
        db=db,
        user_id=MOCK_USER_ID,
        search=search,
    )


@router.get(
    "/{zone_id}",
    response_model=HostedZoneResponse,
)
def get_hosted_zone(
    zone_id: int,
    db: Session = Depends(get_db),
):

    hosted_zone = HostedZoneService.get_hosted_zone(
        db=db,
        zone_id=zone_id,
        user_id=MOCK_USER_ID,
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
    db: Session = Depends(get_db),
):

    hosted_zone = HostedZoneService.get_hosted_zone(
        db=db,
        zone_id=zone_id,
        user_id=MOCK_USER_ID,
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
    db: Session = Depends(get_db),
):

    hosted_zone = HostedZoneService.get_hosted_zone(
        db=db,
        zone_id=zone_id,
        user_id=MOCK_USER_ID,
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