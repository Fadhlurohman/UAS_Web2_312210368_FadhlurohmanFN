const LoginApp = {
  data() {
    return {
      username: '',
      password: '',
      error: '',
      showPassword: false,
      isLoading: false
    }
  },

  methods: {
    async login() {
      if (this.isLoading) return;
      this.error = '';
      this.isLoading = true;
      try {
        const res = await axios.post('http://localhost:8080/login', {
          username: this.username,
          password: this.password
        });

        localStorage.setItem('token', res.data.token);
        window.location.href = 'dashboard.html';
      } catch (err) {
        console.error(err);
        if (err.response && err.response.data) {
          const data = err.response.data;
          this.error = data.message || (data.messages && data.messages.error) || 'Login gagal. Silakan coba lagi.';
        } else {
          this.error = 'Koneksi ke server gagal. Pastikan API berjalan.';
        }
      } finally {
        this.isLoading = false;
      }
    }
  },

  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>E-Inventory</h2>
          <p>Silakan masuk ke akun Anda</p>
        </div>

        <div v-if="error" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          <span>{{ error }}</span>
        </div>

        <form @submit.prevent="login">
          <div class="form-group">
            <label for="username">Username</label>
            <div class="input-wrapper">
              <i class="fas fa-user"></i>
              <input 
                id="username"
                v-model="username" 
                type="text" 
                placeholder="Masukkan username" 
                required
                :disabled="isLoading"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper password-wrapper">
              <i class="fas fa-lock"></i>
              <input 
                id="password"
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                placeholder="Masukkan password" 
                required
                :disabled="isLoading"
              >
              <button 
                type="button" 
                class="password-toggle" 
                @click="showPassword = !showPassword"
                title="Tampilkan/Sembunyikan password"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="login-btn" :disabled="isLoading">
            <span v-if="isLoading" class="spinner"></span>
            <span>{{ isLoading ? 'Memproses...' : 'Masuk' }}</span>
          </button>
        </form>
      </div>
    </div>
  `
};

Vue.createApp(LoginApp).mount('#app');