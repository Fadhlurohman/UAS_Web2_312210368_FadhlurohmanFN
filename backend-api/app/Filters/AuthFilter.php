<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use App\Models\UserModel;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine('Authorization');

        if (!$authHeader) {
            return service('response')
                ->setJSON(['message' => 'Token tidak ditemukan'])
                ->setStatusCode(401);
        }

        $token = str_replace('Bearer ', '', $authHeader);

        $model = new UserModel();
        $user = $model->where('token', $token)->first();

        if (!$user) {
            return service('response')
                ->setJSON(['message' => 'Token tidak valid'])
                ->setStatusCode(401);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // tidak dipakai
    }
}