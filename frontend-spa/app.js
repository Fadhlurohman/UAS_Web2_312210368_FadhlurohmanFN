/**
 * app.js
 * Root Vue Application:
 *   - Layout utama: Sidebar (admin panel) + <router-view>
 *   - Menyembunyikan sidebar saat di halaman Login
 *   - Tombol Logout: hapus localStorage, redirect ke /login
 *
 * Harus di-load TERAKHIR (setelah router.js dan semua komponen)
 */

const App = {
    name: 'App',
    template: `
        <div class="min-h-screen font-sans antialiased">

            <!-- ── AUTHENTICATED LAYOUT: Sidebar + Main Content ──────────────── -->
            <div v-if="isAuthRoute" class="flex h-screen overflow-hidden">
                
                <!-- SIDEBAR -->
                <aside class="w-64 bg-gray-900 text-white flex flex-col justify-between flex-shrink-0 shadow-2xl">
                
                    <!-- Top: Brand + Nav -->
                    <div>
                        <!-- Brand -->
                        <div class="flex items-center gap-3 p-5 border-b border-gray-800/60">
                            <div class="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg shadow-indigo-600/30">
                                E
                            </div>
                            <div>
                                <h2 class="text-sm font-bold text-white tracking-widest leading-none">E-INVENTORY</h2>
                                <p class="text-[11px] text-gray-500 mt-0.5 font-medium">Admin Panel</p>
                            </div>
                        </div>

                        <!-- Navigation Links -->
                        <nav class="p-3 mt-2 space-y-1">
                            <!-- Items -->
                            <router-link
                                to="/dashboard"
                                id="nav-dashboard"
                                class="flex items-center gap-3 w-full py-3 px-4 rounded-xl transition-all duration-200 font-medium text-sm no-underline"
                                :class="$route.path === '/dashboard'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
                            >
                                <i class="fas fa-box w-4 text-center"></i>
                                <span>Items</span>
                            </router-link>

                            <!-- Categories -->
                            <router-link
                                to="/categories"
                                id="nav-categories"
                                class="flex items-center gap-3 w-full py-3 px-4 rounded-xl transition-all duration-200 font-medium text-sm no-underline"
                                :class="$route.path === '/categories'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
                            >
                                <i class="fas fa-tags w-4 text-center"></i>
                                <span>Kategori</span>
                            </router-link>

                            <!-- Suppliers -->
                            <router-link
                                to="/suppliers"
                                id="nav-suppliers"
                                class="flex items-center gap-3 w-full py-3 px-4 rounded-xl transition-all duration-200 font-medium text-sm no-underline"
                                :class="$route.path === '/suppliers'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
                            >
                                <i class="fas fa-truck w-4 text-center"></i>
                                <span>Supplier</span>
                            </router-link>

                            <!-- Stock Transactions -->
                            <router-link
                                to="/stocks"
                                id="nav-stocks"
                                class="flex items-center gap-3 w-full py-3 px-4 rounded-xl transition-all duration-200 font-medium text-sm no-underline"
                                :class="$route.path === '/stocks'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
                            >
                                <i class="fas fa-exchange-alt w-4 text-center"></i>
                                <span>Transaksi Stok</span>
                            </router-link>

                            <!-- Reports -->
                            <router-link
                                to="/reports"
                                id="nav-reports"
                                class="flex items-center gap-3 w-full py-3 px-4 rounded-xl transition-all duration-200 font-medium text-sm no-underline"
                                :class="$route.path === '/reports'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
                            >
                                <i class="fas fa-chart-bar w-4 text-center"></i>
                                <span>Laporan</span>
                            </router-link>

                            <!-- Alerts -->
                            <router-link
                                to="/alerts"
                                id="nav-alerts"
                                class="flex items-center gap-3 w-full py-3 px-4 rounded-xl transition-all duration-200 font-medium text-sm no-underline"
                                :class="$route.path === '/alerts'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
                            >
                                <i class="fas fa-bell w-4 text-center"></i>
                                <span>Pengingat Stok</span>
                            </router-link>

                            <!-- Profile -->
                            <router-link
                                to="/profile"
                                id="nav-profile"
                                class="flex items-center gap-3 w-full py-3 px-4 rounded-xl transition-all duration-200 font-medium text-sm no-underline"
                                :class="$route.path === '/profile'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
                            >
                                <i class="fas fa-user-cog w-4 text-center"></i>
                                <span>Profil Admin</span>
                            </router-link>
                        </nav>
                    </div>

                    <!-- Bottom: Session Info + Logout -->
                    <div class="p-3 border-t border-gray-800/60">
                        <!-- Session Indicator -->
                        <div class="flex items-center gap-2.5 px-4 py-3 mb-1">
                            <div class="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0 shadow-sm shadow-emerald-400/50"></div>
                            <span class="text-xs text-gray-500 font-medium">Sesi Aktif</span>
                        </div>

                        <!-- Logout Button -->
                        <button
                            id="btn-logout"
                            @click="logout()"
                            class="flex items-center gap-3 w-full text-left py-3 px-4 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-all duration-200 font-medium text-sm border border-transparent hover:border-red-900/30"
                        >
                            <i class="fas fa-sign-out-alt w-4 text-center"></i>
                            <span>Keluar</span>
                        </button>
                    </div>
                </aside>

                <!-- MAIN CONTENT AREA -->
                <main class="flex-1 overflow-y-auto bg-gray-50">
                    <router-view></router-view>
                </main>
            </div>

            <!-- ── UNAUTHENTICATED LAYOUT: Full-page (Home / Login pages) ────── -->
            <router-view v-else></router-view>
        </div>
    `,

    computed: {
        /**
         * isAuthRoute
         * Mengecek apakah rute saat ini membutuhkan autentikasi (untuk render sidebar)
         */
        isAuthRoute() {
            void this.$route.path; // trigger computed update on route change
            return !!(this.$route.meta && this.$route.meta.requiresAuth);
        },
        /**
         * isAuthenticated
         * Mengecek apakah token tersimpan di localStorage.
         */
        isAuthenticated() {
            void this.$route.path;
            return !!localStorage.getItem('token');
        }
    },

    methods: {
        /**
         * logout()
         * Menghapus seluruh sesi dari localStorage dan redirect ke /login
         */
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            this.$router.push('/login');
        }
    }
};

// ── Mount Vue Application ─────────────────────────────────────────────────────
const app = Vue.createApp(App);
app.use(router); // Register Vue Router plugin
app.mount('#app');
