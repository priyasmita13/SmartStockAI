#!/usr/bin/env python3
"""
Startup script for SmartStock AI Backend
This script sets up the environment and starts the Flask server
"""

import os
import sys
import subprocess
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def check_dependencies():
    """Check if required dependencies are installed"""
    required_packages = [
        'flask', 'pandas', 'matplotlib', 'seaborn', 
        'fpdf', 'numpy', 'requests'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Missing packages: {', '.join(missing_packages)}")
        print("Installing missing packages...")
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install'] + missing_packages)
            print("✅ Dependencies installed successfully")
        except subprocess.CalledProcessError:
            print("❌ Failed to install dependencies")
            return False
    else:
        print("✅ All dependencies are installed")
    return True

def create_directories():
    """Create necessary directories"""
    directories = ['data', 'reports']
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
    print("✅ Directories created")

def start_server():
    """Start the Flask server"""
    print("\n🚀 Starting SmartStock AI Backend...")
    print("=" * 50)
    print("📊 Inventory Health Management System")
    print("🤖 AI-Powered Chatbot")
    print("📄 PDF Report Generation")
    print("=" * 50)
    
    try:
        # Import and run the Flask app
        from app import app
        print("\n✅ Server starting on http://localhost:5000")
        print("📋 Available endpoints:")
        print("   GET  /api/health")
        print("   POST /api/inventory/upload")
        print("   GET  /api/inventory/health-analysis")
        print("   POST /api/inventory/generate-pdf")
        print("   POST /api/chatbot/query")
        print("   GET  /api/inventory/analytics")
        print("\n🔄 Server is running... Press Ctrl+C to stop")
        
        app.run(debug=True, host='0.0.0.0', port=5000)
        
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        return False
    
    return True

def main():
    """Main function"""
    print("🔧 SmartStock AI Backend Setup")
    print("=" * 40)
    
    # Check Python version
    if not check_python_version():
        return False
    
    # Check dependencies
    if not check_dependencies():
        return False
    
    # Create directories
    create_directories()
    
    # Start server
    return start_server()

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1) 