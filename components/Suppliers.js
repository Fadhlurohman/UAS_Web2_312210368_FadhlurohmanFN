/**
 * components/Suppliers.js
 * Suppliers Management — Full CRUD with SweetAlert2 & Premium Card UI
 * Requires: axios (global), Swal (SweetAlert2)
 */
const SuppliersPage = {
    name: 'SuppliersPage',
    template: `
        <div class="p-8 space-y-6 min-h-screen">
            <!-- Page Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Partner Supplier</h1>
                    <p class="text-sm text-gray-500 mt-1">Kelola data partner pemasok barang inventaris Anda</p>
                </div>
                <button
                    @click="openSupplierModal()"
                    id="btn-tambah-supplier"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all font-semibold flex items-center gap-2 text-sm"
                >
                    <i class="fas fa-plus text-xs"></i>
                    <span>Tambah Supplier</span>
                </button>
            </div>

            <!-- Stats Card -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div class="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 border border-purple-400/30 p-6 rounded-2xl shadow-xl shadow-purple-500/20 text-white flex items-center justify-between">
                    <div>
                        <p class="text-xs font-semibold text-purple-100 uppercase tracking-wider">Total Supplier</p>
                        <h2 class="text-3xl font-extrabold mt-2">{{ suppliers.length }}</h2>
                    </div>
                    <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl backdrop-blur-md">
                        <i class="fas fa-truck"></i>
                    </div>
                </div>
            </div>

            <!-- Search Area -->
            <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div class="relative flex-1 max-w-md">
                    <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <i class="fas fa-search text-sm"></i>
                    </span>
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Cari nama, kategori, atau telepon..."
                        class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    />
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loadingSuppliers" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                <svg class="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <p class="text-gray-400 text-sm font-medium">Memuat data supplier...</p>
            </div>

            <!-- Grid Cards -->
            <div v-else>
                <div v-if="paginatedSuppliers.length > 0" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div
                            v-for="sup in paginatedSuppliers"
                            :key="sup.id"
                            class="bg-white rounded-2xl p-6 border border-gray-100 hover:border-purple-100 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 flex flex-col justify-between group"
                        >
                            <div class="space-y-4">
                                <!-- Header: Initials + Buttons -->
                                <div class="flex items-start justify-between">
                                    <div class="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg border shadow-sm" :class="getSupplierAvatar(sup.name).class">
                                        {{ getSupplierAvatar(sup.name).text }}
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <button
                                            @click="editSupplier(sup)"
                                            class="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-center text-xs"
                                            title="Edit Supplier"
                                        >
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button
                                            @click="deleteSupplier(sup.id)"
                                            class="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center justify-center text-xs"
                                            title="Hapus Supplier"
                                        >
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>

                                <!-- Supplier Info -->
                                <div class="space-y-2">
                                    <div>
                                        <h3 class="font-bold text-gray-800 text-lg group-hover:text-purple-600 transition-colors leading-snug">{{ sup.name }}</h3>
                                        <span class="text-[11px] font-bold text-gray-400 uppercase font-mono">ID #{{ sup.id }}</span>
                                    </div>
                                    
                                    <!-- Category Badge -->
                                    <div class="flex items-center gap-1.5 flex-wrap">
                                        <span v-if="sup.category_name" class="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100 flex items-center gap-1">
                                            <i class="fas fa-tag text-[10px]"></i>{{ sup.category_name }}
                                        </span>
                                        <span v-else class="px-2.5 py-1 rounded-lg bg-gray-50 text-gray-400 text-xs font-semibold border border-gray-100">
                                            Tanpa Kategori
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Footer Detail Contact -->
                            <div class="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500 font-medium">
                                <div class="flex items-center gap-1.5 text-gray-400">
                                    <i class="fas fa-phone-alt"></i>
                                    <span class="font-mono">{{ sup.phone || '-' }}</span>
                                </div>
                                <a
                                    v-if="sup.phone"
                                    :href="'https://wa.me/' + formatWhatsApp(sup.phone)"
                                    target="_blank"
                                    class="text-emerald-600 hover:text-white flex items-center gap-1 font-semibold transition-colors bg-emerald-50 hover:bg-emerald-500 border border-emerald-100 hover:border-emerald-500 px-2.5 py-1.5 rounded-lg"
                                >
                                    <i class="fab fa-whatsapp"></i> Chat WA
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Pagination Controls -->
                    <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 pt-2">
                        <button
                            @click="currentPage > 1 ? currentPage-- : null"
                            :disabled="currentPage === 1"
                            class="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed"
                        >
                            Sebelumnya
                        </button>
                        <span class="text-xs font-semibold text-gray-500 font-sans tracking-wide">
                            Halaman <span class="text-indigo-600 font-mono">{{ currentPage }}</span> dari <span class="text-gray-800 font-mono">{{ totalPages }}</span>
                        </span>
                        <button
                            @click="currentPage < totalPages ? currentPage++ : null"
                            :disabled="currentPage === totalPages"
                            class="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed"
                        >
                            Berikutnya
                        </button>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                    <i class="fas fa-truck text-4xl text-gray-200 mb-4 block"></i>
                    <p class="text-gray-400 font-medium">Tidak ada supplier ditemukan.</p>
                    <p class="text-gray-300 text-xs mt-1">Coba ubah kata kunci pencarian Anda atau tambah supplier baru.</p>
                </div>
            </div>

            <!-- SUPPLIER MODAL -->
            <teleport to="body">
                <div
                    v-if="showSupplierModal"
                    id="modal-supplier"
                    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    @click.self="closeSupplierModal()"
                >
                    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100">
                        <div class="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 class="text-xl font-bold text-gray-900">
                                {{ supplierForm.id ? 'Edit Supplier' : 'Tambah Supplier Baru' }}
                            </h2>
                            <button @click="closeSupplierModal()" class="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="p-6 space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Supplier</label>
                                <input
                                    v-model="supplierForm.name"
                                    placeholder="Masukkan nama supplier"
                                    class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                >
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Kategori Yang Disuplai</label>
                                <select
                                    v-model="supplierForm.category_id"
                                    class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all bg-white"
                                >
                                    <option value="" disabled>Pilih Kategori</option>
                                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                        {{ cat.name }}
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nomor Telepon</label>
                                <input
                                    v-model="supplierForm.phone"
                                    placeholder="Contoh: 08123456789"
                                    @keyup.enter="saveSupplier()"
                                    class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                >
                            </div>
                        </div>
                        <div class="flex justify-end gap-3 p-6 border-t border-gray-100">
                            <button @click="closeSupplierModal()" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                                Batal
                            </button>
                            <button @click="saveSupplier()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-600/20">
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            </teleport>
        </div>
    `,
    data() {
        return {
            suppliers: [],
            categories: [],
            loadingSuppliers: false,
            showSupplierModal: false,
            searchQuery: '',
            currentPage: 1,
            itemsPerPage: 6,
            supplierForm: { id: null, name: '', phone: '', category_id: '' }
        };
    },
    watch: {
        searchQuery() {
            this.currentPage = 1;
        }
    },
    computed: {
        filteredSuppliers() {
            if (!this.searchQuery.trim()) {
                return this.suppliers;
            }
            const query = this.searchQuery.toLowerCase();
            return this.suppliers.filter(sup => {
                const name = sup.name ? sup.name.toLowerCase() : '';
                const phone = sup.phone ? sup.phone.toLowerCase() : '';
                const cat = sup.category_name ? sup.category_name.toLowerCase() : '';
                return name.includes(query) || phone.includes(query) || cat.includes(query);
            });
        },
        totalPages() {
            return Math.ceil(this.filteredSuppliers.length / this.itemsPerPage) || 1;
        },
        paginatedSuppliers() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredSuppliers.slice(start, end);
        }
    },
    mounted() {
        this.loadSuppliers();
        this.loadCategories();
    },
    methods: {
        async loadSuppliers() {
            this.loadingSuppliers = true;
            try {
                const res = await axios.get('/suppliers');
                this.suppliers = res.data;
            } finally {
                this.loadingSuppliers = false;
            }
        },
        async loadCategories() {
            try {
                const res = await axios.get('/categories');
                this.categories = res.data;
            } catch (err) {
                console.error('[Suppliers] Failed to load categories:', err);
            }
        },
        getSupplierAvatar(name) {
            if (!name) return { text: '??', class: 'bg-indigo-50 text-indigo-700 border-indigo-100' };
            
            // Clean common prefixes
            let cleanName = name.replace(/^(PT|CV|UD|Toko|Apotek)\.?\s+/i, '');
            const words = cleanName.trim().split(/\s+/);
            let initials = '';
            if (words.length >= 2) {
                initials = words[0][0] + words[1][0];
            } else if (words[0]) {
                initials = words[0].substring(0, 2);
            } else {
                initials = '??';
            }
            initials = initials.toUpperCase();

            const code = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
            const colors = [
                'bg-blue-50 text-blue-700 border-blue-100',
                'bg-emerald-50 text-emerald-700 border-emerald-100',
                'bg-pink-50 text-pink-700 border-pink-100',
                'bg-amber-50 text-amber-700 border-amber-100',
                'bg-purple-50 text-purple-700 border-purple-100',
                'bg-rose-50 text-rose-700 border-rose-100',
                'bg-indigo-50 text-indigo-700 border-indigo-100',
                'bg-teal-50 text-teal-700 border-teal-100'
            ];
            const colorClass = colors[code % colors.length];
            
            return {
                text: initials,
                class: colorClass
            };
        },
        formatWhatsApp(phone) {
            if (!phone) return '';
            let cleaned = phone.replace(/\D/g, '');
            if (cleaned.startsWith('0')) {
                cleaned = '62' + cleaned.substring(1);
            }
            return cleaned;
        },
        openSupplierModal() {
            this.supplierForm = { id: null, name: '', phone: '', category_id: '' };
            this.showSupplierModal = true;
        },
        closeSupplierModal() {
            this.showSupplierModal = false;
        },
        editSupplier(sup) {
            this.supplierForm = {
                id: sup.id,
                name: sup.name,
                phone: sup.phone,
                category_id: sup.category_id || ''
            };
            this.showSupplierModal = true;
        },
        async saveSupplier() {
            if (!this.supplierForm.name.trim()) {
                Swal.fire({
                    title: 'Peringatan',
                    text: 'Nama supplier tidak boleh kosong.',
                    icon: 'warning',
                    confirmButtonColor: '#4f46e5'
                });
                return;
            }
            try {
                if (this.supplierForm.id) {
                    await axios.put('/suppliers/' + this.supplierForm.id, this.supplierForm);
                } else {
                    await axios.post('/suppliers', this.supplierForm);
                }
                this.closeSupplierModal();
                await this.loadSuppliers();
                Swal.fire({
                    title: 'Berhasil',
                    text: 'Supplier berhasil disimpan.',
                    icon: 'success',
                    confirmButtonColor: '#10b981'
                });
            } catch (err) {
                console.error('[Suppliers] Failed to save supplier:', err);
                Swal.fire({
                    title: 'Gagal',
                    text: 'Gagal menyimpan supplier.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            }
        },
        async deleteSupplier(id) {
            Swal.fire({
                title: 'Hapus Supplier?',
                text: 'Apakah Anda yakin ingin menghapus supplier ini?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.delete('/suppliers/' + id);
                        await this.loadSuppliers();
                        Swal.fire({
                            title: 'Terhapus!',
                            text: 'Supplier berhasil dihapus.',
                            icon: 'success',
                            confirmButtonColor: '#10b981'
                        });
                    } catch (err) {
                        console.error('[Suppliers] Failed to delete supplier:', err);
                        const msg = err.response && err.response.data
                            ? (err.response.data.message || (err.response.data.messages && err.response.data.messages.error) || 'Gagal menghapus supplier.')
                            : 'Gagal menghapus supplier.';
                        Swal.fire({
                            title: 'Gagal',
                            text: msg,
                            icon: 'error',
                            confirmButtonColor: '#ef4444'
                        });
                    }
                }
            });
        }
    }
};
