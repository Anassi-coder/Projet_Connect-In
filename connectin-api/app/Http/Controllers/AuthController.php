<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;



class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Validation des données
        $validated = $request->validate([
            'username' => 'required|string|unique:users,username',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
        ]);

        // Création de l'utilisateur
        $user = User::create($validated);

        // Création d'un token d'authentification pour l'utilisateur
        $token = $user->createToken('auth_token')->plainTextToken;

        // Retourner une réponse avec un token d'authentification
        return response()->json([
            'message' => 'Utilisateur enregistré avec succès',
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        // Validation des données
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Récuperation de l'utilisateur via son email
        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        // Création d'un token d'authentification pour l'utilisateur
        $token = $user->createToken('auth_token')->plainTextToken;

        // Retourner une réponse avec un token d'authentification
        return response()->json([
            'message' => 'Connexion réussie',
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        // Supprimer le token actif de l'utilisateur afin de le déconnecter
        $request->user()->currentAccessToken()->delete();

        return response()->json ([
            'message' => 'Déconnexion réussie'
        ]);
    }
}
