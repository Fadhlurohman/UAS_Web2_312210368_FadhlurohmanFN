<?php

namespace App\Controllers;

use App\Models\ItemModel;
use CodeIgniter\RESTful\ResourceController;

class ItemController extends ResourceController
{
    public function index()
    {
        $model = new ItemModel();

        $data = $model
            ->select('items.*, categories.name as category_name, suppliers.name as supplier_name')
            ->join('categories', 'categories.id = items.category_id')
            ->join('suppliers', 'suppliers.id = items.supplier_id')
            ->findAll();

        return $this->respond($data);
    }

    public function create()
    {
        $model = new ItemModel();
        $data = $this->request->getJSON();

        // VALIDASI (data integrity)
        if (!$this->validate([
            'item_name'   => 'required|min_length[3]',
            'category_id' => 'required|integer',
            'supplier_id' => 'required|integer',
            'stock'       => 'required|integer|greater_than_equal_to[0]'
        ])) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $model->insert([
            'category_id' => $data->category_id,
            'supplier_id' => $data->supplier_id,
            'item_name'   => $data->item_name,
            'stock'       => $data->stock
        ]);

        return $this->respondCreated([
            'message' => 'Barang berhasil ditambahkan'
        ]);
    }

    public function update($id = null)
    {
        $model = new ItemModel();
        $data = $this->request->getJSON();

        // CEK DATA EXIST (safety)
        $item = $model->find($id);
        if (!$item) {
            return $this->failNotFound('Data tidak ditemukan');
        }

        // VALIDASI (data integrity)
        if (!$this->validate([
            'item_name'   => 'required|min_length[3]',
            'category_id' => 'required|integer',
            'supplier_id' => 'required|integer',
            'stock'       => 'required|integer|greater_than_equal_to[0]'
        ])) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $model->update($id, [
            'category_id' => $data->category_id,
            'supplier_id' => $data->supplier_id,
            'item_name'   => $data->item_name,
            'stock'       => $data->stock
        ]);

        return $this->respond([
            'message' => 'Barang berhasil diupdate'
        ]);
    }

    public function delete($id = null)
    {
        $model = new ItemModel();

        // CEK DATA EXIST (safety)
        $item = $model->find($id);
        if (!$item) {
            return $this->failNotFound('Data tidak ditemukan');
        }

        $model->delete($id);

        return $this->respond([
            'message' => 'Barang berhasil dihapus'
        ]);
    }
}