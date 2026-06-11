<?php
 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\UserController;
 
// ========================================
// ROUTES PUBLIQUES (sans authentification)
// ========================================
 
// Authentification
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
 
// ========================================
// ROUTES PROTÉGÉES (avec authentification)
// ========================================
 
Route::middleware('auth:sanctum')->group(function () {
 
    // Authentification
    Route::post('/logout', [AuthController::class, 'logout']);
 
    // Profil utilisateur
    Route::get('/user', [UserController::class, 'show']);
    Route::put('/user', [UserController::class, 'update']);
    Route::delete('/user', [UserController::class, 'destroy']);
 
    // Posts
    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/user/posts', [PostController::class, 'myPosts']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::get('/posts/{id}', [PostController::class, 'show']);
    Route::put('/posts/{id}', [PostController::class, 'update']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);
 
    // Likes
    Route::post('/posts/{id}/like', [LikeController::class, 'store']);
    Route::delete('/posts/{id}/like', [LikeController::class, 'destroy']);
    Route::get('/user/likes', [LikeController::class, 'myLikes']);
 
    // Comments
    Route::get('/posts/{id}/comments', [CommentController::class, 'index']);
    Route::get('/user/comments', [CommentController::class, 'myComments']);
    Route::post('/posts/{id}/comments', [CommentController::class, 'store']);
    Route::put('/comments/{id}', [CommentController::class, 'update']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);
});
 
 