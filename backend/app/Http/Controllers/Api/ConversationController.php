<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use Illuminate\Support\Facades\Auth;

class ConversationController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $conversations = Conversation::where('buyer_id', $user->id)
            ->orWhereHas('shop', function ($query) use ($user) {
                $query->where('owner_id', $user->id);
            })
            ->with(['buyer', 'shop', 'lastMessage'])
            ->orderBy('last_message_at', 'desc')
            ->get();

        return response()->json($conversations);
    }

    public function show($id)
    {
        $conversation = Conversation::with(['messages.sender', 'buyer', 'shop'])
            ->findOrFail($id);

        $this->authorizeAccess($conversation);

        return response()->json($conversation);
    }

    private function authorizeAccess(Conversation $conversation)
    {
        $user = Auth::user();
        if ($conversation->buyer_id !== $user->id && $conversation->shop->owner_id !== $user->id) {
            abort(403, 'Unauthorized access to conversation.');
        }
    }
}
