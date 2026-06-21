/**
 * components/Dashboard.js
 * Items Management Page — Premium Card UI with CRUD
 * Requires: axios (global, baseURL set), Vue Router ($router)
 */
const DashboardPage = {
    name: 'DashboardPage',
    template: `
        <div class="p-8 space-y-6 min-h-screen">

            <!-- Page Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Items</h1>
                    <p class="text-sm text-gray-500 mt-1">Kelola stok barang inventaris secara real-time</p>
                </div>
                <button
                    @click="openModal()"
                    id="btn-tambah-item"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all font-semibold flex items-center gap-2 text-sm"
                >
                    <i class="fas fa-plus text-xs"></i>
                    <span>Tambah Item</span>
                </button>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <!-- Total Jenis Barang -->
                <div class="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 border border-blue-400/30 p-6 rounded-2xl shadow-xl shadow-blue-500/20 text-white flex items-center justify-between">
                    <div>
                        <p class="text-xs font-semibold text-blue-100 uppercase tracking-wider">Total Jenis Barang</p>
                        <h2 class="text-3xl font-extrabold mt-2">{{ items.length }}</h2>
                    </div>
                    <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl backdrop-blur-md">
                        <i class="fas fa-box"></i>
                    </div>
                </div>

                <!-- Total Stok Unit -->
                <div class="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 border border-emerald-400/30 p-6 rounded-2xl shadow-xl shadow-emerald-500/20 text-white flex items-center justify-between">
                    <div>
                        <p class="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Total Stok Unit</p>
                        <h2 class="text-3xl font-extrabold mt-2">{{ totalStock }}</h2>
                    </div>
                    <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl backdrop-blur-md">
                        <i class="fas fa-cubes"></i>
                    </div>
                </div>

                <!-- Stok Menipis -->
                <div class="bg-gradient-to-br from-rose-500 via-rose-600 to-pink-600 border border-rose-400/30 p-6 rounded-2xl shadow-xl shadow-rose-500/20 text-white flex items-center justify-between">
                    <div>
                        <p class="text-xs font-semibold text-rose-100 uppercase tracking-wider">Stok Menipis</p>
                        <h2 class="text-3xl font-extrabold mt-2">{{ lowStockCount }}</h2>
                    </div>
                    <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl backdrop-blur-md">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                <svg class="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <p class="text-gray-400 text-sm font-medium">Memuat data barang...</p>
            </div>

            <!-- Search & Filter Controls -->
            <div v-if="!isLoading" class="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 items-center justify-between">
                <!-- Search Input -->
                <div class="relative w-full sm:w-80">
                    <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Cari nama barang..."
                        class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 transition-all bg-gray-50 focus:bg-white"
                    >
                </div>
                <!-- Category Filter -->
                <div class="flex items-center gap-2 w-full sm:w-auto">
                    <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Filter Kategori:</span>
                    <select
                        v-model="selectedCategory"
                        class="w-full sm:w-48 border border-gray-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all bg-white"
                    >
                        <option value="">Semua Kategori</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                            {{ cat.name }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Items Data Table -->
            <div v-if="!isLoading" class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50/75">
                            <tr>
                                <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">ID</th>
                                <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Nama Barang</th>
                                <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Kategori</th>
                                <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Supplier</th>
                                <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Stok</th>
                                <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Status</th>
                                <th scope="col" class="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-100">
                            <tr v-for="item in paginatedItems" :key="item.id" class="hover:bg-indigo-50/10 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-400">#{{ item.id }}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-bold text-gray-900 font-sans">{{ item.item_name }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                        {{ item.category_name }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-sans">
                                    {{ item.supplier_name }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-gray-800">
                                    {{ item.stock }} Unit
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span 
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                                        :class="item.stock <= 5 ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'"
                                    >
                                        <i class="fas" :class="item.stock <= 5 ? 'fa-exclamation-triangle mr-1.5' : 'fa-check-circle mr-1.5'"></i>
                                        {{ item.stock <= 5 ? 'Stok Menipis' : 'Stok Aman' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div class="flex items-center justify-end gap-2">
                                        <button
                                            @click="editItem(item)"
                                            class="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-center text-xs"
                                            title="Edit Barang"
                                        >
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button
                                            @click="deleteItem(item.id)"
                                            class="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center justify-center text-xs"
                                            title="Hapus Barang"
                                        >
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="filteredItems.length === 0">
                                <td colspan="7" class="px-6 py-12 text-center text-gray-400">
                                    <i class="fas fa-box-open text-3xl text-gray-200 mb-2 block"></i>
                                    <span class="font-medium text-sm">Tidak ada item ditemukan.</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Table Pagination -->
                <div v-if="totalPages > 1" class="bg-gray-50/75 border-t border-gray-100 px-6 py-4 flex items-center justify-between">
                    <span class="text-xs text-gray-500 font-sans">
                        Menampilkan Halaman <span class="font-semibold text-gray-800 font-mono">{{ currentPage }}</span> dari <span class="font-semibold text-gray-800 font-mono">{{ totalPages }}</span>
                    </span>
                    <div class="flex gap-2">
                        <button
                            @click="currentPage > 1 ? currentPage-- : null"
                            :disabled="currentPage === 1"
                            class="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                            Sebelumnya
                        </button>
                        <button
                            @click="currentPage < totalPages ? currentPage++ : null"
                            :disabled="currentPage === totalPages"
                            class="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                            Berikutnya
                        </button>
                    </div>
                </div>
            </div>

            <!-- Two Column Layout: Recent Activity & Distribution Chart -->
            <div v-if="!isLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Recent Activity -->
                <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <div class="flex items-center gap-3 border-b border-gray-100 pb-4">
                        <div class="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                            <i class="fas fa-tasks"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-gray-800 leading-none">Aktivitas Transaksi Terbaru</h3>
                            <p class="text-xs text-gray-400 mt-1">5 riwayat mutasi stok masuk & keluar terakhir</p>
                        </div>
                    </div>

                    <!-- List -->
                    <div class="space-y-3.5 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                        <div
                            v-for="act in recentActivities"
                            :key="act.id"
                            class="flex items-center justify-between p-3.5 rounded-xl border border-gray-50 bg-gray-50/40 hover:bg-gray-50 transition-colors"
                        >
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 rounded-xl flex items-center justify-center text-sm shadow-inner flex-shrink-0"
                                    :class="act.type === 'in'
                                        ? 'bg-emerald-50 text-emerald-500'
                                        : 'bg-rose-50 text-rose-500'"
                                >
                                    <i :class="act.type === 'in' ? 'fas fa-arrow-down' : 'fas fa-arrow-up'"></i>
                                </div>
                                <div class="min-w-0">
                                    <h4 class="text-sm font-semibold text-gray-800 leading-snug truncate">
                                        {{ act.item_name }}
                                    </h4>
                                    <p class="text-xs text-gray-400 font-medium mt-0.5 truncate">
                                        {{ act.notes || 'Tanpa keterangan' }} &bull; {{ formatDate(act.created_at) }}
                                    </p>
                                </div>
                            </div>
                            <div class="text-right flex-shrink-0 ml-2">
                                <span
                                    class="font-mono font-extrabold text-sm"
                                    :class="act.type === 'in' ? 'text-emerald-600' : 'text-rose-600'"
                                >
                                    {{ act.type === 'in' ? '+' : '-' }}{{ act.quantity }}
                                </span>
                            </div>
                        </div>

                        <!-- Empty state -->
                        <div v-if="recentActivities.length === 0" class="text-center py-10">
                            <i class="fas fa-history text-3xl text-gray-200 mb-2 block"></i>
                            <p class="text-gray-400 text-sm">Belum ada riwayat aktivitas transaksi.</p>
                        </div>
                    </div>
                </div>

                <!-- Distribution Chart -->
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 flex flex-col justify-between">
                    <div>
                        <div class="flex items-center gap-3 border-b border-gray-100 pb-4">
                            <div class="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
                                <i class="fas fa-chart-pie"></i>
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-gray-800 leading-none">Distribusi Kategori</h3>
                                <p class="text-xs text-gray-400 mt-1">Persentase sebaran jenis barang</p>
                            </div>
                        </div>

                        <!-- CSS Chart Bars -->
                        <div class="space-y-4 pt-4 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                            <div v-for="stat in categoryStats" :key="stat.id" class="space-y-1.5">
                                <div class="flex justify-between text-xs font-semibold">
                                    <span class="text-gray-600">{{ stat.name }}</span>
                                    <span class="text-gray-400">{{ stat.count }} items ({{ stat.percentage }}%)</span>
                                </div>
                                <div class="w-full bg-gray-100 rounded-full h-2 shadow-inner overflow-hidden">
                                    <div
                                        class="bg-indigo-600 h-full rounded-full transition-all duration-500"
                                        :style="{ width: stat.percentage + '%' }"
                                    ></div>
                                </div>
                            </div>

                            <!-- Empty state -->
                            <div v-if="categoryStats.length === 0" class="text-center py-10">
                                <i class="fas fa-chart-bar text-3xl text-gray-200 mb-2 block"></i>
                                <p class="text-gray-400 text-sm">Tidak ada data kategori.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ADD / EDIT MODAL -->
            <teleport to="body">
                <div
                    v-if="showModal"
                    id="modal-item"
                    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    @click.self="closeModal()"
                >
                    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
                        <!-- Modal Header -->
                        <div class="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 class="text-xl font-bold text-gray-900">
                                {{ form.id ? 'Edit Item' : 'Tambah Item Baru' }}
                            </h2>
                            <button
                                @click="closeModal()"
                                class="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
                            >
                                <i class="fas fa-times"></i>
                            </button>
                        </div>

                        <!-- Modal Body -->
                        <div class="p-6 space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Item</label>
                                <input
                                    v-model="form.item_name"
                                    placeholder="Masukkan nama item"
                                    class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                >
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Jumlah Stok</label>
                                <input
                                    v-model.number="form.stock"
                                    type="number"
                                    min="0"
                                    placeholder="Masukkan jumlah stok"
                                    class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                >
                            </div>
                             <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Kategori</label>
                                <select
                                    v-model="form.category_id"
                                    @change="form.supplier_id = ''"
                                    class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all bg-white"
                                >
                                    <option value="" disabled>Pilih Kategori</option>
                                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                        {{ cat.name }}
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Supplier</label>
                                <select
                                    v-model="form.supplier_id"
                                    :disabled="!form.category_id"
                                    class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="" disabled>
                                        {{ form.category_id ? 'Pilih Supplier' : 'Pilih Kategori Terlebih Dahulu' }}
                                    </option>
                                    <option v-for="sup in filteredSuppliers" :key="sup.id" :value="sup.id">
                                        {{ sup.name }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <!-- Modal Footer -->
                        <div class="flex justify-end gap-3 p-6 border-t border-gray-100">
                            <button
                                @click="closeModal()"
                                class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                @click="saveItem()"
                                :disabled="isSaving"
                                class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-600/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <svg v-if="isSaving" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
                            </button>
                        </div>
                    </div>
                </div>
            </teleport>

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
            isSaving: false,
            showModal: false,
            currentPage: 1,
            itemsPerPage: 10,
            form: {
                id: null,
                item_name: '',
                stock: '',
                category_id: '',
                supplier_id: ''
            }
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
        lowStockCount() {
            return this.items.filter(item => parseInt(item.stock) <= 5).length;
        },
        filteredSuppliers() {
            if (!this.form.category_id) return [];
            return this.suppliers.filter(sup => sup.category_id == this.form.category_id);
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

    mounted() {
        this.loadAll();
    },

    methods: {
        // Load all data concurrently
        async loadAll() {
            this.isLoading = true;
            try {
                await Promise.all([
                    this.loadItems(),
                    this.loadCategories(),
                    this.loadSuppliers(),
                    this.loadRecentActivity()
                ]);
            } finally {
                this.isLoading = false;
            }
        },

        // ── ITEMS ──────────────────────────────────────────────────────────────
        async loadItems() {
            const res = await axios.get('/items');
            this.items = res.data;
        },

        openModal() {
            this.form = { id: null, item_name: '', stock: '', category_id: '', supplier_id: '' };
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
        },

        editItem(item) {
            this.form = { ...item };
            this.showModal = true;
        },

        async saveItem() {
            if (!this.form.item_name || this.form.stock === '') {
                Swal.fire({
                    title: 'Peringatan',
                    text: 'Nama item dan stok tidak boleh kosong.',
                    icon: 'warning',
                    confirmButtonColor: '#4f46e5'
                });
                return;
            }
            this.isSaving = true;
            try {
                if (this.form.id) {
                    await axios.put('/items/' + this.form.id, this.form);
                } else {
                    await axios.post('/items', this.form);
                }
                this.closeModal();
                await this.loadItems();
                await this.loadRecentActivity();
                Swal.fire({
                    title: 'Berhasil',
                    text: 'Data item berhasil disimpan.',
                    icon: 'success',
                    confirmButtonColor: '#10b981'
                });
            } catch (err) {
                console.error('[Dashboard] Failed to save item:', err);
                Swal.fire({
                    title: 'Gagal',
                    text: 'Gagal menyimpan data item. Silakan coba lagi.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            } finally {
                this.isSaving = false;
            }
        },

        async deleteItem(id) {
            Swal.fire({
                title: 'Hapus Barang?',
                text: 'Apakah Anda yakin ingin menghapus barang ini?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.delete('/items/' + id);
                        await this.loadItems();
                        await this.loadRecentActivity();
                        Swal.fire({
                            title: 'Terhapus!',
                            text: 'Barang berhasil dihapus.',
                            icon: 'success',
                            confirmButtonColor: '#10b981'
                        });
                    } catch (err) {
                        console.error('[Dashboard] Failed to delete item:', err);
                        const msg = err.response && err.response.data
                            ? (err.response.data.message || (err.response.data.messages && err.response.data.messages.error) || 'Gagal menghapus barang.')
                            : 'Gagal menghapus barang.';
                        Swal.fire({
                            title: 'Gagal',
                            text: msg,
                            icon: 'error',
                            confirmButtonColor: '#ef4444'
                        });
                    }
                }
            });
        },

        // ── CATEGORIES (for dropdowns) ─────────────────────────────────────────
        async loadCategories() {
            const res = await axios.get('/categories');
            this.categories = res.data;
        },

        // ── SUPPLIERS (for dropdowns) ──────────────────────────────────────────
        async loadSuppliers() {
            const res = await axios.get('/suppliers');
            this.suppliers = res.data;
        },

        // ── RECENT ACTIVITY ────────────────────────────────────────────────────
        async loadRecentActivity() {
            try {
                const res = await axios.get('/stocks');
                this.recentActivities = res.data.slice(0, 5);
            } catch (err) {
                console.error('[Dashboard] Failed to load recent activities:', err);
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
