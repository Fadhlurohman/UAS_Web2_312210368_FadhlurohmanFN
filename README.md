# UAS Pemrograman Web 2 - Sistem Manajemen Inventaris Pintar (E-Inventory)

- **Nama:** Fadhlurohman Fatikh Navintino
- **NIM:** 312210368
- **Mata Kuliah:** Pemrograman Web 2 (UAS)
- **Link Demo:** [http://uasweb2.infinityfree.io/](http://uasweb2.infinityfree.io/)
- **Link Video YouTube:** 

---

Aplikasi ini merupakan **Sistem Manajemen Inventaris (E-Inventory)** berbasis web modern yang dibangun dengan arsitektur decoupled (frontend dan backend terpisah). 

Aplikasi ini dirancang untuk melacak ketersediaan stok barang gudang, mengelompokkan kategori produk, melacak mitra supplier, merekam transaksi mutasi stok masuk & keluar secara real-time, serta mempermudah pesanan restock otomatis ke supplier melalui integrasi WhatsApp.

---

## 🛠️ Teknologi yang Digunakan

### Backend (RESTful API Server)
- **PHP 8.2+**
- **CodeIgniter 4** (sebagai penyedia RESTful API)
- **MySQL / MariaDB** (basis data relasional)
- **CORS & AuthFilter** (pengaman akses endpoint API)
- **Token-based Authentication** (Bearer Token Session)

### Frontend (SPA - Single Page Application)
- **VueJS 3 (via CDN)**
- **Vue Router 4 (via CDN)** (Hash-based history navigation)
- **Axios** (HTTP Client dengan request & response interceptor otomatis)
- **TailwindCSS (via CDN)** (styling antarmuka modern)
- **SweetAlert2** (notifikasi interaktif & estetik)
- **FontAwesome 6** (ikonografi)

---

## 🌟 Fitur Utama Aplikasi

### 1. Public Dashboard (Landing Page - Visitor/Owner View)
- **Live Counter Widgets**: Menampilkan total jenis barang, jumlah unit stok, kategori aktif, dan supplier rekanan.
- **Real-Time Catalog & Search**: Pencarian dan penyaringan barang berdasarkan kategori secara instan.
- **Stock Level Progress Bar**: Indikator tingkat stok visual dengan peringatan **"Persediaan Menipis!"** jika stok berada di bawah batas kritis (≤ 5 unit).
- **Auto-Scrolling Widgets**: Menampilkan 5 aktivitas transaksi terbaru dan grafik distribusi kategori yang bergulir otomatis (dapat dijeda saat kursor diarahkan ke widget).

### 2. Admin Portal & Authentication
- **Secure Portal**: Antarmuka login dengan desain glassmorphic premium.
- **Bearer Token Security**: Token autentikasi unik disimpan secara dinamis ke database dan `localStorage` browser.
- **Automatic Session Expiry Interceptor**: Apabila token tidak lagi valid (401 Unauthorized), sesi akan dibersihkan secara otomatis dan dialihkan kembali ke portal login.

### 3. Master Data Management (CRUD - Protected)
- **Dashboard Items (Barang)**: Tambah, edit, dan hapus data barang, lengkap dengan validasi relasi kategori & supplier.
- **Kategori**: Tambah, edit, dan hapus pengelompokan produk.
- **Supplier**: Mengelola informasi mitra pemasok, termasuk nomor telepon dan referensi kategori.

### 4. Transaksi Stok (Timeline & Activity Feed)
- Pencatatan transaksi aliran stok masuk (**Stock In**) dan keluar (**Stock Out**).
- **Interactive Timeline**: Desain mutasi stok bergaya linimasa yang dipisah berdasarkan warna indikator (hijau untuk masuk, merah untuk keluar).
- **Stock Protection**: Validasi otomatis yang memblokir transaksi keluar apabila jumlah unit melebihi stok fisik yang tersedia saat itu.

### 5. Analisis & Laporan (Print-Ready Layout)
- **Ratio Chart**: Visualisasi perbandingan rasio persentase kuantitas stok masuk vs stok keluar.
- **Top Active Goods**: Daftar barang dengan frekuensi mutasi tertinggi.
- **Printable Layout**: Fitur cetak fisik laporan inventaris yang secara otomatis merapikan tata letak, menyembunyikan navigasi sidebar, tombol, serta memunculkan seluruh data tabel penuh (no-pagination) saat proses cetak berjalan.

### 6. Pengingat Stok & Whatsapp Integration
- Deteksi otomatis barang dengan stok kritis (≤ 5 unit).
- Tombol **"Restock via WhatsApp"** yang secara otomatis memformat pesan draf berisi nama barang, sisa unit, nama supplier, dan membuka tautan chat langsung ke nomor WhatsApp supplier yang bersangkutan.

### 7. Profil Admin & Log Audit
- Menampilkan informasi Super Admin, detail koneksi (User Agent, Client IP, SSL Status).
- Form perubahan sandi administrator (simulasi).
- **Security Audit Logs**: Daftar rekaman log audit keamanan sesi aktif.

---

## 🗄️ Struktur Database (`db_inventory`)

### 1. `users` (Data Akun & Token Sesi)
- `id` (int, Primary Key, Auto Increment)
- `username` (varchar)
- `password` (varchar, MD5)
- `token` (varchar, Bearer Token)

### 2. `categories` (Data Kategori)
- `id` (int, Primary Key, Auto Increment)
- `name` (varchar)

### 3. `suppliers` (Data Supplier Partner)
- `id` (int, Primary Key, Auto Increment)
- `name` (varchar)
- `phone` (varchar)
- `category_id` (int)

### 4. `items` (Data Master Barang)
- `id` (int, Primary Key, Auto Increment)
- `category_id` (int)
- `supplier_id` (int)
- `item_name` (varchar)
- `stock` (int)

### 5. `stock_mutations` (Riwayat Aliran Transaksi Stok)
- `id` (int, Primary Key, Auto Increment)
- `item_id` (int)
- `type` (enum: `'in'`, `'out'`)
- `quantity` (int)
- `notes` (varchar)
- `created_at` (datetime)

---

## 📂 Struktur Folder Proyek

```text
UAS_Web2_312210368_FadhlurohmanFN/
│
├── backend-api/                  # RESTful API Server (CodeIgniter 4)
│   ├── app/
│   │   ├── Config/               # Konfigurasi aplikasi & Routes
│   │   ├── Controllers/          # Auth, Item, Category, Supplier, Stock
│   │   ├── Filters/              # AuthFilter (Bearer Token Validator)
│   │   └── Models/               # Model database CI4
│   ├── public/                   # Entry point index.php
│   └── .env                      # Environment settings (Database & BaseURL)
│
├── frontend-spa/                 # Single Page Application (VueJS 3 SPA)
│   ├── components/               # Komponen Modular Halaman Vue
│   │   ├── Home.js               # Halaman Publik Landing Page
│   │   ├── Login.js              # Halaman Login
│   │   ├── Dashboard.js          # CRUD Items
│   │   ├── Categories.js         # CRUD Kategori
│   │   ├── Suppliers.js          # CRUD Supplier
│   │   ├── StockTransactions.js  # Aliran Transaksi Stok & Timeline
│   │   ├── Reports.js            # Laporan & Cetak Fisik
│   │   ├── Alerts.js             # Deteksi Kritis & WhatsApp Order
│   │   ├── Profile.js            # Profil Admin & Security Logs
│   │   └── NotFound.js           # Penanganan Halaman 404
│   ├── index.html                # Main SPA Layout
│   ├── style.css                 # Custom Styling & Visual Ambient Blobs
│   ├── axios-setup.js            # Interceptors & Global BaseURL
│   └── router.js                 # Konfigurasi Vue Router & Navigation Guards
│
└── gambar/                       # Aset Gambar & Dokumentasi Screenshot
```

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Konfigurasi Backend (API Server)

#### A. Dijalankan Secara Lokal (Local Development)
1. Aktifkan modul **Apache** dan **MySQL** pada control panel XAMPP.
2. Buat database baru bernama `db_inventory` melalui phpMyAdmin, kemudian import file SQL database Anda.
3. Masuk ke dalam direktori `backend-api/` dan pastikan file `.env` sudah terkonfigurasi dengan benar:
   ```env
   database.default.hostname = localhost
   database.default.database = db_inventory
   database.default.username = root
   database.default.password = 
   database.default.DBDriver = MySQLi
   ```
4. Jalankan server lokal CodeIgniter 4 melalui Command Prompt:
   ```bash
   php spark serve
   ```
   *API server akan berjalan secara default di alamat:* `http://localhost:8080`

#### B. Dijalankan di Hosting Produksi (InfinityFree / Live Hosting)
Backend API didesain untuk mendeteksi lingkungan hosting secara otomatis pada file [Database.php](file:///c:/Fadhlurohman/UAS_Web2_312210368_FadhlurohmanFN/backend-api/app/Config/Database.php). Jika dijalankan di server luar (non-localhost), aplikasi akan otomatis menggunakan kredensial database hosting:
- **Hostname Database**: `sql109.infinityfree.com`
- **Nama Database**: `if0_42237580_einventory`
- **Username**: `if0_42237580`
- **Password**: *Password vPanel akun InfinityFree Anda*

### 2. Menjalankan Frontend (SPA)

#### A. Dijalankan Secara Lokal (Local Development)
1. Karena aplikasi ini merupakan Single Page Application murni menggunakan CDN, Anda cukup membuka file `frontend-spa/index.html` langsung pada peramban web (browser) Anda, atau menjalankannya melalui extension *Live Server* pada VS Code.
2. API Base URL akan otomatis terarah ke `http://localhost:8080` lewat deteksi hostname pada file [axios-setup.js](file:///c:/Fadhlurohman/UAS_Web2_312210368_FadhlurohmanFN/frontend-spa/axios-setup.js).

#### B. Dijalankan di Hosting Produksi (InfinityFree / Live Hosting)
1. Unggah seluruh isi folder `frontend-spa` ke direktori publik hosting (seperti `htdocs`).
2. API Base URL otomatis berubah mengarah ke path `/api` dari domain hosting (e.g. `http://uasweb2.infinityfree.io/api`) menggunakan pendeteksian otomatis di [axios-setup.js](file:///c:/Fadhlurohman/UAS_Web2_312210368_FadhlurohmanFN/frontend-spa/axios-setup.js).
3. Akses halaman login dengan mengklik tombol **Login Admin** di pojok kanan atas.
4. Gunakan kredensial default untuk masuk:
   - **Username**: `admin`
   - **Password**: `123456`
5. Setelah sukses terautentikasi, Anda akan otomatis dialihkan ke dalam Admin Panel Dashboard.

---

## 🔗 Endpoint API Utama

| Method | Endpoint | Deskripsi | Proteksi |
| :--- | :--- | :--- | :--- |
| **POST** | `/login` | Otentikasi admin & generate token sesi | Publik |
| **GET** | `/items` | Menampilkan seluruh katalog barang | Publik |
| **POST** | `/items` | Menambahkan data barang baru | Bearer Token |
| **PUT** | `/items/(:num)` | Memperbarui data barang berdasarkan ID | Bearer Token |
| **DELETE** | `/items/(:num)` | Menghapus data barang berdasarkan ID | Bearer Token |
| **GET** | `/categories` | Menampilkan seluruh kategori barang | Publik |
| **POST** | `/categories` | Menambahkan kategori baru | Bearer Token |
| **PUT** | `/categories/(:num)` | Memperbarui kategori berdasarkan ID | Bearer Token |
| **DELETE** | `/categories/(:num)` | Menghapus kategori berdasarkan ID | Bearer Token |
| **GET** | `/suppliers` | Menampilkan seluruh supplier rekanan | Publik |
| **POST** | `/suppliers` | Menambahkan supplier baru | Bearer Token |
| **PUT** | `/suppliers/(:num)` | Memperbarui supplier berdasarkan ID | Bearer Token |
| **DELETE** | `/suppliers/(:num)` | Menghapus supplier berdasarkan ID | Bearer Token |
| **GET** | `/stocks` | Menampilkan seluruh riwayat mutasi stok | Publik |
| **POST** | `/stocks` | Mencatat transaksi mutasi stok baru | Bearer Token |

---

## 📸 Dokumentasi & Screenshot Aplikasi

Di bawah ini adalah dokumentasi visual aplikasi yang dikelompokkan ke dalam beberapa bagian. Klik pada masing-masing bagian untuk menampilkan screenshot/gambar:

<details>
  <summary><b>🖥️ 1. Antarmuka Aplikasi (Dashboard Publik & Admin Panel)</b></summary>
  <br>
  
  #### Halaman Dashboard Publik (Katalog Live & Auto-Scrolling Feed)
  <img src="gambar/landing page.jpeg" alt="Public Dashboard">
  
  #### Panel Admin Dashboard (CRUD Data Master Items)
  <img src="gambar/admin panel.jpeg" alt="Admin Panel Items">
</details>

<details>
  <summary><b>📦 2. Manajemen Data Barang (Aktivitas CRUD)</b></summary>
  <br>
  
  #### Form Tambah Barang
  <img src="gambar/tambah item.jpeg" alt="Tambah Item">
  
  #### Form Edit Barang
  <img src="gambar/edit item.jpeg" alt="Edit Item">
  
  #### Konfirmasi Hapus Barang
  <img src="gambar/hapus item.jpeg" alt="Hapus Item">
</details>

<details>
  <summary><b>🔒 3. Pengujian API via Postman (Autentikasi & Keamanan)</b></summary>
  <br>
  
  #### Login RESTful API (Success)
  <img src="gambar/postman login.png" alt="Postman Login Success">
  
  #### Header Bearer Token Authorization
  <img src="gambar/Header Authorization.png" alt="Postman Header Token">
  
  #### Pengamanan Endpoint Terproteksi (401 Unauthorized)
  <img src="gambar/postman request tanpa token (401 Unauthorized).png" alt="401 Unauthorized">
</details>

<details>
  <summary><b>🗄️ 4. Struktur Database & Skema Relasi (ERD)</b></summary>
  <br>
  
  #### Struktur Database phpMyAdmin (`db_inventory`)
  <img src="gambar/struktur database.png" alt="Struktur Database">
  
  #### Skema Relasi Database (ERD)
  <img src="gambar/relasi erd.png" alt="Skema Relasi Database">
</details>