<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */

$routes->get('/', 'Home::index');
$routes->get('test', 'Test::index');

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/
$routes->post('login', 'LoginController::login');
$routes->get('login/test', 'LoginController::test');
$routes->options('(:any)', 'LoginController::test');

/*
|--------------------------------------------------------------------------
| Categories (TIDAK DIPROTEKSI)
|--------------------------------------------------------------------------
*/
$routes->get('categories', 'CategoryController::index');
$routes->post('categories', 'CategoryController::create');
$routes->put('categories/(:num)', 'CategoryController::update/$1');
$routes->delete('categories/(:num)', 'CategoryController::delete/$1');

/*
|--------------------------------------------------------------------------
| Suppliers (TIDAK DIPROTEKSI)
|--------------------------------------------------------------------------
*/
$routes->get('suppliers', 'SupplierController::index');
$routes->post('suppliers', 'SupplierController::create');
$routes->put('suppliers/(:num)', 'SupplierController::update/$1');
$routes->delete('suppliers/(:num)', 'SupplierController::delete/$1');

/*
|--------------------------------------------------------------------------
| ITEMS (WAJIB TOKEN / PROTECTED)
|--------------------------------------------------------------------------
*/
$routes->group('items', ['filter' => 'auth'], function($routes) {
    $routes->get('/', 'ItemController::index');
    $routes->post('/', 'ItemController::create');
    $routes->put('(:num)', 'ItemController::update/$1');
    $routes->delete('(:num)', 'ItemController::delete/$1');
});