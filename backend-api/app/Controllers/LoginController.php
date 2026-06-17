<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;

class LoginController extends ResourceController
{
    public function test()
    {
        return $this->respond(['ok' => true]);
    }

    public function login()
    {
        $model = new UserModel();

        // AMBIL DATA JSON DARI FRONTEND
        $data = $this->request->getJSON();

        // DEBUG: kalau ingin cek apakah data masuk
        // return $this->respond($data);

        // VALIDASI DATA KOSONG
        if (!$data || !isset($data->username) || !isset($data->password)) {
            return $this->fail([
                'message' => 'Data tidak lengkap',
                'debug'   => $data
            ]);
        }

        // CEK USER DI DATABASE
        $user = $model
            ->where('username', $data->username)
            ->where('password', md5($data->password))
            ->first();

        if (!$user) {
            return $this->failUnauthorized('Login gagal');
        }

        // BUAT TOKEN
        $token = bin2hex(random_bytes(32));

        // SIMPAN TOKEN KE DATABASE
        $model->update($user['id'], [
            'token' => $token
        ]);

        // RESPONSE SUCCESS
        return $this->respond([
            'status' => true,
            'token'  => $token
        ]);
    }
}