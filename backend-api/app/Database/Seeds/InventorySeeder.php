<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class InventorySeeder extends Seeder
{
    public function run()
    {
        $db = \Config\Database::connect();
        
        // Nonaktifkan pemeriksaan foreign key sementara untuk mengosongkan tabel
        $db->query('SET FOREIGN_KEY_CHECKS = 0;');

        // Kosongkan tabel (Truncate)
        $db->table('stock_mutations')->truncate();
        $db->table('items')->truncate();
        $db->table('suppliers')->truncate();
        $db->table('categories')->truncate();

        // Seed Categories
        $categories = [
            ['id' => 1, 'name' => 'Elektronik'],
            ['id' => 2, 'name' => 'Peralatan Kantor'],
            ['id' => 3, 'name' => 'Bahan Makanan'],
            ['id' => 4, 'name' => 'Pakaian & Tekstil'],
            ['id' => 5, 'name' => 'ATK & Kertas'],
        ];
        $db->table('categories')->insertBatch($categories);

        // Seed Suppliers
        $suppliers = [
            ['id' => 1, 'name' => 'PT Sinar Baru Jaya', 'phone' => '081234567890', 'category_id' => 1],
            ['id' => 2, 'name' => 'CV Global Tech', 'phone' => '082187654321', 'category_id' => 1],
            ['id' => 3, 'name' => 'PT Office World', 'phone' => '081199887766', 'category_id' => 2],
            ['id' => 4, 'name' => 'CV Berkah Pangan', 'phone' => '085244332211', 'category_id' => 3],
            ['id' => 5, 'name' => 'PT Garmen Nusantara', 'phone' => '081377665544', 'category_id' => 4],
            ['id' => 6, 'name' => 'CV Cahaya ATK', 'phone' => '089911223344', 'category_id' => 5],
        ];
        $db->table('suppliers')->insertBatch($suppliers);

        // Seed Items
        $items = [
            ['id' => 1, 'category_id' => 1, 'supplier_id' => 1, 'item_name' => 'Laptop Asus Zenbook', 'stock' => 15],
            ['id' => 2, 'category_id' => 1, 'supplier_id' => 2, 'item_name' => 'Mouse Wireless Logitech', 'stock' => 50],
            ['id' => 3, 'category_id' => 1, 'supplier_id' => 2, 'item_name' => 'Keyboard Mechanical Keychron', 'stock' => 25],
            ['id' => 4, 'category_id' => 1, 'supplier_id' => 1, 'item_name' => 'Monitor Dell 24" UltraSharp', 'stock' => 12],
            ['id' => 5, 'category_id' => 2, 'supplier_id' => 3, 'item_name' => 'Kursi Kerja Ergonomis', 'stock' => 8],
            ['id' => 6, 'category_id' => 2, 'supplier_id' => 3, 'item_name' => 'Meja Kantor Minimalis', 'stock' => 6],
            ['id' => 7, 'category_id' => 3, 'supplier_id' => 4, 'item_name' => 'Kopi Arabika Gayo 250g', 'stock' => 120],
            ['id' => 8, 'category_id' => 3, 'supplier_id' => 4, 'item_name' => 'Teh Premium Melati', 'stock' => 80],
            ['id' => 9, 'category_id' => 4, 'supplier_id' => 5, 'item_name' => 'Kaos Polos Cotton Combed', 'stock' => 200],
            ['id' => 10, 'category_id' => 4, 'supplier_id' => 5, 'item_name' => 'Kemeja Flanel Slimfit', 'stock' => 45],
            ['id' => 11, 'category_id' => 5, 'supplier_id' => 6, 'item_name' => 'Kertas HVS A4 80gsm', 'stock' => 300],
            ['id' => 12, 'category_id' => 5, 'supplier_id' => 6, 'item_name' => 'Pulpen Gel Hitam 0.5mm', 'stock' => 500],
        ];
        $db->table('items')->insertBatch($items);

        // Seed initial Stock Mutations
        $mutations = [];
        foreach ($items as $item) {
            $mutations[] = [
                'item_id'    => $item['id'],
                'type'       => 'in',
                'quantity'   => $item['stock'],
                'notes'      => 'Stok awal barang',
                'created_at' => date('Y-m-d H:i:s'),
            ];
        }
        $db->table('stock_mutations')->insertBatch($mutations);

        // Aktifkan kembali pemeriksaan foreign key
        $db->query('SET FOREIGN_KEY_CHECKS = 1;');
    }
}
