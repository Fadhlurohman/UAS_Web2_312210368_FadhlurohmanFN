/**
 * components/Alerts.js
 * Low Stock Alerts & Automated Supplier Orders via WhatsApp
 * Requires: axios (global), Swal (SweetAlert2)
 */
const AlertsPage = {
    name: 'AlertsPage',
    template: `
        <div class="p-8 space-y-6 min-h-screen">
            <!-- Page Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Pengingat Stok</h1>
                    <p class="text-sm text-gray-500 mt-1">Deteksi stok menipis dan buat pesanan restock otomatis ke Supplier</p>
                </div>
            </div>

            <!-- Stats Card -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <!-- Critical Items -->
                <div class="bg-gradient-to-br from-rose-500 via-rose-600 to-pink-600 p-6 rounded-2xl shadow-xl shadow-rose-500/20 text-white flex items-center justify-between">
                    <div>
                        <p class="text-xs font-semibold text-rose-100 uppercase tracking-wider">Stok Kritis (≤ 5)</p>
                        <h2 class="text-3xl font-extrabold mt-2">{{ lowStockItems.length }} Barang</h2>
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
                <p class="text-gray-400 text-sm font-medium">Menganalisis tingkat persediaan...</p>
            </div>

            <!-- Alerts Content -->
            <div v-else>
                <!-- Low Stock Items List -->
                <div v-if="lowStockItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        v-for="item in lowStockItems"
                        :key="item.id"
                        class="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm hover:shadow-lg hover:border-rose-300 transition-all duration-300 flex flex-col justify-between group"
                    >
                        <div class="space-y-4">
                            <!-- Badges Header -->
                            <div class="flex items-center gap-1.5 flex-wrap">
                                <span class="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100">
                                    {{ item.category_name }}
                                </span>
                                <span class="px-2 py-0.5 rounded-lg bg-red-50 text-red-700 text-[10px] font-bold border border-red-100 flex items-center gap-1">
                                    <i class="fas fa-exclamation-circle text-[9px]"></i>Kritis
                                </span>
                            </div>

                            <!-- Name & Status -->
                            <div>
                                <h3 class="font-bold text-gray-800 text-lg group-hover:text-rose-600 transition-colors leading-snug">{{ item.item_name }}</h3>
                                <div class="flex justify-between items-center text-xs mt-2 bg-rose-50/50 p-2.5 rounded-xl border border-rose-100/50 text-rose-700 font-bold">
                                    <span>Stok Saat Ini:</span>
                                    <span class="font-mono text-sm bg-white px-2 py-0.5 rounded-md shadow-sm">{{ item.stock }} Unit</span>
                                </div>
                            </div>

                            <!-- Supplier Info Details -->
                            <div class="pt-2 space-y-1.5 border-t border-gray-50 text-xs">
                                <p class="text-gray-400 font-semibold uppercase tracking-wider text-[9px]">Supplier Terkait</p>
                                <div class="flex items-center justify-between text-gray-700 font-medium">
                                    <span class="truncate">{{ item.supplier_name || 'Tidak ada supplier' }}</span>
                                    <span class="text-gray-400 font-mono text-[10px]">{{ getSupplierPhone(item.supplier_id) || '-' }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Action Button WhatsApp -->
                        <div class="mt-6 pt-4 border-t border-gray-50">
                            <button
                                @click="sendWhatsAppOrder(item)"
                                :disabled="!getSupplierPhone(item.supplier_id)"
                                class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200"
                                :class="getSupplierPhone(item.supplier_id)
                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white border-emerald-100 hover:border-emerald-500 shadow-sm'
                                    : 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'"
                            >
                                <i class="fab fa-whatsapp"></i>
                                <span>Restock via WhatsApp</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Green Safe State -->
                <div v-else class="bg-white rounded-2xl p-16 border border-emerald-100 shadow-sm text-center max-w-2xl mx-auto space-y-4">
                    <div class="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 text-3xl mx-auto shadow-inner">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="space-y-2">
                        <h3 class="text-xl font-bold text-gray-800">Semua Stok Aman!</h3>
                        <p class="text-sm text-gray-400 max-w-md mx-auto">Tidak ada barang yang berada di bawah ambang batas kritis (≤ 5 unit). Sirkulasi stok Anda berjalan dengan sehat.</p>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            items: [],
            suppliers: [],
            isLoading: false
        };
    },
    computed: {
        lowStockItems() {
            return this.items.filter(item => parseInt(item.stock) <= 5);
        }
    },
    mounted() {
        this.loadAll();
    },
    methods: {
        async loadAll() {
            this.isLoading = true;
            try {
                const [itemRes, supRes] = await Promise.all([
                    axios.get('/items'),
                    axios.get('/suppliers')
                ]);
                this.items = itemRes.data;
                this.suppliers = supRes.data;
            } catch (err) {
                console.error('[Alerts] Failed to load data:', err);
            } finally {
                this.isLoading = false;
            }
        },
        getSupplierPhone(supplierId) {
            if (!supplierId) return '';
            const sup = this.suppliers.find(s => parseInt(s.id) === parseInt(supplierId));
            return sup ? sup.phone : '';
        },
        formatWhatsApp(phone) {
            let cleaned = phone.replace(/\D/g, '');
            if (cleaned.startsWith('0')) {
                cleaned = '62' + cleaned.substring(1);
            }
            return cleaned;
        },
        sendWhatsAppOrder(item) {
            const phone = this.getSupplierPhone(item.supplier_id);
            if (!phone) {
                Swal.fire({
                    title: 'Gagal',
                    text: 'Nomor telepon supplier tidak terdaftar.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
                return;
            }
            const formattedPhone = this.formatWhatsApp(phone);
            const message = `Halo ${item.supplier_name}, kami dari tim E-Inventory ingin memesan kembali produk "${item.item_name}" karena persediaan stok kami saat ini tersisa ${item.stock} unit. Mohon bantu memproses dokumen restock dan penawaran harganya. Terima kasih.`;
            const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        }
    }
};
