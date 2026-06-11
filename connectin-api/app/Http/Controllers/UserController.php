<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(Request $request)
{
    $user = $request->user();

    return response()->json([
        'user' => [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'bio' => $user->bio,
            'location' => $user->location,
            'website' => $user->website,
        ]
    ]);
}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        // Validation des données
        $validated = $request->validate([
            'username' => 'sometimes|required|string|unique:users,username,' . $user->id,
            'email' => 'sometimes|required|string|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|required|string|min:8|confirmed',
            'first_name' => 'sometimes|required|string',
            'last_name' => 'sometimes|required|string',
            'bio'        => 'sometimes|nullable|string',
            'location'   => 'sometimes|nullable|string',
            'website'    => 'sometimes|nullable|string',
        ]);

        // Mise à jour de l'utilisateur
        $user->update($validated);

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès',
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'bio' => $user->bio,
                'location' => $user->location,
                'website' => $user->website,
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'delete_content' => 'required|boolean'
        ]);

        // On récupère le choix envoyé par le front
        $deleteContent = $request->boolean('delete_content');

        if ($deleteContent) {
            // OPTION 1 : suppression totale de l'utilisateur et de son contenu
            $user->comments()->forceDelete();
            $user->posts()->forceDelete();
            $user->forceDelete();

            return response()->json([
                'message' => 'Compte et contenu supprimés définitivement.'
            ]);
        }

        // OPTION 2 : conservation du contenu avec un auteur "Utilisateur supprimé"
        $user->likes()->delete(); // suppression des likes uniquement
        $user->delete(); // soft delete de l'utilisateur uniquement

        return response()->json([
            'message' => 'Compte supprimé. Le contenu est conservé.'
        ]);
    }
}
