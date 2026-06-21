/**
 * components/Reports.js
 * Inventory Reports & Analytics — Premium visual graphs & print-friendly layout
 * Requires: axios (global)
 */
const ReportsPage = {
    name: 'ReportsPage',
    template: `
        <div class="p-8 space-y-6 min-h-screen">
            <!-- Page Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
                <div>
                    <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Analisis & Laporan</h1>
                    <p class="text-sm text-gray-500 mt-1">Pantau statistik sirkulasi dan cetak fisik inventaris gudang</p>
                </div>
                <button
                    @click="printReport()"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all font-semibold flex items-center gap-2 text-sm"
                >
                    <i class="fas fa-print text-xs"></i>
                    <span>Cetak Laporan</span>
                </button>
            </div>

            <!-- Print Header (Hidden on screen, visible on print) -->
            <div class="hidden print:block border-b border-gray-300 pb-4 mb-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-800 uppercase tracking-wider">Laporan Inventaris Fisik</h1>
                        <p class="text-xs text-gray-500 mt-0.5">Sistem Manajemen E-Inventory Pintar</p>
                    </div>
                    <div class="text-right text-xs text-gray-400">
                        <p>Tanggal Cetak: {{ getPrintDate() }}</p>
                        <p>Dicetak Oleh: Administrator</p>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center no-print">
                <svg class="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <p class="text-gray-400 text-sm font-medium">Memproses analisis data...</p>
            </div>

            <div v-else class="space-y-6">
                <!-- Metrics Summary Card -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div class="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-5 rounded-2xl text-white shadow-md print:text-gray-800 print:bg-none print:border print:border-gray-200">
                        <p class="text-xs font-semibold text-blue-100 print:text-gray-500 uppercase tracking-wider">Total Barang Unik</p>
                        <h2 class="text-2xl font-bold mt-1">{{ items.length }} Barang</h2>
                    </div>
                    <div class="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-5 rounded-2xl text-white shadow-md print:text-gray-800 print:bg-none print:border print:border-gray-200">
                        <p class="text-xs font-semibold text-emerald-100 print:text-gray-500 uppercase tracking-wider">Total Stok Masuk</p>
                        <h2 class="text-2xl font-bold mt-1">+{{ totalIn }} Unit</h2>
                    </div>
                    <div class="bg-gradient-to-br from-rose-500 via-rose-600 to-pink-600 p-5 rounded-2xl text-white shadow-md print:text-gray-800 print:bg-none print:border print:border-gray-200">
                        <p class="text-xs font-semibold text-rose-100 print:text-gray-500 uppercase tracking-wider">Total Stok Keluar</p>
                        <h2 class="text-2xl font-bold mt-1">-{{ totalOut }} Unit</h2>
                    </div>
                </div>

                <!-- Two Column Analysis -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 no-print">
                    <!-- Ratio chart -->
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
                        <h3 class="font-bold text-gray-800 text-lg">Rasio Mutasi Stok</h3>
                        <p class="text-xs text-gray-400">Persentase perbandingan kuantitas barang masuk vs keluar</p>
                        
                        <div class="space-y-4 pt-4">
                            <div class="flex justify-between items-center text-xs font-bold">
                                <span class="text-emerald-600 flex items-center gap-1"><i class="fas fa-arrow-down"></i> Masuk ({{ ratioIn }}%)</span>
                                <span class="text-rose-600 flex items-center gap-1"><i class="fas fa-arrow-up"></i> Keluar ({{ ratioOut }}%)</span>
                            </div>
                            <div class="w-full bg-gray-100 rounded-full h-4 shadow-inner overflow-hidden flex">
                                <div class="bg-emerald-500 h-full transition-all" :style="{ width: ratioIn + '%' }"></div>
                                <div class="bg-rose-500 h-full transition-all" :style="{ width: ratioOut + '%' }"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Top active items -->
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
                        <h3 class="font-bold text-gray-800 text-lg">Aktivitas Barang Teraktif</h3>
                        <p class="text-xs text-gray-400">Daftar barang dengan frekuensi transaksi mutasi tertinggi</p>
                        
                        <div class="space-y-3.5 pt-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                            <div v-for="(act, idx) in activeGoods" :key="act.id" class="space-y-1">
                                <div class="flex justify-between text-xs font-semibold">
                                    <span class="text-gray-700 font-bold">#{{ idx+1 }} {{ act.name }}</span>
                                    <span class="text-indigo-600">{{ act.count }} Transaksi</span>
                                </div>
                                <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner">
                                    <div class="bg-indigo-600 h-full rounded-full transition-all duration-500" :style="{ width: Math.min((act.count / maxActivityCount) * 100, 100) + '%' }"></div>
                                </div>
                            </div>
                            <div v-if="activeGoods.length === 0" class="text-center py-6 text-gray-400 text-xs">
                                Belum ada aktivitas transaksi terekam.
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Print Table -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden print:border-none print:shadow-none">
                    <div class="p-6 border-b border-gray-50 flex items-center justify-between print:px-0">
                        <h3 class="font-bold text-gray-800 text-lg">Fisik Stok Inventaris</h3>
                        <span class="text-xs font-medium text-gray-400 no-print">{{ items.length }} Baris Terdata</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider print:bg-none">
                                    <th class="p-4 pl-6 w-20">ID</th>
                                    <th class="p-4">Nama Barang</th>
                                    <th class="p-4">Kategori</th>
                                    <th class="p-4">Supplier</th>
                                    <th class="p-4 pr-6 text-right w-28">Stok Unit</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 text-sm text-gray-600">
                                <!-- Baris Layar (Terpaginasi & disembunyikan saat dicetak) -->
                                <tr v-for="item in paginatedItems" :key="item.id" class="hover:bg-gray-50/60 transition-colors print:hidden">
                                    <td class="p-4 pl-6 font-bold text-indigo-600 font-mono">#{{ item.id }}</td>
                                    <td class="p-4 font-semibold text-gray-800">{{ item.item_name }}</td>
                                    <td class="p-4">
                                        <span class="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                                            {{ item.category_name }}
                                        </span>
                                    </td>
                                    <td class="p-4 text-gray-600">{{ item.supplier_name }}</td>
                                    <td class="p-4 pr-6 text-right font-mono font-bold" :class="item.stock <= 5 ? 'text-red-600' : 'text-gray-800'">
                                        {{ item.stock }}
                                    </td>
                                </tr>
                                <!-- Baris Cetak (Seluruh Item & hanya muncul saat dicetak) -->
                                <tr v-for="item in items" :key="'print-' + item.id" class="hidden print:table-row">
                                    <td class="p-4 pl-6 font-bold text-gray-800 font-mono">#{{ item.id }}</td>
                                    <td class="p-4 font-semibold text-gray-800">{{ item.item_name }}</td>
                                    <td class="p-4 text-gray-700">{{ item.category_name }}</td>
                                    <td class="p-4 text-gray-600">{{ item.supplier_name }}</td>
                                    <td class="p-4 pr-6 text-right font-mono font-bold text-gray-800">
                                        {{ item.stock }}
                                    </td>
                                </tr>
                                <tr v-if="items.length === 0">
                                    <td colspan="5" class="p-16 text-center text-gray-400">
                                        Tidak ada barang terdaftar di inventaris.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- Table Pagination (Non-Print) -->
                    <div v-if="totalPages > 1" class="bg-gray-50/75 border-t border-gray-100 px-6 py-4 flex items-center justify-between no-print">
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
            </div>
        </div>
    `,
    data() {
        return {
            items: [],
            mutations: [],
            isLoading: false,
            currentPage: 1,
            itemsPerPage: 10
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
        ratioIn() {
            const total = this.totalIn + this.totalOut;
            if (total === 0) return 50;
            return Math.round((this.totalIn / total) * 100);
        },
        ratioOut() {
            const total = this.totalIn + this.totalOut;
            if (total === 0) return 50;
            return Math.round((this.totalOut / total) * 100);
        },
        activeGoods() {
            // Count mutations by item
            const counts = {};
            this.mutations.forEach(m => {
                const name = m.item_name || 'Barang ID #' + m.item_id;
                counts[name] = (counts[name] || 0) + 1;
            });
            return Object.keys(counts).map(name => ({
                name,
                count: counts[name]
            })).sort((a, b) => b.count - a.count);
        },
        maxActivityCount() {
            if (this.activeGoods.length === 0) return 1;
            return Math.max(...this.activeGoods.map(g => g.count));
        },
        totalPages() {
            return Math.ceil(this.items.length / this.itemsPerPage) || 1;
        },
        paginatedItems() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.items.slice(start, end);
        }
    },
    mounted() {
        // Dynamically add printing CSS support
        const style = document.createElement('style');
        style.id = 'print-reports-style';
        style.innerHTML = `
            @media print {
                aside, button, .no-print, header, nav, #btn-logout {
                    display: none !important;
                }
                main {
                    padding: 0 !important;
                    margin: 0 !important;
                    background: white !important;
                    color: black !important;
                    width: 100% !important;
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                }
                body {
                    background: white !important;
                    color: black !important;
                }
                .print\\:block {
                    display: block !important;
                }
                .print\\:table-row {
                    display: table-row !important;
                }
                .print\\:hidden {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
        this.loadAll();
    },
    unmounted() {
        const style = document.getElementById('print-reports-style');
        if (style) style.remove();
    },
    methods: {
        async loadAll() {
            this.isLoading = true;
            try {
                const [itemRes, mutRes] = await Promise.all([
                    axios.get('/items'),
                    axios.get('/stocks')
                ]);
                this.items = itemRes.data;
                this.mutations = mutRes.data;
            } catch (err) {
                console.error('[Reports] Failed to load data:', err);
            } finally {
                this.isLoading = false;
            }
        },
        printReport() {
            window.print();
        },
        getPrintDate() {
            const dt = new Date();
            return dt.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
};
