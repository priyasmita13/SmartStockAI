#!/usr/bin/env python3
"""
Test script for SmartStock AI Backend
Run this script to test the API endpoints
"""

import requests
import json
import os
from datetime import datetime

# Base URL for the API
BASE_URL = "http://localhost:5000/api"

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")

def test_inventory_health_analysis():
    """Test the inventory health analysis endpoint"""
    print("\n📊 Testing inventory health analysis...")
    try:
        response = requests.get(f"{BASE_URL}/inventory/health-analysis")
        if response.status_code == 200:
            print("✅ Inventory health analysis successful")
            data = response.json()
            print(f"Health Score: {data['health_score']}/100")
            print(f"Total Products: {data['summary']['total_products']}")
            print(f"Dead Stock Items: {len(data['dead_stock'])}")
            print(f"Overstocked Items: {len(data['overstocked'])}")
            print(f"Understocked Items: {len(data['understocked'])}")
        else:
            print(f"❌ Inventory health analysis failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Inventory health analysis error: {e}")

def test_chatbot_query():
    """Test the chatbot endpoint"""
    print("\n🤖 Testing chatbot...")
    
    test_queries = [
        "Show inventory health summary",
        "What are my most sold products?",
        "Which items are dead stock?",
        "Show overstocked items",
        "Generate PDF report"
    ]
    
    for query in test_queries:
        print(f"\nQuery: {query}")
        try:
            response = requests.post(
                f"{BASE_URL}/chatbot/query",
                json={"message": query},
                headers={"Content-Type": "application/json"}
            )
            if response.status_code == 200:
                print("✅ Chatbot response received")
                response_data = response.json()
                print(f"Response: {response_data['response'][:200]}...")
            else:
                print(f"❌ Chatbot query failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Chatbot error: {e}")

def test_pdf_generation():
    """Test PDF report generation"""
    print("\n📄 Testing PDF generation...")
    try:
        response = requests.post(
            f"{BASE_URL}/inventory/generate-pdf",
            json={"seller_id": "test_seller_123"},
            headers={"Content-Type": "application/json"}
        )
        if response.status_code == 200:
            print("✅ PDF generation successful")
            # Save the PDF file
            pdf_filename = f"test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            with open(pdf_filename, 'wb') as f:
                f.write(response.content)
            print(f"PDF saved as: {pdf_filename}")
        else:
            print(f"❌ PDF generation failed: {response.status_code}")
    except Exception as e:
        print(f"❌ PDF generation error: {e}")

def test_analytics():
    """Test analytics charts endpoint"""
    print("\n📈 Testing analytics...")
    try:
        response = requests.get(f"{BASE_URL}/inventory/analytics")
        if response.status_code == 200:
            print("✅ Analytics successful")
            data = response.json()
            print(f"Available charts: {list(data.keys())}")
        else:
            print(f"❌ Analytics failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Analytics error: {e}")

def test_file_upload():
    """Test file upload functionality"""
    print("\n📁 Testing file upload...")
    try:
        # Check if sample CSV exists
        csv_file = "data/sample_inventory.csv"
        if os.path.exists(csv_file):
            with open(csv_file, 'rb') as f:
                files = {'file': ('sample_inventory.csv', f, 'text/csv')}
                response = requests.post(f"{BASE_URL}/inventory/upload", files=files)
                
                if response.status_code == 200:
                    print("✅ File upload successful")
                    print(f"Response: {response.json()}")
                else:
                    print(f"❌ File upload failed: {response.status_code}")
        else:
            print("⚠️ Sample CSV file not found, skipping upload test")
    except Exception as e:
        print(f"❌ File upload error: {e}")

def test_csv_connector():
    """Test CSV connector utility"""
    print("\n🔗 Testing CSV connector...")
    try:
        # Import the CSV connector
        from utils.csv_connector import CSVConnector
        
        connector = CSVConnector()
        
        # Test listing files
        print("📁 Listing available files:")
        connector.list_available_files()
        
        # Test creating sample CSV
        print("\n📝 Creating sample CSV:")
        sample_path = connector.create_sample_csv()
        
        print("✅ CSV connector test completed")
        
    except Exception as e:
        print(f"❌ CSV connector error: {e}")

def test_festival_recommendations():
    """Test festival recommendations endpoint"""
    print("\n🎉 Testing festival recommendations...")
    try:
        response = requests.get(f"{BASE_URL}/inventory/festival-recommendations")
        if response.status_code == 200:
            print("✅ Festival recommendations successful")
            data = response.json()
            print(f"Found {len(data['recommendations'])} festival recommendations")
            for rec in data['recommendations'][:3]:  # Show first 3
                print(f"  - {rec['product']} for {rec['festival']}")
        else:
            print(f"❌ Festival recommendations failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Festival recommendations error: {e}")

def main():
    """Run all tests"""
    print("🚀 Starting SmartStock AI Backend Tests")
    print("=" * 50)
    
    # Check if server is running
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code != 200:
            print("❌ Server is not running. Please start the Flask backend first:")
            print("cd backend && python app.py")
            return
    except:
        print("❌ Cannot connect to server. Please start the Flask backend first:")
        print("cd backend && python app.py")
        return
    
    # Run tests
    test_health_check()
    test_inventory_health_analysis()
    test_chatbot_query()
    test_pdf_generation()
    test_analytics()
    test_file_upload()
    test_csv_connector()
    test_festival_recommendations()
    
    print("\n" + "=" * 50)
    print("✅ All tests completed!")

if __name__ == "__main__":
    main() 