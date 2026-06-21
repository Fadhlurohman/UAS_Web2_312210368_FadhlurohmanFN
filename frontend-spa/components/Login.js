/**
 * components/Login.js
 * Login Page Component — Axios POST + localStorage
 * Requires: axios (global), Vue Router ($router)
 */
const LoginPage = {
    name: 'LoginPage',
    template: `
        <div class="min-h-screen flex items-center justify-center py-12 px-4" style="background: radial-gradient(circle at 20% 20%, #1e1b4b 0%, #0f172a 40%, #020617 100%);">

            <!-- Ambient blob decorations -->
            <div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
                <div class="absolute -top-32 right-16 w-80 h-80 bg-indigo-600/25 rounded-full blur-3xl"></div>
                <div class="absolute bottom-16 left-10 w-72 h-72 bg-pink-600/20 rounded-full blur-3xl"></div>
            </div>

            <div class="relative w-full max-w-md z-10">
                <!-- Card -->
                <div class="bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-10 shadow-[0_25px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.07)]">

                    <!-- Header -->
                    <div class="text-center mb-8">
                        <div class="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold mx-auto mb-5 shadow-[0_8px_20px_rgba(99,102,241,0.5)]">E</div>
                        <h1 class="text-2xl font-bold text-white tracking-tight">Portal Administrator</h1>
                        <p class="text-slate-400 text-sm mt-1.5">Masuk untuk mengelola sistem E-Inventory</p>
                    </div>

                    <!-- Error Alert -->
                    <div v-if="error" class="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/25 rounded-xl flex items-start gap-3 text-red-400 text-sm">
                        <i class="fas fa-exclamation-circle flex-shrink-0 mt-0.5"></i>
                        <span>{{ error }}</span>
                    </div>

                    <!-- Login Form -->
                    <form @submit.prevent="login" class="space-y-5">
                        <!-- Username -->
                        <div>
                            <label for="login-username" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Username
                            </label>
                            <div class="relative">
                                <i class="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none"></i>
                                <input
                                    id="login-username"
                                    v-model="username"
                                    type="text"
                                    placeholder="Masukkan username"
                                    required
                                    autocomplete="username"
                                    :disabled="isLoading"
                                    class="w-full bg-white/[0.05] border border-white/[0.10] rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                            </div>
                        </div>

                        <!-- Password -->
                        <div>
                            <label for="login-password" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <div class="relative">
                                <i class="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none"></i>
                                <input
                                    id="login-password"
                                    v-model="password"
                                    type="password"
                                    placeholder="Masukkan password"
                                    required
                                    autocomplete="current-password"
                                    :disabled="isLoading"
                                    class="w-full bg-white/[0.05] border border-white/[0.10] rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                            </div>
                        </div>

                        <!-- Submit -->
                        <button
                            type="submit"
                            :disabled="isLoading"
                            class="w-full bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-[0_4px_14px_rgba(99,102,241,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(99,102,241,0.5)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                        >
                            <!-- Spinner -->
                            <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>{{ isLoading ? 'Memproses...' : 'Masuk ke Dashboard' }}</span>
                        </button>
                    </form>

                    <!-- Back to Public Dashboard Link -->
                    <div class="text-center mt-6 pt-4 border-t border-white/[0.06]">
                        <router-link
                            to="/"
                            class="text-xs text-slate-400 hover:text-indigo-400 transition-all font-semibold no-underline inline-flex items-center gap-2 group"
                        >
                            <i class="fas fa-arrow-left text-[10px] group-hover:-translate-x-1 transition-transform"></i> Kembali ke Dashboard Publik
                        </router-link>
                    </div>
                </div>

                <!-- Footer text -->
                <p class="text-center text-slate-600 text-xs mt-6">
                    &copy; 2026 E-Inventory &mdash; Sistem Manajemen Inventaris
                </p>
            </div>
        </div>
    `,

    data() {
        return {
            username: '',
            password: '',
            error: '',
            isLoading: false
        };
    },

    mounted() {
        // If already authenticated, redirect to dashboard
        if (localStorage.getItem('token')) {
            this.$router.push('/dashboard');
        }
    },

    methods: {
        async login() {
            if (this.isLoading) return;
            this.error = '';
            this.isLoading = true;

            try {
                const res = await axios.post('/login', {
                    username: this.username,
                    password: this.password
                });

                // Store credentials in localStorage
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('isLoggedIn', 'true');

                // Navigate to dashboard via Vue Router (no page reload)
                this.$router.push('/dashboard');

            } catch (err) {
                console.error('[Login] Error:', err);

                if (err.response && err.response.data) {
                    const data = err.response.data;
                    this.error = data.message
                        || (data.messages && data.messages.error)
                        || 'Login gagal. Periksa username dan password.';
                } else {
                    this.error = 'Koneksi ke server gagal. Pastikan API berjalan di port 8080.';
                }
            } finally {
                this.isLoading = false;
            }
        }
    }
};
