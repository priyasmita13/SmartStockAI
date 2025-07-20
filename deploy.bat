@echo off
echo 🚀 SmartStock AI Deployment Script
echo ==================================

REM Check if we're in the right directory
if not exist "backend\app.py" (
    echo ❌ Error: backend\app.py not found. Please run this script from the project root.
    exit /b 1
)

echo ✅ Project structure verified

echo 📦 Creating deployment requirements...
(
echo Flask==2.3.3
echo Flask-CORS==4.0.0
echo pandas==2.3.0
echo matplotlib==3.9.0
echo seaborn==0.13.2
echo fpdf==1.7.2
echo numpy==1.27.0
echo Werkzeug==2.3.7
echo requests==2.31.0
echo gunicorn
) > requirements.txt

echo ✅ Deployment requirements created

echo 🐍 Setting Python version...
echo python-3.11.18 > runtime.txt

echo ✅ Python version set to 3.11.18

echo.
echo 🎉 Deployment files ready!
echo 📋 Next steps:
echo    1. Commit these changes to your repository
echo    2. Deploy to Render or your preferred platform
echo    3. The backend will be available at your deployment URL
echo.
echo 🔧 Configuration:
echo    - Python: 3.11.18
echo    - Framework: Flask
echo    - Entry point: backend/app.py
echo    - Port: %%PORT%% (set by platform)

pause 