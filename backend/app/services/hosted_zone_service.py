# Hosted Zone Service
from sqlalchemy.orm import Session

from app.models.hosted_zone import HostedZone
from app.models.dns_record import DNSRecord


class HostedZoneService:

    @staticmethod
    def create_hosted_zone(
        db: Session,
        user_id: int,
        name: str,
        zone_type: str,
        comment: str | None,
        private: bool,
    ) -> HostedZone:

        zone_name = name.strip().rstrip(".")

        existing_zone = (
            db.query(HostedZone)
            .filter(
                HostedZone.user_id == user_id,
                HostedZone.name == zone_name
            )
            .first()
        )

        if existing_zone:
            raise ValueError(
                "A hosted zone with this name already exists"
            )

        hosted_zone = HostedZone(
            name=zone_name,
            zone_type=zone_type,
            comment=comment,
            private=private,
            user_id=user_id,
            record_count=0,
        )

        db.add(hosted_zone)
        db.commit()
        db.refresh(hosted_zone)

        HostedZoneService._create_default_records(
            db,
            hosted_zone
        )

        HostedZoneService._update_record_count(
            db,
            hosted_zone
        )

        db.refresh(hosted_zone)

        return hosted_zone

    @staticmethod
    def _create_default_records(
        db: Session,
        hosted_zone: HostedZone
    ):

        zone_name = hosted_zone.name + "."

        name_servers = [
            "ns-123.awsdns-01.com.",
            "ns-456.awsdns-02.net.",
            "ns-789.awsdns-03.org.",
            "ns-999.awsdns-04.co.uk.",
        ]

        for name_server in name_servers:

            record = DNSRecord(
                hosted_zone_id=hosted_zone.id,
                name=zone_name,
                record_type="NS",
                ttl=172800,
                value=name_server,
                routing_policy="Simple",
                alias=False,
            )

            db.add(record)

        soa_record = DNSRecord(
            hosted_zone_id=hosted_zone.id,
            name=zone_name,
            record_type="SOA",
            ttl=900,
            value=(
                "ns-123.awsdns-01.com. "
                "awsdns-hostmaster.amazon.com. "
                "1 7200 900 1209600 86400"
            ),
            routing_policy="Simple",
            alias=False,
        )

        db.add(soa_record)

        db.commit()

    @staticmethod
    def _update_record_count(
        db: Session,
        hosted_zone: HostedZone
    ):

        count = (
            db.query(DNSRecord)
            .filter(
                DNSRecord.hosted_zone_id == hosted_zone.id
            )
            .count()
        )

        hosted_zone.record_count = count

        db.commit()

    @staticmethod
    def get_hosted_zones(
        db: Session,
        user_id: int,
        search: str | None = None,
    ):

        query = (
            db.query(HostedZone)
            .filter(
                HostedZone.user_id == user_id
            )
        )

        if search:
            query = query.filter(
                HostedZone.name.ilike(
                    f"%{search}%"
                )
            )

        return (
            query
            .order_by(HostedZone.created_at.desc())
            .all()
        )

    @staticmethod
    def get_hosted_zone(
        db: Session,
        zone_id: int,
        user_id: int,
    ):

        return (
            db.query(HostedZone)
            .filter(
                HostedZone.id == zone_id,
                HostedZone.user_id == user_id,
            )
            .first()
        )

    @staticmethod
    def update_hosted_zone(
        db: Session,
        hosted_zone: HostedZone,
        comment: str | None,
    ):

        hosted_zone.comment = comment

        db.commit()
        db.refresh(hosted_zone)

        return hosted_zone

    @staticmethod
    def delete_hosted_zone(
        db: Session,
        hosted_zone: HostedZone,
    ):

        db.delete(hosted_zone)
        db.commit()