# Emoji Picker Feature

## Overview

The emoji picker allows users to quickly add emojis to messages in the chat system. Located in the message input area (between the text input and send button), it uses the lightweight `@emoji-mart/react` library.

## Implementation

### Components & Files

- **Location:** `frontend/src/app/messages/page.tsx` (lines 535–554)
- **Library:** `@emoji-mart/react` + `@emoji-mart/data`
- **UI Button:** `SmilePlus` icon from `lucide-react`

### State Management

```typescript
const [showEmojiPicker, setShowEmojiPicker] = useState(false);
const emojiPickerRef = useRef<HTMLDivElement>(null);
```

- `showEmojiPicker` — controls picker visibility (toggle on button click)
- `emojiPickerRef` — wrapper div for semantic reference

### Callback

```typescript
const handleEmojiSelect = useCallback((emoji: { native: string }) => {
  setNewMessage((prev) => prev + emoji.native);
}, []);
```

- Appends the selected emoji's Unicode character (`.native`) to the message
- Picker remains open for selecting multiple emojis
- Picker closes automatically when message is sent (line 308 in `handleSendMessage`)

## Data Flow

1. **Selection** → `Picker.onEmojiSelect` fires
2. **Append** → `handleEmojiSelect` adds emoji to `newMessage` state
3. **Display** → Emoji renders in text input as Unicode character
4. **Storage** → Sent via API in `body` field (stored as-is in DB)
5. **Retrieval** → Emoji displays in chat as native Unicode (no rendering required)

## Styling & UX

| Element | Styling |
|---------|---------|
| **Emoji Button** | `h-11 w-11` rounded circle, stone-100 bg, stone-500 text |
| **Picker Container** | `absolute bottom-14 right-0 z-50` (above button) |
| **Picker Theme** | Light theme, preview/skin-tone features disabled |

### Behavior

- **Click emoji button** → Picker toggles open/closed
- **Click emoji in picker** → Appended to message, picker stays open
- **Send message** → Picker auto-closes (cleared for next message)
- **Multiple emojis** → Users can select many in one session without reopening

## Performance

- **Bundle Impact:** ~6 KB gzipped (emoji-mart is optimized)
- **Data Load:** All emoji data loaded once on component mount
- **Re-renders:** Minimal (callback memoized, state-isolated)

## Database Schema

Emojis are stored as UTF-8 Unicode characters in the existing `messages.body` text column. No schema changes required.

```sql
-- Example storage
SELECT body FROM messages WHERE id = 1;
-- Output: "Love this! 🎉😍✨"
```

## Browser Compatibility

Emoji rendering depends on OS/browser support. Modern browsers (Chrome, Firefox, Safari, Edge) render emojis natively.

## Future Enhancements

- Add emoji search (currently disabled for simplicity)
- Persist recently-used emojis
- Custom emoji support
- Emoji reactions on messages
