<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat.{conversationId}', function ($user, $conversationId) {
    $conversation = \App\Models\Conversation::with('shop')->find($conversationId);
    if (! $conversation) {
        return false;
    }

    // Check if user is the buyer or the owner of the shop
    $isAuthorized = (int) $user->id === (int) $conversation->buyer_id ||
                    (int) $user->id === (int) $conversation->shop->owner_id;

    if ($isAuthorized) {
        return [
            'id' => $user->id,
            'name' => $user->name,
        ];
    }

    return false;
});
