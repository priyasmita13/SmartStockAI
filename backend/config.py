import os
from pathlib import Path

class Config:
    """Configuration settings for SmartStock AI Backend"""
    
    # Base directory
    BASE_DIR = Path(__file__).parent
    
    # Data directories
    DATA_DIR = BASE_DIR / "data"
    REPORTS_DIR = BASE_DIR / "reports"
    UPLOADS_DIR = BASE_DIR / "uploads"
    
    # CSV file settings
    DEFAULT_CSV_PATH = DATA_DIR / "sample_inventory.csv"
    UPLOADED_CSV_PATH = UPLOADS_DIR / "uploaded_inventory.csv"
    
    # JSON file settings
    DEFAULT_JSON_PATH = DATA_DIR / "inventory_data.json"
    
    # PDF settings
    PDF_TEMPLATE_DIR = BASE_DIR / "templates"
    
    # API settings
    API_HOST = "0.0.0.0"
    API_PORT = 5000
    DEBUG = True
    
    # File upload settings
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'csv', 'json'}
    
    @classmethod
    def create_directories(cls):
        """Create necessary directories if they don't exist"""
        directories = [
            cls.DATA_DIR,
            cls.REPORTS_DIR,
            cls.UPLOADS_DIR,
            cls.PDF_TEMPLATE_DIR
        ]
        
        for directory in directories:
            directory.mkdir(exist_ok=True)
    
    @classmethod
    def get_csv_path(cls, file_type="default"):
        """Get the appropriate CSV file path"""
        if file_type == "uploaded" and cls.UPLOADED_CSV_PATH.exists():
            return cls.UPLOADED_CSV_PATH
        elif cls.DEFAULT_CSV_PATH.exists():
            return cls.DEFAULT_CSV_PATH
        else:
            return None
    
    @classmethod
    def get_json_path(cls):
        """Get the JSON file path"""
        if cls.DEFAULT_JSON_PATH.exists():
            return cls.DEFAULT_JSON_PATH
        else:
            return None
    
    @classmethod
    def allowed_file(cls, filename):
        """Check if file extension is allowed"""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in cls.ALLOWED_EXTENSIONS 