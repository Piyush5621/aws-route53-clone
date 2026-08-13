from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_dns_record_crud_flow():
    # Login & get auth token
    client.post("/api/auth/register", json={
        "name": "DNS Admin",
        "email": "dnsadmin@route53.com",
        "password": "securepassword123"
    })
    login_res = client.post("/api/auth/login", json={
        "email": "dnsadmin@route53.com",
        "password": "securepassword123"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create Hosted Zone
    zone_res = client.post("/api/hosted-zones", headers=headers, json={
        "name": "dnstest.com",
        "zone_type": "PUBLIC",
        "comment": "Zone for testing DNS records",
        "private": False
    })
    assert zone_res.status_code in [201, 409]
    if zone_res.status_code == 409:
        zones = client.get("/api/hosted-zones", headers=headers).json()
        zone_id = zones[0]["id"]
    else:
        zone_id = zone_res.json()["id"]

    print(f"Using Hosted Zone ID: {zone_id}")

    print("1. Testing Create A Record...")
    a_rec = client.post(f"/api/hosted-zones/{zone_id}/records", headers=headers, json={
        "name": "api.dnstest.com",
        "record_type": "A",
        "ttl": 300,
        "value": "192.0.2.10",
        "routing_policy": "Simple",
        "alias": False
    })
    print(f"Create A status: {a_rec.status_code}, response: {a_rec.json()}")
    assert a_rec.status_code == 201
    rec_id = a_rec.json()["id"]

    print("2. Testing Create CNAME Record...")
    cname_rec = client.post(f"/api/hosted-zones/{zone_id}/records", headers=headers, json={
        "name": "www.dnstest.com",
        "record_type": "CNAME",
        "ttl": 600,
        "value": "api.dnstest.com",
        "routing_policy": "Simple",
        "alias": False
    })
    print(f"Create CNAME status: {cname_rec.status_code}, response: {cname_rec.json()}")
    assert cname_rec.status_code == 201

    print("3. Testing Type Validation for Unsupported Record Type...")
    invalid_rec = client.post(f"/api/hosted-zones/{zone_id}/records", headers=headers, json={
        "name": "test.dnstest.com",
        "record_type": "INVALID_TYPE",
        "ttl": 300,
        "value": "1.1.1.1"
    })
    print(f"Invalid type status: {invalid_rec.status_code}, detail: {invalid_rec.json()}")
    assert invalid_rec.status_code == 400

    print("4. Testing List DNS Records for Zone...")
    records_list = client.get(f"/api/hosted-zones/{zone_id}/records", headers=headers)
    print(f"List records status: {records_list.status_code}, count: {len(records_list.json())}")
    assert records_list.status_code == 200
    assert len(records_list.json()) >= 2

    print("5. Testing Filter Records by record_type=A...")
    filtered_list = client.get(f"/api/hosted-zones/{zone_id}/records?record_type=A", headers=headers)
    print(f"Filtered status: {filtered_list.status_code}, count: {len(filtered_list.json())}")
    assert filtered_list.status_code == 200
    for r in filtered_list.json():
        assert r["record_type"] == "A"

    print("6. Testing Update DNS Record...")
    update_rec = client.put(f"/api/records/{rec_id}", headers=headers, json={
        "value": "192.0.2.99",
        "ttl": 120
    })
    print(f"Update record status: {update_rec.status_code}, updated: {update_rec.json()}")
    assert update_rec.status_code == 200
    assert update_rec.json()["value"] == "192.0.2.99"
    assert update_rec.json()["ttl"] == 120

    print("7. Testing Delete DNS Record...")
    del_rec = client.delete(f"/api/records/{rec_id}", headers=headers)
    print(f"Delete record status: {del_rec.status_code}")
    assert del_rec.status_code == 204

    # Verify deleted
    verify_del = client.get(f"/api/records/{rec_id}", headers=headers)
    assert verify_del.status_code == 404

    print("ALL DNS RECORD CRUD TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_dns_record_crud_flow()
