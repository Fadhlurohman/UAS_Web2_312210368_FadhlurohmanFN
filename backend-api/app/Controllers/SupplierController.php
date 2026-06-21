<?php

namespace App\Controllers;

use App\Models\SupplierModel;
use CodeIgniter\RESTful\ResourceController;

class SupplierController extends ResourceController
{
    public function index()
    {
        $model = new SupplierModel();
        $data = $model
            ->select('suppliers.*, categories.name as category_name')
            ->join('categories', 'categories.id = suppliers.category_id', 'left')
            ->findAll();
        return $this->respond($data);
    }

    public function create()
    {
        $model = new SupplierModel();

        $data = $this->request->getJSON();

        $model->insert([
            'name'        => $data->name,
            'phone'       => $data->phone,
            'category_id' => $data->category_id ?: null
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
            'name'        => $data->name,
            'phone'       => $data->phone,
            'category_id' => $data->category_id ?: null
        ]);

        return $this->respond([
            'message' => 'Supplier berhasil diupdate'
        ]);
    }

    public function delete($id = null)
    {
        $model = new SupplierModel();

        try {
            $model->delete($id);
            return $this->respond([
                'message' => 'Supplier berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            if (strpos($e->getMessage(), 'foreign key constraint fails') !== false || $e->getCode() == 1451) {
                return $this->fail('Gagal menghapus: Supplier ini masih terhubung dengan data barang (items) di inventaris. Hapus atau ubah terlebih dahulu barang yang menggunakan supplier ini.', 409);
            }
            return $this->fail('Gagal menghapus supplier: ' . $e->getMessage(), 500);
        }
    }
}