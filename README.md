# UAS Web 2 - Sistem Manajemen Inventaris (E-Inventory)

## Deskripsi Proyek
Aplikasi ini merupakan sistem manajemen inventaris berbasis web yang dibangun menggunakan arsitektur decoupled (frontend dan backend terpisah). Backend menggunakan CodeIgniter 4 sebagai RESTful API server, sedangkan frontend menggunakan VueJS 3 SPA dengan TailwindCSS.

Sistem ini mengelola data barang, kategori, dan supplier dengan fitur autentikasi berbasis token (Bearer Token).

---

## Teknologi yang Digunakan

### Backend
- PHP 8+
- CodeIgniter 4
- MySQL / MariaDB
- RESTful API
- JWT-like Token Authentication (custom token)

### Frontend
- VueJS 3 (CDN)
- Axios
- TailwindCSS (CDN)
- SPA (Single Page Application)

---

## Fitur Aplikasi

### 1. Authentication
- Login menggunakan username & password
- Token disimpan di database
- Token disimpan di localStorage browser
- Proteksi akses menggunakan Bearer Token

### 2. Master Data (CRUD)
- Data Items (Barang)
  - Create item
  - Read item
  - Update item
  - Delete item

- Relasi data:
  - Categories
  - Suppliers

### 3. Dashboard Admin
- Sidebar navigation
- Statistik jumlah items
- Modal form untuk tambah/edit data
- Tabel data dinamis

### 4. Security
- Authorization Bearer Token
- AuthFilter pada CodeIgniter 4
- Proteksi endpoint POST, PUT, DELETE

---

## Struktur Database

### Users
- id
- username
- password
- token

### Categories
- id
- name

### Suppliers
- id
- name

### Items
- id
- category_id
- supplier_id
- item_name
- stock

---

## Struktur Folder Project
backend-api/
│
├── app/
│ ├── Controllers/
│ ├── Models/
│ ├── Filters/
│
├── public/
├── writable/
└── .env

frontend-spa/
│
├── index.html
├── dashboard.html
└── assets (optional)

---

## Cara Menjalankan Project

### Backend (CodeIgniter 4)
1. Jalankan XAMPP (Apache + MySQL)
2. Import database `db_inventory`
3. Jalankan server: http://localhost:8080

---

### Frontend (Vue SPA)
1. Buka file: frontend-spa/index.html
2. Login menggunakan: username: admin password: 123456
3. Setelah login akan diarahkan ke dashboard

---

## Endpoint API

### Authentication
- POST /login

### Items
- GET /items
- POST /items
- PUT /items/{id}
- DELETE /items/{id}

### Categories
- GET /categories

### Suppliers
- GET /suppliers

---

## Contoh Header Authorization
Authorization: Bearer <token>

---

## Screenshot yang Wajib Dilampirkan

- Halaman login
- Dashboard admin
- Tabel items
- Modal tambah/edit data
- Postman login (success)
- Postman request tanpa token (401 Unauthorized)
- Struktur database phpMyAdmin

---

## Link Demo
- http://localhost/frontend-spa/index.html

---

## Link Video Presentasi
- 

---

## Kesimpulan
Aplikasi ini berhasil mengimplementasikan arsitektur decoupled modern dengan backend REST API dan frontend SPA, serta menerapkan autentikasi berbasis token dan CRUD lengkap.