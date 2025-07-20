from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
import pandas as pd
import json
import os
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import seaborn as sns
from io import BytesIO
import base64
from services.inventory_health import InventoryHealthAnalyzer
from services.pdf_generator import InventoryPDFGenerator
from services.sales_pdf_generator import SalesPDFGenerator
from services.chatbot import ChatbotService
from services.forecasting_service import ForecastingService
from config import Config
from flask import url_for
import re
from werkzeug.exceptions import HTTPException

app = Flask(__name__)
CORS(app, origins=["https://smart-stock-ai-ivory.vercel.app"], supports_credentials=True, methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type"])

# Configure app
app.config['MAX_CONTENT_LENGTH'] = Config.MAX_CONTENT_LENGTH

# Initialize services
inventory_analyzer = InventoryHealthAnalyzer()
pdf_generator = InventoryPDFGenerator()
sales_pdf_generator = SalesPDFGenerator()
chatbot_service = ChatbotService()
forecasting_service = ForecastingService()

@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "Welcome to SmartStockAI backend! See /api/health for status."})

@app.errorhandler(Exception)
def handle_exception(e):
    import traceback
    traceback.print_exc()
    code = 500
    if isinstance(e, HTTPException):
        code = e.code
    return jsonify({"error": str(e)}), code

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "SmartStock AI Flask Backend is running"})

@app.route('/api/inventory/upload', methods=['POST'])
def upload_inventory_data():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not Config.allowed_file(file.filename):
            return jsonify({"error": "Please upload a CSV or JSON file"}), 400
        
        # Save uploaded file
        file_path = Config.UPLOADED_CSV_PATH
        file.save(file_path)
        
        return jsonify({
            "message": "File uploaded successfully", 
            "filename": file.filename,
            "path": str(file_path)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/inventory/health-analysis', methods=['GET'])
def get_inventory_health():
    try:
        analysis = inventory_analyzer.analyze_inventory()
        return jsonify(analysis)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/inventory/generate-pdf', methods=['POST'])
def generate_inventory_pdf():
    try:
        data = request.get_json()
        seller_id = data.get('seller_id', 'default_seller')
        
        # Generate PDF
        pdf_path = pdf_generator.generate_inventory_health_pdf(seller_id)
        
        return send_file(pdf_path, as_attachment=True, download_name=f"inventory_health_report_{seller_id}.pdf")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sales/generate-report', methods=['POST'])
def generate_sales_report():
    try:
        data = request.get_json()
        seller_id = data.get('seller_id', 'default_seller')
        
        # Generate Sales Report PDF
        pdf_path = sales_pdf_generator.generate_sales_report_pdf(seller_id)
        
        return send_file(pdf_path, as_attachment=True, download_name=f"sales_report_{seller_id}.pdf")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/chatbot/query', methods=['POST', 'OPTIONS'])
def chatbot_query():
    if request.method == 'OPTIONS':
        return '', 204
    data = request.get_json()
    user_message = data.get('message', '')
    lang = data.get('lang', 'en')
    print(f"DEBUG: Received chatbot query: message='{user_message}', lang='{lang}'")
    response = chatbot_service.process_message(user_message, lang=lang)
    # Extract PDF filename if present
    pdf_url = None
    if response:
        import re
        match = re.search(r'Download: `([^`]+)`', response)
        if match:
            pdf_url = f"/backend/reports/{match.group(1)}"
    print(f"DEBUG: chatbot_query response: {response}")
    print(f"DEBUG: chatbot_query pdf_url: {pdf_url}")
    return jsonify({'response': response, 'pdf_url': pdf_url})

@app.route('/api/inventory/analytics', methods=['GET'])
def get_inventory_analytics():
    try:
        # Generate analytics charts
        charts = inventory_analyzer.generate_analytics_charts()
        return jsonify(charts)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/inventory/festival-recommendations', methods=['GET'])
def get_festival_recommendations():
    try:
        analysis = inventory_analyzer.analyze_inventory()
        recommendations = analysis.get('festival_recommendations', [])
        return jsonify({"recommendations": recommendations})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sales/summary', methods=['GET'])
def get_sales_summary():
    try:
        from services.sales_report import SalesReportService
        sales_service = SalesReportService()
        summary = sales_service.generate_sales_summary()
        
        if summary:
            return jsonify(summary)
        else:
            return jsonify({"error": "No sales data available"}), 404
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Forecasting and Restock Planning Endpoints
@app.route('/api/forecast/generate-report', methods=['POST'])
def generate_forecast_report():
    """Generate comprehensive forecast report with restock planning"""
    try:
        data = request.get_json() or {}
        seller_name = data.get('seller_name', 'Default Seller')
        
        # Generate forecast report
        forecast_data = forecasting_service.generate_forecast_report()
        
        if 'error' in forecast_data:
            return jsonify(forecast_data), 500
        
        return jsonify(forecast_data)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/forecast/generate-pdf', methods=['POST'])
def generate_forecast_pdf():
    """Generate PDF report for forecasting and restock planning"""
    try:
        data = request.get_json() or {}
        seller_name = data.get('seller_name', 'Default Seller')
        # Generate forecast data
        restock_plan = forecasting_service.generate_restock_plan()
        if 'error' in restock_plan:
            return jsonify(restock_plan), 500
        # Generate PDF using previous FPDF/canvas-based implementation
        pdf_path = forecasting_service.generate_restock_plan_pdf(seller_name, restock_plan)
        if pdf_path:
            return send_file(pdf_path, as_attachment=True, download_name=f"restock_plan_report_{seller_name.replace(' ', '_')}.pdf")
        else:
            return jsonify({"error": "Failed to generate PDF"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/forecast/restock-plan', methods=['GET'])
def get_restock_plan():
    """Get restock plan based on forecasting analysis"""
    try:
        restock_plan = forecasting_service.generate_restock_plan()
        
        if not restock_plan:
            return jsonify({"error": "Failed to generate restock plan"}), 500
        
        return jsonify(restock_plan)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/forecast/new-products', methods=['GET'])
def get_new_product_recommendations():
    """Get new product recommendations based on festival/seasonal trends"""
    try:
        recommendations = forecasting_service.get_new_product_recommendations()
        return jsonify({"recommendations": recommendations})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/forecast/demand-analysis', methods=['GET'])
def get_demand_analysis():
    """Get historical demand analysis"""
    try:
        historical_demand = forecasting_service.analyze_historical_demand()
        festival_patterns = forecasting_service.analyze_festival_seasonal_patterns()
        demand_forecast = forecasting_service.forecast_upcoming_demand()
        
        analysis = {
            'historical_demand': historical_demand,
            'festival_patterns': festival_patterns,
            'demand_forecast': demand_forecast
        }
        
        return jsonify(analysis)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/backend/reports/<path:filename>')
def download_report(filename):
    reports_dir = os.path.join(os.path.dirname(__file__), 'reports')
    return send_from_directory(reports_dir, filename, as_attachment=True)

if __name__ == '__main__':
    # Create necessary directories
    Config.create_directories()
    
    app.run(debug=Config.DEBUG, host=Config.API_HOST, port=Config.API_PORT) 