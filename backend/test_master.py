# Master Test Suite for AWS Route53 Clone Backend
import sys
from test_auth import test_auth_flow
from test_hosted_zones import test_hosted_zone_crud_flow
from test_records import test_dns_record_crud_flow

def run_master_test_suite():
    print("=" * 60)
    print("RUNNING MASTER TEST SUITE — AWS ROUTE 53 CLONE")
    print("=" * 60)

    try:
        print("\n--- TEST PHASE 1: AUTHENTICATION ---")
        test_auth_flow()

        print("\n--- TEST PHASE 2: HOSTED ZONES CRUD ---")
        test_hosted_zone_crud_flow()

        print("\n--- TEST PHASE 3: DNS RECORDS CRUD & TYPE VALIDATION ---")
        test_dns_record_crud_flow()

        print("\n" + "=" * 60)
        print("ALL AUDIT TESTS PASSED SUCCESSFULLY! 100% VERIFIED!")
        print("=" * 60)
    except Exception as e:
        print(f"\n[ERROR] MASTER TEST FAILED: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_master_test_suite()
