<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CooperadoController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/cooperados/search', [CooperadoController::class, 'search']);
Route::apiResource('cooperados', CooperadoController::class);