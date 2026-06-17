<?php

namespace App\Controllers;

use App\Models\CategoryModel;
use CodeIgniter\RESTful\ResourceController;

class CategoryController extends ResourceController
{
    public function index()
    {
        $model = new CategoryModel();
        return $this->respond($model->findAll());
    }

    public function create()
    {
        $model = new CategoryModel();

        $model->insert([
            'name' => $this->request->getJSON()->name
        ]);

        return $this->respondCreated([
            'message' => 'Category berhasil ditambahkan'
        ]);
    }

    public function update($id = null)
    {
        $model = new CategoryModel();

        $model->update($id, [
            'name' => $this->request->getJSON()->name
        ]);

        return $this->respond([
            'message' => 'Category berhasil diupdate'
        ]);
    }

    public function delete($id = null)
    {
        $model = new CategoryModel();

        $model->delete($id);

        return $this->respond([
            'message' => 'Category berhasil dihapus'
        ]);
    }
}