/**
 * router.js
 * Vue Router 4 Configuration:
 *   - Route definitions dengan meta: { requiresAuth: true } pada halaman admin
 *   - Navigation Guard (router.beforeEach) — proteksi rute dari pengguna yang belum login
 *
 * Harus di-load SETELAH komponen didefinisikan (Login.js, Dashboard.js, References.js, NotFound.js)
 */

const { createRouter, createWebHashHistory } = VueRouter;

// ── Route Definitions ────────────────────────────────────────────────────────
const routes = [
    // Halaman Beranda (Landing Page - Publik)
    {
        path: '/',
        component: HomePage,
        meta: { requiresAuth: false }
    },

    // Halaman Login (publik)
    {
        path: '/login',
        component: LoginPage,
        meta: { requiresAuth: false }
    },

    // Dashboard Items (PROTECTED — butuh token)
    {
        path: '/dashboard',
        component: DashboardPage,
        meta: { requiresAuth: true }
    },

    // Kategori (PROTECTED — butuh token)
    {
        path: '/categories',
        component: CategoriesPage,
        meta: { requiresAuth: true }
    },

    // Supplier (PROTECTED — butuh token)
    {
        path: '/suppliers',
        component: SuppliersPage,
        meta: { requiresAuth: true }
    },

    // Transaksi Stok (PROTECTED — butuh token)
    {
        path: '/stocks',
        component: StockTransactionsPage,
        meta: { requiresAuth: true }
    },

    // Laporan (PROTECTED — butuh token)
    {
        path: '/reports',
        component: ReportsPage,
        meta: { requiresAuth: true }
    },

    // Pengingat Stok (PROTECTED — butuh token)
    {
        path: '/alerts',
        component: AlertsPage,
        meta: { requiresAuth: true }
    },

    // Profil Admin (PROTECTED — butuh token)
    {
        path: '/profile',
        component: ProfilePage,
        meta: { requiresAuth: true }
    },

    // 404 Not Found — catch-all
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFoundPage
    }
];

// ── Create Router Instance ───────────────────────────────────────────────────
const router = createRouter({
    history: createWebHashHistory(), // Hash-based (tidak perlu server config)
    routes,
    scrollBehavior() {
        return { top: 0 }; // Scroll ke atas saat pindah halaman
    }
});

// ── Navigation Guard ─────────────────────────────────────────────────────────
// router.beforeEach mencegat SETIAP navigasi sebelum dilakukan
router.beforeEach((to, from, next) => {
    const isLoggedIn = !!localStorage.getItem('token');

    if (to.meta.requiresAuth && !isLoggedIn) {
        // ❌ Pengguna belum login mencoba akses halaman protected → lempar ke /login
        console.warn('[Router Guard] Akses ditolak: token tidak ditemukan. Redirect ke /login.');
        next('/login');

    } else if (to.path === '/login' && isLoggedIn) {
        // ✅ Pengguna sudah login mencoba akses /login → redirect ke /dashboard
        next('/dashboard');

    } else {
        // ✅ Lanjutkan navigasi
        next();
    }
});

// ── Expose router globally ───────────────────────────────────────────────────
// Diakses oleh axios-setup.js untuk redirect setelah 401
window.appRouter = router;
