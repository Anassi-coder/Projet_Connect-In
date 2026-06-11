<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Like;
use App\Models\Post;

class LikeController extends Controller
{
     public function store($id)
    {
        // 1. Récupérer le post
        $post = Post::findOrFail($id);

        // 2. Récupérer l'utilisateur connecté
        $user = auth()->user();

        // 3. Vérifier si l'utilisateur a déjà liké ce post
        $existingLike = Like::where('user_id', $user->id)
                            ->where('post_id', $post->id)
                            ->first();

        if ($existingLike) {
            return response()->json([
                'message' => 'Vous avez déjà liké ce post'
            ], 400);
        }

         // 4. Créer le like
        $like = Like::create([
            'user_id' => $user->id,
            'post_id' => $post->id,
        ]);

        // 5. Compter le nombre total de likes
        $likesCount = $post->likes()->count();

        // 6. Retourner la réponse
        return response()->json([
            'message' => 'Post liké avec succès',
            'likes_count' => $likesCount
        ], 201);
    }
     /**
     * Retirer le like d'un post
     * DELETE /api/posts/{id}/like
     */
    public function destroy($id)
    {// 1. Récupérer le post
        $post = Post::findOrFail($id);

        // 2. Récupérer l'utilisateur connecté
        $user = auth()->user();

        // 3. Trouver le like de cet utilisateur sur ce post
        $like = Like::where('user_id', $user->id)
                    ->where('post_id', $post->id)
                    ->first();

        // 4. Si le like n'existe pas
        if (!$like) {
            return response()->json([
                'message' => 'Vous n\'avez pas liké ce post'
            ], 400);
        }

        // 5. Supprimer le like
        $like->delete();

        // 6. Compter le nombre total de likes restants
        $likesCount = $post->likes()->count();

        // 7. Retourner la réponse
        return response()->json([
            'message' => 'Like retiré avec succès',
            'likes_count' => $likesCount
        ], 200);
    }

    public function myLikes(Request $request)
{
    $userId = $request->user()->id;

    $posts = \App\Models\Post::with(['user'])
        ->withCount(['likes', 'comments'])
        ->whereHas('likes', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
        ->latest()
        ->get()
        ->map(function ($post) {
            $post->liked_by_user = true;
            return $post;
        });

    return response()->json($posts);
}
}
