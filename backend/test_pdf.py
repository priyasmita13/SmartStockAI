import requests
import json

def test_pdf_generation():
    try:
        response = requests.post(
            'http://localhost:5000/api/inventory/generate-pdf',
            json={},
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ PDF generation successful!")
        else:
            print("❌ PDF generation failed!")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_pdf_generation() 