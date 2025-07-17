#!/usr/bin/env python3
"""
Test script for DataProcessor to debug data combination issues
"""

import sys
import traceback
from services.data_processor import DataProcessor

def test_data_processor():
    """Test the data processor step by step"""
    try:
        print("🔧 Testing DataProcessor...")
        
        # Initialize processor
        dp = DataProcessor()
        
        # Test loading data
        print("\n📊 Loading data...")
        success = dp.load_all_data()
        
        if success:
            print("✅ Data loaded successfully!")
            
            # Test getting summary stats
            print("\n📈 Getting summary stats...")
            stats = dp.get_summary_stats()
            print(f"Summary: {stats}")
            
            # Test getting dead stock
            print("\n💀 Getting dead stock...")
            dead_stock = dp.get_dead_stock()
            print(f"Dead stock count: {len(dead_stock)}")
            
            # Test getting overstocked products
            print("\n📦 Getting overstocked products...")
            overstocked = dp.get_overstocked_products()
            print(f"Overstocked count: {len(overstocked)}")
            
            # Test getting understocked products
            print("\n⚠️ Getting understocked products...")
            understocked = dp.get_understocked_products()
            print(f"Understocked count: {len(understocked)}")
            
        else:
            print("❌ Failed to load data")
            
    except Exception as e:
        print(f"❌ Error in test: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    test_data_processor() 