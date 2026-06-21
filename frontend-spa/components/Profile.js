/**
 * components/Profile.js
 * Admin Profile & Session Security Logs
 * Requires: axios (global), Swal (SweetAlert2)
 */
const ProfilePage = {
    name: 'ProfilePage',
    template: `
        <div class="p-8 space-y-6 min-h-screen">
            <!-- Page Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Profil Admin</h1>
                    <p class="text-sm text-gray-500 mt-1">Kelola data profil, keamanan sandi, dan pantau log audit sesi aktif</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- User Profile Card -->
                <div class="lg:col-span-1 space-y-6">
                    <!-- Profile Details -->
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 text-center space-y-4">
                        <div class="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white text-3xl font-bold flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
                            A
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-800 text-xl leading-none">Administrator</h3>
                            <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1.5 font-mono">Super Admin Account</p>
                        </div>
                        <div class="pt-4 border-t border-gray-50 text-left space-y-2.5 text-sm text-gray-600">
                            <div class="flex justify-between">
                                <span class="text-gray-400 font-medium">Username:</span>
                                <span class="font-bold text-gray-800 font-mono">admin</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400 font-medium">Status Akun:</span>
                                <span class="text-emerald-600 font-bold flex items-center gap-1">
                                    <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Aktif
                                </span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400 font-medium">Sesi Mulai:</span>
                                <span class="text-gray-800 font-mono text-xs">{{ sessionStart }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Browser Security Details -->
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
                        <h4 class="font-bold text-gray-800 border-b border-gray-50 pb-2">Informasi Koneksi</h4>
                        <div class="space-y-3 text-xs text-gray-600">
                            <div class="space-y-1">
                                <p class="text-gray-400 font-semibold">User Agent:</p>
                                <p class="bg-gray-50 p-2 rounded-lg font-mono text-[10px] text-gray-500 break-all leading-normal">{{ userAgent }}</p>
                            </div>
                            <div class="flex justify-between border-t border-gray-50 pt-2.5">
                                <span class="text-gray-400">IP Client:</span>
                                <span class="font-bold font-mono">127.0.0.1 (Localhost)</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Sertifikat SSL:</span>
                                <span class="text-indigo-600 font-bold">Local SSL / HTTP</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Password Update Form & Security Logs -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Password Update Card -->
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
                        <h3 class="font-bold text-gray-800 text-lg">Ubah Kata Sandi (Simulasi)</h3>
                        <p class="text-xs text-gray-400 leading-normal">Untuk menjaga keamanan, perbarui kata sandi akun administrator secara berkala.</p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sandi Baru</label>
                                <input
                                    v-model="passwordForm.new"
                                    type="password"
                                    placeholder="Masukkan sandi baru"
                                    class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all bg-gray-50 focus:bg-white"
                                >
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Konfirmasi Sandi Baru</label>
                                <input
                                    v-model="passwordForm.confirm"
                                    type="password"
                                    placeholder="Ulangi sandi baru"
                                    class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all bg-gray-50 focus:bg-white"
                                >
                            </div>
                        </div>
                        <div class="flex justify-end pt-2">
                            <button
                                @click="updatePassword()"
                                class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-600/20"
                            >
                                Perbarui Sandi
                            </button>
                        </div>
                    </div>

                    <!-- Security Log Activities -->
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
                        <h3 class="font-bold text-gray-800 text-lg">Log Audit Keamanan Sesi</h3>
                        <p class="text-xs text-gray-400">Daftar rekaman aktivitas operasional sesi akun saat ini</p>
                        
                        <div class="space-y-3.5 pt-2 max-h-[300px] overflow-y-auto pr-1">
                            <div
                                v-for="log in logs"
                                :key="log.id"
                                class="flex justify-between items-start p-3 bg-gray-50 rounded-xl border border-gray-100/50 hover:bg-gray-100/50 transition-colors text-xs"
                            >
                                <div class="space-y-1 min-w-0">
                                    <p class="font-semibold text-gray-800 leading-snug break-words">{{ log.action }}</p>
                                    <p class="text-gray-400 font-mono text-[10px]">{{ log.ip }} &bull; {{ log.agent }}</p>
                                </div>
                                <span class="text-gray-400 font-mono font-medium text-[10px] flex-shrink-0 ml-2">
                                    {{ log.time }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            sessionStart: '',
            userAgent: navigator.userAgent,
            passwordForm: {
                new: '',
                confirm: ''
            },
            logs: []
        };
    },
    mounted() {
        const now = new Date();
        this.sessionStart = now.toLocaleDateString('id-ID', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        this.generateLogs();
    },
    methods: {
        generateLogs() {
            const dt = new Date();
            const formatTime = (minusMinutes) => {
                const temp = new Date(dt.getTime() - minusMinutes * 60 * 1000);
                return temp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            };
            this.logs = [
                {
                    id: 1,
                    action: 'Akses masuk (Log-in) administrator dikonfirmasi via token JWT',
                    ip: '127.0.0.1',
                    agent: 'Localhost Connection',
                    time: formatTime(15)
                },
                {
                    id: 2,
                    action: 'Pemuatan basis data barang, kategori, dan partner supplier berhasil disinkronisasi',
                    ip: '127.0.0.1',
                    agent: 'Vue Router Guard',
                    time: formatTime(14)
                },
                {
                    id: 3,
                    action: 'Melihat ringkasan analisis statistik transaksi sirkulasi stok masuk & keluar',
                    ip: '127.0.0.1',
                    agent: 'Reports Controller',
                    time: formatTime(8)
                },
                {
                    id: 4,
                    action: 'Memeriksa barang kritis yang hampir habis untuk draf pesanan otomatis',
                    ip: '127.0.0.1',
                    agent: 'Alerts Monitoring System',
                    time: formatTime(5)
                },
                {
                    id: 5,
                    action: 'Mengakses menu pengelolaan profil dan log audit sesi keaktifan admin',
                    ip: '127.0.0.1',
                    agent: 'Active Session Log',
                    time: 'Baru saja'
                }
            ];
        },
        updatePassword() {
            if (!this.passwordForm.new || !this.passwordForm.confirm) {
                Swal.fire({
                    title: 'Peringatan',
                    text: 'Silakan isi kolom kata sandi baru dan konfirmasinya.',
                    icon: 'warning',
                    confirmButtonColor: '#4f46e5'
                });
                return;
            }
            if (this.passwordForm.new !== this.passwordForm.confirm) {
                Swal.fire({
                    title: 'Gagal',
                    text: 'Konfirmasi kata sandi tidak cocok.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
                return;
            }
            if (this.passwordForm.new.length < 6) {
                Swal.fire({
                    title: 'Peringatan',
                    text: 'Kata sandi baru harus minimal 6 karakter.',
                    icon: 'warning',
                    confirmButtonColor: '#4f46e5'
                });
                return;
            }

            Swal.fire({
                title: 'Memproses...',
                text: 'Mengubah kata sandi administrator...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            setTimeout(() => {
                Swal.fire({
                    title: 'Berhasil',
                    text: 'Kata sandi administrator berhasil diubah! (Simulasi Sukses)',
                    icon: 'success',
                    confirmButtonColor: '#10b981'
                });
                this.passwordForm.new = '';
                this.passwordForm.confirm = '';
                
                // Add new log
                this.logs.unshift({
                    id: Date.now(),
                    action: 'Mengubah kata sandi akun administrator (Simulasi Sukses)',
                    ip: '127.0.0.1',
                    agent: 'Security Controller',
                    time: 'Baru saja'
                });
            }, 1000);
        }
    }
};
