<?php

namespace App\Controllers;

use App\Models\SupplierModel;
use CodeIgniter\RESTful\ResourceController;

class SupplierController extends ResourceController
{
    public function index()
    {
        $model = new SupplierModel();
        return $this->respond($model->findAll());
    }

    public function create()
    {
        $model = new SupplierModel();

        $data = $this->request->getJSON();

        $model->insert([
            'name'  => $data->name,
            'phone' => $data->phone
        ]);

        return $this->respondCreated([
            'message' => 'Supplier berhasil ditambahkan'
        ]);
    }

    public function update($id = null)
    {
        $model = new SupplierModel();

        $data = $this->request->getJSON();

        $model->update($id, [
            'name'  => $data->name,
            'phone' => $data->phone
        ]);

        return $this->respond([
            'message' => 'Supplier berhasil diupdate'
        ]);
    }

    public function delete($id = null)
    {
        $model = new SupplierModel();

        $model->delete($id);

        return $this->respond([
            'message' => 'Supplier berhasil dihapus'
        ]);
    }
}