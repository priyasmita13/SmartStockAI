# SmartStock AI - Ecommerce Inventory Management Backend

A comprehensive Flask-based backend for ecommerce inventory health management with AI-powered analytics, chatbot functionality, and festival-based recommendations.

## 🏗️ **Clean Directory Structure**

```
smartStockAI/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── config.py              # Configuration settings
│   ├── run.py                 # Startup script
│   ├── test_backend.py        # API testing script
│   ├── services/
│   │   ├── inventory_health.py    # Inventory analysis logic
│   │   ├── pdf_generator.py       # PDF report generation
│   │   ├── chatbot.py            # Chatbot service
│   │   └── data_processor.py     # CSV data processing
│   ├── utils/
│   │   └── csv_connector.py      # CSV file connection utility
│   ├── data/
│   │   ├── Inventoryproducts(1).csv                    # Product inventory
│   │   ├── Seasonal_Sales_400_OrderedByMonth(1).csv   # Sales data
│   │   ├── Product_Trends_By_Month.csv                 # Trend analysis
│   │   └── Festival_Season_ClothingTags_Refined.csv    # Festival data
│   ├── uploads/                   # User uploaded files
│   ├── reports/                   # Generated PDF reports
│   └── templates/                 # PDF templates
├── frontend/                      # Frontend application
├── requirements.txt               # Python dependencies
└── README.md                     # This file
```

## 🚀 **Quick Start**

### 1. **Install Dependencies**
```bash
pip install -r requirements.txt
```

### 2. **Start the Backend**
```bash
cd backend
python run.py
```

### 3. **Test the System**
```bash
python test_backend.py
```

## 📊 **Data Sources**

The system processes 4 comprehensive CSV files:

### **1. Inventory Products** (`Inventoryproducts(1).csv`)
- Product details, stock levels, pricing
- Restock thresholds and status
- Last sold dates

### **2. Seasonal Sales** (`Seasonal_Sales_400_OrderedByMonth(1).csv`)
- Detailed sales records by month
- Product-wise sales quantities
- Sales date tracking

### **3. Product Trends** (`Product_Trends_By_Month.csv`)
- Monthly trend scores for each product
- Category-wise performance analysis
- Seasonal trend patterns

### **4. Festival Data** (`Festival_Season_ClothingTags_Refined.csv`)
- Festival-seasonal product mapping
- Product tags and categories
- Seasonal recommendations

## 🤖 **Chatbot Features**

### **Inventory Health Analysis**
- **Most Sold Products**: Top performers with trend scores
- **Least Sold Products**: Products needing attention
- **Dead Stock**: Items with stock but no sales (🔴 red alert)
- **Overstocked Items**: High stock, low sales (🟠 orange warning)
- **Understocked Items**: Low stock, high demand (🔴 red alert)
- **Last Week Sales**: Recent performance tracking

### **Festival Recommendations**
- Seasonal product recommendations
- Festival-specific inventory suggestions
- Trend-based forecasting

### **PDF Report Generation**
- Comprehensive inventory health reports
- Color-coded alerts and warnings
- Actionable recommendations
- Festival-based insights

## 📋 **API Endpoints**

### **Health Check**
```
GET /api/health
```

### **Inventory Health Analysis**
```
GET /api/inventory/health-analysis
```

### **Generate PDF Report**
```
POST /api/inventory/generate-pdf
Content-Type: application/json
Body: {"seller_id": "seller_123"}
```

### **Chatbot Query**
```
POST /api/chatbot/query
Content-Type: application/json
Body: {"message": "Show inventory health summary"}
```

### **Analytics Charts**
```
GET /api/inventory/analytics
```

### **Festival Recommendations**
```
GET /api/inventory/festival-recommendations
```

## 🤖 **Chatbot Prompts**

### **Analysis Prompts**
- "Show inventory health summary"
- "What are my most sold products?"
- "Which items are dead stock?"
- "Show overstocked items"
- "Show understocked items"
- "Analyze by category"

### **Report Prompts**
- "Generate PDF report"
- "Create inventory health report"
- "Download report"

### **Recommendation Prompts**
- "Give me recommendations"
- "What should I do?"
- "Show suggestions"

## 📊 **Inventory Health Metrics**

### **Health Indicators**
- **Most Sold Items**: Top performing products with trend scores
- **Least Sold Items**: Products with low sales performance
- **Dead Stock**: Items with stock but no sales (🔴 red alert)
- **Overstocked Items**: High stock-to-sales ratio (🟠 orange warning)
- **Understocked Items**: Low stock, high sales potential (🔴 red alert)
- **Last Week Sales**: Recent sales performance tracking
- **Category Analysis**: Performance by product category
- **Festival Recommendations**: Seasonal product suggestions

### **Health Score Calculation**
- **Excellent (80-100)**: Optimal inventory management
- **Good (60-79)**: Room for improvement
- **Needs Attention (0-59)**: Requires immediate action

### **Advanced Metrics**
- **Trend Scores**: Product popularity trends
- **Stock-to-Sales Ratio**: Inventory efficiency
- **Festival Mapping**: Seasonal demand patterns
- **Category Performance**: Category-wise analysis

## 🎨 **Color Coding in Reports**

- **🔴 Red**: Dead stock, understocked items, critical alerts
- **🟠 Orange**: Overstocked items, warnings
- **🟢 Green**: Good performance, recommendations

## 📄 **PDF Report Sections**

1. **Executive Summary**
   - Overall health score
   - Key metrics and statistics
   - Status indicators

2. **Top Performing Products**
   - Most sold items with trend scores
   - Stock levels and performance

3. **Dead Stock Alert**
   - Items with stock but no sales
   - Price information for liquidation decisions

4. **Overstocked Items**
   - High stock-to-sales ratio products
   - Recommendations for stock reduction

5. **Understocked Items**
   - Low stock, high demand products
   - Restock threshold information

6. **Last Week Sales Performance**
   - Recent sales data
   - Performance tracking

7. **Category Analysis**
   - Category-wise performance
   - Average prices and trends

8. **Festival Recommendations**
   - Seasonal product suggestions
   - Festival-specific inventory advice

9. **Actionable Recommendations**
   - Specific improvement suggestions
   - Strategic inventory management advice

## 🧪 **Testing**

### **Run All Tests**
```bash
python test_backend.py
```

### **Test Individual Components**
```bash
# Test health check
curl http://localhost:5000/api/health

# Test inventory analysis
curl http://localhost:5000/api/inventory/health-analysis

# Test chatbot
curl -X POST -H "Content-Type: application/json" \
  -d '{"message": "Show inventory health summary"}' \
  http://localhost:5000/api/chatbot/query

# Test festival recommendations
curl http://localhost:5000/api/inventory/festival-recommendations
```

## 🔄 **Workflow Example**

1. **Start the backend:**
   ```bash
   cd backend
   python run.py
   ```

2. **Test the system:**
   ```bash
   python test_backend.py
   ```

3. **Use the chatbot:**
   ```bash
   curl -X POST -H "Content-Type: application/json" \
     -d '{"message": "Show inventory health summary"}' \
     http://localhost:5000/api/chatbot/query
   ```

4. **Generate PDF report:**
   ```bash
   curl -X POST -H "Content-Type: application/json" \
     -d '{"seller_id": "my_store"}' \
     http://localhost:5000/api/inventory/generate-pdf
   ```

5. **Get festival recommendations:**
   ```bash
   curl http://localhost:5000/api/inventory/festival-recommendations
   ```

## 📈 **Advanced Features**

### **Data Processing**
- **Multi-CSV Integration**: Combines 4 different data sources
- **Real-time Analysis**: Processes current inventory and sales data
- **Trend Analysis**: Uses historical data for predictions
- **Festival Mapping**: Seasonal demand pattern recognition

### **Smart Analytics**
- **Health Scoring**: AI-powered inventory health assessment
- **Trend Prediction**: Product popularity forecasting
- **Category Analysis**: Category-wise performance insights
- **Seasonal Recommendations**: Festival-based inventory suggestions

### **Comprehensive Reporting**
- **Professional PDFs**: Detailed, color-coded reports
- **Multiple Sections**: Comprehensive analysis coverage
- **Actionable Insights**: Specific improvement recommendations
- **Visual Indicators**: Color-coded alerts and warnings

## 🛠️ **Troubleshooting**

### **Common Issues**

1. **"Failed to load inventory data files"**
   - Ensure all 4 CSV files are in the `backend/data/` directory
   - Check file names match exactly

2. **"No inventory data found"**
   - Verify CSV files are properly formatted
   - Check file permissions

3. **"Missing columns"**
   - Ensure CSV files have required columns
   - Use the provided sample files as templates

### **Getting Help**
```bash
# Check system status
curl http://localhost:5000/api/health

# Test data loading
python test_backend.py

# Check file structure
ls backend/data/
```

## 📈 **Features Summary**

- **📊 Comprehensive Inventory Analysis**: Multi-source data processing
- **🤖 Smart Chatbot**: Natural language inventory queries
- **📄 Professional PDF Reports**: Color-coded, detailed reports
- **📈 Advanced Analytics**: Trend analysis and predictions
- **🎯 Health Scoring**: AI-powered inventory assessment
- **🔍 Smart Detection**: Dead stock, overstocked, understocked alerts
- **🎉 Festival Recommendations**: Seasonal inventory suggestions
- **📊 Category Analysis**: Category-wise performance insights
- **📈 Trend Analysis**: Product popularity forecasting
- **🔄 Real-time Processing**: Current data analysis

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

For support and questions, please open an issue in the repository. 