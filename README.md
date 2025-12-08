# 📦 Product Inventory Management

Full-Stack Application — React • Node.js • Express • SQLite

A complete inventory management platform featuring product CRUD operations, search, category filtering, inline editing, CSV import/export, and full inventory change history tracking.

Designed with a modern UI, optimized APIs, and smooth end-to-end workflows.

---

## 🚀 Features

### ✅ **Products Module**

* Add, edit, delete products
* Inline row editing
* Product table view with:

  * Image
  * Name, Unit, Category, Brand
  * Stock & Status (green = In Stock, red = Out of Stock)
  * Actions menu

### 🔍 **Search & Filtering**

* Search products by name
* Filter by category
* Real-time updates

### 📥 **CSV Import**

* Upload product CSV
* Auto-validation
* Prevent duplicate product names
* Response returns:

  * Added count
  * Skipped count
  * Duplicate list

### 📤 **CSV Export**

* Export full product list
* Clean, well-formatted CSV with headers

### 📘 **Inventory History Tracking**

* Track each stock change
* Logs include:

  * Old stock
  * New stock
  * Changed By
  * Timestamp
* Shown in a slide-in sidebar

---

## 🏗️ Tech Stack

### **Frontend**

* React
* Axios
* React Router
* Tailwind (optional UI helpers)

### **Backend**

* Node.js
* Express
* SQLite3
* Multer (CSV uploads)
* CSV-Parser
* Express Validator

---

## 📁 Project Structure

```
inventory-management/
│── backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── inventory.sqlite
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    └── build/
```

---

## 🔧 Installation & Setup (Local)

### 1️⃣ Clone Repo

```sh
git clone https://github.com/<your-username>/inventory-management.git
cd inventory-management
```

---

### 2️⃣ Backend Setup

```sh
cd backend
npm install
npm start   # or npm run dev
```

Backend runs on **[http://localhost:5000](http://localhost:5000)**

---

### 3️⃣ Frontend Setup

```sh
cd ../frontend
npm install
npm start
```

Frontend runs on **[http://localhost:3000](http://localhost:3000)**

---

## 🌐 Deployment

### **Backend Deployment (Render)**

* Build Command:

  ```
  cd backend && npm install
  ```
* Start Command:

  ```
  cd backend && npm start
  ```
* SQLite file included inside `backend/`

You’ll receive a backend URL like:

```
https://inventory-backend.onrender.com
```

---

### **Frontend Deployment (Netlify / Vercel)**

Add environment variable:

```
REACT_APP_API_BASE_URL = <your-render-backend-url>
```

Build command:

```
npm run build
```

Deploy the **frontend/build** folder.

---

## 🧪 API Endpoints (Backend)

### **Products**

| Method | Endpoint                     | Description      |
| ------ | ---------------------------- | ---------------- |
| GET    | `/api/products`              | Get all products |
| GET    | `/api/products/search?name=` | Search products  |
| POST   | `/api/products/import`       | Import CSV       |
| GET    | `/api/products/export`       | Export CSV       |
| PUT    | `/api/products/:id`          | Update product   |

### **Inventory History**

| Method | Endpoint                    | Description         |
| ------ | --------------------------- | ------------------- |
| GET    | `/api/products/:id/history` | Get product history |

---

## 📚 CSV Format

```
name,unit,category,brand,stock,status,image
```

---

## ✔️ Assignment Deliverables

* **Public GitHub Repo**
* **Backend Deployed on Render**
* **Frontend Deployed on Netlify/Vercel**
* **Search, Filter, Inline Editing**
* **CSV Import/Export**
* **Inventory History**
* **Live URLs Included**

---

## 🏁 Final Notes

This project fulfills all functional, UI, and architectural requirements for a full-stack inventory management application.

---


Just tell me — want the **README upgraded further**?
