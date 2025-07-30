# AquaTrade - Fish Market Management System

A comprehensive, modern fish market management application built with React, TypeScript, and TailwindCSS. This frontend-only application provides a complete business management solution with beautiful Eastern-inspired UI/UX design.

## 🌟 Features

### Core Functionality
- **Dashboard** - Real-time analytics with charts and KPIs
- **Billing** - Invoice creation and management
- **Purchase Management** - Supplier purchase orders
- **Inventory Control** - Product stock management with low-stock alerts
- **Customer Management** - Complete customer database with CRUD operations
- **Party Management** - Supplier and distributor management
- **Sales Analytics** - Comprehensive sales reporting and summaries
- **Financial Tracking** - Receivables, collections, and statements

### Specialized Features
- **Fish Box Tracking** - Receive and send fish boxes to customers
- **Daily Collection Sheets** - Track daily sales and payments
- **Sales Register** - Detailed transaction records
- **Admin Panel** - System administration and data management

### Technical Features
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Local Storage Persistence** - Data persists between sessions
- **Modern UI/UX** - Clean, Eastern-inspired design with smooth animations
- **Real-time Updates** - Instant data synchronization across components
- **Export Functionality** - Export data and reports

## 🎨 Design Philosophy

The application features a beautiful Eastern-inspired color palette:
- **Primary Blue** (#3B82F6) - Trust and reliability
- **Sand Beige** (#F5F5DC) - Warmth and comfort  
- **Clay Red** (#CD853F) - Energy and action
- **Sage Green** (#9CAF88) - Growth and prosperity
- **Warm Grays** - Balance and sophistication

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aquatrade-fish-market
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📱 Application Structure

### Pages Overview
1. **Dashboard** (`/`) - Main analytics and overview
2. **Billing** (`/billing`) - Invoice management
3. **Purchase** (`/purchase`) - Purchase order management
4. **Inventory** (`/inventory`) - Product and stock management
5. **Salesman Receivable** (`/salesman-receivable`) - Outstanding payments
6. **Reports** (`/reports`) - Business analytics and insights
7. **Daily Collection** (`/daily-collection`) - Daily sales tracking
8. **Sales Register** (`/sales-register`) - Transaction records
9. **Sales Summary** (`/sales-summary`) - Sales analytics
10. **Statement** (`/statement`) - Customer account statements
11. **Fish Boxes Received** (`/fish-boxes-received`) - Incoming inventory
12. **Fish Boxes Sent** (`/fish-boxes-sent`) - Outgoing shipments
13. **Customer Management** (`/customers`) - Customer database
14. **Party Management** (`/parties`) - Supplier/distributor management
15. **Admin Panel** (`/admin`) - System administration

### Key Components
- **Header** - Navigation with responsive mobile menu
- **PageHeader** - Consistent page headers with actions
- **Modal** - Reusable modal component for forms
- **StatsCard** - Dashboard statistics display
- **DataContext** - Centralized state management

## 💾 Data Management

The application uses localStorage for data persistence with the following structure:

- `fishmarket_customers` - Customer data
- `fishmarket_parties` - Supplier/distributor data  
- `fishmarket_products` - Product inventory
- `fishmarket_sales` - Sales transactions
- `fishmarket_purchases` - Purchase orders
- `fishmarket_fishboxes` - Fish box tracking

### Sample Data
The application comes with sample data to demonstrate functionality:
- 2 sample customers
- 2 sample suppliers
- 3 sample products
- Realistic business scenarios

## 🔧 Customization

### Adding New Features
1. Create new page components in `src/pages/`
2. Add routes in `src/App.tsx`
3. Update navigation in `src/components/Header.tsx`
4. Extend data context in `src/context/DataContext.tsx`

### Styling
- Uses TailwindCSS for styling
- Custom color palette defined in design system
- Responsive breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)

### Icons
- Uses Lucide React for consistent iconography
- Easy to replace or extend icon set

## 📊 Business Logic

### Sales Flow
1. Create customer in Customer Management
2. Add products to Inventory
3. Create invoices in Billing
4. Track payments in Daily Collection
5. Monitor receivables in RCBL

### Purchase Flow
1. Add suppliers in Party Management
2. Create purchase orders in Purchase
3. Receive fish boxes in Fish Boxes Received
4. Update inventory automatically
5. Track supplier payments

### Reporting
- Real-time dashboard analytics
- Detailed sales and purchase reports
- Customer statements and summaries
- Export functionality for external analysis

## 🛠️ Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── context/            # React Context for state management
├── pages/              # Page components
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

### State Management
- Uses React Context API for global state
- Local component state for UI interactions
- localStorage for data persistence

### Performance Considerations
- Lazy loading for large datasets
- Optimized re-renders with React.memo
- Efficient data filtering and sorting
- Responsive image loading

## 🔒 Security Notes

This is a frontend-only application designed for demonstration purposes. For production use:

- Implement proper authentication
- Add input validation and sanitization
- Use HTTPS for all communications
- Implement proper error handling
- Add data backup strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React and TypeScript
- Styled with TailwindCSS
- Icons by Lucide React
- Charts by Recharts
- Inspired by modern fish market operations

---

**AquaTrade** - Streamlining fish market operations with modern technology and beautiful design.