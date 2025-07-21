# SmartStock AI - Complete Ecommerce Management Platform

A comprehensive full-stack ecommerce management platform featuring AI-powered inventory analytics, a modern seller dashboard, promotional campaigns, and intelligent business insights.

## 🏗️ **Project Structure**

```
SmartStockAI/
├── backend/                          # Flask Backend API
│   ├── app.py                        # Main Flask application
│   ├── config.py                     # Configuration settings
│   ├── run.py                        # Startup script
│   ├── test_backend.py               # API testing script
│   ├── test_data_processor.py        # Data processor tests
│   ├── test_pdf.py                   # PDF generation tests
│   ├── services/
│   │   ├── inventory_health.py       # Inventory analysis logic
│   │   ├── pdf_generator.py          # PDF report generation
│   │   ├── pdf_base.py               # Base PDF functionality
│   │   ├── sales_pdf_generator.py    # Sales report generation
│   │   ├── chatbot.py                # Chatbot service
│   │   ├── data_processor.py         # CSV data processing
│   │   └── forecasting_service.py    # AI forecasting
│   ├── utils/
│   │   └── csv_connector.py          # CSV file connection utility
│   ├── data/                         # Data files
│   │   ├── inventory_data.json       # Inventory data
│   │   ├── Inventoryproducts.csv     # Product inventory
│   │   ├── Inventoryproducts(1).csv  # Product inventory (backup)
│   │   ├── sample_inventory.csv      # Sample inventory data
│   │   ├── Seasonal_Sales_400_OrderedByMonth(1).csv  # Sales data
│   │   ├── Product_Trends_By_Month.csv               # Trend analysis
│   │   └── Festival_Season_ClothingTags_Refined.csv  # Festival data
│   ├── reports/                      # Generated PDF reports
│   ├── uploads/                      # User uploaded files
│   └── templates/                    # PDF templates
├── seller-dashboard/                 # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                      # Next.js 13+ App Router
│   │   │   ├── page.tsx              # Home page
│   │   │   ├── layout.tsx            # Root layout
│   │   │   ├── globals.css           # Global styles
│   │   │   ├── inventory/            # Inventory page
│   │   │   ├── orders/               # Orders page
│   │   │   ├── returns/              # Returns page
│   │   │   ├── advertisements/       # Advertisements page
│   │   │   ├── payments/             # Payments page
│   │   │   ├── add-catalogue/        # Add Catalogue page
│   │   │   └── promo/                # Promo page
│   │   ├── components/               # React components
│   │   │   ├── Header.jsx            # Dashboard header
│   │   │   ├── Sidebar.jsx           # Navigation sidebar
│   │   │   ├── SmartStockAI.jsx      # AI assistant modal
│   │   │   ├── LayoutWrapper.jsx     # Layout wrapper
│   │   │   ├── IntroExperience.jsx   # Welcome experience
│   │   │   ├── WelcomePopup.jsx      # Welcome popup
│   │   │   ├── FloatingElements.jsx  # Animated elements
│   │   │   ├── AnimatedHeader.jsx    # Animated header
│   │   │   ├── LanguageModal.jsx     # Language selector
│   │   │   ├── ProductCard.jsx       # Product display
│   │   │   ├── OrderCard.jsx         # Order display
│   │   │   └── StockChart.jsx        # Stock visualization
│   │   ├── pages/                    # Legacy pages (if any)
│   │   ├── router/                   # Routing configuration
│   │   ├── data/                     # Mock data
│   │   ├── assets/                   # Static assets
│   │   └── i18n.js                   # Internationalization
│   ├── public/                       # Static files
│   │   ├── AI.jpeg                   # AI logo
│   │   ├── meesho.jpeg               # Meesho logo
│   │   ├── meesho-banner2.jpg        # Promo banner 1
│   │   ├── meesho-banner3.jpg        # Promo banner 2
│   │   ├── meesho-banner3.webp       # WebP banner
│   │   ├── meesho-banner4.jpeg       # Banner 4
│   │   ├── meesho-banner4.webp       # WebP banner 4
│   │   ├── meesho-Imp.webp           # Important banner
│   │   └── [other product images]    # Product images
│   ├── package.json                  # Node.js dependencies
│   ├── next.config.ts                # Next.js configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   └── eslint.config.mjs             # ESLint configuration
├── requirements.txt                  # Python dependencies
├── package.json                      # Root package.json
├── schema.prisma                     # Database schema
└── README.md                         # This file
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ and npm
- Python 3.10.x
- Git

### **1. Clone and Setup**
```bash
git clone <repository-url>
cd SmartStockAI
```

### **2. Backend Setup**
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the Flask backend
cd backend
python run.py
```

### **3. Frontend Setup**
```bash
# Install Node.js dependencies
cd seller-dashboard
npm install

# Start the development server
npm run dev
```

### **4. Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🎯 **Key Features**

### **🤖 SmartStock AI Assistant**
- **AI-Powered Chatbot**: Intelligent business assistant
- **Inventory Health Analysis**: Real-time inventory insights
- **Sales Forecasting**: Predictive analytics
- **PDF Report Generation**: Comprehensive business reports
- **Multi-language Support**: English, Hindi, Bengali
- **Product Listing Assistance**: AI-guided product setup

### **📊 Seller Dashboard**
- **Modern UI/UX**: Beautiful, responsive design
- **Real-time Analytics**: Live business metrics
- **Order Management**: Complete order lifecycle
- **Inventory Tracking**: Stock level monitoring
- **Payment Processing**: Financial management
- **Returns Handling**: Customer service tools

### **📸 Add Catalogue**
- **Image Upload**: Drag-and-drop functionality
- **AI Image Enhancement**: Smart image optimization
- **SEO Assistance**: AI-generated product descriptions
- **Product Details**: Automated content generation
- **SmartStock AI Integration**: Seamless AI assistance

### **🎉 Promotional Campaigns**
- **Campaign Management**: Promotional tools
- **Banner Integration**: Visual marketing materials
- **Seasonal Campaigns**: Festival-specific promotions
- **Performance Tracking**: Campaign analytics

### **📈 Advanced Analytics**
- **Inventory Health Scoring**: 0-100 health metrics
- **Trend Analysis**: Product popularity tracking
- **Festival Recommendations**: Seasonal insights
- **Sales Forecasting**: Predictive modeling
- **Category Performance**: Detailed breakdowns

## 🎨 **UI/UX Features**

### **Design System**
- **Modern Aesthetics**: Clean, professional design
- **Responsive Layout**: Mobile-first approach
- **Smooth Animations**: Framer Motion integration
- **Dark/Light Themes**: Theme customization
- **Accessibility**: WCAG compliant

### **Interactive Elements**
- **Hover Effects**: Engaging user interactions
- **Loading States**: Smooth loading experiences
- **Toast Notifications**: User feedback
- **Modal Dialogs**: Focused interactions
- **Sidebar Navigation**: Collapsible menu

## 🌐 **Internationalization**

### **Supported Languages**
- **English (en)**: Primary language
- **Hindi (hi)**: हिन्दी
- **Bengali (bn)**: বাংলা

### **Translation Features**
- **Dynamic Language Switching**: Real-time language changes
- **Contextual Translations**: Context-aware translations
- **RTL Support**: Right-to-left language support

## 📊 **Data Sources**

### **Inventory Data**
- **Product Information**: Names, categories, prices
- **Stock Levels**: Current inventory quantities
- **Sales History**: Historical performance data
- **Trend Analysis**: Product popularity trends

### **Sales Analytics**
- **Monthly Sales**: Detailed monthly breakdowns
- **Category Performance**: Category-wise analysis
- **Seasonal Patterns**: Festival and seasonal data
- **Customer Insights**: Buyer behavior analysis

## 🔧 **API Endpoints**

### **Health & Status**
```
GET /api/health                    # System health check
```

### **Inventory Management**
```
GET /api/inventory/health-analysis     # Inventory health
POST /api/inventory/generate-pdf       # PDF report generation
GET /api/inventory/analytics           # Analytics data
GET /api/inventory/festival-recommendations  # Festival insights
```

### **AI Assistant**
```
POST /api/chatbot/query               # Chatbot interactions
```

### **File Management**
```
POST /api/upload                      # File uploads
GET /api/files/:filename              # File retrieval
```

## 🤖 **SmartStock AI Prompts**

### **Inventory Analysis**
- "Show inventory health summary"
- "What are my most sold products?"
- "Which items are dead stock?"
- "Show overstocked items"
- "Show understocked items"

### **Business Intelligence**
- "Generate sales report"
- "Create inventory health report"
- "Forecast product demand"
- "Give me recommendations"

### **Product Management**
- "Product listing assistance"
- "Help me add a new product"
- "Optimize my product descriptions"

## 📄 **Report Types**

### **Inventory Health Report**
- Overall health score (0-100)
- Top performing products
- Dead stock alerts
- Overstocked items
- Understocked items
- Category analysis

### **Sales Report**
- Monthly sales performance
- Product-wise breakdown
- Trend analysis
- Seasonal insights
- Growth metrics

### **Restock Plan**
- Automated restock recommendations
- Optimal order quantities
- Timing suggestions
- Cost analysis

## 🧪 **Testing**

### **Backend Testing**
```bash
cd backend
python test_backend.py
python test_data_processor.py
python test_pdf.py
```

### **Frontend Testing**
```bash
cd seller-dashboard
npm test
npm run lint
```

### **API Testing**
```bash
# Health check
curl http://localhost:5000/api/health

# Inventory analysis
curl http://localhost:5000/api/inventory/health-analysis

# Chatbot query
curl -X POST -H "Content-Type: application/json" \
  -d '{"message": "Show inventory health summary"}' \
  http://localhost:5000/api/chatbot/query
```

## 🔒 **Security Features**

- **Input Validation**: Comprehensive data validation
- **Error Handling**: Graceful error management
- **CORS Configuration**: Cross-origin resource sharing
- **File Upload Security**: Safe file handling
- **API Rate Limiting**: Request throttling

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### **Features**
- **Mobile-First**: Mobile-optimized design
- **Touch-Friendly**: Touch-optimized interactions
- **Adaptive Layout**: Flexible grid system
- **Performance Optimized**: Fast loading times

## 🚀 **Deployment**

### **Backend Deployment**
```bash
# Production setup
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### **Frontend Deployment**
```bash
# Build for production
npm run build

# Start production server
npm start
```

**SmartStock AI** - Empowering ecommerce businesses with intelligent inventory management and AI-driven insights. 
