/**
 * components/StockTransactions.js
 * Stock In/Out Transactions — Timeline Activity Feed UI
 * Requires: axios (global), Swal (SweetAlert2)
 */
const StockTransactionsPage = {
    name: 'StockTransactionsPage',
    template: `
        <div class="p-8 space-y-6 min-h-screen">
            <!-- Page Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Transaksi Stok</h1>
                    <p class="text-sm text-gray-500 mt-1">Catat dan pantau aliran stok barang masuk dan keluar secara real-time</p>
                </div>
                <button
                    @click="openModal()"
                    id="btn-tambah-transaksi"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all font-semibold flex items-center gap-2 text-sm"
                >
                    <i class="fas fa-exchange-alt text-xs"></i>
                    <span>Catat Transaksi</span>
                </button>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <!-- Total Transaksi -->
                <div class="bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 border border-indigo-400/30 p-6 rounded-2xl shadow-xl shadow-indigo-500/20 text-white flex items-center justify-between">
                    <div>
                        <p class="text-xs font-semibold text-indigo-100 uppercase tracking-wider">Total Transaksi</p>
                        <h2 class="text-3xl font-extrabold mt-2">{{ mutations.length }}</h2>
                    </div>
                    <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl backdrop-blur-md">
                        <i class="fas fa-history"></i>
                    </div>
                </div>

                <!-- Total Stok Masuk -->
                <div class="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 border border-emerald-400/30 p-6 rounded-2xl shadow-xl shadow-emerald-500/20 text-white flex items-center justify-between">
                    <div>
                        <p class="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Total Stok Masuk</p>
                        <h2 class="text-3xl font-extrabold mt-2">+{{ totalIn }}</h2>
                    </div>
                    <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl backdrop-blur-md">
                        <i class="fas fa-arrow-down"></i>
                    </div>
                </div>

                <!-- Total Stok Keluar -->
                <div class="bg-gradient-to-br from-rose-500 via-rose-600 to-pink-600 border border-rose-400/30 p-6 rounded-2xl shadow-xl shadow-rose-500/20 text-white flex items-center justify-between">
                    <div>
                        <p class="text-xs font-semibold text-rose-100 uppercase tracking-wider">Total Stok Keluar</p>
                        <h2 class="text-3xl font-extrabold mt-2">-{{ totalOut }}</h2>
                    </div>
                    <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl backdrop-blur-md">
                        <i class="fas fa-arrow-up"></i>
                    </div>
                </div>
            </div>

            <!-- Filters & Search -->
            <div class="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <!-- Tabs Filter -->
                <div class="flex items-center bg-gray-100 p-1 rounded-xl flex-wrap">
                    <button
                        @click="currentFilter = 'all'"
                        class="px-4 py-2 rounded-lg text-xs font-bold transition-all"
                        :class="currentFilter === 'all' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'"
                    >
                        Semua
                    </button>
                    <button
                        @click="currentFilter = 'in'"
                        class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                        :class="currentFilter === 'in' ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-500 hover:text-emerald-600'"
                    >
                        <i class="fas fa-arrow-down text-[10px]"></i> Stok Masuk
                    </button>
                    <button
                        @click="currentFilter = 'out'"
                        class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                        :class="currentFilter === 'out' ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-500 hover:text-rose-600'"
                    >
                        <i class="fas fa-arrow-up text-[10px]"></i> Stok Keluar
                    </button>
                </div>

                <!-- Search Input -->
                <div class="relative w-full md:w-72">
                    <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <i class="fas fa-search text-sm"></i>
                    </span>
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Cari barang atau keterangan..."
                        class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    />
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                <svg class="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <p class="text-gray-400 text-sm font-medium">Memuat data transaksi stok...</p>
            </div>

            <!-- Vertical Timeline Feed -->
            <div v-else class="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div v-if="filteredMutations.length > 0" class="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar py-2">
                    <div class="relative pl-6 md:pl-8 border-l-2 border-gray-100 ml-4 space-y-6">
                        <div
                            v-for="mut in filteredMutations"
                            :key="mut.id"
                            class="relative group"
                        >
                            <!-- Timeline Indicator Bullet -->
                            <div
                                class="absolute -left-[35px] md:-left-[43px] top-1.5 w-7 h-7 md:w-8 md:h-8 rounded-full border-4 border-white flex items-center justify-center text-xs md:text-sm shadow-md transition-transform group-hover:scale-110"
                                :class="mut.type === 'in' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-rose-500/20'"
                            >
                                <i :class="mut.type === 'in' ? 'fas fa-arrow-down' : 'fas fa-arrow-up'"></i>
                            </div>

                            <!-- Card Content -->
                            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300">
                                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <div class="space-y-1">
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <h3 class="font-bold text-gray-800 text-base md:text-lg group-hover:text-indigo-600 transition-colors">
                                                {{ mut.item_name }}
                                            </h3>
                                            <span class="text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md font-mono">ID #{{ mut.id }}</span>
                                        </div>
                                        <p class="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                                            <i class="far fa-clock"></i>
                                            <span>{{ formatDate(mut.created_at) }}</span>
                                        </p>
                                    </div>

                                    <!-- Quantity Badge -->
                                    <div>
                                        <span
                                            class="font-mono font-extrabold text-sm md:text-base px-3 py-1.5 rounded-xl border flex items-center gap-1.5 shadow-sm"
                                            :class="mut.type === 'in'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : 'bg-rose-50 text-rose-700 border-rose-100'"
                                        >
                                            {{ mut.type === 'in' ? '+' : '-' }}{{ mut.quantity }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Transaction Note -->
                                <div v-if="mut.notes" class="mt-3 bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs md:text-sm text-gray-600 italic">
                                    <i class="far fa-comment-alt text-gray-400 mr-1.5 text-[10px] not-italic"></i>
                                    "{{ mut.notes }}"
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-16">
                    <i class="fas fa-exchange-alt text-4xl text-gray-200 mb-4 block"></i>
                    <p class="text-gray-400 font-medium">Tidak ada transaksi ditemukan.</p>
                    <p class="text-gray-300 text-xs mt-1">Coba ubah filter pencarian Anda atau catat transaksi baru.</p>
                </div>
            </div>

            <!-- ADD TRANSACTION MODAL -->
            <teleport to="body">
                <div
                    v-if="showModal"
                    id="modal-transaksi"
                    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    @click.self="closeModal()"
                >
                    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
                        <!-- Modal Header -->
                        <div class="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 class="text-xl font-bold text-gray-900">
                                Catat Transaksi Stok
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
                            <!-- Select Item -->
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Barang</label>
                                <select
                                    v-model="form.item_id"
                                    class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all bg-white"
                                >
                                    <option value="" disabled>Pilih Barang</option>
                                    <option v-for="item in items" :key="item.id" :value="item.id">
                                        {{ item.item_name }} (Stok: {{ item.stock }})
                                    </option>
                                </select>
                            </div>

                            <!-- Transaction Type -->
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Jenis Transaksi</label>
                                <div class="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        @click="form.type = 'in'"
                                        class="py-2.5 rounded-xl border font-semibold text-sm transition-all flex items-center justify-center gap-2"
                                        :class="form.type === 'in'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-500 ring-2 ring-emerald-500/20'
                                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'"
                                    >
                                        <i class="fas fa-arrow-down text-xs"></i>
                                        Stok Masuk
                                    </button>
                                    <button
                                        type="button"
                                        @click="form.type = 'out'"
                                        class="py-2.5 rounded-xl border font-semibold text-sm transition-all flex items-center justify-center gap-2"
                                        :class="form.type === 'out'
                                            ? 'bg-rose-50 text-rose-700 border-rose-500 ring-2 ring-rose-500/20'
                                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'"
                                    >
                                        <i class="fas fa-arrow-up text-xs"></i>
                                        Stok Keluar
                                    </button>
                                </div>
                            </div>

                            <!-- Quantity -->
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Jumlah</label>
                                <input
                                    v-model.number="form.quantity"
                                    type="number"
                                    min="1"
                                    placeholder="Masukkan jumlah barang"
                                    class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                >
                            </div>

                            <!-- Notes -->
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Keterangan (Opsional)</label>
                                <input
                                    v-model="form.notes"
                                    type="text"
                                    placeholder="Contoh: Pembelian supplier, Barang rusak, dll."
                                    class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                >
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
                                @click="saveTransaction()"
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
            mutations: [],
            items: [],
            isLoading: false,
            isSaving: false,
            showModal: false,
            currentFilter: 'all',
            searchQuery: '',
            form: {
                item_id: '',
                type: 'in',
                quantity: '',
                notes: ''
            }
        };
    },
    computed: {
        totalIn() {
            return this.mutations
                .filter(m => m.type === 'in')
                .reduce((sum, m) => sum + parseInt(m.quantity || 0), 0);
        },
        totalOut() {
            return this.mutations
                .filter(m => m.type === 'out')
                .reduce((sum, m) => sum + parseInt(m.quantity || 0), 0);
        },
        filteredMutations() {
            let result = this.mutations;
            if (this.currentFilter === 'in') {
                result = result.filter(m => m.type === 'in');
            } else if (this.currentFilter === 'out') {
                result = result.filter(m => m.type === 'out');
            }
            if (this.searchQuery.trim()) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(m => {
                    const itemName = m.item_name ? m.item_name.toLowerCase() : '';
                    const notes = m.notes ? m.notes.toLowerCase() : '';
                    return itemName.includes(query) || notes.includes(query);
                });
            }
            return result;
        }
    },
    mounted() {
        this.loadAll();
    },
    methods: {
        async loadAll() {
            this.isLoading = true;
            try {
                await Promise.all([
                    this.loadMutations(),
                    this.loadItems()
                ]);
            } finally {
                this.isLoading = false;
            }
        },
        async loadMutations() {
            const res = await axios.get('/stocks');
            this.mutations = res.data;
        },
        async loadItems() {
            const res = await axios.get('/items');
            this.items = res.data;
        },
        openModal() {
            this.form = {
                item_id: '',
                type: 'in',
                quantity: '',
                notes: ''
            };
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        async saveTransaction() {
            if (!this.form.item_id || !this.form.quantity) {
                Swal.fire({
                    title: 'Peringatan',
                    text: 'Pilih barang dan masukkan jumlah transaksi.',
                    icon: 'warning',
                    confirmButtonColor: '#4f46e5'
                });
                return;
            }
            this.isSaving = true;
            try {
                await axios.post('/stocks', this.form);
                this.closeModal();
                await this.loadAll();
                Swal.fire({
                    title: 'Berhasil',
                    text: 'Transaksi stok berhasil disimpan.',
                    icon: 'success',
                    confirmButtonColor: '#10b981'
                });
            } catch (err) {
                console.error('[StockTransactions] Failed to save transaction:', err);
                const msg = err.response && err.response.data
                    ? (err.response.data.message || (err.response.data.messages && err.response.data.messages.error) || 'Gagal menyimpan transaksi.')
                    : 'Gagal menyimpan transaksi.';
                Swal.fire({
                    title: 'Gagal',
                    text: msg,
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            } finally {
                this.isSaving = false;
            }
        },
        formatDate(dateStr) {
            if (!dateStr) return '-';
            const dt = new Date(dateStr);
            return dt.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
};
