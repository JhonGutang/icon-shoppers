<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function store(Request $request, $conversationId)
    {
        $request->validate([
            'body' => 'required|string',
        ]);

        $conversation = Conversation::findOrFail($conversationId);
        $this->authorizeAccess($conversation);

        $message = Message::create([
            'conversation_id' => $conversationId,
            'sender_id' => Auth::id(),
            'body' => $request->body,
        ]);

        $conversation->update(['last_message_at' => now()]);
        
        \Log::info('Messaging: Broadcasting message', [
            'id' => $message->id,
            'conversation_id' => $conversationId,
            'sender_id' => Auth::id()
        ]);

        broadcast(new MessageSent($message))->toOthers();

        \Log::info('Messaging: Broadcast sent');

        return response()->json($message);
    }

    private function authorizeAccess(Conversation $conversation)
    {
        $user = Auth::user();
        if ($conversation->buyer_id !== $user->id && $conversation->shop->owner_id !== $user->id) {
            abort(403, 'Unauthorized access to conversation.');
        }
    }
}
