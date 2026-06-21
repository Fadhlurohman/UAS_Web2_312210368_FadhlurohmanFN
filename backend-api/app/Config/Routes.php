<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */

$routes->get('/', 'Home::index');
$routes->get('test', 'Test::index');
$routes->get('public-summary', 'ItemController::publicSummary');

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
| Categories (GET Publik, POST/PUT/DELETE Proteksi)
|--------------------------------------------------------------------------
*/
$routes->get('categories', 'CategoryController::index');
$routes->group('categories', ['filter' => 'auth'], function($routes) {
    $routes->post('/', 'CategoryController::create');
    $routes->put('(:num)', 'CategoryController::update/$1');
    $routes->delete('(:num)', 'CategoryController::delete/$1');
});

/*
|--------------------------------------------------------------------------
| Suppliers (GET Publik, POST/PUT/DELETE Proteksi)
|--------------------------------------------------------------------------
*/
$routes->get('suppliers', 'SupplierController::index');
$routes->group('suppliers', ['filter' => 'auth'], function($routes) {
    $routes->post('/', 'SupplierController::create');
    $routes->put('(:num)', 'SupplierController::update/$1');
    $routes->delete('(:num)', 'SupplierController::delete/$1');
});

/*
|--------------------------------------------------------------------------
| ITEMS
|--------------------------------------------------------------------------
*/
$routes->get('items', 'ItemController::index');
$routes->group('items', ['filter' => 'auth'], function($routes) {
    $routes->post('/', 'ItemController::create');
    $routes->put('(:num)', 'ItemController::update/$1');
    $routes->delete('(:num)', 'ItemController::delete/$1');
});

/*
|--------------------------------------------------------------------------
| STOCKS
|--------------------------------------------------------------------------
|*/
$routes->get('stocks', 'StockController::index');
$routes->group('stocks', ['filter' => 'auth'], function($routes) {
    $routes->post('/', 'StockController::create');
});