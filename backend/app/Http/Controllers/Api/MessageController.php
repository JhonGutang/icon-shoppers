<?php

namespace App\Http\Controllers\Api;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Notifications\NewMessageNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{
    public function index($conversationId)
    {
        $conversation = Conversation::findOrFail($conversationId);
        $this->authorizeAccess($conversation);

        $messages = Message::where('conversation_id', $conversationId)
            ->with('sender')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($messages);
    }

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

        // Notify recipient
        $recipientId = Auth::id() === $conversation->buyer_id
            ? $conversation->shop->owner_id
            : $conversation->buyer_id;

        $recipient = \App\Models\User::find($recipientId);
        if ($recipient) {
            $recipient->notify(new NewMessageNotification($message->load('sender')));
        }

        try {
            broadcast(new MessageSent($message))->toOthers();
        } catch (\Exception $e) {
            Log::error('Real-time: Broadcast message sent failure', [
                'message_id' => $message->id,
                'error' => $e->getMessage(),
            ]);
        }

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
