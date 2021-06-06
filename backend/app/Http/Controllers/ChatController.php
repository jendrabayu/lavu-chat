<?php

namespace App\Http\Controllers;

use App\Events\NewMessage;
use App\Models\Message;
use App\Models\Room;
use App\Models\Secret;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    public function getContacts()
    {
        $contacts = User::where('id', '<>', Auth::id())->get();
        $unreadIds = Message::select(DB::raw('`from` as sender_id, count(`from`) as messages_count '))
            ->where('to', Auth::id())
            ->where('read', 0)
            ->groupBy('from')
            ->get();

        $contacts = $contacts->map(function ($contact) use ($unreadIds) {
            $contactUnread = $unreadIds->where('sender_id', $contact->id)->first();
            $contact->unread = $contactUnread ? $contactUnread->messages_count : 0;
            return $contact;
        });

        return response()->json([
            'status' => 'success',
            'data' => $contacts
        ], 200);
    }

    public function send(Request $request)
    {
        $message = Message::create($request->all());

        broadcast(new NewMessage($message));

        return response()->json([
            'status' => 'success',
            'data' => $message
        ]);
    }

    public function getMessagesFor(Request $request, $user_id)
    {
        $room = $this->getRoomByUserId($user_id);

        if (!$room) {
            DB::beginTransaction();
            try {
                $room = Room::create([]);
                $a = $request->a;
                $b = $request->b;
                $a['room_id'] = $room->id;
                $a['user_id'] = auth()->id();
                $b['room_id'] = $room->id;
                $b['user_id'] = $user_id;
                Secret::create($a);
                Secret::create($b);
                DB::commit();
                $room = $this->getRoomByUserId($user_id);
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json(['status' => 'fail', 'message' => $e->getMessage()]);
            }
        }

        Message::where('room_id', $room->id)
            ->where('from', $user_id)
            ->where('to', Auth::id())
            ->update(['read' => true]);

        $from = $room->secrets->where('user_id', auth()->id())->map(function ($item) {
            return [
                'e' => $item->e,
                'n' => $item->n,
                'd' => $item->d,
                'r' => $item->r,
                't' => $item->t,
                'x' => $item->x,
                'big_x' => $item->big_x
            ];
        })->first();
        $to = $room->secrets->where('user_id', $user_id)->map(function ($item) {
            return [
                'e' => $item->e,
                'n' => $item->n,
                't' => $item->t,
                'r' => $item->r,
                'big_x' => $item->big_x
            ];
        })->first();

        return response()->json([
            'status' => 'success',
            'data' => [
                'room_id' => $room->id,
                'messages' => $room->messages,
                'secrets' => [
                    'from' => $from,
                    'to' => $to
                ]
            ]
        ]);
    }

    private function getRoomByUserId($user_id)
    {
        $room = Room::whereHas('secrets', function ($q) {
            $q->where('user_id', auth()->id());
        })->get();

        $room = $room->filter(function ($value) use ($user_id) {
            $secrets = $value->secrets->toArray();
            return in_array($user_id, [$secrets[0]['user_id'], $secrets[1]['user_id']]);
        });

        return $room->first();
    }
}
