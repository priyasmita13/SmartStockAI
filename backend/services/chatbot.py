import json
import os
from datetime import datetime
from services.inventory_health import InventoryHealthAnalyzer
from services.pdf_generator import InventoryPDFGenerator
from services.sales_pdf_generator import SalesPDFGenerator
from config import Config
from services.forecasting_service import ForecastingService
import re
from deep_translator import GoogleTranslator

def localize_number(number, lang):
    # Only localize for Hindi and Bengali, else return as string
    if lang == 'hi':
        # Hindi numerals
        hindi_digits = '०१२३४५६७८९'
        return ''.join(hindi_digits[int(d)] if d.isdigit() else d for d in str(number))
    elif lang == 'bn':
        # Bengali numerals
        bengali_digits = '০১২৩৪৫৬৭৮৯'
        return ''.join(bengali_digits[int(d)] if d.isdigit() else d for d in str(number))
    else:
        return str(number)

def is_garbled_hindi(translated):
    # Heuristic: if too many Latin chars or too short, it's likely garbled
    non_native = sum(1 for c in translated if c in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    if non_native > len(translated) // 2 or len(translated) < 10:
        return True
    return False

def sanitize_for_translation(line):
    # Replace 'Rs.' and 'PDF' with Hindi equivalents
    line = re.sub(r'Rs\.?', 'रुपये', line)
    line = re.sub(r'PDF', 'पीडीएफ', line)
    return line

def should_translate_line(line):
    # Skip translation for lines that are mostly numbers, whitespace, or technical terms
    stripped = line.strip()
    # If line is empty, skip
    if not stripped:
        return False
    # If line is only digits, punctuation, or whitespace, skip
    if re.fullmatch(r'[\d\s,.:;\-–—]+', stripped):
        return False
    # If line contains 'Rs.', 'PDF', 'Download', or is mostly digits, skip
    if 'Rs.' in line or 'PDF' in line or 'Download' in line:
        return False
    # If more than half the characters are digits, skip
    digit_count = sum(1 for c in line if c.isdigit())
    if digit_count > len(line) // 2:
        return False
    return True

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
            'boost_profit': [
                'make more profit',
                'boost profit',
                'increase profit',
                'profit suggestions',
                'profit tips'
            ],
        }
    
    def process_message(self, user_message, lang='en'):
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
            response = f"Weekly & Monthly Sales Report PDF Generated!\nDownload: `{pdf_filename}`\n\nThe report includes:\n• Weekly sales (past year, product-wise)\n• Monthly sales (past year, product-wise)\n\nYou can download the PDF from the reports folder."
            # Localize numbers in the response
            response = re.sub(r'\d+', lambda m: localize_number(m.group(), lang), response)
            # Translate response if needed
            if lang != 'en':
                try:
                    response = GoogleTranslator(source='en', target=lang).translate(response)
                except Exception:
                    pass
            return response

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
                if intent == 'boost_profit':
                    # Use a session or message-based offset for rotation; fallback to random for now
                    return self._get_boost_profit_suggestions(user_message)
                response = self._handle_intent(intent, user_message, lang=lang)
                # Localize numbers in the response
                response = re.sub(r'\d+', lambda m: localize_number(m.group(), lang), response)
                # Translate response if needed
                if lang != 'en':
                    try:
                        response = GoogleTranslator(source='en', target=lang).translate(response)
                    except Exception:
                        pass
                return response
        # Default response
        response = self._get_default_response()
        # Localize numbers in the response
        response = re.sub(r'\d+', lambda m: localize_number(m.group(), lang), response)
        # Translate response if needed
        if lang != 'en':
            try:
                response = GoogleTranslator(source='en', target=lang).translate(response)
            except Exception:
                pass
        return response
    
    def _handle_intent(self, intent, user_message, lang='en'):
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
                response = self._generate_pdf_report(user_message)
                # Localize numbers in the response
                response = re.sub(r'\d+', lambda m: localize_number(m.group(), lang), response)
                # Translate response if needed
                if lang != 'en':
                    try:
                        response = GoogleTranslator(source='en', target=lang).translate(response)
                    except Exception:
                        pass
                return response
            
            elif intent == 'sales_report':
                seller_id = 'default_seller'
                summary = self._get_sales_report_summary()
                pdf_path = self.sales_pdf_generator.generate_sales_report_pdf(seller_id)
                pdf_filename = os.path.basename(pdf_path)
                response = f"{summary}\n\nPDF Report Generated!\nDownload: `{pdf_filename}`"
                return response
            
            elif intent == 'most_sold':
                response = self._get_most_sold_items()
                # Localize numbers in the response
                response = re.sub(r'\d+', lambda m: localize_number(m.group(), lang), response)
                # Translate response if needed
                if lang != 'en':
                    try:
                        response = GoogleTranslator(source='en', target=lang).translate(response)
                    except Exception:
                        pass
                return response
            
            elif intent == 'least_sold':
                response = self._get_least_sold_items()
                # Localize numbers in the response
                response = re.sub(r'\d+', lambda m: localize_number(m.group(), lang), response)
                # Translate response if needed
                if lang != 'en':
                    try:
                        response = GoogleTranslator(source='en', target=lang).translate(response)
                    except Exception:
                        pass
                return response
            
            elif intent == 'dead_stock':
                response = self._get_dead_stock()
                # Localize numbers in the response
                response = re.sub(r'\d+', lambda m: localize_number(m.group(), lang), response)
                # Translate response if needed
                if lang != 'en':
                    try:
                        response = GoogleTranslator(source='en', target=lang).translate(response)
                    except Exception:
                        pass
                return response
            
            elif intent == 'overstocked':
                response = self._get_overstocked_items()
                # Localize numbers in the response
                response = re.sub(r'\d+', lambda m: localize_number(m.group(), lang), response)
                # Translate response if needed
                if lang != 'en':
                    try:
                        response = GoogleTranslator(source='en', target=lang).translate(response)
                    except Exception:
                        pass
                return response
            
            elif intent == 'understocked':
                response = self._get_understocked_items()
                # Localize numbers in the response
                response = re.sub(r'\d+', lambda m: localize_number(m.group(), lang), response)
                # Translate response if needed
                if lang != 'en':
                    try:
                        response = GoogleTranslator(source='en', target=lang).translate(response)
                    except Exception:
                        pass
                return response
            
            elif intent == 'category_analysis':
                response = self._get_category_analysis()
                # Localize numbers in the response
                response = re.sub(r'\d+', lambda m: localize_number(m.group(), lang), response)
                # Translate response if needed
                if lang != 'en':
                    try:
                        response = GoogleTranslator(source='en', target=lang).translate(response)
                    except Exception:
                        pass
                return response
            
            elif intent == 'recommendations':
                response = self._get_recommendations()
                # Localize numbers in the response
                response = re.sub(r'\d+', lambda m: localize_number(m.group(), lang), response)
                # Translate response if needed
                if lang != 'en':
                    try:
                        response = GoogleTranslator(source='en', target=lang).translate(response)
                    except Exception:
                        pass
                return response
            
            elif intent == 'restock_plan':
                response = self._get_restock_plan(test_month=None) # Default to None for now
                # Localize numbers in the response
                response = re.sub(r'\d+', lambda m: localize_number(m.group(), lang), response)
                # Translate response if needed
                if lang != 'en':
                    try:
                        response = GoogleTranslator(source='en', target=lang).translate(response)
                    except Exception:
                        pass
                return response
            
            elif intent == 'boost_profit':
                orig_response = self._get_boost_profit_suggestions(user_message)
                print(f"DEBUG: boost_profit original response: {orig_response}")
                response = re.sub(r'\d+', lambda m: localize_number(m.group(), lang), orig_response)
                print(f"DEBUG: boost_profit after number localization: {response}")
                if lang == 'hi':
                    try:
                        lines = response.split('\n')
                        translated_lines = []
                        for line in lines:
                            print(f"DEBUG: Hindi line before translation: {line}")
                            if line.strip() and should_translate_line(line):
                                sanitized = sanitize_for_translation(line)
                                try:
                                    translated_line = GoogleTranslator(source='en', target='hi').translate(sanitized)
                                    print(f"DEBUG: Hindi line after translation: {translated_line}")
                                    translated_lines.append(translated_line)
                                except Exception as e:
                                    print(f"DEBUG: Hindi line translation failed: {e}")
                                    translated_lines.append(line)
                            else:
                                print(f"DEBUG: Skipping translation for line: {line}")
                                translated_lines.append(line)
                        translated = '\n'.join(translated_lines)
                        print(f"DEBUG: boost_profit after line-by-line translation: {translated}")
                        if translated.strip() and not is_garbled_hindi(translated):
                            response = translated
                        else:
                            print("DEBUG: Hindi translation garbled or empty, using English fallback.")
                            response = orig_response + "\n\n[Hindi translation unavailable, showing English.]"
                    except Exception as e:
                        print(f"DEBUG: Hindi translation failed: {e}, using English fallback.")
                        response = orig_response + "\n\n[Hindi translation unavailable, showing English.]"
                elif lang != 'en':
                    try:
                        translated = GoogleTranslator(source='en', target=lang).translate(response)
                        print(f"DEBUG: boost_profit after translation: {translated}")
                        if translated.strip():
                            response = translated
                        else:
                            print("DEBUG: Translation returned empty string, using English fallback.")
                            response = orig_response
                    except Exception as e:
                        print(f"DEBUG: Translation failed: {e}, using English fallback.")
                        response = orig_response
                if not response.strip():
                    print("DEBUG: Final response is empty, using English fallback.")
                    response = orig_response
                return response
            else:
                response = self._get_default_response()
                # Localize numbers in the response
                response = re.sub(r'\d+', lambda m: localize_number(m.group(), lang), response)
                # Translate response if needed
                if lang != 'en':
                    try:
                        response = GoogleTranslator(source='en', target=lang).translate(response)
                    except Exception:
                        pass
                return response
                
        except Exception as e:
            import traceback
            traceback.print_exc()
            response = f"I encountered an error while processing your request: {str(e)}"
            # Localize numbers in the response
            response = re.sub(r'\d+', lambda m: localize_number(m.group(), lang), response)
            # Translate response if needed
            if lang != 'en':
                try:
                    response = GoogleTranslator(source='en', target=lang).translate(response)
                except Exception:
                    pass
            return response
    
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

        # Static variables to store last name and category
        if not hasattr(self, '_last_product_name'):
            self._last_product_name = None
        if not hasattr(self, '_last_product_category'):
            self._last_product_category = None

        # Step 1: Image upload
        if not msg or msg_lower in ['product listing assistance', 'list product', 'add product', 'new product', 'product addition']:
            return "To list a new product, please upload an image of the product."
        if msg_lower == 'uploaded' or msg_lower.endswith(image_exts):
            return f"Image received: {msg}\nWhat is the product name?"
        # Step 2: Product name
        if msg_lower.startswith('product name received:') or msg_lower.startswith('name:') or (msg and not msg_lower.startswith('category') and not msg_lower.startswith('price')):
            name = msg.replace('product name received:', '').replace('name:', '').strip()
            # Remove any leading 'name:' prefix again if present
            if name.lower().startswith('name:'):
                name = name[5:].strip()
            self._last_product_name = name
            return f"Product name received: {name}\nWhat is the product category?"
        # Step 3: Category
        if msg_lower.startswith('category received:') or msg_lower.startswith('category:'):
            category = msg.replace('category received:', '').replace('category:', '').strip()
            # Remove any leading 'category:' prefix again if present
            if category.lower().startswith('category:'):
                category = category[9:].strip()
            self._last_product_category = category
            return f"Category received: {category}\nWhat is the price of the product?"
        # Step 4: Price
        if msg_lower.startswith('price received:') or msg_lower.startswith('price:') or (msg and msg.replace('.', '', 1).isdigit()):
            price = msg.replace('price received:', '').replace('price:', '').replace('Price:', '').strip()
            name = self._last_product_name or ''
            category = self._last_product_category or ''
            # Remove 'name:' and 'category:' prefixes if present
            if name.lower().startswith('name:'):
                name = name[5:].strip()
            if category.lower().startswith('category:'):
                category = category[9:].strip()
            tags = []
            if name:
                tags.append(name.lower().replace(' ', '_'))
            if category:
                tags.append(category.lower().replace(' ', '_'))
            try:
                price_val = int(float(price))
                # Round up to nearest 10
                rounded_price = ((price_val + 9) // 10) * 10
                tags.append(f"under_rs._{rounded_price}")
            except:
                tags.append(f"under_rs._{price}")
            season = None
            lower_cat = category.lower()
            lower_name = name.lower()
            if any(s in lower_cat or s in lower_name for s in ['summer', 'cotton', 'kurti', 't-shirt', 'shorts', 'sleeveless']):
                season = 'summer'
            elif any(s in lower_cat or s in lower_name for s in ['winter', 'jacket', 'sweater', 'hoodie', 'wool', 'pullover']):
                season = 'winter'
            elif any(s in lower_cat or s in lower_name for s in ['rain', 'raincoat', 'umbrella']):
                season = 'rainy'
            elif any(s in lower_cat or s in lower_name for s in ['festive', 'diwali', 'eid', 'christmas', 'saree', 'lehenga']):
                season = 'festive'
            if season:
                tags.append(season)
            tags.append('fashion')
            tags.append('trending')
            tags.append('best_price')
            tag_str = ', '.join([f"#{t}" for t in tags if t])
            self._last_product_name = None
            self._last_product_category = None
            return f"Price received: {price}\nThis product has been listed. Will show up in your inventory dashboard in one hour.\n\nRelevant SEO tags have also been generated for your product:\n{tag_str}"
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

    def _get_boost_profit_suggestions(self, user_message):
        """Return 2 dynamic, actionable profit-boosting suggestions, rotating on each call. Bundles relevant products together."""
        import random
        analysis = self.inventory_pdf_generator.analyzer.analyze_inventory()
        dead_stock = analysis.get('dead_stock', [])
        overstocked = analysis.get('overstocked', [])
        category_analysis = analysis.get('category_analysis', [])
        suggestions = []
        # Suggestion 1: Discount slow/dead stock
        if dead_stock:
            ds = sorted(dead_stock, key=lambda x: x['stock_quantity'], reverse=True)
            for item in ds:
                suggestions.append(f"Discount '{item['name']}' ({item['category']}) by 20-30% to clear slow-moving stock and free up cash flow.")
        # Suggestion 2: Bundle slow/overstocked products with related fast-movers
        if overstocked and category_analysis:
            # Group overstocked by category
            cat_map = {}
            for item in overstocked:
                cat = item['category']
                if cat not in cat_map:
                    cat_map[cat] = []
                cat_map[cat].append(item)
            # For each category, suggest a bundle if possible
            for cat, items in cat_map.items():
                if len(items) >= 2:
                    names = ', '.join([i['name'] for i in items[:2]])
                    suggestions.append(f"Bundle {names} together as a combo offer in '{cat}' to boost sales and clear excess stock.")
        # Suggestion 3: Cross-category bundle (if not enough in one category)
        if overstocked and len(suggestions) < 4:
            over_names = [i['name'] for i in overstocked]
            if len(over_names) >= 2:
                suggestions.append(f"Create a combo offer: {over_names[0]} + {over_names[1]} at a special price to attract more buyers.")
        # Suggestion 4: Upsell with bestsellers
        most_sold = analysis.get('most_sold', [])
        if most_sold and overstocked:
            ms = most_sold[0]
            os = overstocked[0]
            suggestions.append(f"Offer '{os['name']}' at a discount with every purchase of bestseller '{ms['name']}' to increase average order value.")
        # Shuffle and rotate suggestions
        random.shuffle(suggestions)
        # Use a simple offset based on message hash for rotation (stateless)
        offset = abs(hash(user_message)) % max(1, len(suggestions)-1) if len(suggestions) > 2 else 0
        selected = suggestions[offset:offset+2]
        if not selected:
            selected = suggestions[:2]
        response = "Profit-Boosting Suggestions\n\n"
        for i, s in enumerate(selected, 1):
            response += f"{i}. {s}\n\n"
        response += "Want more suggestions? Click 'More suggestions'!"
        return response.strip() 