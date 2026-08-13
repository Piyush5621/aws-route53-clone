from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_auth_flow():
    print("Testing Registration...")
    reg_res = client.post("/api/auth/register", json={
        "name": "Route53 Admin",
        "email": "admin@route53.com",
        "password": "securepassword123"
    })
    print(f"Register status: {reg_res.status_code}, response: {reg_res.json()}")
    assert reg_res.status_code in [201, 409] # 201 created or 409 if already exists

    print("Testing Login...")
    login_res = client.post("/api/auth/login", json={
        "email": "admin@route53.com",
        "password": "securepassword123"
    })
    print(f"Login status: {login_res.status_code}, response: {login_res.json()}")
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    assert token is not None

    print("Testing Protected /api/auth/me Endpoint...")
    me_res = client.get("/api/auth/me", headers={
        "Authorization": f"Bearer {token}"
    })
    print(f"Me status: {me_res.status_code}, response: {me_res.json()}")
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "admin@route53.com"

    print("ALL AUTHENTICATION TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_auth_flow()
