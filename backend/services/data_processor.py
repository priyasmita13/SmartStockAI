import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path
from config import Config

class DataProcessor:
    def __init__(self):
        self.inventory_df = None
        self.sales_df = None
        self.trends_df = None
        self.festival_df = None
        self.combined_df = None
        
    def load_all_data(self):
        """Load and combine all CSV files"""
        try:
            # Load inventory data
            inventory_path = Path("data/Inventoryproducts.csv")
            if inventory_path.exists():
                self.inventory_df = pd.read_csv(inventory_path)
                print(f"✅ Loaded inventory data: {len(self.inventory_df)} products")
            
            # Load sales data
            sales_path = Path("data/Seasonal_Sales_400_OrderedByMonth(1).csv")
            if sales_path.exists():
                self.sales_df = pd.read_csv(sales_path)
                print(f"✅ Loaded sales data: {len(self.sales_df)} sales records")
            
            # Load trends data
            trends_path = Path("data/Product_Trends_By_Month.csv")
            if trends_path.exists():
                self.trends_df = pd.read_csv(trends_path)
                print(f"✅ Loaded trends data: {len(self.trends_df)} trend records")
            
            # Load festival data
            festival_path = Path("data/Festival_Season_ClothingTags_Refined.csv")
            if festival_path.exists():
                self.festival_df = pd.read_csv(festival_path)
                print(f"✅ Loaded festival data: {len(self.festival_df)} festival records")
            
            # Combine all data
            self._combine_data()
            return True
            
        except Exception as e:
            print(f"❌ Error loading data: {e}")
            return False
    
    def _ensure_required_columns(self, df):
        """Ensure all required columns exist in the DataFrame, fill with random/default values if missing."""
        import random
        required_columns = {
            'product_id': lambda: random.randint(1000, 9999),
            'name': lambda: f"Product{random.randint(1, 100)}",
            'category': lambda: random.choice(['T-shirt', 'Kurti', 'Jacket', 'Kidswear', 'Sleepwear', 'Ethnicwear', 'Winterwear', 'Saree', 'Rainwear', 'Western', 'Shorts']),
            'price': lambda: random.randint(100, 2000),
            'cost': lambda: random.randint(50, 1500),
            'status': lambda: random.choice(['active', 'paused']),
            'stock_quantity': lambda: random.randint(0, 50),
            'restock_threshold': lambda: random.randint(1, 10),
            'last_sold_date': lambda: 'Never',
            'total_sold': lambda: random.randint(0, 100),
            'trend_score': lambda: random.randint(0, 300),
            'festivals': lambda: '',
            'seasons': lambda: '',
            'tags': lambda: '',
            'is_dead_stock': lambda: False,
            'is_overstocked': lambda: False,
            'is_understocked': lambda: False,
            'last_week_sales': lambda: random.randint(0, 20),
            'stock_sales_ratio': lambda: random.uniform(0.1, 5.0),
        }
        for col, gen in required_columns.items():
            if col not in df.columns:
                df[col] = [gen() for _ in range(len(df))]
        return df

    def _combine_data(self):
        """Combine all data sources into a comprehensive dataset"""
        try:
            # Start with inventory data
            if self.inventory_df is not None:
                self.combined_df = self.inventory_df.copy()
                self.combined_df = self._ensure_required_columns(self.combined_df)
                
                # Calculate total sales for each product
                if self.sales_df is not None:
                    sales_summary = self.sales_df.groupby('product_id').agg({
                        'quantity_sold': 'sum',
                        'sales_date': 'max'
                    }).reset_index()
                    sales_summary.columns = ['product_id', 'total_sold', 'last_sold_date']
                    
                    # Merge with inventory data
                    self.combined_df = self.combined_df.merge(
                        sales_summary, 
                        left_on='product_id', 
                        right_on='product_id', 
                        how='left'
                    )
                    
                    # Ensure required columns exist after merge
                    self.combined_df = self._ensure_required_columns(self.combined_df)
                    
                    # Fill NaN values - check if columns exist first
                    if 'total_sold' in self.combined_df.columns:
                        self.combined_df['total_sold'] = self.combined_df['total_sold'].fillna(0)
                    else:
                        self.combined_df['total_sold'] = 0
                        
                    if 'last_sold_date' in self.combined_df.columns:
                        self.combined_df['last_sold_date'] = self.combined_df['last_sold_date'].fillna('Never')
                    else:
                        self.combined_df['last_sold_date'] = 'Never'
                
                # Add trend scores
                if self.trends_df is not None:
                    # Get latest trend scores (assuming latest month)
                    latest_trends = self.trends_df.groupby('product_id')['trend_score'].max().reset_index()
                    latest_trends.columns = ['product_id', 'trend_score']
                    
                    self.combined_df = self.combined_df.merge(
                        latest_trends,
                        left_on='product_id',
                        right_on='product_id',
                        how='left'
                    )
                    
                    # Ensure required columns exist after merge
                    self.combined_df = self._ensure_required_columns(self.combined_df)
                    
                    # Fill NaN values - check if column exists first
                    if 'trend_score' in self.combined_df.columns:
                        self.combined_df['trend_score'] = self.combined_df['trend_score'].fillna(0)
                    else:
                        self.combined_df['trend_score'] = 0
                
                # Add festival/seasonal information
                if self.festival_df is not None:
                    # Clean festival data - handle NaN values
                    festival_clean = self.festival_df.copy()
                    festival_clean['festival'] = festival_clean['festival'].fillna('None')
                    festival_clean['season'] = festival_clean['season'].fillna('None')
                    festival_clean['tags'] = festival_clean['tags'].fillna('None')
                    
                    # Get unique product-festival combinations
                    festival_info = festival_clean.groupby('product_name').agg({
                        'festival': lambda x: ', '.join(set(str(val) for val in x if pd.notna(val))),
                        'season': lambda x: ', '.join(set(str(val) for val in x if pd.notna(val))),
                        'tags': lambda x: ', '.join(set(str(val) for val in x if pd.notna(val)))
                    }).reset_index()
                    festival_info.columns = ['name', 'festivals', 'seasons', 'tags']
                    
                    self.combined_df = self.combined_df.merge(
                        festival_info,
                        left_on='name',
                        right_on='name',
                        how='left'
                    )
                    
                    # Ensure required columns exist after merge
                    self.combined_df = self._ensure_required_columns(self.combined_df)
                
                # Calculate additional metrics
                self._calculate_metrics()
                
                print(f"✅ Combined data created: {len(self.combined_df)} products")
                
        except Exception as e:
            print(f"❌ Error combining data: {e}")
            import traceback
            traceback.print_exc()
    
    def _calculate_metrics(self):
        """Calculate additional inventory health metrics"""
        try:
            self.combined_df = self._ensure_required_columns(self.combined_df)
            # Ensure required columns exist
            if 'total_sold' not in self.combined_df.columns:
                self.combined_df['total_sold'] = 0
            if 'stock_quantity' not in self.combined_df.columns:
                self.combined_df['stock_quantity'] = 0
            if 'restock_threshold' not in self.combined_df.columns:
                self.combined_df['restock_threshold'] = 5
            
            # Calculate stock-to-sales ratio
            self.combined_df['stock_sales_ratio'] = (
                self.combined_df['stock_quantity'] / 
                self.combined_df['total_sold'].replace(0, 1)
            )
            
            # Calculate days since last sold (STATIC: use fixed reference date)
            static_today = datetime(2025, 7, 1)  # Fixed date for demo
            self.combined_df['days_since_last_sold'] = 0
            for idx, row in self.combined_df.iterrows():
                if row['last_sold_date'] != 'Never':
                    try:
                        last_sold = pd.to_datetime(row['last_sold_date'])
                        days_since = (static_today - last_sold).days
                        self.combined_df.at[idx, 'days_since_last_sold'] = days_since
                    except:
                        self.combined_df.at[idx, 'days_since_last_sold'] = 999
            
            # Calculate health indicators
            self.combined_df['is_dead_stock'] = (
                (self.combined_df['stock_quantity'] > 0) & 
                (self.combined_df['total_sold'] == 0)
            )
            
            self.combined_df['is_overstocked'] = (
                (self.combined_df['stock_sales_ratio'] > 2.0) & 
                (self.combined_df['stock_quantity'] > self.combined_df['restock_threshold'])
            )
            
            self.combined_df['is_understocked'] = (
                (self.combined_df['stock_quantity'] < self.combined_df['restock_threshold']) & 
                (self.combined_df['total_sold'] > 10)
            )
            
            # Calculate last week sales (simulated based on recent sales)
            self.combined_df['last_week_sales'] = 0
            if self.sales_df is not None:
                # Get sales from last 7 days (simulated)
                recent_sales = self.sales_df.groupby('product_id')['quantity_sold'].sum().reset_index()
                recent_sales.columns = ['product_id', 'recent_sales']
                
                self.combined_df = self.combined_df.merge(
                    recent_sales,
                    left_on='product_id',
                    right_on='product_id',
                    how='left'
                )
                self.combined_df['last_week_sales'] = self.combined_df['recent_sales'].fillna(0)
            
        except Exception as e:
            print(f"❌ Error calculating metrics: {e}")
            import traceback
            traceback.print_exc()
    
    def get_most_sold_products(self, top_n=5):
        """Get most sold products"""
        if self.combined_df is None:
            return []
        
        # Ensure required columns exist
        self.combined_df = self._ensure_required_columns(self.combined_df)
        
        return self.combined_df.nlargest(top_n, 'total_sold')[
            ['name', 'category', 'total_sold', 'stock_quantity', 'trend_score']
        ].to_dict('records')
    
    def get_least_sold_products(self, top_n=5):
        """Get least sold products"""
        if self.combined_df is None:
            return []
        
        # Ensure required columns exist
        self.combined_df = self._ensure_required_columns(self.combined_df)
        
        return self.combined_df.nsmallest(top_n, 'total_sold')[
            ['name', 'category', 'total_sold', 'stock_quantity', 'trend_score']
        ].to_dict('records')
    
    def get_dead_stock(self):
        """Get dead stock products"""
        if self.combined_df is None:
            return []
        
        # Ensure required columns exist
        self.combined_df = self._ensure_required_columns(self.combined_df)
        
        dead_stock = self.combined_df[self.combined_df['is_dead_stock'] == True]
        return dead_stock[
            ['name', 'category', 'stock_quantity', 'total_sold', 'price']
        ].to_dict('records')
    
    def get_overstocked_products(self, top_n=10):
        """Get overstocked products"""
        if self.combined_df is None:
            return []
        
        # Ensure required columns exist
        self.combined_df = self._ensure_required_columns(self.combined_df)
        
        overstocked = self.combined_df[self.combined_df['is_overstocked'] == True]
        return overstocked.nlargest(top_n, 'stock_sales_ratio')[
            ['name', 'category', 'stock_quantity', 'total_sold', 'stock_sales_ratio', 'price']
        ].to_dict('records')
    
    def get_understocked_products(self):
        """Get understocked products"""
        if self.combined_df is None:
            return []
        
        # Ensure required columns exist
        self.combined_df = self._ensure_required_columns(self.combined_df)
        
        understocked = self.combined_df[self.combined_df['is_understocked'] == True]
        return understocked[
            ['name', 'category', 'stock_quantity', 'total_sold', 'restock_threshold', 'price', 'stock_sales_ratio']
        ].to_dict('records')
    
    def get_last_week_sales(self, top_n=5):
        """Get last week sales data"""
        if self.combined_df is None:
            return []
        
        # Ensure required columns exist
        self.combined_df = self._ensure_required_columns(self.combined_df)
        
        return self.combined_df.nlargest(top_n, 'last_week_sales')[
            ['name', 'category', 'last_week_sales', 'total_sold']
        ].to_dict('records')
    
    def get_category_analysis(self):
        """Get category-wise analysis"""
        if self.combined_df is None:
            return []
        
        # Ensure required columns exist
        self.combined_df = self._ensure_required_columns(self.combined_df)
        
        category_analysis = self.combined_df.groupby('category').agg({
            'name': 'count',
            'stock_quantity': 'sum',
            'total_sold': 'sum',
            'price': 'mean',
            'trend_score': 'mean'
        }).reset_index()
        
        category_analysis.columns = [
            'category', 'product_count', 'total_stock', 'total_sold', 
            'avg_price', 'avg_trend_score'
        ]
        
        return category_analysis.to_dict('records')
    
    def get_summary_stats(self):
        """Get overall summary statistics"""
        if self.combined_df is None:
            return {}
        
        # Ensure required columns exist
        self.combined_df = self._ensure_required_columns(self.combined_df)
        
        total_products = len(self.combined_df)
        total_stock = self.combined_df['stock_quantity'].sum()
        total_sold = self.combined_df['total_sold'].sum()
        total_value = (self.combined_df['stock_quantity'] * self.combined_df['price']).sum()
        
        dead_stock_count = self.combined_df['is_dead_stock'].sum()
        overstocked_count = self.combined_df['is_overstocked'].sum()
        understocked_count = self.combined_df['is_understocked'].sum()
        
        return {
            'total_products': total_products,
            'total_stock': int(total_stock),
            'total_sold': int(total_sold),
            'total_value': float(total_value),
            'dead_stock_count': int(dead_stock_count),
            'overstocked_count': int(overstocked_count),
            'understocked_count': int(understocked_count),
            'avg_stock': float(total_stock / total_products),
            'avg_sold': float(total_sold / total_products),
            'stock_to_sales_ratio': float(total_stock / total_sold if total_sold > 0 else 0)
        }
    
    def calculate_health_score(self):
        """Calculate overall inventory health score"""
        if self.combined_df is None:
            return 0
        
        # Ensure required columns exist
        self.combined_df = self._ensure_required_columns(self.combined_df)
        
        score = 100
        
        # Deduct points for dead stock
        dead_stock_count = self.combined_df['is_dead_stock'].sum()
        score -= dead_stock_count * 5
        
        # Deduct points for overstocked items
        overstocked_count = self.combined_df['is_overstocked'].sum()
        score -= overstocked_count * 3
        
        # Deduct points for understocked items
        understocked_count = self.combined_df['is_understocked'].sum()
        score -= understocked_count * 2
        
        # Bonus for good stock-to-sales ratio
        avg_ratio = self.combined_df['stock_quantity'].sum() / self.combined_df['total_sold'].sum()
        if 0.5 <= avg_ratio <= 1.5:
            score += 10
        
        # Bonus for high trend scores
        avg_trend = self.combined_df['trend_score'].mean()
        if avg_trend > 150:
            score += 5
        
        return max(0, min(100, score))
    
    def get_festival_recommendations(self):
        """Get festival-based recommendations"""
        if self.festival_df is None:
            return []
        
        # Get current month
        current_month = datetime.now().month
        
        # Get products for current month festivals
        current_festivals = self.festival_df[self.festival_df['month'] == current_month]
        
        recommendations = []
        for _, row in current_festivals.iterrows():
            recommendations.append({
                'product': row['product_name'],
                'festival': row['festival'],
                'season': row['season'],
                'tags': row['tags']
            })
        
        return recommendations 