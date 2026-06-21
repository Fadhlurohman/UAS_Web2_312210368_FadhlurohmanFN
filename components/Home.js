/**
 * components/Home.js
 * HomePage Component — Public Read-Only Inventory Dashboard (Visitor/Owner View)
 * Requires: Vue, Vue Router, Axios, Tailwind CSS
 */
const HomePage = {
    name: 'HomePage',
    template: `
        <div class="w-full max-w-[1200px] mx-auto px-6 flex flex-col gap-8 z-10 relative animate-fade-in py-8">

            <!-- HEADER / NAVBAR -->
            <header class="flex justify-between items-center py-3.5 px-7 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-[10px] flex items-center justify-center font-bold text-white text-lg shadow-[0_4px_10px_rgba(99,102,241,0.4)]">E</div>
                    <span class="text-xl font-bold tracking-tight bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">E-Inventory</span>
                    <div class="w-px h-[18px] bg-white/[0.08] mx-1"></div>
                    <span class="text-[13px] text-slate-400 font-medium hidden lg:block font-sans">Monitoring Stok Real-Time (Visitor View)</span>
                </div>
                <router-link
                    to="/login"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all font-sans no-underline inline-block"
                >
                    Login Admin
                </router-link>
            </header>

            <!-- WELCOME OWNER HEADER -->
            <div class="text-left space-y-2">
                <span class="text-[10px] font-bold uppercase tracking-[1.5px] text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 inline-block">Public Dashboard</span>
                <h1 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">Katalog Inventaris Real-Time</h1>
                <p class="text-sm text-slate-400 max-w-[750px]">Pantau ketersediaan barang gudang, penyebaran kategori produk, serta log transaksi keluar masuk terbaru secara langsung tanpa memerlukan login.</p>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-16 text-center">
                <svg class="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <p class="text-slate-400 text-sm font-medium">Sinkronisasi data inventaris...</p>
            </div>

            <div v-else class="space-y-8">
                <!-- Live Stats Summary -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <!-- Total Jenis Barang -->
                    <div class="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
                        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Jenis Barang</span>
                        <div class="flex items-baseline justify-between mt-3">
                            <h2 class="text-2xl font-extrabold text-white">{{ items.length }}</h2>
                            <i class="fas fa-box text-indigo-400 text-sm opacity-80"></i>
                        </div>
                    </div>

                    <!-- Total Stok Unit -->
                    <div class="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
                        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Stok Unit</span>
                        <div class="flex items-baseline justify-between mt-3">
                            <h2 class="text-2xl font-extrabold text-emerald-400">{{ totalStock }}</h2>
                            <i class="fas fa-cubes text-emerald-400 text-sm opacity-80"></i>
                        </div>
                    </div>

                    <!-- Kategori Aktif -->
                    <div class="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
                        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kategori Aktif</span>
                        <div class="flex items-baseline justify-between mt-3">
                            <h2 class="text-2xl font-extrabold text-purple-400">{{ categories.length }}</h2>
                            <i class="fas fa-tags text-purple-400 text-sm opacity-80"></i>
                        </div>
                    </div>

                    <!-- Supplier Rekanan -->
                    <div class="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
                        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Supplier Rekanan</span>
                        <div class="flex items-baseline justify-between mt-3">
                            <h2 class="text-2xl font-extrabold text-amber-400">{{ suppliers.length }}</h2>
                            <i class="fas fa-truck text-amber-400 text-sm opacity-80"></i>
                        </div>
                    </div>
                </div>

                <!-- Search & Filters Controls -->
                <div class="flex flex-col sm:flex-row gap-4 bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl items-center justify-between">
                    <!-- Search Input -->
                    <div class="relative w-full sm:w-80">
                        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Cari barang..."
                            class="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/[0.08] rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-white placeholder-slate-400 transition-all font-sans"
                        >
                    </div>
                    <!-- Category Filter -->
                    <div class="flex items-center gap-2 w-full sm:w-auto">
                        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Filter Kategori:</span>
                        <select
                            v-model="selectedCategory"
                            class="w-full sm:w-48 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all bg-slate-900 font-sans"
                        >
                            <option value="">Semua Kategori</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                {{ cat.name }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Product Catalog Grid -->
                <div>
                    <div v-if="paginatedItems.length > 0" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div
                                v-for="item in paginatedItems"
                                :key="item.id"
                                class="bg-white/[0.03] border rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group relative"
                                :class="item.stock <= 5 ? 'border-rose-500/30 hover:border-rose-500/50 hover:shadow-[0_10px_25px_rgba(239,68,68,0.08)]' : 'border-white/[0.08] hover:border-indigo-500/40 hover:shadow-[0_10px_25px_rgba(99,102,241,0.08)]'"
                            >
                                <div class="space-y-4 text-left">
                                    <!-- Tags header -->
                                    <div class="flex flex-wrap gap-1.5">
                                        <span class="px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                                            {{ item.category_name }}
                                        </span>
                                        <span class="px-2.5 py-0.5 rounded-lg bg-purple-500/10 text-purple-400 text-[10px] font-bold border border-purple-500/20">
                                            {{ item.supplier_name }}
                                        </span>
                                    </div>

                                    <!-- Title -->
                                    <div>
                                        <h3 class="font-bold text-white text-lg leading-snug group-hover:text-indigo-400 transition-colors">{{ item.item_name }}</h3>
                                        <span class="text-[9px] font-bold text-slate-500 uppercase font-mono">ID #{{ item.id }}</span>
                                    </div>

                                    <!-- Progress bar / stock level indicator -->
                                    <div class="space-y-1.5 pt-2">
                                        <div class="flex justify-between items-center text-xs">
                                            <span class="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Stok Unit</span>
                                            <span class="font-mono font-bold" :class="item.stock <= 5 ? 'text-rose-400' : 'text-slate-200'">
                                                {{ item.stock }}
                                            </span>
                                        </div>
                                        <div class="w-full bg-white/[0.06] rounded-full h-2 overflow-hidden">
                                            <div
                                                class="h-full rounded-full transition-all"
                                                :class="item.stock <= 5 ? 'bg-rose-500' : 'bg-emerald-500'"
                                                :style="{ width: Math.min((item.stock / 50) * 100, 100) + '%' }"
                                            ></div>
                                        </div>
                                        <div v-if="item.stock <= 5" class="flex items-center gap-1 text-[10px] text-rose-400 font-bold">
                                            <i class="fas fa-exclamation-triangle"></i> Persediaan Menipis!
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Pagination Controls -->
                        <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 pt-2">
                            <button
                                @click="currentPage > 1 ? currentPage-- : null"
                                :disabled="currentPage === 1"
                                class="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:bg-white/10 hover:border-indigo-500/50 hover:text-indigo-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/[0.08] disabled:hover:text-slate-300 transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                            >
                                <i class="fas fa-chevron-left text-xs"></i>
                            </button>
                            <span class="text-xs font-semibold text-slate-400 font-sans tracking-wide">
                                Halaman <span class="text-indigo-400 font-mono">{{ currentPage }}</span> dari <span class="text-white font-mono">{{ totalPages }}</span>
                            </span>
                            <button
                                @click="currentPage < totalPages ? currentPage++ : null"
                                :disabled="currentPage === totalPages"
                                class="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:bg-white/10 hover:border-indigo-500/50 hover:text-indigo-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/[0.08] disabled:hover:text-slate-300 transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                            >
                                <i class="fas fa-chevron-right text-xs"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Catalog Empty State -->
                    <div v-else class="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-16 text-center">
                        <i class="fas fa-box-open text-4xl text-slate-600 mb-4 block"></i>
                        <p class="text-slate-400 font-medium">Barang tidak ditemukan.</p>
                        <p class="text-slate-500 text-xs mt-1">Coba sesuaikan pencarian kata kunci atau filter kategori Anda.</p>
                    </div>
                </div>

                <!-- Two-Column Section: Real Activities and Category Distribution Chart -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Live activity feed (Left 2 columns) -->
                    <div class="lg:col-span-2 bg-white/[0.03] border border-white/[0.08] p-6 rounded-2xl space-y-4 text-left">
                        <div class="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                            <div class="w-9 h-9 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                <i class="fas fa-tasks text-sm"></i>
                            </div>
                            <div>
                                <h3 class="text-base font-bold text-white leading-none">Mutasi Stok Terbaru</h3>
                                <p class="text-xs text-slate-400 mt-1">5 transaksi aliran stok masuk & keluar live terakhir</p>
                            </div>
                        </div>

                        <!-- Live Activities List -->
                        <div 
                            ref="timelineContainer"
                            @mouseenter="hoverTimeline = true"
                            @mouseleave="hoverTimeline = false"
                            class="space-y-3.5 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar"
                        >
                            <div
                                v-for="act in recentActivities"
                                :key="act.id"
                                class="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] transition-colors"
                            >
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-10 h-10 rounded-xl flex items-center justify-center text-sm shadow-inner flex-shrink-0"
                                        :class="act.type === 'in'
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'"
                                    >
                                        <i :class="act.type === 'in' ? 'fas fa-arrow-down' : 'fas fa-arrow-up'"></i>
                                    </div>
                                    <div class="min-w-0">
                                        <h4 class="text-sm font-semibold text-slate-200 leading-snug truncate">
                                            {{ act.item_name }}
                                        </h4>
                                        <p class="text-xs text-slate-400 font-medium mt-0.5 truncate">
                                            {{ act.notes || 'Tanpa keterangan' }} &bull; {{ formatDate(act.created_at) }}
                                        </p>
                                    </div>
                                </div>
                                <div class="text-right flex-shrink-0 ml-2">
                                    <span
                                        class="font-mono font-extrabold text-sm"
                                        :class="act.type === 'in' ? 'text-emerald-400' : 'text-rose-400'"
                                    >
                                        {{ act.type === 'in' ? '+' : '-' }}{{ act.quantity }}
                                    </span>
                                </div>
                            </div>

                            <!-- Live Activity Empty State -->
                            <div v-if="recentActivities.length === 0" class="text-center py-10 text-slate-400 text-sm">
                                <i class="fas fa-history text-3xl text-slate-600 mb-2 block"></i>
                                Belum ada riwayat aktivitas transaksi.
                            </div>
                        </div>
                    </div>

                    <!-- Category Distribution Chart (Right 1 column) -->
                    <div class="bg-white/[0.03] border border-white/[0.08] p-6 rounded-2xl space-y-4 flex flex-col justify-between text-left">
                        <div>
                            <div class="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                                <div class="w-9 h-9 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 border border-purple-500/20">
                                    <i class="fas fa-chart-pie text-sm"></i>
                                </div>
                                <div>
                                    <h3 class="text-base font-bold text-white leading-none">Distribusi Kategori</h3>
                                    <p class="text-xs text-slate-400 mt-1">Persentase sebaran jenis barang</p>
                                </div>
                            </div>

                            <!-- Live Distribution Bars -->
                            <div 
                                ref="categoryContainer"
                                @mouseenter="hoverCategory = true"
                                @mouseleave="hoverCategory = false"
                                class="space-y-4 pt-4 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar"
                            >
                                <div v-for="stat in categoryStats" :key="stat.id" class="space-y-1.5">
                                    <div class="flex justify-between text-xs font-semibold">
                                        <span class="text-slate-300">{{ stat.name }}</span>
                                        <span class="text-slate-400">{{ stat.count }} items ({{ stat.percentage }}%)</span>
                                    </div>
                                    <div class="w-full bg-white/[0.06] rounded-full h-2 overflow-hidden">
                                        <div
                                            class="bg-indigo-500 h-full rounded-full transition-all duration-500"
                                            :style="{ width: stat.percentage + '%' }"
                                        ></div>
                                    </div>
                                </div>

                                <!-- Distribution Empty State -->
                                <div v-if="categoryStats.length === 0" class="text-center py-10 text-slate-500 text-sm">
                                    <i class="fas fa-chart-bar text-3xl text-slate-600 mb-2 block"></i>
                                    Tidak ada data kategori.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- FOOTER -->
            <footer class="mt-8 py-8 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 text-center md:text-left">
                <span class="font-semibold text-white">E-Inventory</span>
                <span>&copy; 2026 Sistem Manajemen Inventaris Pintar. Semua Hak Dilindungi.</span>
            </footer>
        </div>
    `,
     data() {
        return {
            items: [],
            categories: [],
            suppliers: [],
            recentActivities: [],
            searchQuery: '',
            selectedCategory: '',
            isLoading: false,
            currentPage: 1,
            itemsPerPage: 6,
            hoverTimeline: false,
            hoverCategory: false,
            timelineDelay: 0,
            categoryDelay: 0,
            scrollInterval: null
        };
    },
    watch: {
        searchQuery() {
            this.currentPage = 1;
        },
        selectedCategory() {
            this.currentPage = 1;
        }
    },
    computed: {
        totalStock() {
            return this.items.reduce((sum, item) => sum + (parseInt(item.stock) || 0), 0);
        },
        filteredItems() {
            return this.items.filter(item => {
                const matchSearch = item.item_name.toLowerCase().includes(this.searchQuery.toLowerCase());
                const matchCategory = !this.selectedCategory || item.category_id == this.selectedCategory;
                return matchSearch && matchCategory;
            });
        },
        totalPages() {
            return Math.ceil(this.filteredItems.length / this.itemsPerPage) || 1;
        },
        paginatedItems() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredItems.slice(start, end);
        },
        categoryStats() {
            const totalItems = this.items.length;
            if (totalItems === 0) return [];
            return this.categories.map(cat => {
                const count = this.items.filter(item => item.category_id == cat.id).length;
                const percentage = Math.round((count / totalItems) * 100) || 0;
                return {
                    id: cat.id,
                    name: cat.name,
                    count: count,
                    percentage: percentage
                };
            }).sort((a, b) => b.count - a.count);
        }
    },
    async mounted() {
        await this.loadAll();
        this.startScrollIntervals();
    },
    beforeUnmount() {
        this.stopScrollIntervals();
    },
    methods: {
        async loadAll() {
            this.isLoading = true;
            try {
                await Promise.all([
                    this.loadItems(),
                    this.loadCategories(),
                    this.loadSuppliers(),
                    this.loadRecentActivity()
                ]);
            } catch (err) {
                console.error('[Home] Failed to sync live inventory data:', err);
            } finally {
                this.isLoading = false;
            }
        },
        async loadItems() {
            const res = await axios.get('/items');
            this.items = res.data;
        },
        async loadCategories() {
            const res = await axios.get('/categories');
            this.categories = res.data;
        },
        async loadSuppliers() {
            const res = await axios.get('/suppliers');
            this.suppliers = res.data;
        },
        async loadRecentActivity() {
            const res = await axios.get('/stocks');
            this.recentActivities = res.data.slice(0, 10); // Ambil 10 agar bisa scroll
        },
        startScrollIntervals() {
            this.stopScrollIntervals();
            this.scrollInterval = setInterval(() => {
                // 1. Scroll Timeline
                const timelineEl = this.$refs.timelineContainer;
                if (timelineEl && !this.hoverTimeline && timelineEl.scrollHeight > timelineEl.clientHeight) {
                    if (this.timelineDelay > 0) {
                        this.timelineDelay--;
                    } else {
                        timelineEl.scrollTop += 1;
                        // Jika sampai di bawah
                        if (timelineEl.scrollTop + timelineEl.clientHeight >= timelineEl.scrollHeight - 1) {
                            this.timelineDelay = 40; // Tunda 2 detik
                            timelineEl.scrollTop = 0;
                        }
                    }
                }

                // 2. Scroll Kategori
                const catEl = this.$refs.categoryContainer;
                if (catEl && !this.hoverCategory && catEl.scrollHeight > catEl.clientHeight) {
                    if (this.categoryDelay > 0) {
                        this.categoryDelay--;
                    } else {
                        catEl.scrollTop += 1;
                        // Jika sampai di bawah
                        if (catEl.scrollTop + catEl.clientHeight >= catEl.scrollHeight - 1) {
                            this.categoryDelay = 40; // Tunda 2 detik
                            catEl.scrollTop = 0;
                        }
                    }
                }
            }, 50); // Kecepatan scroll halus
        },
        stopScrollIntervals() {
            if (this.scrollInterval) {
                clearInterval(this.scrollInterval);
                this.scrollInterval = null;
            }
        },
        formatDate(dateStr) {
            if (!dateStr) return '-';
            const dt = new Date(dateStr);
            return dt.toLocaleDateString('id-ID', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
};
