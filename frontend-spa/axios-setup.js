/**
 * axios-setup.js
 * Global Axios Configuration:
 *   1. Base URL untuk semua request
 *   2. Request Interceptor — inject Bearer token otomatis dari localStorage
 *   3. Response Interceptor — tangkap 401 Unauthorized secara global
 *
 * Harus di-load SEBELUM router.js (agar window.appRouter tersedia saat interceptor berjalan)
 */

axios.defaults.baseURL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8080'
    : window.location.origin + '/api';

// ── 2. Request Interceptor ───────────────────────────────────────────────────
// Menyuntikkan Authorization header ke SETIAP request secara otomatis
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ── 3. Response Interceptor ──────────────────────────────────────────────────
// Menangkap error 401 Unauthorized secara global:
// → Hapus sesi, tampilkan alert, redirect ke halaman login
axios.interceptors.response.use(
    (response) => response, // pass-through untuk response sukses
    (error) => {
        if (error.response && error.response.status === 401) {
            // Bersihkan seluruh sesi dari localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');

            // Tampilkan notifikasi sesi habis
            alert('Sesi Anda telah berakhir. Silakan login kembali.');

            // Redirect ke halaman login via Vue Router (set sebagai global di router.js)
            if (window.appRouter) {
                window.appRouter.push('/login');
            }
        }
        return Promise.reject(error);
    }
);
