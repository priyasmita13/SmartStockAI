#!/bin/bash

echo "🚀 SmartStock AI Deployment Script"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "backend/app.py" ]; then
    echo "❌ Error: backend/app.py not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Project structure verified"

# Create a simple requirements.txt for deployment
echo "📦 Creating deployment requirements..."
cat > requirements.txt << EOF
Flask==2.3.3
Flask-CORS==4.0.0
pandas==2.3.0
matplotlib==3.9.0
seaborn==0.13.2
fpdf==1.7.2
numpy==1.27.0
Werkzeug==2.3.7
requests==2.31.0
gunicorn
EOF

echo "✅ Deployment requirements created"

# Create runtime.txt for Python version
echo "🐍 Setting Python version..."
echo "python-3.10.18" > runtime.txt

echo "✅ Python version set to 3.10.18"

echo ""
echo "🎉 Deployment files ready!"
echo "📋 Next steps:"
echo "   1. Commit these changes to your repository"
echo "   2. Deploy to Render or your preferred platform"
echo "   3. The backend will be available at your deployment URL"
echo ""
echo "🔧 Configuration:"
echo "   - Python: 3.10.18"
echo "   - Framework: Flask"
echo "   - Entry point: backend/app.py"
echo "   - Port: $PORT (set by platform)" 