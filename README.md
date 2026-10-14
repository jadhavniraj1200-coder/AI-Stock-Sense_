# Swad Restaurant – Smart Inventory & Food Waste Management System

A modern, clean, bright, and fully functional web application designed for restaurant owners and head chefs to solve the problems of **overstocking, ingredient spoilage, expired products, and lost sales due to stockouts**.

---

## 🌟 Key Features

1. **Gravy-Brown & Warm Cream Design System**:
   - Bright, clean, premium restaurant aesthetic with warm tones (`#5C2C16`, `#85411D`, `#FAF6F0`, `#FFFFFF`).
   - Clean typography with rounded cards, subtle shadows, and generous spacing.
   - Smooth viewport reveal animations with blur-to-clear transitions.

2. **Real-time Live Statistics**:
   - Live KPI cards tracking Total Products, In Stock Items, Low-Stock Warnings, Expired Products, Near Expiry Items, and Recorded Food Waste Losses in Indian Rupees (₹).

3. **Interactive Menu with Food Photography & Fallbacks**:
   - Filter by categories: All Dishes, Starters, Main Course, Breads, Beverages, Desserts.
   - Live search by dish name or ingredient.
   - One-click **"Mark Available / Mark Unavailable"** toggle reflecting real-time kitchen status.
   - High-definition culinary food photography with seamless local SVG fallbacks for complete offline reliability.

4. **Chef Swad AI – Waste Calculator & Inventory Bot (New Dedicated Section)**:
   - Dedicated conversational AI section (`#ai-bot`) connected directly to live restaurant inventory and waste records.
   - **Intelligent Food Waste Calculator**: Computes exact financial loss in ₹ given any quantity and ingredient (e.g. *"Calculate waste for 5 kg spoiled tomatoes"* or *"3 L milk spoiled"*).
   - **One-Click Waste Logging**: Direct action buttons inside the AI chat allowing kitchen managers to record computed waste into the official register instantly.
   - **Surplus Culinary Recommendations**: Chef recommendations for dishes (e.g. Makhani gravy master base, homemade paneer, garlic croutons) to utilize near-expiry ingredients before they spoil.
   - **Live Inventory Queries**: Answers questions regarding low stock, expired ingredients, and weekly waste totals.
   - Interactive quick-prompt suggestion chips and typing animation.

5. **Dynamic Inventory Dashboard**:
   - Searchable, category-filtered, and status-filtered ingredient table.
   - Quick **`+` / `−` quantity adjustments** directly in the table with immediate recalculation.
   - Add new ingredient modal with input validation (checks negative values, required fields, and valid dates).
   - Edit ingredient details and delete with confirmation dialog.
   - Automated stock status calculation: *In Stock*, *Low Stock*, *Near Expiry*, and *Expired*.
   - **CSV Export**: Export live inventory reports with one click.

5. **Waste Products Tracking**:
   - Dedicated incident log for wasted food and ingredients.
   - Categorized by root causes: Overstocking, Spoilage, Unsold Food, Improper Storage, Prep Spill.
   - Automatic calculation of cumulative kg wasted and total financial loss in ₹.
   - Filter by waste reason.

6. **Expired & Near-Expiry Protection**:
   - Automated countdown tracking expiration dates.
   - Filters for *Expired*, *Expiring in 3 Days*, and *All Alerts*.
   - **"Mark Discarded" Workflow**: Automatically records the wasted batch into the Waste Log with financial loss, deducts remaining inventory to 0, and updates all statistics.
   - Strict culinary safety protocol banners.

7. **Smart Stock Recommendations**:
   - Intelligent rule-based engine simulating restaurant demand forecasting:
     - Urgent restock alerts calculating recommended reorder quantities.
     - Excess inventory warnings to pause orders and prevent cash lockup.
     - Imminent expiry chef specials recommendations to clear stock before loss occurs.

8. **Analytics & Financial Reports**:
   - Stock valuation distribution by ingredient category.
   - Loss breakdown by root cause.
   - Projected monthly cost savings calculator.

9. **Data Persistence & Demo Controls**:
   - Changes automatically persist in `localStorage`.
   - **"Reset Demo"** button in navbar to restore clean sample data anytime.

---

## 🚀 How to Run

### Method 1: Direct in Browser (Zero Install Required)
Simply double click or open `index.html` in any web browser (Google Chrome, Microsoft Edge, Firefox, Safari):
```
file:///d:/antigravity/aiml hackathon/index.html
```

### Method 2: Local Web Server (PowerShell)
Run the bundled lightweight server:
```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```
Then visit **`http://localhost:3000/`** in your browser.

---

## 📂 Project Architecture

```
d:/antigravity/aiml hackathon/
├── index.html                  # Main SPA layout with all sections and modals
├── css/
│   ├── main.css                # Gravy brown & cream theme, typography, blur-to-clear animations
│   └── components.css          # Tables, cards, modals, charts, badges, and responsive layouts
├── js/
│   ├── data.js                 # Realistic seed data (inventory, menu dishes, waste logs)
│   ├── state.js                # LocalStorage management, status calculations, intelligence engine
│   ├── ui.js                   # DOM renderers, SVG analytics charts, toasts, and CSV export
│   └── app.js                  # Event listeners, form validations, search/filter, and scroll spy
├── assets/                     # Custom gourmet food SVG illustrations
│   ├── hero_food.svg
│   ├── paneer_butter_masala.svg
│   ├── veg_biryani.svg
│   ├── masala_dosa.svg
│   ├── butter_naan.svg
│   ├── dal_tadka.svg
│   ├── veg_thali.svg
│   ├── paneer_pakora.svg
│   ├── kulcha.svg
│   ├── mango_lassi.svg
│   └── gulab_jamun.svg
├── serve.ps1                   # Zero-dependency local HTTP server
└── README.md                   # Documentation and user guide
```
