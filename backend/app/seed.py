# Seed Script for AWS Route53 Clone Backend
import logging
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.hosted_zone import HostedZone
from app.models.dns_record import DNSRecord
from app.services.auth_service import AuthService

logger = logging.getLogger(__name__)

DEMO_ACCOUNTS = [
    {
        "name": "Route53 Admin",
        "email": "admin@route53.com",
        "password": "admin123"
    },
    {
        "name": "Demo User",
        "email": "demo@route53.com",
        "password": "demo123"
    }
]

def seed_demo_data(db: Session):
    """
    Ensures demo accounts exist with valid bcrypt password hashes and seeds rich demo hosted zones & DNS records.
    """
    try:
        users = {}
        for acc in DEMO_ACCOUNTS:
            email = acc["email"]
            name = acc["name"]
            pwd = acc["password"]

            user = db.query(User).filter(User.email == email).first()
            valid_hash = AuthService.hash_password(pwd)

            if not user:
                user = User(
                    name=name,
                    email=email,
                    password_hash=valid_hash
                )
                db.add(user)
                db.commit()
                db.refresh(user)
                logger.info(f"Seeded new user: {email}")
            else:
                # Update password hash to guarantee valid bcrypt salt
                user.password_hash = valid_hash
                user.name = name
                db.commit()
                db.refresh(user)
                logger.info(f"Updated password hash for user: {email}")

            users[email] = user

        # Also fix any existing users (like dnsadmin@route53.com) with corrupted hashes
        existing_users = db.query(User).all()
        for u in existing_users:
            if u.email not in users:
                u.password_hash = AuthService.hash_password("password123")
                db.commit()

        admin_user = users["admin@route53.com"]
        demo_user = users["demo@route53.com"]

        # Seed hosted zones for Admin User
        _seed_zones_and_records(db, admin_user.id)
        _seed_zones_and_records(db, demo_user.id)

    except Exception as e:
        logger.error(f"Error seeding demo data: {e}")
        db.rollback()


def _seed_zones_and_records(db: Session, user_id: int):
    # Check if user already has hosted zones
    existing_count = db.query(HostedZone).filter(HostedZone.user_id == user_id).count()
    if existing_count > 0:
        # Update record_count property for accuracy
        zones = db.query(HostedZone).filter(HostedZone.user_id == user_id).all()
        for z in zones:
            rec_count = db.query(DNSRecord).filter(DNSRecord.hosted_zone_id == z.id).count()
            z.record_count = rec_count
        db.commit()
        return

    # Create Zone 1: example-corp.com (Public)
    z1 = HostedZone(
        name="example-corp.com",
        zone_type="PUBLIC",
        comment="Main Production Public Hosted Zone for Example Corp",
        private=False,
        user_id=user_id,
        record_count=7
    )
    db.add(z1)
    db.commit()
    db.refresh(z1)

    r1_list = [
        DNSRecord(hosted_zone_id=z1.id, name="example-corp.com.", record_type="NS", ttl=172800, value="ns-123.awsdns-01.com.\nns-456.awsdns-02.net.\nns-789.awsdns-03.org.\nns-999.awsdns-04.co.uk.", routing_policy="Simple"),
        DNSRecord(hosted_zone_id=z1.id, name="example-corp.com.", record_type="SOA", ttl=900, value="ns-123.awsdns-01.com. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400", routing_policy="Simple"),
        DNSRecord(hosted_zone_id=z1.id, name="example-corp.com.", record_type="A", ttl=300, value="192.0.2.1", routing_policy="Simple"),
        DNSRecord(hosted_zone_id=z1.id, name="api.example-corp.com.", record_type="A", ttl=60, value="198.51.100.42", routing_policy="Simple"),
        DNSRecord(hosted_zone_id=z1.id, name="www.example-corp.com.", record_type="CNAME", ttl=300, value="lb.example-corp.com", routing_policy="Simple"),
        DNSRecord(hosted_zone_id=z1.id, name="example-corp.com.", record_type="MX", ttl=300, value="10 mail.example-corp.com", routing_policy="Simple"),
        DNSRecord(hosted_zone_id=z1.id, name="example-corp.com.", record_type="TXT", ttl=300, value="\"v=spf1 include:_spf.google.com ~all\"", routing_policy="Simple"),
    ]
    for r in r1_list:
        db.add(r)
    db.commit()
    z1.record_count = len(r1_list)

    # Create Zone 2: internal.aws.local (Private)
    z2 = HostedZone(
        name="internal.aws.local",
        zone_type="PRIVATE",
        comment="Internal VPC Private Hosted Zone for Microservices",
        private=True,
        user_id=user_id,
        record_count=5
    )
    db.add(z2)
    db.commit()
    db.refresh(z2)

    r2_list = [
        DNSRecord(hosted_zone_id=z2.id, name="internal.aws.local.", record_type="NS", ttl=172800, value="ns-123.awsdns-01.com.", routing_policy="Simple"),
        DNSRecord(hosted_zone_id=z2.id, name="internal.aws.local.", record_type="SOA", ttl=900, value="ns-123.awsdns-01.com. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400", routing_policy="Simple"),
        DNSRecord(hosted_zone_id=z2.id, name="db.internal.aws.local.", record_type="A", ttl=60, value="10.0.1.50", routing_policy="Simple"),
        DNSRecord(hosted_zone_id=z2.id, name="redis.internal.aws.local.", record_type="A", ttl=60, value="10.0.1.51", routing_policy="Simple"),
        DNSRecord(hosted_zone_id=z2.id, name="auth.internal.aws.local.", record_type="CNAME", ttl=300, value="idp.internal.aws.local", routing_policy="Simple"),
    ]
    for r in r2_list:
        db.add(r)
    db.commit()
    z2.record_count = len(r2_list)
    db.commit()
