/**
 * components/NotFound.js
 * 404 Not Found Page Component
 */
const NotFoundPage = {
    name: 'NotFoundPage',
    template: `
        <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div class="text-center">
                <div class="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-map-signs text-4xl text-indigo-400"></i>
                </div>
                <h1 class="text-7xl font-extrabold text-indigo-600 mb-4 tracking-tight">404</h1>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h2>
                <p class="text-gray-500 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
                    Halaman yang Anda cari tidak tersedia atau mungkin telah dipindahkan.
                </p>
                <router-link
                    to="/dashboard"
                    class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-indigo-500/30 text-sm"
                >
                    <i class="fas fa-arrow-left"></i>
                    Kembali ke Dashboard
                </router-link>
            </div>
        </div>
    `
};
