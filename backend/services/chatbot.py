import json
import os
from datetime import datetime
from services.inventory_health import InventoryHealthAnalyzer
from services.pdf_generator import InventoryPDFGenerator
from services.sales_pdf_generator import SalesPDFGenerator
from config import Config
from services.forecasting_service import ForecastingService
import re

class ChatbotService:
    def __init__(self):
        self.inventory_pdf_generator = InventoryPDFGenerator()
        self.sales_pdf_generator = SalesPDFGenerator()
        self.analyzer = InventoryHealthAnalyzer()
        self.forecasting_service = ForecastingService()
        
        # Predefined prompts and responses
        self.prompts = {
            'inventory_health': [
                'inventory health',
                'inventory analysis',
                'stock health',
                'inventory status',
                'health report'
            ],
            'generate_pdf': [
                'generate pdf',
                'create pdf report',
                'download report',
                'pdf report',
                'export report'
            ],
            'sales_report': [
                'sales report',
                'last year sales',
                'annual sales report',
                'sales analysis',
                'sales summary',
                'yearly sales',
                'sales performance'
            ],
            'most_sold': [
                'most sold',
                'top products',
                'best sellers',
                'highest sales'
            ],
            'least_sold': [
                'least sold',
                'worst products',
                'low sales',
                'poor performers'
            ],
            'dead_stock': [
                'dead stock',
                'no sales',
                'unsold items',
                'zero sales'
            ],
            'overstocked': [
                'overstocked',
                'too much stock',
                'excess inventory',
                'high stock low sales'
            ],
            'understocked': [
                'understocked',
                'low stock',
                'need more stock',
                'stockout risk'
            ],
            'category_analysis': [
                'category analysis',
                'by category',
                'category performance',
                'category breakdown'
            ],
            'recommendations': [
                'recommendations',
                'suggestions',
                'what should I do',
                'advice'
            ],
            'restock_plan': [
                'restock plan',
                'monthly restock plan',
                'restock recommendation',
                'what should I restock',
                'restock advice'
            ],
            'forecast_demand': [
                'forecast product demand',
                'product demand forecast',
                'demand forecast',
                'forecast demand',
                'expected sales',
                'predict sales',
            ],
            'product_listing_assistance': [
                'list product',
                'add product',
                'new product',
                'product listing',
                'product addition'
            ],
        }
    
    def process_message(self, user_message):
        """Process user message and return appropriate response"""
        user_message_clean = user_message.lower().strip()

        # Robust check for weekly/monthly report requests
        if any(kw in user_message_clean for kw in [
            'weekly or monthly report',
            'weekly report',
            'monthly report',
            'generate weekly report',
            'generate monthly report',
            'weekly sales report',
            'monthly sales report',
            'weekly sales',
            'monthly sales',
            'generate a weekly or monthly report',
        ]):
            # Always trigger the weekly/monthly PDF logic
            seller_id = 'default_seller'
            pdf_path = self.sales_pdf_generator.generate_weekly_monthly_sales_pdf(seller_id)
            pdf_filename = os.path.basename(pdf_path)
            return f"Weekly & Monthly Sales Report PDF Generated!\nDownload: `{pdf_filename}`\n\nThe report includes:\n• Weekly sales (past year, product-wise)\n• Monthly sales (past year, product-wise)\n\nYou can download the PDF from the reports folder."

        # Robust check for product listing assistance flow (step keywords or image file)
        image_file_pattern = re.compile(r"\.(jpg|jpeg|png|gif|bmp|webp|tiff|svg)$", re.IGNORECASE)
        if (
            'uploaded' in user_message_clean
            or 'name:' in user_message_clean
            or 'category:' in user_message_clean
            or 'price:' in user_message_clean
            or 'step2' in user_message_clean
            or 'step3' in user_message_clean
            or 'step4' in user_message_clean
            or image_file_pattern.search(user_message.strip())
        ):
            return self._handle_product_listing_assistance(user_message)

        # Check for exact matches with predefined prompts
        for intent, keywords in self.prompts.items():
            if any(keyword in user_message_clean for keyword in keywords):
                if intent == 'forecast_demand':
                    return self._get_forecast_demand_response()
                if intent == 'product_listing_assistance':
                    return self._handle_product_listing_assistance(user_message)
                return self._handle_intent(intent, user_message)
        # Default response
        return self._get_default_response()
    
    def _handle_intent(self, intent, user_message):
        """Handle different intents"""
        try:
            if intent == 'inventory_health':
                seller_id = 'default_seller'
                analysis = self.inventory_pdf_generator.analyzer.analyze_inventory()
                summary = self._get_inventory_health_summary_from_analysis(analysis)
                pdf_path = self.inventory_pdf_generator.generate_inventory_health_pdf(seller_id, analysis)
                pdf_filename = os.path.basename(pdf_path)
                response = f"{summary}\n\nPDF Report Generated!\nDownload: `{pdf_filename}`"
                return response
            
            elif intent == 'generate_pdf':
                # Special case: if the prompt is for weekly/monthly report, generate that PDF
                if 'weekly' in user_message or 'monthly' in user_message:
                    seller_id = 'default_seller'
                    pdf_path = self.sales_pdf_generator.generate_weekly_monthly_sales_pdf(seller_id)
                    pdf_filename = os.path.basename(pdf_path)
                    response = f"Weekly & Monthly Sales Report PDF Generated!\nDownload: `{pdf_filename}`\n\nThe report includes:\n• Weekly sales (past year, product-wise)\n• Monthly sales (past year, product-wise)\n\nYou can download the PDF from the reports folder."
                    return response
                return self._generate_pdf_report(user_message)
            
            elif intent == 'sales_report':
                seller_id = 'default_seller'
                summary = self._get_sales_report_summary()
                pdf_path = self.sales_pdf_generator.generate_sales_report_pdf(seller_id)
                pdf_filename = os.path.basename(pdf_path)
                response = f"{summary}\n\nPDF Report Generated!\nDownload: `{pdf_filename}`"
                return response
            
            elif intent == 'most_sold':
                return self._get_most_sold_items()
            
            elif intent == 'least_sold':
                return self._get_least_sold_items()
            
            elif intent == 'dead_stock':
                return self._get_dead_stock()
            
            elif intent == 'overstocked':
                return self._get_overstocked_items()
            
            elif intent == 'understocked':
                return self._get_understocked_items()
            
            elif intent == 'category_analysis':
                return self._get_category_analysis()
            
            elif intent == 'recommendations':
                return self._get_recommendations()
            
            elif intent == 'restock_plan':
                return self._get_restock_plan(test_month=None) # Default to None for now
            
            else:
                return self._get_default_response()
                
        except Exception as e:
            return f"I encountered an error while processing your request: {str(e)}"
    
    def _get_inventory_health_summary_from_analysis(self, analysis):
        """Get overall inventory health summary from a given analysis"""
        try:
            summary = analysis['summary']
            health_score = analysis['health_score']
            response = f"""
Inventory Health Summary

Overall Health Score: {health_score}/100
Total Products: {summary['total_products']}
Total Stock: {summary['total_stock']}
Total Sold: {summary['total_sold']}
Total Value: ₹{summary['total_value']:,.0f}
Stock-to-Sales Ratio: {summary['stock_to_sales_ratio']:.2f}

Status: {'Excellent' if health_score >= 80 else 'Good' if health_score >= 60 else 'Needs Attention'}
"""
            return response.strip()
        except Exception as e:
            return f"Error getting inventory health summary: {str(e)}"
    
    def _generate_pdf_report(self, user_message):
        """Generate PDF report"""
        try:
            # Extract seller_id from message if provided
            seller_id = 'default_seller'
            if 'seller' in user_message:
                # Simple extraction - in real app, use more sophisticated parsing
                seller_id = user_message.split('seller')[-1].strip()[:10]
            
            pdf_path = self.inventory_pdf_generator.generate_inventory_health_pdf(seller_id)
            pdf_filename = os.path.basename(pdf_path)
            response = f"""
PDF Report Generated Successfully!

Report saved as: `{pdf_filename}`

The report includes:
• Executive Summary with Health Score
• Top Performing Products
• Dead Stock Alerts
• Overstocked Items
• Understocked Items
• Category Analysis
• Actionable Recommendations

You can download the PDF from the reports folder.
            """
            return response
            
        except Exception as e:
            return f"Error generating PDF report: {str(e)}"
    
    def _get_sales_report_summary(self):
        # Generate a short summary for the sales report
        try:
            analysis = self.sales_pdf_generator.analyze_sales_data()
            summary = analysis['summary']
            response = f"""
Sales Report Summary

Total Sales Records: {summary['total_records']}
Total Products Sold: {summary['total_products']}
Total Quantity Sold: {summary['total_quantity']}
Report Period: {summary['period']}
Average Monthly Sales: {summary['avg_monthly_sales']:.0f} units
"""
            return response.strip()
        except Exception as e:
            return f"Error getting sales report summary: {str(e)}"
    
    def _get_most_sold_items(self):
        """Get most sold items"""
        try:
            analysis = self.inventory_pdf_generator.analyzer.analyze_inventory()
            most_sold = analysis['most_sold']
            
            response = "Top Performing Products\n\n"
            for i, item in enumerate(most_sold, 1):
                response += f"{i}. {item['name']} ({item['category']})\n"
                response += f"   Stock: {item['stock_quantity']} | Sold: {item['total_sold']} | Trend: {int(item['trend_score'])}\n\n"
            
            return response.strip()
            
        except Exception as e:
            return f"Error getting most sold items: {str(e)}"
    
    def _get_least_sold_items(self):
        """Get least sold items"""
        try:
            analysis = self.inventory_pdf_generator.analyzer.analyze_inventory()
            least_sold = analysis['least_sold']
            
            response = "Lowest Performing Products\n\n"
            for i, item in enumerate(least_sold, 1):
                response += f"{i}. {item['name']} ({item['category']})\n"
                response += f"   Stock: {item['stock_quantity']} | Sold: {item['total_sold']} | Trend: {int(item['trend_score'])}\n\n"
            
            return response.strip()
            
        except Exception as e:
            return f"Error getting least sold items: {str(e)}"
    
    def _get_dead_stock(self):
        """Get dead stock items"""
        try:
            analysis = self.inventory_pdf_generator.analyzer.analyze_inventory()
            dead_stock = analysis['dead_stock']
            
            if not dead_stock:
                return "No Dead Stock Found!\n\nAll your products have some sales activity."
            
            response = "Dead Stock Alert (Items with stock but no sales)\n\n"
            for i, item in enumerate(dead_stock, 1):
                response += f"{i}. {item['name']} ({item['category']})\n"
                response += f"   Stock: {item['stock_quantity']} | Price: ₹{item['price']}\n\n"
            
            response += "Recommendation: Consider discounting or liquidating these items."
            return response.strip()
            
        except Exception as e:
            return f"Error getting dead stock: {str(e)}"
    
    def _get_overstocked_items(self):
        """Get overstocked items"""
        try:
            analysis = self.inventory_pdf_generator.analyzer.analyze_inventory()
            overstocked = analysis['overstocked']
            
            if not overstocked:
                return "No Overstocked Items Found!\n\nYour stock levels are well-balanced."
            
            response = "Overstocked Items (High stock, low sales)\n\n"
            for i, item in enumerate(overstocked, 1):
                response += f"{i}. {item['name']} ({item['category']})\n"
                response += f"   Stock: {item['stock_quantity']} | Sold: {item['total_sold']} | Ratio: {item['stock_sales_ratio']:.2f}\n\n"
            
            response += "Recommendation: Consider reducing stock levels for these items."
            return response.strip()
            
        except Exception as e:
            return f"Error getting overstocked items: {str(e)}"
    
    def _get_understocked_items(self):
        """Get understocked items"""
        try:
            analysis = self.inventory_pdf_generator.analyzer.analyze_inventory()
            understocked = analysis['understocked']
            
            if not understocked:
                return "No Understocked Items Found!\n\nAll your products have adequate stock levels."
            
            response = "Understocked Items (Low stock, high sales potential)\n\n"
            for i, item in enumerate(understocked, 1):
                response += f"{i}. {item['name']} ({item['category']})\n"
                response += f"   Stock: {item['stock_quantity']} | Threshold: {item['restock_threshold']} | Sold: {item['total_sold']}\n\n"
            
            response += "Recommendation: Consider increasing stock levels for these items."
            return response.strip()
            
        except Exception as e:
            return f"Error getting understocked items: {str(e)}"
    
    def _get_category_analysis(self):
        """Get category analysis"""
        try:
            analysis = self.inventory_pdf_generator.analyzer.analyze_inventory()
            category_analysis = analysis['category_analysis']
            
            response = "Category Analysis\n\n"
            for category in category_analysis:
                response += f"{category['category']}\n"
                response += f"   Products: {category['product_count']}\n"
                response += f"   Total Stock: {category['total_stock']}\n"
                response += f"   Total Sold: {category['total_sold']}\n"
                response += f"   Avg Price: ₹{category['avg_price']:.0f}\n"
                response += f"   Avg Trend: {category['avg_trend_score']:.0f}\n\n"
            
            return response.strip()
            
        except Exception as e:
            return f"Error getting category analysis: {str(e)}"
    
    def _get_recommendations(self):
        """Get recommendations based on analysis"""
        try:
            analysis = self.inventory_pdf_generator.analyzer.analyze_inventory()
            
            recommendations = []
            
            # Health score recommendations
            health_score = analysis['health_score']
            if health_score >= 80:
                recommendations.append("Excellent inventory health! Keep up the good work.")
            elif health_score >= 60:
                recommendations.append("Good inventory health with room for improvement.")
            else:
                recommendations.append("Inventory health needs attention. Consider the following actions:")
            
            # Specific recommendations
            if analysis['dead_stock']:
                recommendations.append(f"• Consider discounting or liquidating {len(analysis['dead_stock'])} dead stock items")
            
            if analysis['overstocked']:
                recommendations.append(f"• Reduce stock levels for {len(analysis['overstocked'])} overstocked items")
            
            if analysis['understocked']:
                recommendations.append(f"• Increase stock levels for {len(analysis['understocked'])} understocked items")
            
            # Stock-to-sales ratio recommendations
            ratio = analysis['summary']['stock_to_sales_ratio']
            if ratio > 2:
                recommendations.append("• Overall stock levels are high relative to sales - consider reducing inventory")
            elif ratio < 0.5:
                recommendations.append("• Overall stock levels are low relative to sales - consider increasing inventory")
            
            return "\n\n".join(recommendations)
            
        except Exception as e:
            return f"Error getting recommendations: {str(e)}"
    
    def _get_restock_plan(self, test_month: int = None):
        """Generate and summarize the monthly restock plan, with optional test_month for testing."""
        try:
            # Ensure data is loaded before generating the plan
            if not self.forecasting_service.load_data():
                return "Could not load data files for restock plan."
            plan = self.forecasting_service.generate_restock_plan(test_month=test_month)
            summary = plan.get('summary', {})
            response_lines = ["Restock Plan Summary\n"]
            response_lines.append(f"Forecast Period: {plan.get('forecast_period', 'N/A')}")
            response_lines.append(f"Total Restock Quantity: {summary.get('total_restock_quantity', 0)}")
            response_lines.append(f"Total Restock Value: Rs.{summary.get('total_restock_value', 0):,}")
            response_lines.append(f"Products to Restock: {summary.get('products_to_restock', 0)}")
            response_lines.append(f"Products to Reduce: {summary.get('products_to_reduce', 0)}\n")
            response_lines.append("For detailed recommendations, download the PDF report below.")
            # Generate PDF using previous FPDF/canvas-based implementation
            seller_id = 'default_seller'
            pdf_path = self.forecasting_service.generate_restock_plan_pdf(seller_id, plan)
            pdf_filename = os.path.basename(pdf_path)
            response_lines.append(f"\nPDF Report Generated!\nDownload: `{pdf_filename}`")
            return "\n".join(response_lines)
        except Exception as e:
            return f"Error generating restock plan: {e}"
    
    def _get_forecast_demand_response(self):
        """Return a chat response with product name, forecasted demand, and traffic light indicator for current month."""
        try:
            if not self.forecasting_service.load_data():
                return "Could not load data files for demand forecast."
            forecast = self.forecasting_service.forecast_upcoming_demand(forecast_months=1)
            if not forecast:
                return "No forecast data available."
            # Get the current forecast month (should be only one)
            forecast_month = list(forecast.keys())[0]
            month_data = forecast[forecast_month]
            # Prepare response
            lines = [f"Product Demand Forecast for This Month:\n"]
            lines.append(f"{'Product':<30} {'Forecasted Sales':<18} Status")
            lines.append('-'*60)
            for product_id, info in month_data.items():
                product_name = self.forecasting_service.inventory_df[self.forecasting_service.inventory_df['product_id'] == product_id]['name'].values[0]
                demand = info['forecasted_demand']
                # Traffic light logic
                if demand >= 100:
                    light = '🟢'
                elif demand >= 30:
                    light = '🟡'
                else:
                    light = '🔴'
                lines.append(f"{product_name:<30} {demand:<18} {light}")
            return '\n'.join(lines)
        except Exception as e:
            return f"Error generating demand forecast: {str(e)}"
    
    def _handle_product_listing_assistance(self, user_message):
        """Stateless, robust product listing chat flow. Infer step from message content, echo input, and advance one step per message."""
        msg = user_message.strip()
        msg_lower = msg.lower()
        image_exts = ('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.svg')

        # Step 1: Image upload
        if not msg or msg_lower in ['product listing assistance', 'list product', 'add product', 'new product', 'product addition']:
            return "To list a new product, please upload an image of the product."
        if msg_lower == 'uploaded' or msg_lower.endswith(image_exts):
            return f"Image received: {msg}\nWhat is the product name?"
        # Step 2: Product name
        if msg_lower.startswith('image received:') or msg_lower.startswith('image uploaded') or msg_lower.startswith('image:') or msg_lower.startswith('file:') or msg_lower.startswith('choose file'):
            # If the previous message was image upload, expect product name next
            return f"What is the product name?"
        if msg_lower.startswith('product name received:') or msg_lower.startswith('name:') or (msg and not msg_lower.startswith('category') and not msg_lower.startswith('price')):
            # If the previous message was product name, expect category next
            # Echo the product name
            name = msg.replace('product name received:', '').replace('name:', '').strip()
            return f"Product name received: {name}\nWhat is the product category?"
        # Step 3: Category
        if msg_lower.startswith('category received:') or msg_lower.startswith('category:'):
            # If the previous message was category, expect price next
            category = msg.replace('category received:', '').replace('category:', '').strip()
            return f"Category received: {category}\nWhat is the price of the product?"
        # Step 4: Price
        if msg_lower.startswith('price received:') or msg_lower.startswith('price:') or (msg and msg.replace('.', '', 1).isdigit()):
            # If the previous message was price, show confirmation
            price = msg.replace('price received:', '').replace('price:', '').strip()
            return f"Price received: {price}\nThis product has been listed. Will show up in your inventory dashboard in one hour."
        # Fallback
        return "Let's start by uploading an image of the product."
    
    def _get_default_response(self):
        """Get default response when intent is not recognized"""
        return """
SmartStock AI Assistant

I can help you with inventory health management and sales analysis. Here are some things you can ask me:

Inventory Analysis:
• "Show inventory health summary"
• "What are my most sold products?"
• "What are my least sold products?"
• "Show dead stock"
• "Show overstocked items"
• "Show understocked items"
• "Analyze by category"

Sales Analysis:
• "Generate sales report"
• "Show last year sales"
• "Annual sales report"
• "Sales performance analysis"

Reports:
• "Generate PDF report" (Inventory Health)
• "Create inventory health report"
• "Generate sales report" (Sales Analysis)

Recommendations:
• "Give me recommendations"
• "What should I do?"
""" 