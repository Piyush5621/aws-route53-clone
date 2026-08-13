from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_hosted_zone_crud_flow():
    # 1. Login to get authentication token
    login_res = client.post("/api/auth/login", json={
        "email": "admin@route53.com",
        "password": "securepassword123"
    })
    if login_res.status_code != 200:
        # Register if not exists
        client.post("/api/auth/register", json={
            "name": "Route53 Admin",
            "email": "admin@route53.com",
            "password": "securepassword123"
        })
        login_res = client.post("/api/auth/login", json={
            "email": "admin@route53.com",
            "password": "securepassword123"
        })

    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    print("1. Testing Create Hosted Zone...")
    create_res = client.post("/api/hosted-zones", headers=headers, json={
        "name": "example.com",
        "zone_type": "PUBLIC",
        "comment": "Primary domain for web application",
        "private": False
    })
    print(f"Create status: {create_res.status_code}, response: {create_res.json()}")
    assert create_res.status_code in [201, 409]

    if create_res.status_code == 409:
        # Get existing list
        list_res = client.get("/api/hosted-zones", headers=headers)
        zone_id = list_res.json()[0]["id"]
    else:
        zone_id = create_res.json()["id"]
        assert create_res.json()["record_count"] == 5 # 4 NS + 1 SOA auto-created

    print("2. Testing List Hosted Zones...")
    list_res = client.get("/api/hosted-zones", headers=headers)
    print(f"List status: {list_res.status_code}, count: {len(list_res.json())}")
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

    print("3. Testing Get Hosted Zone Details...")
    get_res = client.get(f"/api/hosted-zones/{zone_id}", headers=headers)
    print(f"Get details status: {get_res.status_code}, zone: {get_res.json()}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == zone_id

    print("4. Testing Update Hosted Zone Comment...")
    update_res = client.put(f"/api/hosted-zones/{zone_id}", headers=headers, json={
        "comment": "Updated production hosted zone comment"
    })
    print(f"Update status: {update_res.status_code}, updated: {update_res.json()}")
    assert update_res.status_code == 200
    assert update_res.json()["comment"] == "Updated production hosted zone comment"

    print("5. Testing Delete Hosted Zone...")
    del_res = client.delete(f"/api/hosted-zones/{zone_id}", headers=headers)
    print(f"Delete status: {del_res.status_code}")
    assert del_res.status_code == 204

    # Verify deleted
    verify_get = client.get(f"/api/hosted-zones/{zone_id}", headers=headers)
    assert verify_get.status_code == 404

    print("ALL HOSTED ZONE CRUD TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_hosted_zone_crud_flow()
