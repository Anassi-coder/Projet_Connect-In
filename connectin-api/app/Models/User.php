<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
 
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'first_name',
        'last_name',
        'bio',
        'location',
        'website',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


 // Un User peut avoir plusieurs Posts
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    // Un User peut avoir plusieurs Comments
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // Un User peut avoir plusieurs Likes
    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    // Les posts qu'un User a likés (Many-to-Many)
    public function likedPosts()
    {
        return $this->belongsToMany(Post::class, 'likes')->withTimestamps();
    }

    public function getDisplayNameAttribute()
    {
        if ($this->deleted_at) {
            return "Utilisateur supprimé";
        }
    
        return $this->first_name . " " . $this->last_name;
    }
}
