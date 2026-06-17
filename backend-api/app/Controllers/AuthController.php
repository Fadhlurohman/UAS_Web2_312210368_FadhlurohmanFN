public function login()
{
    $model = new UserModel();
    $data = $this->request->getJSON();

    $user = $model->where('username', $data->username)
                  ->where('password', md5($data->password))
                  ->first();

    if (!$user) {
        return $this->failUnauthorized('Login gagal');
    }

    // TOKEN REAL (WAJIB INI DIPAKAI)
    $token = bin2hex(random_bytes(32));

    // SIMPAN KE DATABASE
    $model->where('id', $user['id'])
          ->set(['token' => $token])
          ->update();

    return $this->respond([
        "status" => true,
        "token"  => $token
    ]);
}