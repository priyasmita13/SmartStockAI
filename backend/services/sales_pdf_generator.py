from .pdf_base import BasePDFReport, BasePDFGenerator
from config import Config
from datetime import datetime
import pandas as pd

class SalesPDFReport(BasePDFReport):
    def __init__(self, title=None):
        super().__init__(title=title or "SmartStock AI - Annual Sales Report")

    def add_executive_summary(self, summary):
        self.chapter_title('Executive Summary')
        self.set_font('Arial', '', 10)
        self.cell(0, 6, f'Total Sales Records: {summary["total_records"]}', ln=True)
        self.cell(0, 6, f'Total Products Sold: {summary["total_products"]}', ln=True)
        self.cell(0, 6, f'Total Quantity Sold: {summary["total_quantity"]}', ln=True)
        self.cell(0, 6, f'Report Period: {summary["period"]}', ln=True)
        self.cell(0, 6, f'Average Monthly Sales: {summary["avg_monthly_sales"]:.0f} units', ln=True)
        self.ln(5)

    def add_monthly_breakdown(self, monthly_data):
        self.chapter_title('Monthly Sales Breakdown')
        self.set_font('Arial', 'B', 10)
        self.set_text_color(0, 0, 0)
        
        # Header
        self.cell(40, 8, 'Month', border=1)
        self.cell(30, 8, 'Sales Records', border=1)
        self.cell(30, 8, 'Products Sold', border=1)
        self.cell(30, 8, 'Quantity Sold', border=1)
        self.cell(30, 8, 'Avg per Record', border=1, ln=True)
        
        # Data
        self.set_font('Arial', '', 9)
        
        for month_data in monthly_data:
            month_name = month_data['month']
            records = month_data['records']
            products = month_data['products']
            quantity = month_data['quantity']
            avg_per_record = month_data['avg_per_record']
            
            # Ensure text is properly encoded for PDF
            safe_month = month_name.encode('latin-1', 'replace').decode('latin-1')
            self.cell(40, 6, safe_month, border=1)
            self.cell(30, 6, str(records), border=1)
            self.cell(30, 6, str(products), border=1)
            self.cell(30, 6, str(quantity), border=1)
            self.cell(30, 6, f'{avg_per_record:.1f}', border=1, ln=True)
        
        self.ln(5)
    
    def add_top_selling_products(self, top_products):
        self.chapter_title('Top Selling Products')
        self.set_font('Arial', 'B', 10)
        self.set_text_color(0, 128, 0)  # Green for top performers
        
        # Header
        self.cell(60, 8, 'Product', border=1)
        self.cell(30, 8, 'Sales Records', border=1)
        self.cell(30, 8, 'Total Quantity', border=1)
        self.cell(30, 8, 'Avg per Sale', border=1, ln=True)
        
        # Data
        self.set_font('Arial', '', 9)
        self.set_text_color(0, 0, 0)
        
        for product in top_products:
            # Ensure text is properly encoded for PDF
            safe_name = product['product_name'][:25].encode('latin-1', 'replace').decode('latin-1')
            self.cell(60, 6, safe_name, border=1)
            self.cell(30, 6, str(product['sales_records']), border=1)
            self.cell(30, 6, str(product['total_quantity']), border=1)
            self.cell(30, 6, f'{product["avg_per_sale"]:.1f}', border=1, ln=True)
        
        self.ln(5)
    
    def add_sales_trends(self, trends):
        self.chapter_title('Sales Trends Analysis')
        self.set_font('Arial', '', 10)
        
        for trend in trends:
            self.set_font('Arial', 'B', 10)
            # Remove emoji and encode safely
            safe_title = trend['title'].encode('latin-1', 'replace').decode('latin-1')
            self.cell(0, 6, f"* {safe_title}", ln=True)
            self.set_font('Arial', '', 9)
            safe_description = trend['description'].encode('latin-1', 'replace').decode('latin-1')
            self.cell(0, 6, f"   {safe_description}", ln=True)
            self.ln(3)
        
        self.ln(5)
    
    def add_seasonal_analysis(self, seasonal_data):
        self.chapter_title('Seasonal Performance Analysis')
        self.set_font('Arial', 'B', 10)
        self.set_text_color(0, 0, 0)
        
        # Header
        self.cell(40, 8, 'Season', border=1)
        self.cell(30, 8, 'Months', border=1)
        self.cell(30, 8, 'Total Sales', border=1)
        self.cell(30, 8, 'Avg Monthly', border=1)
        self.cell(30, 8, 'Performance', border=1, ln=True)
        
        # Data
        self.set_font('Arial', '', 9)
        
        for season in seasonal_data:
            # Ensure text is properly encoded for PDF
            safe_season = season['season'].encode('latin-1', 'replace').decode('latin-1')
            safe_performance = season['performance'].encode('latin-1', 'replace').decode('latin-1')
            
            self.cell(40, 6, safe_season, border=1)
            self.cell(30, 6, str(season['months']), border=1)
            self.cell(30, 6, str(season['total_sales']), border=1)
            self.cell(30, 6, f'{season["avg_monthly"]:.0f}', border=1)
            self.cell(30, 6, safe_performance, border=1, ln=True)
        
        self.ln(5)

    def add_weekly_sales_table(self, weekly_data):
        self.chapter_title('Weekly Sales (Past Year)')
        self.set_font('Arial', 'B', 10)
        self.set_text_color(0, 0, 0)
        # Header
        self.cell(40, 8, 'Week', border=1)
        self.cell(60, 8, 'Product', border=1)
        self.cell(30, 8, 'Total Sold', border=1, ln=True)
        self.set_font('Arial', '', 9)
        for row in weekly_data:
            self.cell(40, 6, str(row['week']), border=1)
            safe_name = row['product_name'][:25].encode('latin-1', 'replace').decode('latin-1')
            self.cell(60, 6, safe_name, border=1)
            self.cell(30, 6, str(row['quantity_sold']), border=1, ln=True)
        self.ln(5)

    def add_monthly_sales_table(self, monthly_data):
        self.chapter_title('Monthly Sales (Past Year)')
        self.set_font('Arial', 'B', 10)
        self.set_text_color(0, 0, 0)
        # Header
        self.cell(40, 8, 'Month', border=1)
        self.cell(60, 8, 'Product', border=1)
        self.cell(30, 8, 'Total Sold', border=1, ln=True)
        self.set_font('Arial', '', 9)
        for row in monthly_data:
            self.cell(40, 6, str(row['month']), border=1)
            safe_name = row['product_name'][:25].encode('latin-1', 'replace').decode('latin-1')
            self.cell(60, 6, safe_name, border=1)
            self.cell(30, 6, str(row['quantity_sold']), border=1, ln=True)
        self.ln(5)

class SalesPDFGenerator(BasePDFGenerator):
    def __init__(self):
        super().__init__(report_title="Sales Report", pdf_class=SalesPDFReport)
        self.sales_data = None
        self.load_sales_data()

    def load_sales_data(self):
        sales_file = Config.DATA_DIR / 'Seasonal_Sales_400_OrderedByMonth(1).csv'
        if not sales_file.exists():
            raise FileNotFoundError(f"Sales data file not found: {sales_file}")
        df = pd.read_csv(sales_file)
        df.columns = [col.lower().replace(' ', '_') for col in df.columns]
        df['sales_date'] = pd.to_datetime(df['sales_date'], errors='coerce')
        df['sales_year'] = df['sales_date'].dt.year
        self.sales_data = df

    def analyze_sales_data(self):
        if self.sales_data is None:
            raise ValueError("Sales data not loaded")
        df = self.sales_data
        total_records = len(df)
        total_products = df['product_name'].nunique()
        total_quantity = df['quantity_sold'].sum()
        monthly_data = []
        for month in range(1, 13):
            month_df = df[df['sales_month'] == month]
            if len(month_df) > 0:
                monthly_data.append({
                    'month': datetime(2024, month, 1).strftime('%B'),
                    'records': len(month_df),
                    'products': month_df['product_name'].nunique(),
                    'quantity': month_df['quantity_sold'].sum(),
                    'avg_per_record': month_df['quantity_sold'].mean()
                })
        product_sales = df.groupby('product_name').agg({
            'quantity_sold': ['sum', 'count', 'mean']
        }).reset_index()
        product_sales.columns = ['product_name', 'total_quantity', 'sales_records', 'avg_per_sale']
        top_products = product_sales.sort_values('total_quantity', ascending=False).head(10).to_dict('records')

        # Example trends (replace with real analysis if available)
        trends = [
            {
                'title': 'Steady Growth in Summer',
                'description': 'Sales increased steadily from May to August, likely due to seasonal demand.'
            },
            {
                'title': 'Festival Boost',
                'description': 'Significant sales spike observed during Diwali and Christmas months.'
            }
        ]

        # Example seasonal analysis (replace with real analysis if available)
        seasonal_data = [
            {
                'season': 'Summer',
                'months': 'May-Aug',
                'total_sales': int(df[df['sales_month'].isin([5,6,7,8])]['quantity_sold'].sum()),
                'avg_monthly': df[df['sales_month'].isin([5,6,7,8])]['quantity_sold'].mean() if not df[df['sales_month'].isin([5,6,7,8])].empty else 0,
                'performance': 'High'
            },
            {
                'season': 'Festival',
                'months': 'Oct-Dec',
                'total_sales': int(df[df['sales_month'].isin([10,11,12])]['quantity_sold'].sum()),
                'avg_monthly': df[df['sales_month'].isin([10,11,12])]['quantity_sold'].mean() if not df[df['sales_month'].isin([10,11,12])].empty else 0,
                'performance': 'Very High'
            },
            {
                'season': 'Off Season',
                'months': 'Jan-Apr, Sep',
                'total_sales': int(df[df['sales_month'].isin([1,2,3,4,9])]['quantity_sold'].sum()),
                'avg_monthly': df[df['sales_month'].isin([1,2,3,4,9])]['quantity_sold'].mean() if not df[df['sales_month'].isin([1,2,3,4,9])].empty else 0,
                'performance': 'Moderate'
            }
        ]

        summary = {
            'total_records': total_records,
            'total_products': total_products,
            'total_quantity': total_quantity,
            'period': 'Last 12 months',
            'avg_monthly_sales': total_quantity / 12 if total_quantity else 0
        }
        return {
            'summary': summary,
            'monthly_data': monthly_data,
            'top_products': top_products,
            'trends': trends,
            'seasonal_data': seasonal_data
        }

    def get_weekly_monthly_sales_data(self):
        if self.sales_data is None:
            raise ValueError("Sales data not loaded")
        df = self.sales_data.copy()
        df = df[df['sales_date'].notna()]
        df['week'] = df['sales_date'].dt.strftime('%Y-W%U')
        df['month'] = df['sales_date'].dt.strftime('%Y-%m')
        # Weekly sales (product-wise)
        weekly = df.groupby(['week', 'product_name'])['quantity_sold'].sum().reset_index()
        weekly = weekly.sort_values(['week', 'product_name'])
        weekly_data = weekly.to_dict('records')
        # Monthly sales (product-wise)
        monthly = df.groupby(['month', 'product_name'])['quantity_sold'].sum().reset_index()
        monthly = monthly.sort_values(['month', 'product_name'])
        monthly_data = monthly.to_dict('records')
        return weekly_data, monthly_data

    def generate_sales_report_pdf(self, seller_id):
        analysis = self.analyze_sales_data()
        def add_sections(pdf):
            pdf.add_executive_summary(analysis['summary'])
            pdf.add_monthly_breakdown(analysis['monthly_data'])
            pdf.add_top_selling_products(analysis['top_products'])
            pdf.add_sales_trends(analysis['trends'])
            pdf.add_seasonal_analysis(analysis['seasonal_data'])
        pdf_path = self.generate_pdf(seller_id, lambda pdf: add_sections(pdf))
        print(f"✅ Sales PDF generated successfully: {pdf_path}")
        return pdf_path 

    def generate_weekly_monthly_sales_pdf(self, seller_id):
        weekly_data, monthly_data = self.get_weekly_monthly_sales_data()
        def add_sections(pdf):
            pdf.add_weekly_sales_table(weekly_data)
            pdf.add_monthly_sales_table(monthly_data)
        pdf_path = self.generate_pdf(seller_id, lambda pdf: add_sections(pdf))
        print(f"✅ Weekly/Monthly Sales PDF generated successfully: {pdf_path}")
        return pdf_path 