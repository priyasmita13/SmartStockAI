import pandas as pd
import json
import os
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import seaborn as sns
from io import BytesIO
import base64
import numpy as np
from services.data_processor import DataProcessor

class InventoryHealthAnalyzer:
    def __init__(self):
        self.data_processor = DataProcessor()
        self.data = None
        self.df = None
        
    def load_data(self, file_path):
        """Load data from CSV or JSON file"""
        try:
            if file_path.endswith('.csv'):
                self.df = pd.read_csv(file_path)
            elif file_path.endswith('.json'):
                with open(file_path, 'r') as f:
                    data = json.load(f)
                self.df = pd.DataFrame(data['inventory'])
            else:
                raise ValueError("Unsupported file format")
                
            # Ensure required columns exist
            required_columns = ['product', 'stock', 'total_sold']
            missing_columns = [col for col in required_columns if col not in self.df.columns]
            if missing_columns:
                raise ValueError(f"Missing required columns: {missing_columns}")
                
        except Exception as e:
            raise Exception(f"Error loading data: {str(e)}")
    
    def analyze_inventory(self, file_path=None):
        """Main analysis function"""
        # Load and process all CSV files
        if not self.data_processor.load_all_data():
            raise Exception("Failed to load inventory data files")
        
        analysis = {
            'summary': self._generate_summary(),
            'most_sold': self._get_most_sold_items(),
            'least_sold': self._get_least_sold_items(),
            'dead_stock': self._get_dead_stock(),
            'overstocked': self._get_overstocked_items(),
            'understocked': self._get_understocked_items(),
            'last_week_sales': self._get_last_week_sales(),
            'category_analysis': self._analyze_by_category(),
            'health_score': self._calculate_health_score(),
            'festival_recommendations': self._get_festival_recommendations()
        }
        
        return analysis
    
    def _generate_summary(self):
        """Generate overall inventory summary"""
        return self.data_processor.get_summary_stats()
    
    def _get_most_sold_items(self, top_n=5):
        """Get most sold items"""
        return self.data_processor.get_most_sold_products(top_n)
    
    def _get_least_sold_items(self, top_n=5):
        """Get least sold items"""
        return self.data_processor.get_least_sold_products(top_n)
    
    def _get_dead_stock(self):
        """Identify dead stock (items with stock but no sales)"""
        return self.data_processor.get_dead_stock()
    
    def _get_overstocked_items(self):
        """Identify overstocked items (high stock, low sales)"""
        return self.data_processor.get_overstocked_products()
    
    def _get_understocked_items(self):
        """Identify understocked items (low stock, high sales)"""
        return self.data_processor.get_understocked_products()
    
    def _get_last_week_sales(self):
        """Get last week sales data"""
        return self.data_processor.get_last_week_sales()
    
    def _analyze_by_category(self):
        """Analyze inventory by category"""
        return self.data_processor.get_category_analysis()
    
    def _calculate_health_score(self):
        """Calculate overall inventory health score (0-100)"""
        return self.data_processor.calculate_health_score()
    
    def _get_festival_recommendations(self):
        """Get festival-based recommendations"""
        return self.data_processor.get_festival_recommendations()
    
    def generate_analytics_charts(self):
        """Generate analytics charts as base64 encoded images"""
        charts = {}
        
        # Stock vs Sales Chart
        plt.figure(figsize=(10, 6))
        plt.scatter(self.df['total_sold'], self.df['stock'], alpha=0.7)
        plt.xlabel('Total Sold')
        plt.ylabel('Current Stock')
        plt.title('Stock vs Sales Analysis')
        plt.grid(True, alpha=0.3)
        
        # Add trend line
        z = np.polyfit(self.df['total_sold'], self.df['stock'], 1)
        p = np.poly1d(z)
        plt.plot(self.df['total_sold'], p(self.df['total_sold']), "r--", alpha=0.8)
        
        # Save chart
        buffer = BytesIO()
        plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
        buffer.seek(0)
        charts['stock_vs_sales'] = base64.b64encode(buffer.getvalue()).decode()
        plt.close()
        
        # Category Analysis Chart
        category_data = self.df.groupby('category').agg({
            'stock': 'sum',
            'total_sold': 'sum'
        }).reset_index()
        
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
        
        # Stock by category
        ax1.bar(category_data['category'], category_data['stock'])
        ax1.set_title('Stock by Category')
        ax1.set_ylabel('Stock')
        ax1.tick_params(axis='x', rotation=45)
        
        # Sales by category
        ax2.bar(category_data['category'], category_data['total_sold'])
        ax2.set_title('Sales by Category')
        ax2.set_ylabel('Total Sold')
        ax2.tick_params(axis='x', rotation=45)
        
        plt.tight_layout()
        
        # Save chart
        buffer = BytesIO()
        plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
        buffer.seek(0)
        charts['category_analysis'] = base64.b64encode(buffer.getvalue()).decode()
        plt.close()
        
        return charts 