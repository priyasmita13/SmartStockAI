#!/usr/bin/env python3
"""
CSV Connector Utility for SmartStock AI
Helps users connect their local CSV files to the system
"""

import pandas as pd
import shutil
from pathlib import Path
from config import Config
import sys

class CSVConnector:
    def __init__(self):
        self.config = Config
    
    def validate_csv_format(self, csv_path):
        """Validate if CSV has required columns"""
        try:
            df = pd.read_csv(csv_path)
            required_columns = ['product', 'stock', 'total_sold']
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                print(f"❌ Missing required columns: {missing_columns}")
                print(f"Required columns: {required_columns}")
                print(f"Found columns: {list(df.columns)}")
                return False
            
            print(f"✅ CSV format is valid")
            print(f"📊 Found {len(df)} products")
            print(f"📋 Columns: {list(df.columns)}")
            return True
            
        except Exception as e:
            print(f"❌ Error reading CSV: {e}")
            return False
    
    def copy_csv_to_system(self, source_path, destination_name="uploaded_inventory.csv"):
        """Copy CSV file to the system's upload directory"""
        try:
            source_path = Path(source_path)
            if not source_path.exists():
                print(f"❌ Source file not found: {source_path}")
                return False
            
            # Validate the CSV format
            if not self.validate_csv_format(source_path):
                return False
            
            # Copy to uploads directory
            dest_path = self.config.UPLOADS_DIR / destination_name
            shutil.copy2(source_path, dest_path)
            
            print(f"✅ CSV file copied successfully")
            print(f"📁 Source: {source_path}")
            print(f"📁 Destination: {dest_path}")
            return True
            
        except Exception as e:
            print(f"❌ Error copying file: {e}")
            return False
    
    def create_sample_csv(self):
        """Create a sample CSV file with proper format"""
        sample_data = {
            'product': ['Cotton Kurti', 'Silk Saree', 'Denim Jacket', 'Leather Wallet', 'Smart Watch'],
            'category': ['Women', 'Women', 'Unisex', 'Men', 'Electronics'],
            'stock': [12, 0, 45, 23, 8],
            'total_sold': [158, 241, 8, 67, 89],
            'last_sold': ['2025-07-10', '2025-06-29', '2025-05-12', '2025-07-15', '2025-07-12']
        }
        
        df = pd.DataFrame(sample_data)
        sample_path = self.config.DATA_DIR / "sample_inventory.csv"
        df.to_csv(sample_path, index=False)
        
        print(f"✅ Sample CSV created: {sample_path}")
        print("📋 Sample format:")
        print(df.head().to_string())
        return sample_path
    
    def list_available_files(self):
        """List all available inventory files"""
        print("📁 Available inventory files:")
        
        # Check uploaded CSV
        if self.config.UPLOADED_CSV_PATH.exists():
            print(f"✅ Uploaded CSV: {self.config.UPLOADED_CSV_PATH}")
        else:
            print(f"❌ No uploaded CSV found")
        
        # Check default CSV
        if self.config.DEFAULT_CSV_PATH.exists():
            print(f"✅ Default CSV: {self.config.DEFAULT_CSV_PATH}")
        else:
            print(f"❌ No default CSV found")
        
        # Check JSON file
        if self.config.DEFAULT_JSON_PATH.exists():
            print(f"✅ JSON file: {self.config.DEFAULT_JSON_PATH}")
        else:
            print(f"❌ No JSON file found")
    
    def show_csv_preview(self, file_path):
        """Show a preview of the CSV file"""
        try:
            df = pd.read_csv(file_path)
            print(f"\n📊 Preview of {file_path}:")
            print("=" * 50)
            print(df.head(10).to_string())
            print(f"\n📈 Summary:")
            print(f"Total products: {len(df)}")
            print(f"Categories: {df['category'].unique() if 'category' in df.columns else 'N/A'}")
            print(f"Total stock: {df['stock'].sum() if 'stock' in df.columns else 'N/A'}")
            print(f"Total sold: {df['total_sold'].sum() if 'total_sold' in df.columns else 'N/A'}")
            
        except Exception as e:
            print(f"❌ Error reading file: {e}")

def main():
    """Main function for CSV connector utility"""
    connector = CSVConnector()
    
    print("🔗 SmartStock AI - CSV Connector")
    print("=" * 40)
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python csv_connector.py copy <path_to_your_csv>")
        print("  python csv_connector.py preview <path_to_csv>")
        print("  python csv_connector.py list")
        print("  python csv_connector.py sample")
        return
    
    command = sys.argv[1]
    
    if command == "copy" and len(sys.argv) >= 3:
        csv_path = sys.argv[2]
        print(f"📁 Copying CSV file: {csv_path}")
        connector.copy_csv_to_system(csv_path)
        
    elif command == "preview" and len(sys.argv) >= 3:
        csv_path = sys.argv[2]
        print(f"👀 Previewing CSV file: {csv_path}")
        connector.show_csv_preview(csv_path)
        
    elif command == "list":
        connector.list_available_files()
        
    elif command == "sample":
        print("📝 Creating sample CSV file...")
        connector.create_sample_csv()
        
    else:
        print("❌ Invalid command or missing arguments")
        print("Usage:")
        print("  python csv_connector.py copy <path_to_your_csv>")
        print("  python csv_connector.py preview <path_to_csv>")
        print("  python csv_connector.py list")
        print("  python csv_connector.py sample")

if __name__ == "__main__":
    main() 