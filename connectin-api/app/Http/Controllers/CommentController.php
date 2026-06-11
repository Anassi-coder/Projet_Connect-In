<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Post;

class CommentController extends Controller
{
    /**
     * Lister les commentaires d'un post
     * GET /posts/{id}/comments
     */
    public function index($postId)  // ← La méthode
    {
        // Récupérer les commentaires du post
        $comments = Comment::where('post_id', $postId)
            ->with('user')
            ->orderBy('created_at', 'asc')
            ->get();

        // Retourner en JSON
        return response()->json($comments, 200);
    }

    public function store(Request $request, $postId)
{
    // 1. Valider
    $validated = $request->validate([
        'content' => 'required|string|max:1000'
    ]);

    // 2. Créer le commentaire
    $comment = Comment::create([
        'post_id' => $postId,
        'user_id' => auth()->id(),
        'content' => $validated['content'],
    ]);

    // 3. Charger l'auteur
    $comment->load('user');

    // 4. Retourner
    return response()->json([
        'message' => 'Commentaire ajouté avec succès',
        'comment' => $comment
    ], 201);
}

public function update(Request $request, $id){
    // 1. Récupérer le commentaire
        $comment = Comment::findOrFail($id);
        // 2. Vérifier le propriétaire
        if ($comment->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Vous n\'êtes pas autorisé à modifier ce commenter'
            ], 403);
        }
        // 3. Valider les données
        $validated = $request->validate([
            "content" => "required|string|max:1000",
        ]);
        // 4. Mettre à jour
        $comment->update($validated);
        // 5. Charger les relations
        $comment->load(['user']);
        // Retourner la réponse
        return response()->json([
            'message' => 'Commentaire modifier avec succès',
            'comment' => $comment
        ], 200);
}

public function destroy($id){
    // 1. Récupérer le commentaire
        $comment = Comment::findOrFail($id);
        // 2. Vérifier le propriétaire
        if ($comment->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Vous n\'êtes pas autorisé à supprimer ce commentaire'
            ], 403);
        }

         // 3. Supprimer le post
        $comment->delete();

        // 4. Retourner confirmation
        return response()->json([
            'message' => 'Commentaire supprimé avec succès'
        ], 200);
}

public function myComments(Request $request)
{
    $user = $request->user();

    $comments = $user->comments()
        ->with(['post', 'post.user'])
        ->latest()
        ->get();

    return response()->json($comments);
}
}
