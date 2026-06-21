<?php

namespace App\Controllers;

use App\Models\StockMutationModel;
use App\Models\ItemModel;
use CodeIgniter\RESTful\ResourceController;

class StockController extends ResourceController
{
    public function index()
    {
        $model = new StockMutationModel();
        
        $data = $model
            ->select('stock_mutations.*, items.item_name')
            ->join('items', 'items.id = stock_mutations.item_id')
            ->orderBy('stock_mutations.created_at', 'DESC')
            ->findAll();

        return $this->respond($data);
    }

    public function create()
    {
        $mutationModel = new StockMutationModel();
        $itemModel = new ItemModel();
        
        $data = $this->request->getJSON();

        if (!$data) {
            return $this->fail('Data tidak valid', 400);
        }

        // VALIDASI input
        if (!$this->validate([
            'item_id'  => 'required|integer',
            'type'     => 'required|in_list[in,out]',
            'quantity' => 'required|integer|greater_than[0]',
            'notes'    => 'permit_empty|string'
        ])) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        // Cek apakah item exist
        $item = $itemModel->find($data->item_id);
        if (!$item) {
            return $this->failNotFound('Barang tidak ditemukan');
        }

        $qty = (int)$data->quantity;
        $currentStock = (int)$item['stock'];
        $newStock = $currentStock;

        if ($data->type === 'in') {
            $newStock += $qty;
        } else {
            // type === 'out'
            if ($currentStock < $qty) {
                return $this->fail('Stok barang tidak mencukupi. Stok saat ini: ' . $currentStock, 400);
            }
            $newStock -= $qty;
        }

        $db = \Config\Database::connect();
        $db->transStart();

        // 1. Update stok barang
        $itemModel->update($data->item_id, ['stock' => $newStock]);

        // 2. Insert transaksi
        $mutationModel->insert([
            'item_id'    => $data->item_id,
            'type'       => $data->type,
            'quantity'   => $qty,
            'notes'      => $data->notes ?? ''
        ]);

        $db->transComplete();

        if ($db->transStatus() === FALSE) {
            return $this->fail('Gagal memproses transaksi stok', 500);
        }

        return $this->respondCreated([
            'message' => 'Transaksi stok berhasil diproses',
            'new_stock' => $newStock
        ]);
    }
}
