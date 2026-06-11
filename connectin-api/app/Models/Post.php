<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
     use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'content',
        'image_path',
    ];

    // =============================
    // RELATIONS
    // =============================

    // Un Post appartient à un User
    public function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    // Un Post peut avoir plusieurs Comments
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // Un Post peut avoir plusieurs Likes
    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    // Les Users qui ont liké ce Post (Many-to-Many)
    public function likedBy()
    {
        return $this->belongsToMany(User::class, 'likes')->withTimestamps();
    }
}
