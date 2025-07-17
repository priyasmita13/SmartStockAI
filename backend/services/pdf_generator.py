from .pdf_base import BasePDFReport, BasePDFGenerator
from services.inventory_health import InventoryHealthAnalyzer

class InventoryPDFReport(BasePDFReport):
    def __init__(self, title=None):
        super().__init__(title=title or "SmartStock AI - Inventory Health Report")
    
    def add_summary_section(self, summary):
        self.chapter_title('Executive Summary')
        self.set_font('Arial', '', 10)
        self.cell(0, 6, f'Total Products: {summary["total_products"]}', ln=True)
        self.cell(0, 6, f'Total Stock: {summary["total_stock"]}', ln=True)
        self.cell(0, 6, f'Total Sold: {summary["total_sold"]}', ln=True)
        self.ln(5)
    
    def add_most_sold_section(self, most_sold):
        self.chapter_title('Top Performing Products')
        self.set_font('Arial', 'B', 10)
        self.set_text_color(0, 128, 0)  # Green for good performers
        
        # Header
        self.cell(60, 8, 'Product', border=1)
        self.cell(30, 8, 'Category', border=1)
        self.cell(25, 8, 'Sold', border=1)
        self.cell(25, 8, 'Stock', border=1)
        self.ln()
        
        # Data
        self.set_font('Arial', '', 9)
        self.set_text_color(0, 0, 0)
        
        for item in most_sold:
            # Ensure text is properly encoded for PDF
            safe_name = item['name'][:25].encode('latin-1', 'replace').decode('latin-1')
            safe_category = item['category'].encode('latin-1', 'replace').decode('latin-1')
            self.cell(60, 6, safe_name, border=1)
            self.cell(30, 6, safe_category, border=1)
            self.cell(25, 6, str(item['total_sold']), border=1)
            self.cell(25, 6, str(item['stock_quantity']), border=1, ln=True)
        
        self.ln(5)
    
    def add_dead_stock_section(self, dead_stock):
        if not dead_stock:
            return
            
        self.chapter_title('Dead Stock Alert')
        self.set_font('Arial', 'B', 10)
        self.set_text_color(255, 0, 0)  # Red for dead stock
        
        # Header
        self.cell(60, 8, 'Product', border=1)
        self.cell(30, 8, 'Category', border=1)
        self.cell(25, 8, 'Stock', border=1)
        self.cell(25, 8, 'Price', border=1, ln=True)
        
        # Data
        self.set_font('Arial', '', 9)
        self.set_text_color(255, 0, 0)  # Red
        
        for item in dead_stock:
            # Ensure text is properly encoded for PDF
            safe_name = item['name'][:25].encode('latin-1', 'replace').decode('latin-1')
            safe_category = item['category'].encode('latin-1', 'replace').decode('latin-1')
            self.cell(60, 6, safe_name, border=1)
            self.cell(30, 6, safe_category, border=1)
            self.cell(25, 6, str(item['stock_quantity']), border=1)
            self.cell(25, 6, f"Rs.{item['price']}", border=1, ln=True)
        
        self.ln(5)
    
    def add_stock_issues_section(self, overstocked, understocked):
        if not overstocked and not understocked:
            return
            
        self.chapter_title('Stock Issues')
        self.set_font('Arial', 'B', 10)
        self.set_text_color(0, 0, 0)  # Normal black text
        
        # Header
        self.cell(50, 8, 'Product', border=1)
        self.cell(25, 8, 'Category', border=1)
        self.cell(20, 8, 'Stock', border=1)
        self.cell(20, 8, 'Sold', border=1)
        self.cell(25, 8, 'Status', border=1)
        self.cell(25, 8, 'Stock-Sales Ratio', border=1, ln=True)
        
        # Data
        self.set_font('Arial', '', 9)
        self.set_text_color(0, 0, 0)  # Normal black text
        
        # Add overstocked items
        for item in overstocked:
            safe_name = item['name'][:20].encode('latin-1', 'replace').decode('latin-1')
            safe_category = item['category'].encode('latin-1', 'replace').decode('latin-1')
            self.cell(50, 6, safe_name, border=1)
            self.cell(25, 6, safe_category, border=1)
            self.cell(20, 6, str(item['stock_quantity']), border=1)
            self.cell(20, 6, str(item['total_sold']), border=1)
            self.cell(25, 6, 'Overstocked', border=1)
            self.cell(25, 6, f'{item["stock_sales_ratio"]:.2f}', border=1, ln=True)
        
        # Add understocked items
        for item in understocked:
            safe_name = item['name'][:20].encode('latin-1', 'replace').decode('latin-1')
            safe_category = item['category'].encode('latin-1', 'replace').decode('latin-1')
            self.cell(50, 6, safe_name, border=1)
            self.cell(25, 6, safe_category, border=1)
            self.cell(20, 6, str(item['stock_quantity']), border=1)
            self.cell(20, 6, str(item['total_sold']), border=1)
            self.cell(25, 6, 'Understocked', border=1)
            self.cell(25, 6, f'{item["stock_sales_ratio"]:.2f}', border=1, ln=True)
        
        self.ln(5)
    
    def add_category_analysis(self, category_analysis):
        self.chapter_title('Category Analysis')
        self.set_font('Arial', 'B', 10)
        self.set_text_color(0, 0, 0)
        
        # Header
        self.cell(40, 8, 'Category', border=1)
        self.cell(25, 8, 'Products', border=1)
        self.cell(25, 8, 'Stock', border=1)
        self.cell(25, 8, 'Sold', border=1)
        self.cell(25, 8, 'Price', border=1, ln=True)
        
        # Data
        self.set_font('Arial', '', 9)
        
        for category in category_analysis:
            # Ensure text is properly encoded for PDF
            safe_category = category['category'].encode('latin-1', 'replace').decode('latin-1')
            self.cell(40, 6, safe_category, border=1)
            self.cell(25, 6, str(category['product_count']), border=1)
            self.cell(25, 6, str(category['total_stock']), border=1)
            self.cell(25, 6, str(category['total_sold']), border=1)
            self.cell(25, 6, f"Rs.{category['avg_price']:.0f}", border=1, ln=True)
        
        self.ln(5)
    
    def add_last_week_sales_section(self, last_week_sales):
        if not last_week_sales:
            return
            
        self.chapter_title('Last Week Sales Performance')
        self.set_font('Arial', 'B', 10)
        self.set_text_color(0, 128, 0)  # Green for good performance
        
        # Header
        self.cell(60, 8, 'Product', border=1)
        self.cell(30, 8, 'Category', border=1)
        self.cell(25, 8, 'Week Sales', border=1)
        self.cell(25, 8, 'Total Sold', border=1, ln=True)
        
        # Data
        self.set_font('Arial', '', 9)
        self.set_text_color(0, 0, 0)
        
        for item in last_week_sales:
            # Ensure text is properly encoded for PDF
            safe_name = item['name'][:25].encode('latin-1', 'replace').decode('latin-1')
            safe_category = item['category'].encode('latin-1', 'replace').decode('latin-1')
            self.cell(60, 6, safe_name, border=1)
            self.cell(30, 6, safe_category, border=1)
            self.cell(25, 6, str(item['last_week_sales']), border=1)
            self.cell(25, 6, str(item['total_sold']), border=1, ln=True)
        
        self.ln(5)

class InventoryPDFGenerator(BasePDFGenerator):
    def __init__(self):
        super().__init__(report_title="Inventory Health Report", pdf_class=InventoryPDFReport)
        self.analyzer = InventoryHealthAnalyzer()
    
    def generate_inventory_health_pdf(self, seller_id, analysis=None):
        if analysis is None:
            analysis = self.analyzer.analyze_inventory()
        def add_sections(pdf):
            pdf.add_summary_section(analysis['summary'])
            pdf.add_most_sold_section(analysis['most_sold'])
            pdf.add_dead_stock_section(analysis['dead_stock'])
            pdf.add_stock_issues_section(analysis['overstocked'], analysis['understocked'])
            pdf.add_last_week_sales_section(analysis['last_week_sales'])
            pdf.add_category_analysis(analysis['category_analysis'])
        pdf_path = self.generate_pdf(seller_id, lambda pdf: add_sections(pdf))
        print(f"✅ PDF generated successfully: {pdf_path}")
        return pdf_path