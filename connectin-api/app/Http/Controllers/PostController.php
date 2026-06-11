<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Créer un nouveau post
     * POST /api/posts
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "content" => "required|string|max:1000",
            "image_path" => "nullable|image|mimes:jpg,jpeg,png,gif|max:2048"
        ]);

        $imagePath = null;

        if ($request->hasFile('image_path')) {
            $imagePath = $request->file('image_path')->store('posts', 'public');
        }

        $post = Post::create([
            "user_id" => auth()->id(),
            "content" => $validated['content'],
            "image_path" => $imagePath
        ]);

        $post->load(['user', 'comments', 'likes']);

        return response()->json([
            'message' => 'Post créé avec succès',
            'post' => $post
        ], 201);
    }

    /**
     * Lister tous les posts
     * GET /api/posts
     */
    public function index()
    {
        $userId = auth()->id();

    $posts = Post::with(['user', 'comments.user'])
        ->withCount(['likes', 'comments'])
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($post) use ($userId) {
            $post->liked_by_user = $post->likes()
                ->where('user_id', $userId)
                ->exists();

                if ($post->user) {
                $post->user->display_name = $post->user->deleted_at
                    ? "Utilisateur supprimé"
                    : $post->user->first_name . " " . $post->user->last_name;
        }

            return $post;
        });

    return response()->json($posts, 200);
    }

    /**
     * Afficher un post spécifique
     * GET /api/posts/{id}
     */
    public function show($id)
    {
        $post = Post::with(['user', 'comments.user'])
            ->withCount(['likes', 'comments'])
            ->findOrFail($id);

        return response()->json($post, 200);
    }

    /**
     * Modifier un post
     * PUT /api/posts/{id}
     */
    public function update(Request $request, $id)
{
    $post = Post::findOrFail($id);

    if ($post->user_id !== auth()->id()) {
        return response()->json([
            'message' => 'Vous n\'êtes pas autorisé à modifier ce post'
        ], 403);
    }

    // validation
    $validated = $request->validate([
        "content" => "required|string|max:1000",
        "image" => "nullable|image|mimes:jpg,jpeg,png,gif|max:2048"
    ]);

    $post->content = $validated['content'];

    // supprimer image
    if ($request->remove_image) {

        if ($post->image_path) {
            Storage::disk('public')->delete($post->image_path);
        }

        $post->image_path = null;
    }

    // remplacer image
    if ($request->hasFile('image')) {

        if ($post->image_path) {
            Storage::disk('public')->delete($post->image_path);
        }

        $path = $request->file('image')->store('posts', 'public');

        $post->image_path = $path;
    }

    $post->save();

    $post->load(['user','comments.user']);

    return response()->json([
        'message' => 'Post modifié avec succès',
        'post' => $post
    ], 200);
}

    /**
     * Supprimer un post
     * DELETE /api/posts/{id}
     */
    public function destroy($id)
    {
        // 1. Récupérer le post
        $post = Post::findOrFail($id);

        // 2. Vérifier le propriétaire
        if ($post->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Vous n\'êtes pas autorisé à supprimer ce post'
            ], 403);
        }

        if ($post->image_path) {
            Storage::disk('public')->delete($post->image_path);
        }
        // 3. Supprimer le post
        $post->delete();

        // 4. Retourner confirmation
        return response()->json([
            'message' => 'Post supprimé avec succès'
        ], 200);
    }

    public function myPosts(Request $request)
{
    $userId = auth()->id();

    $posts = Post::with(['user', 'comments.user'])
        ->withCount(['likes', 'comments'])
        ->where('user_id', $userId)
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($post) use ($userId) {

            $post->liked_by_user = $post->likes()
                ->where('user_id', $userId)
                ->exists();

            return $post;
        });

    return response()->json($posts, 200);
}
}
