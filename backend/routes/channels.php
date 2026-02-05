<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat.{conversationId}', function ($user, $conversationId) {
    Log::info('Channel Auth Attempt', [
        'user_id' => $user?->id,
        'conversation_id' => $conversationId,
        'channel' => "chat.{$conversationId}",
        'driver' => config('broadcasting.default'),
        'reverb_host' => config('broadcasting.connections.reverb.options.host'),
    ]);

    if (! $user) {
        Log::error('Channel Auth Failed: User not authenticated in callback');

        return false;
    }

    $conversation = \App\Models\Conversation::with('shop')->find($conversationId);
    if (! $conversation) {
        Log::warning('Channel Auth Failed: Conversation not found', ['conversation_id' => $conversationId]);

        return false;
    }

    // Check if user is the buyer or the owner of the shop
    $isAuthorized = (int) $user->id === (int) $conversation->buyer_id ||
                    (int) $user->id === (int) $conversation->shop->owner_id;

    if ($isAuthorized) {
        Log::info('Channel Auth Success', ['user_id' => $user->id, 'conversation_id' => $conversationId]);

        return [
            'id' => $user->id,
            'name' => $user->name,
        ];
    }

    Log::warning('Channel Auth Failed: User not authorized', [
        'user_id' => $user->id,
        'buyer_id' => $conversation->buyer_id,
        'shop_owner_id' => $conversation->shop->owner_id,
    ]);

    return false;
});
