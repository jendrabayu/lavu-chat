<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = ['room_id', 'from', 'to', 'body', 'read'];

    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id', 'id');
    }

    // protected $casts = [
    //     'read' => 'boolean',
    // ];
}
