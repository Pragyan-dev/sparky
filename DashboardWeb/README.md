# 🌐 Store Manager Dashboard - Next.js Web App

A beautiful, responsive web application for retail store managers to monitor empty shelves, track popular products, and dispatch employees.

## ✨ Features

- **Dashboard Overview** - Real-time statistics and quick actions
- **Empty Shelf Alerts** - Priority-based alert system with employee dispatch
- **Popular Products** - Product analytics with depletion rates
- **Employee Management** - Staff availability and task tracking
- **Demo Mode** - Floating button to trigger notifications during presentations

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd dashboard-web
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Open in Browser

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Demo Usage

### Trigger a Demo Notification

1. Click the red **"DEMO"** button in the bottom-right corner
2. Enter an aisle location (e.g., "Aisle 7")
3. Enter a product name (e.g., "Milk")
4. Click "Trigger Alert"
5. A notification will appear - click "OK" to navigate to alerts

### Navigate the Dashboard

- **View Alerts** - Click on stat cards or quick action buttons
- **Dispatch Employee** - Click "Dispatch Employee" on any alert
- **Mark Resolved** - After dispatching, mark alerts as complete
- **Go Back** - Use the "← Back" button to return to dashboard

## 📁 Project Structure

```
dashboard-web/
├── app/
│   ├── layout.js          # Root layout
│   └── page.js            # Main entry point
├── components/
│   ├── Dashboard.js       # Main dashboard screen
│   ├── EmptyShelfAlerts.js # Alert management
│   ├── PopularProducts.js  # Analytics screen
│   ├── EmployeeDispatch.js # Staff management
│   └── DemoTrigger.js     # Demo button
├── services/
│   └── dataService.js     # Mock data & APIs
├── styles/
│   └── globals.css        # Global styles
├── package.json
└── next.config.js
```

## 🎨 Features Breakdown

### Dashboard
- 4 clickable stat cards
- Quick action buttons  
- Urgent alert banner
- Responsive grid layout

### Empty Shelf Alerts
- Color-coded priority (Red/Orange/Green)
- Timestamp display
- Employee dispatch modal
- Alert resolution tracking

### Popular Products
- Depletion rate visualization
- Stock status badges
- Progress bars
- Category labels

### Employee Management
- Available vs busy staff
- Current task assignments
- Status indicators
- Help information

## 💡 Technology Stack

- **Next.js 14** - React framework
- **React 18** - UI library
- **CSS Modules** - Scoped styling
- **JavaScript** - Programming language

## 🎬 Perfect for Presentations

- ✅ No mobile device needed
- ✅ Runs in any browser
- ✅ Full-screen mode ready
- ✅ Professional UI
- ✅ Easy demo triggers
- ✅ Smooth animations

## 🔧 Build for Production

```bash
npm run build
npm start
```

## 📱 Responsive Design

Works perfectly on:
- Desktop browsers
- Tablets
- Mobile phones
- Large displays

## 🎁 No Backend Required

All data is mocked in `services/dataService.js`. Perfect for demos and presentations!

---

**Built with Next.js & React** 💙
