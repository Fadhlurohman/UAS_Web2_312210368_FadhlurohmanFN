/**
 * components/Categories.js
 * Categories Management — Full CRUD with SweetAlert2 & Beautiful Card UI
 * Requires: axios (global), Swal (SweetAlert2)
 */
const CategoriesPage = {
    name: 'CategoriesPage',
    template: `
        <div class="p-8 space-y-6 min-h-screen">
            <!-- Page Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Kategori Barang</h1>
                    <p class="text-sm text-gray-500 mt-1">Kelola kategori pengelompokan barang inventaris Anda</p>
                </div>
                <button
                    @click="openCategoryModal()"
                    id="btn-tambah-kategori"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all font-semibold flex items-center gap-2 text-sm"
                >
                    <i class="fas fa-plus text-xs"></i>
                    <span>Tambah Kategori</span>
                </button>
            </div>

            <!-- Stats Card -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div class="bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 border border-indigo-400/30 p-6 rounded-2xl shadow-xl shadow-indigo-500/20 text-white flex items-center justify-between">
                    <div>
                        <p class="text-xs font-semibold text-indigo-100 uppercase tracking-wider">Total Kategori</p>
                        <h2 class="text-3xl font-extrabold mt-2">{{ categories.length }}</h2>
                    </div>
                    <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl backdrop-blur-md">
                        <i class="fas fa-tags"></i>
                    </div>
                </div>
            </div>

            <!-- Search & Filter Area -->
            <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div class="relative flex-1 max-w-md">
                    <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <i class="fas fa-search text-sm"></i>
                    </span>
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Cari kategori berdasarkan nama..."
                        class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    />
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loadingCategories" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                <svg class="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <p class="text-gray-400 text-sm font-medium">Memuat data kategori...</p>
            </div>

            <!-- Grid Cards -->
            <div v-else>
                <div v-if="paginatedCategories.length > 0" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div
                            v-for="cat in paginatedCategories"
                            :key="cat.id"
                            class="bg-white rounded-2xl p-6 border border-gray-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between group"
                        >
                            <div>
                                <div class="flex items-center justify-between mb-4">
                                    <span class="text-xs font-bold text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-lg font-mono">ID #{{ cat.id }}</span>
                                    <div class="flex items-center gap-2">
                                        <button
                                            @click="editCategory(cat)"
                                            class="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-center text-xs"
                                            title="Edit Kategori"
                                        >
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button
                                            @click="deleteCategory(cat.id)"
                                            class="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center justify-center text-xs"
                                            title="Hapus Kategori"
                                        >
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="flex items-start gap-4">
                                    <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" :class="getCategoryIcon(cat.name).class">
                                        <i :class="getCategoryIcon(cat.name).icon"></i>
                                    </div>
                                    <div class="space-y-1">
                                        <h3 class="font-bold text-gray-800 text-lg group-hover:text-indigo-600 transition-colors">{{ cat.name }}</h3>
                                        <p class="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                                            <i class="fas fa-box-open"></i>
                                            <span>{{ getItemCount(cat.id) }} Item Barang</span>
                                        </p>
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
                    <i class="fas fa-tags text-4xl text-gray-200 mb-4 block"></i>
                    <p class="text-gray-400 font-medium">Tidak ada kategori ditemukan.</p>
                    <p class="text-gray-300 text-xs mt-1">Coba ubah kata kunci pencarian Anda atau tambah kategori baru.</p>
                </div>
            </div>

            <!-- CATEGORY MODAL -->
            <teleport to="body">
                <div
                    v-if="showCategoryModal"
                    id="modal-kategori"
                    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    @click.self="closeCategoryModal()"
                >
                    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100">
                        <div class="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 class="text-xl font-bold text-gray-900">
                                {{ categoryForm.id ? 'Edit Kategori' : 'Tambah Kategori Baru' }}
                            </h2>
                            <button @click="closeCategoryModal()" class="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="p-6">
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Kategori</label>
                            <input
                                v-model="categoryForm.name"
                                placeholder="Masukkan nama kategori"
                                @keyup.enter="saveCategory()"
                                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            >
                        </div>
                        <div class="flex justify-end gap-3 p-6 border-t border-gray-100">
                            <button @click="closeCategoryModal()" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                                Batal
                            </button>
                            <button @click="saveCategory()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-600/20">
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
            categories: [],
            items: [],
            loadingCategories: false,
            showCategoryModal: false,
            searchQuery: '',
            currentPage: 1,
            itemsPerPage: 6,
            categoryForm: { id: null, name: '' }
        };
    },
    watch: {
        searchQuery() {
            this.currentPage = 1;
        }
    },
    computed: {
        filteredCategories() {
            if (!this.searchQuery.trim()) {
                return this.categories;
            }
            const query = this.searchQuery.toLowerCase();
            return this.categories.filter(cat => cat.name.toLowerCase().includes(query));
        },
        totalPages() {
            return Math.ceil(this.filteredCategories.length / this.itemsPerPage) || 1;
        },
        paginatedCategories() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredCategories.slice(start, end);
        }
    },
    mounted() {
        this.loadCategories();
    },
    methods: {
        async loadCategories() {
            this.loadingCategories = true;
            try {
                const [catRes, itemRes] = await Promise.all([
                    axios.get('/categories'),
                    axios.get('/items').catch(() => ({ data: [] }))
                ]);
                this.categories = catRes.data;
                this.items = itemRes.data;
            } finally {
                this.loadingCategories = false;
            }
        },
        getItemCount(categoryId) {
            return this.items.filter(item => parseInt(item.category_id) === parseInt(categoryId)).length;
        },
        getCategoryIcon(name) {
            const n = name.toLowerCase();
            if (n.includes('elektronik') || n.includes('komputer') || n.includes('gadget') || n.includes('handphone') || n.includes('laptop') || n.includes('tech') || n.includes('hp')) {
                return { icon: 'fas fa-laptop-code', class: 'text-blue-500 bg-blue-50' };
            }
            if (n.includes('makanan') || n.includes('minuman') || n.includes('kuliner') || n.includes('food') || n.includes('drink') || n.includes('snack') || n.includes('roti') || n.includes('susu')) {
                return { icon: 'fas fa-utensils', class: 'text-emerald-500 bg-emerald-50' };
            }
            if (n.includes('pakaian') || n.includes('baju') || n.includes('celana') || n.includes('fashion') || n.includes('clothing') || n.includes('sepatu') || n.includes('tas')) {
                return { icon: 'fas fa-tshirt', class: 'text-pink-500 bg-pink-50' };
            }
            if (n.includes('buku') || n.includes('tulis') || n.includes('pendidikan') || n.includes('stationery') || n.includes('office') || n.includes('kertas') || n.includes('pena') || n.includes('pensil')) {
                return { icon: 'fas fa-book', class: 'text-amber-500 bg-amber-50' };
            }
            if (n.includes('perkakas') || n.includes('alat') || n.includes('hardware') || n.includes('tools') || n.includes('mesin') || n.includes('otomotif') || n.includes('obeng') || n.includes('tang')) {
                return { icon: 'fas fa-tools', class: 'text-purple-500 bg-purple-50' };
            }
            if (n.includes('obat') || n.includes('kesehatan') || n.includes('medis') || n.includes('health') || n.includes('medicine') || n.includes('vitamin') || n.includes('masker')) {
                return { icon: 'fas fa-prescription-bottle-alt', class: 'text-rose-500 bg-rose-50' };
            }
            return { icon: 'fas fa-tag', class: 'text-indigo-500 bg-indigo-50' };
        },
        openCategoryModal() {
            this.categoryForm = { id: null, name: '' };
            this.showCategoryModal = true;
        },
        closeCategoryModal() {
            this.showCategoryModal = false;
        },
        editCategory(cat) {
            this.categoryForm = { ...cat };
            this.showCategoryModal = true;
        },
        async saveCategory() {
            if (!this.categoryForm.name.trim()) {
                Swal.fire({
                    title: 'Peringatan',
                    text: 'Nama kategori tidak boleh kosong.',
                    icon: 'warning',
                    confirmButtonColor: '#4f46e5'
                });
                return;
            }
            try {
                if (this.categoryForm.id) {
                    await axios.put('/categories/' + this.categoryForm.id, this.categoryForm);
                } else {
                    await axios.post('/categories', this.categoryForm);
                }
                this.closeCategoryModal();
                await this.loadCategories();
                Swal.fire({
                    title: 'Berhasil',
                    text: 'Kategori berhasil disimpan.',
                    icon: 'success',
                    confirmButtonColor: '#10b981'
                });
            } catch (err) {
                console.error('[Categories] Failed to save category:', err);
                Swal.fire({
                    title: 'Gagal',
                    text: 'Gagal menyimpan kategori.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            }
        },
        async deleteCategory(id) {
            Swal.fire({
                title: 'Hapus Kategori?',
                text: 'Apakah Anda yakin ingin menghapus kategori ini? Barang yang menggunakan kategori ini mungkin terpengaruh.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.delete('/categories/' + id);
                        await this.loadCategories();
                        Swal.fire({
                            title: 'Terhapus!',
                            text: 'Kategori berhasil dihapus.',
                            icon: 'success',
                            confirmButtonColor: '#10b981'
                        });
                    } catch (err) {
                        console.error('[Categories] Failed to delete category:', err);
                        const msg = err.response && err.response.data
                            ? (err.response.data.message || (err.response.data.messages && err.response.data.messages.error) || 'Gagal menghapus kategori.')
                            : 'Gagal menghapus kategori.';
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
