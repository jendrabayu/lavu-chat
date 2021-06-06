<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Secret extends Model
{
    use HasFactory;

    protected $fillable = ['room_id', 'user_id', 'e', 'n', 'd', 'r', 't', 'x', 'big_x'];
}
