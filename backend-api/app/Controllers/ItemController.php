<?php

namespace App\Controllers;

use App\Models\ItemModel;
use App\Models\StockMutationModel;
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
        $mutationModel = new StockMutationModel();
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

        $db = \Config\Database::connect();
        $db->transStart();

        $itemId = $model->insert([
            'category_id' => $data->category_id,
            'supplier_id' => $data->supplier_id,
            'item_name'   => $data->item_name,
            'stock'       => $data->stock
        ]);

        // Catat mutasi stok awal jika stok > 0
        if ($itemId && (int)$data->stock > 0) {
            $mutationModel->insert([
                'item_id'  => $itemId,
                'type'     => 'in',
                'quantity' => (int)$data->stock,
                'notes'    => 'Stok awal barang baru'
            ]);
        }

        $db->transComplete();

        if ($db->transStatus() === FALSE) {
            return $this->fail('Gagal menyimpan barang dan mutasi stok', 500);
        }

        return $this->respondCreated([
            'message' => 'Barang berhasil ditambahkan'
        ]);
    }

    public function update($id = null)
    {
        $model = new ItemModel();
        $mutationModel = new StockMutationModel();
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

        $oldStock = (int)$item['stock'];
        $newStock = (int)$data->stock;
        $diff = $newStock - $oldStock;

        $db = \Config\Database::connect();
        $db->transStart();

        $model->update($id, [
            'category_id' => $data->category_id,
            'supplier_id' => $data->supplier_id,
            'item_name'   => $data->item_name,
            'stock'       => $data->stock
        ]);

        // Catat koreksi mutasi jika ada perbedaan jumlah stok
        if ($diff !== 0) {
            $mutationModel->insert([
                'item_id'  => $id,
                'type'     => $diff > 0 ? 'in' : 'out',
                'quantity' => abs($diff),
                'notes'    => 'Koreksi stok (edit barang)'
            ]);
        }

        $db->transComplete();

        if ($db->transStatus() === FALSE) {
            return $this->fail('Gagal mengupdate barang dan mutasi stok', 500);
        }

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

    public function publicSummary()
    {
        $itemModel = new \App\Models\ItemModel();
        $categoryModel = new \App\Models\CategoryModel();
        $supplierModel = new \App\Models\SupplierModel();

        $totalItems = $itemModel->countAllResults();
        $totalCategories = $categoryModel->countAllResults();
        $totalSuppliers = $supplierModel->countAllResults();

        return $this->respond([
            'total_items'      => $totalItems,
            'total_categories' => $totalCategories,
            'total_suppliers'  => $totalSuppliers
        ]);
    }
}