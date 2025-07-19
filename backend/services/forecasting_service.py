import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path
import json
from typing import Dict, List, Tuple, Optional
import sys
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
import os

class ForecastingService:
    def __init__(self):
        self.inventory_df = None
        self.sales_df = None
        self.trends_df = None
        self.festival_df = None
        self.current_month = datetime.now().month
        self.current_year = datetime.now().year
        
    def load_data(self):
        """Load all required data files"""
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
                print(f"✅ Loaded sales data: {len(self.sales_df)} sales records (raw)")
                print(self.sales_df.head(20))
                print(self.sales_df.tail(20))
                # Use correct date parser for MM/DD/YYYY
                self.sales_df['sales_date'] = pd.to_datetime(self.sales_df['sales_date'], format='%m/%d/%Y', errors='coerce')
                print(f"✅ Parsed sales_date (MM/DD/YYYY). Rows with NaT in sales_date:")
                print(self.sales_df[self.sales_df['sales_date'].isna()])
                print(f"✅ Loaded sales data: {len(self.sales_df)} sales records (after date parse)")
            
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
                print(f"Festival DataFrame columns: {self.festival_df.columns.tolist()}")
            
            return True
        except Exception as e:
            print(f"❌ Error loading data: {e}")
            return False
    
    def analyze_historical_demand(self, months_back: int = 6) -> List[Dict]:
        """Analyze historical demand patterns using all available sales data (ignore date)"""
        if self.sales_df is None:
            return []
        print(f"[DEMAND DEBUG] self.sales_df rows: {len(self.sales_df)}")
        print(f"[DEMAND DEBUG] self.sales_df sales_date head: {self.sales_df['sales_date'].head(5)}")
        sys.stdout.flush()
        # Use all sales data, not just recent months
        all_sales = self.sales_df
        print(f"[DEMAND DEBUG] all_sales rows: {len(all_sales)}")
        print(f"[DEMAND DEBUG] all_sales product_ids: {all_sales['product_id'].unique()}")
        print(f"[DEMAND DEBUG] all_sales sales_date head: {all_sales['sales_date'].head(5)}")
        sys.stdout.flush()
        # Calculate total and average monthly demand for each product
        demand = []
        for product_id in all_sales['product_id'].unique():
            product_sales = all_sales[all_sales['product_id'] == product_id]
            total_sold = product_sales['quantity_sold'].sum()
            # Group by sales_month to get monthly sales
            monthly_sales = product_sales.groupby('sales_month')['quantity_sold'].sum()
            months = max(1, len(monthly_sales))
            avg_monthly = total_sold / months
            demand_std = float(monthly_sales.std()) if months > 1 else 0.0
            max_demand = int(monthly_sales.max()) if months > 0 else 0
            min_demand = int(monthly_sales.min()) if months > 0 else 0
            demand.append({
                'product_id': product_id,
                'total_sold': int(total_sold),
                'avg_demand': float(avg_monthly),
                'demand_std': demand_std,
                'max_demand': max_demand,
                'min_demand': min_demand
            })
        return demand

    def analyze_historical_demand_12m(self) -> Dict:
        """Analyze historical demand patterns for 12 months"""
        if self.sales_df is None:
            return {}
        end_date = datetime.now()
        start_date = end_date - timedelta(days=12 * 30)
        recent_sales = self.sales_df[
            (self.sales_df['sales_date'] >= start_date) &
            (self.sales_df['sales_date'] <= end_date)
        ]
        monthly_demand = recent_sales.groupby(['product_id', 'sales_month']).agg({
            'quantity_sold': 'sum'
        }).reset_index()
        avg_monthly_demand = monthly_demand.groupby('product_id').agg({
            'quantity_sold': ['mean', 'std', 'max', 'min']
        }).reset_index()
        avg_monthly_demand.columns = ['product_id', 'avg_demand_12m', 'demand_std_12m', 'max_demand_12m', 'min_demand_12m']
        return avg_monthly_demand.to_dict('records')
    
    def analyze_festival_seasonal_patterns(self) -> Dict:
        """Analyze festival and seasonal demand patterns"""
        if self.festival_df is None or self.sales_df is None:
            return {}
        
        # Create festival-season mapping
        festival_season_map = {}
        for _, row in self.festival_df.iterrows():
            month = row['month']
            festival = row['festival'] if pd.notna(row['festival']) else 'None'
            season = row['season'] if pd.notna(row['season']) else 'None'
            product_name = row['product_name']
            
            if month not in festival_season_map:
                festival_season_map[month] = {
                    'festivals': set(),
                    'seasons': set(),
                    'products': set()
                }
            
            festival_season_map[month]['festivals'].add(festival)
            festival_season_map[month]['seasons'].add(season)
            festival_season_map[month]['products'].add(product_name)
        
        # Analyze sales during festival months
        festival_sales_analysis = {}
        for month, data in festival_season_map.items():
            if month in self.sales_df['sales_month'].values:
                month_sales = self.sales_df[self.sales_df['sales_month'] == month]
                
                # Calculate demand boost for festival months
                total_monthly_sales = month_sales['quantity_sold'].sum()
                avg_monthly_sales = self.sales_df['quantity_sold'].mean()
                
                demand_boost = (total_monthly_sales / avg_monthly_sales) if avg_monthly_sales > 0 else 1
                
                festival_sales_analysis[month] = {
                    'festivals': list(data['festivals']),
                    'seasons': list(data['seasons']),
                    'products': list(data['products']),
                    'total_sales': total_monthly_sales,
                    'demand_boost': demand_boost,
                    'avg_demand_boost': demand_boost
                }
        
        return festival_sales_analysis
    
    def forecast_upcoming_demand(self, forecast_months: int = 2, test_month: int = None) -> Dict:
        """Forecast demand for upcoming months based on last 1 year sales and festivals. If test_month is set, use it as the starting month."""
        if self.sales_df is None or self.festival_df is None:
            return {}
        # Prepare recent sales for last 12 months
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)
        recent_sales = self.sales_df[
            (self.sales_df['sales_date'] >= start_date) &
            (self.sales_df['sales_date'] <= end_date)
        ].copy()
        recent_sales['sales_month'] = recent_sales['sales_date'].dt.month
        # Festival/season mapping
        festival_map = {}
        for _, row in self.festival_df.iterrows():
            month = row['month']
            festival = row['festival'] if pd.notna(row['festival']) else None
            season = row['season'] if pd.notna(row['season']) else None
            product_name = row['product_name'] if 'product_name' in row else row['name']
            if month not in festival_map:
                festival_map[month] = {}
            if product_name not in festival_map[month]:
                festival_map[month][product_name] = {'festivals': set(), 'seasons': set()}
            if festival:
                festival_map[month][product_name]['festivals'].add(festival)
            if season:
                festival_map[month][product_name]['seasons'].add(season)
        # Fallback average
        product_monthly_avg = recent_sales.groupby('product_id')['quantity_sold'].mean().reset_index().set_index('product_id')['quantity_sold']
        forecast = {}
        now = datetime.now()
        for i in range(forecast_months):
            forecast_month = (now.month + i) if not test_month else (test_month + i)
            if forecast_month > 12:
                forecast_month -= 12
            month_forecast = {}
            for product_id in self.inventory_df['product_id']:
                filtered = recent_sales[(recent_sales['product_id'] == product_id) & (recent_sales['sales_month'] == forecast_month)]
                avg_sales = filtered['quantity_sold'].mean() if not filtered.empty else product_monthly_avg.get(product_id, 0)
                product_name = self.inventory_df[self.inventory_df['product_id'] == product_id]['name'].values[0]
                # Apply festival/season boost for both forecasted months
                if forecast_month in festival_map and product_name in festival_map[forecast_month]:
                    fest = festival_map[forecast_month][product_name]['festivals']
                    seas = festival_map[forecast_month][product_name]['seasons']
                    events = list(fest | seas)
                    if events:
                        avg_sales = avg_sales * 1.2  # 20% boost
                        reason = ', '.join(events)
                    else:
                        reason = ''
                else:
                    reason = ''
                month_forecast[product_id] = {'forecasted_demand': int(round(avg_sales)), 'reason': reason}
            forecast[forecast_month] = month_forecast
        return forecast
    
    def generate_restock_plan(self, test_month: int = None) -> Dict:
        try:
            if self.inventory_df is None:
                return {}
            demand_forecast = self.forecast_upcoming_demand(test_month=test_month)
            current_inventory = self.inventory_df.set_index('product_id').to_dict('index')
            restock_plan = {'monthly_plans': {}}
            for month, forecast_data in demand_forecast.items():
                month_plan = {'month': month, 'product_recommendations': []}
                for product_id, forecast_info in forecast_data.items():
                    if product_id in current_inventory:
                        current_stock = current_inventory[product_id]['stock_quantity']
                        restock_threshold = current_inventory[product_id]['restock_threshold']
                        product_cost = current_inventory[product_id]['cost']
                        forecasted_demand = forecast_info['forecasted_demand']
                        reason = forecast_info['reason']
                        demand_gap = forecasted_demand - current_stock
                        if demand_gap > restock_threshold:
                            recommended_restock = demand_gap
                            demand_type = 'High demand'
                        else:
                            recommended_restock = restock_threshold + 5
                            demand_type = 'Low demand'
                        final_reason = reason if reason else demand_type
                        month_plan['product_recommendations'].append({
                            'product_id': product_id,
                            'name': current_inventory[product_id]['name'],
                            'product_name': current_inventory[product_id]['name'],
                            'category': current_inventory[product_id]['category'],
                            'current_stock': current_stock,
                            'forecasted_demand': forecasted_demand,
                            'restock_threshold': restock_threshold,
                            'recommended_restock': int(round(recommended_restock)),
                            'reason': final_reason,
                            'cost': product_cost
                        })
                restock_plan['monthly_plans'][month] = month_plan
            # Calculate summary
            total_restock_quantity = 0
            total_restock_value = 0
            products_to_restock = 0
            products_to_reduce = 0
            for month_plan in restock_plan['monthly_plans'].values():
                for rec in month_plan['product_recommendations']:
                    qty = rec['recommended_restock']
                    if qty > 0:
                        total_restock_quantity += qty
                        total_restock_value += qty * rec['cost']
                        products_to_restock += 1
                    elif qty < 0:
                        products_to_reduce += 1
            restock_plan['summary'] = {
                'total_restock_quantity': total_restock_quantity,
                'total_restock_value': int(round(total_restock_value)),
                'products_to_restock': products_to_restock,
                'products_to_reduce': products_to_reduce
            }
            restock_plan['forecast_period'] = f"{len(restock_plan['monthly_plans'])} months"
            # Debug: print any product_recommendations missing 'product_name'
            for month, month_plan in restock_plan['monthly_plans'].items():
                for rec in month_plan['product_recommendations']:
                    if 'product_name' not in rec:
                        print(f"DEBUG: Missing product_name in recommendation: {rec}")
            return restock_plan
        except KeyError as ke:
            if str(ke) == "'product_name'":
                import traceback
                print('KeyError for product_name! Full traceback:')
                traceback.print_exc()
                # Print all product_recommendations for inspection
                try:
                    for month, month_plan in restock_plan['monthly_plans'].items():
                        for rec in month_plan['product_recommendations']:
                            print('PRODUCT RECOMMENDATION:', rec)
                except Exception as e:
                    print('Could not print product_recommendations:', e)
            raise
        except Exception as e:
            import traceback
            traceback.print_exc()
            return f"Error generating restock plan: {e}"
    
    def _generate_high_level_recommendations(self, restock_plan: Dict) -> List[Dict]:
        """Generate high-level business recommendations"""
        recommendations = []
        
        # Analyze overall trends
        total_restock_value = restock_plan['summary']['total_restock_value']
        products_to_restock = restock_plan['summary']['products_to_restock']
        
        if total_restock_value > 50000:
            recommendations.append({
                'type': 'budget_alert',
                'title': 'High Restock Investment Required',
                'description': f'Total restock investment is ₹{total_restock_value:,.0f}. Consider prioritizing high-demand products.',
                'priority': 'high'
            })
        
        # Analyze seasonal patterns
        seasonal_products = []
        for month_plan in restock_plan['monthly_plans'].values():
            for rec in month_plan['product_recommendations']:
                # The original code had rec['seasonal_factors'] and rec['recommendation_type'] == 'restock'
                # The new forecast_upcoming_demand does not provide 'festivals' or 'seasons' in the forecast_data.
                # So, we cannot reliably determine seasonal factors from the forecast_data.
                # For now, we'll skip this analysis as it relies on non-existent data.
                pass # Removed seasonal_products generation as it's not directly available in forecast_data
        
        if seasonal_products:
            recommendations.append({
                'type': 'seasonal_opportunity',
                'title': 'Seasonal Stocking Opportunity',
                'description': f'Consider stocking seasonal products: {", ".join(set(seasonal_products[:5]))}',
                'priority': 'medium'
            })
        
        # Analyze category trends
        category_restock = {}
        for month_plan in restock_plan['monthly_plans'].values():
            for rec in month_plan['product_recommendations']:
                if rec.get('restock_quantity', rec.get('recommended_change', 0)) > 0:
                    category = rec['category']
                    if category not in category_restock:
                        category_restock[category] = 0
                    category_restock[category] += rec['recommended_restock']
                elif rec.get('restock_quantity', rec.get('recommended_change', 0)) < 0:
                    category = rec['category']
                    if category not in category_restock:
                        category_restock[category] = 0
                    category_restock[category] += rec['recommended_restock'] # Assuming negative is a reduction
        
        if category_restock:
            top_category = max(category_restock.items(), key=lambda x: x[1])
            recommendations.append({
                'type': 'category_focus',
                'title': 'Category Focus Recommendation',
                'description': f'Focus on {top_category[0]} category - highest restock requirement ({top_category[1]} units)',
                'priority': 'medium'
            })
        
        return recommendations
    
    def get_new_product_recommendations(self) -> List[Dict]:
        """Recommend new products based on festival/seasonal trends"""
        if self.festival_df is None:
            return []
        
        # Analyze festival/seasonal product popularity
        festival_product_analysis = {}
        
        for _, row in self.festival_df.iterrows():
            festival = row['festival'] if pd.notna(row['festival']) else 'None'
            season = row['season'] if pd.notna(row['season']) else 'None'
            product_name = row['product_name']
            tags = row['tags'] if pd.notna(row['tags']) else ''
            
            if festival not in festival_product_analysis:
                festival_product_analysis[festival] = {
                    'products': set(),
                    'seasons': set(),
                    'tags': set()
                }
            
            festival_product_analysis[festival]['products'].add(product_name)
            festival_product_analysis[festival]['seasons'].add(season)
            festival_product_analysis[festival]['tags'].update(tags.split(', '))
        
        # Find upcoming festivals
        upcoming_festivals = []
        current_month = datetime.now().month
        
        for month in range(current_month + 1, current_month + 4):
            forecast_month = ((month - 1) % 12) + 1
            month_festivals = self.festival_df[self.festival_df['month'] == forecast_month]['festival'].unique()
            for festival in month_festivals:
                if pd.notna(festival) and festival != 'None':
                    upcoming_festivals.append({
                        'festival': festival,
                        'month': forecast_month,
                        'products': list(festival_product_analysis.get(festival, {}).get('products', [])),
                        'tags': list(festival_product_analysis.get(festival, {}).get('tags', []))
                    })
        
        # Generate new product recommendations
        recommendations = []
        for festival_info in upcoming_festivals:
            festival = festival_info['festival']
            tags = festival_info['tags']
            
            # Recommend products based on tags
            for tag in tags:
                if tag and tag not in ['None', '']:
                    recommendations.append({
                        'festival': festival,
                        'month': festival_info['month'],
                        'recommended_product_type': tag,
                        'reason': f'High demand during {festival}',
                        'estimated_demand': 'High',
                        'investment_priority': 'High' if festival in ['Diwali', 'Christmas', 'Eid al-Fitr'] else 'Medium'
                    })
        
        return recommendations
    
    def generate_forecast_report(self) -> Dict:
        """Generate comprehensive forecast report"""
        try:
            # Load data
            if not self.load_data():
                return {'error': 'Failed to load data'}
            
            # Generate all analyses
            restock_plan = self.generate_restock_plan()
            new_product_recommendations = self.get_new_product_recommendations()
            demand_forecast = self.forecast_upcoming_demand()
            
            report = {
                'report_generated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'forecast_period': '3 months',
                'restock_plan': restock_plan,
                'new_product_recommendations': new_product_recommendations,
                'demand_forecast': demand_forecast,
                'summary': {
                    'total_restock_value': restock_plan.get('summary', {}).get('total_restock_value', 0),
                    'products_to_restock': restock_plan.get('summary', {}).get('products_to_restock', 0),
                    'new_product_recommendations': len(new_product_recommendations),
                    'upcoming_festivals': len(set([rec['festival'] for rec in new_product_recommendations]))
                }
            }
            
            return report
            
        except Exception as e:
            print(f"❌ Error generating forecast report: {e}")
            return {'error': str(e)} 

    def generate_restock_plan_pdf(self, seller_id: str, restock_plan: dict) -> str:
        """Generate a PDF report for the restock plan and return the file path"""
        reports_dir = os.path.join(os.path.dirname(__file__), '..', 'reports')
        os.makedirs(reports_dir, exist_ok=True)
        filename = f"restock_plan_report_{seller_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        file_path = os.path.join(reports_dir, filename)
        c = canvas.Canvas(file_path, pagesize=letter)
        width, height = letter
        y = height - inch
        # Add more spacing and better formatting
        c.setFillColorRGB(0.29, 0.08, 0.55)  # Purple header
        c.rect(0, height - 1.2*inch, width, 0.6*inch, fill=1, stroke=0)
        c.setFillColorRGB(1, 1, 1)
        c.setFont("Helvetica-Bold", 20)
        c.drawString(inch, height - 0.95*inch, "Monthly Restock Plan Report")
        c.setFillColorRGB(0, 0, 0)
        y = height - 1.4 * inch
        c.setFont("Helvetica", 12)
        c.drawString(inch, y, f"Generated: {restock_plan.get('generated_date', '')}")
        y -= 0.3 * inch
        summary = restock_plan.get('summary', {})
        c.setFont("Helvetica-Bold", 13)
        c.drawString(inch, y, f"Forecast Period: {restock_plan.get('forecast_period', '')}")
        y -= 0.22 * inch
        c.setFont("Helvetica-Bold", 12)
        c.drawString(inch, y, f"Total Restock Quantity: {summary.get('total_restock_quantity', 0)}")
        y -= 0.18 * inch
        c.drawString(inch, y, f"Total Restock Value: Rs.{summary.get('total_restock_value', 0):,}")
        y -= 0.18 * inch
        c.drawString(inch, y, f"Products to Restock: {summary.get('products_to_restock', 0)}")
        y -= 0.18 * inch
        c.drawString(inch, y, f"Products to Reduce: {summary.get('products_to_reduce', 0)}")
        y -= 0.3 * inch
        c.setFont("Helvetica-Bold", 13)
        c.drawString(inch, y, "Restock Recommendations (2 Months)")
        y -= 0.22 * inch
        c.setFont("Helvetica-Bold", 11)
        # Table header
        c.setFillColorRGB(0.93, 0.91, 0.98)
        c.rect(inch-0.1*inch, y-0.04*inch, 6.2*inch, 0.22*inch, fill=1, stroke=0)
        c.setFillColorRGB(0.29, 0.08, 0.55)
        c.drawString(inch+0.05*inch, y, "Month")
        c.drawString(inch+0.8*inch, y, "Product Name")
        c.drawString(inch+2.8*inch, y, "Category")
        c.drawString(inch+3.8*inch, y, "Stock")
        c.drawString(inch+4.4*inch, y, "Demand")
        c.drawString(inch+5.2*inch, y, "Restock")
        c.drawString(inch+6.0*inch, y, "Reason")
        y -= 0.22 * inch
        c.setFont("Helvetica", 10)
        row_num = 0
        for month, month_plan in restock_plan.get('monthly_plans', {}).items():
            for rec in month_plan.get('product_recommendations', []):
                if y < inch:
                    # Footer with page number
                    c.setFont("Helvetica-Oblique", 9)
                    c.setFillColorRGB(0.5, 0.5, 0.5)
                    c.drawRightString(width - inch, 0.7*inch, f"Page {int(c.getPageNumber())}")
                    c.showPage()
                    y = height - 1.4 * inch
                    c.setFont("Helvetica", 10)
                # Alternate row shading
                if row_num % 2 == 0:
                    c.setFillColorRGB(0.98, 0.97, 1)
                else:
                    c.setFillColorRGB(1, 1, 1)
                c.rect(inch-0.1*inch, y-0.04*inch, 6.2*inch, 0.19*inch, fill=1, stroke=0)
                c.setFillColorRGB(0, 0, 0)
                c.drawString(inch+0.05*inch, y, str(month))
                c.drawString(inch+0.8*inch, y, f"{rec.get('name', rec.get('product_name', ''))[:18]}")
                c.drawString(inch+2.8*inch, y, f"{rec['category'][:10]}")
                c.drawString(inch+3.8*inch, y, f"{rec['current_stock']}")
                c.drawString(inch+4.4*inch, y, f"{rec['forecasted_demand']}")
                c.drawString(inch+5.2*inch, y, f"{rec['recommended_restock']}")
                # Reason: festival/season or high demand
                reason = rec.get('reason', '')
                c.setFont("Helvetica-Oblique", 9)
                c.setFillColorRGB(0.29, 0.08, 0.55)
                c.drawString(inch+6.0*inch, y, reason)
                c.setFont("Helvetica", 10)
                c.setFillColorRGB(0, 0, 0)
                y -= 0.19 * inch
                row_num += 1
            y -= 0.08 * inch
        # High-level recommendations section
        c.setFont("Helvetica-Bold", 12)
        if y < 1.2*inch:
            c.setFont("Helvetica-Oblique", 9)
            c.setFillColorRGB(0.5, 0.5, 0.5)
            c.drawRightString(width - inch, 0.7*inch, f"Page {int(c.getPageNumber())}")
            c.showPage()
            y = height - 1.4 * inch
        c.setFillColorRGB(0, 0, 0)
        # Remove all previous summary and recommendations headings and text. Only show top 3 categories by restock quantity.
        # At the bottom of the Summary section, add top 3 categories by restock quantity
        category_restock = {}
        for month_plan in restock_plan.get('monthly_plans', {}).values():
            for rec in month_plan.get('product_recommendations', []):
                qty = rec['recommended_restock']
                if qty > 0:
                    cat = rec['category']
                    category_restock[cat] = category_restock.get(cat, 0) + qty
        if category_restock:
            top_cats = sorted(category_restock.items(), key=lambda x: x[1], reverse=True)[:3]
            cat_str = ', '.join([f"{cat} ({qty})" for cat, qty in top_cats])
            y -= 0.18 * inch
            c.setFont("Helvetica", 10)
            c.setFillColorRGB(0, 0, 0)
            c.drawString(inch, y, f"Highest restock quantities required for: {cat_str}")
        # Final footer
        c.setFont("Helvetica-Oblique", 9)
        c.setFillColorRGB(0.5, 0.5, 0.5)
        c.drawRightString(width - inch, 0.7*inch, f"Page {int(c.getPageNumber())}")
        c.save()
        return file_path 