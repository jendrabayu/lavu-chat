<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    public function secrets()
    {
        return $this->hasMany(Secret::class, 'room_id', 'id');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'room_id', 'id');
    }
}
