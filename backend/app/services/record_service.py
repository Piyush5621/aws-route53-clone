# Record Service
from typing import Optional
from sqlalchemy.orm import Session
from app.models.dns_record import DNSRecord
from app.models.hosted_zone import HostedZone
from app.schemas.dns_record import SUPPORTED_RECORD_TYPES

class RecordService:

    @staticmethod
    def create_record(
        db: Session,
        user_id: int,
        hosted_zone_id: int,
        name: str,
        record_type: str,
        ttl: int,
        value: str,
        routing_policy: Optional[str] = "Simple",
        alias: bool = False,
    ) -> DNSRecord:
        rec_type_upper = record_type.upper()
        if rec_type_upper not in SUPPORTED_RECORD_TYPES:
            raise ValueError(f"Unsupported record type: {record_type}. Supported types: {', '.join(sorted(SUPPORTED_RECORD_TYPES))}")

        # Verify hosted zone belongs to user
        zone = db.query(HostedZone).filter(
            HostedZone.id == hosted_zone_id,
            HostedZone.user_id == user_id
        ).first()

        if not zone:
            raise ValueError("Hosted zone not found or access denied")

        # Format record name
        clean_name = name.strip()
        if not clean_name.endswith('.'):
            clean_name += '.'

        record = DNSRecord(
            hosted_zone_id=hosted_zone_id,
            name=clean_name,
            record_type=rec_type_upper,
            ttl=ttl,
            value=value,
            routing_policy=routing_policy or "Simple",
            alias=alias
        )

        db.add(record)
        zone.record_count += 1
        db.commit()
        db.refresh(record)

        return record

    @staticmethod
    def get_records_by_zone(
        db: Session,
        user_id: int,
        hosted_zone_id: int,
        search: Optional[str] = None,
        record_type: Optional[str] = None,
    ):
        # Verify zone ownership
        zone = db.query(HostedZone).filter(
            HostedZone.id == hosted_zone_id,
            HostedZone.user_id == user_id
        ).first()

        if not zone:
            return None

        query = db.query(DNSRecord).filter(DNSRecord.hosted_zone_id == hosted_zone_id)

        if search:
            query = query.filter(DNSRecord.name.ilike(f"%{search}%"))

        if record_type:
            query = query.filter(DNSRecord.record_type == record_type.upper())

        return query.order_by(DNSRecord.name.asc()).all()

    @staticmethod
    def get_record(
        db: Session,
        user_id: int,
        record_id: int
    ) -> Optional[DNSRecord]:
        return (
            db.query(DNSRecord)
            .join(HostedZone)
            .filter(
                DNSRecord.id == record_id,
                HostedZone.user_id == user_id
            )
            .first()
        )

    @staticmethod
    def update_record(
        db: Session,
        record: DNSRecord,
        name: Optional[str] = None,
        record_type: Optional[str] = None,
        ttl: Optional[int] = None,
        value: Optional[str] = None,
        routing_policy: Optional[str] = None,
        alias: Optional[bool] = None,
    ) -> DNSRecord:
        if record_type:
            rec_type_upper = record_type.upper()
            if rec_type_upper not in SUPPORTED_RECORD_TYPES:
                raise ValueError(f"Unsupported record type: {record_type}")
            record.record_type = rec_type_upper

        if name is not None:
            clean_name = name.strip()
            if not clean_name.endswith('.'):
                clean_name += '.'
            record.name = clean_name

        if ttl is not None:
            record.ttl = ttl
        if value is not None:
            record.value = value
        if routing_policy is not None:
            record.routing_policy = routing_policy
        if alias is not None:
            record.alias = alias

        db.commit()
        db.refresh(record)
        return record

    @staticmethod
    def delete_record(
        db: Session,
        record: DNSRecord
    ):
        zone = db.query(HostedZone).filter(HostedZone.id == record.hosted_zone_id).first()
        if zone and zone.record_count > 0:
            zone.record_count -= 1

        db.delete(record)
        db.commit()
