const LoginApp = {
    data() {
        return {
            username: '',
            password: '',
            error: ''
        }
    },

    methods: {
        async login() {
            try {
                const res = await axios.post('http://localhost:8080/login', {
                    username: this.username,
                    password: this.password
                });

                const token = res.data.token;

                localStorage.setItem('token', res.data.token);

                window.location.href = 'dashboard.html';

            } catch (err) {
                this.error = 'Login gagal';
            }
        }
    },

    template: `
    <div style="max-width:300px;margin:auto;margin-top:100px;">
      <h2>Login</h2>

      <input v-model="username" placeholder="Username"><br><br>
      <input v-model="password" type="password" placeholder="Password"><br><br>

      <button @click="login">Login</button>

      <p style="color:red">{{ error }}</p>
    </div>
  `
};

Vue.createApp(LoginApp).mount('#app');