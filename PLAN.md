# Implementation Plan - Chat App Features

This plan outlines the steps to implement User Authentication, Room Management, and a Friend System for the existing Sentinel Chat Application.

## User Review Required

> [!IMPORTANT]
> - I will be creating new database tables using raw SQL migrations in `apps/api/src/db/migrations`.
> - I will assume `postgres` is running locally as per `pool.ts` connection string.
> - I will implement JWT-based authentication.

## Proposed Changes

### Database
#### [NEW] [migrations/001_init.sql](file:///Users/karan/Desktop/Projects/Sentinel/apps/api/src/db/migrations/001_init.sql)
- Create `users` table (id, username, email, password_hash, image_url, created_at).
- Create `rooms` table (id, name, type, created_at).
- Create `room_users` table (room_id, user_id, role).
- Create `friends` table (user_id_1, user_id_2, status).
- Ensure `messages` table exists and matches requirements.

### API (`apps/api`)
#### [NEW] [src/routes/auth.routes.ts](file:///Users/karan/Desktop/Projects/Sentinel/apps/api/src/routes/auth.routes.ts)
- `POST /signup`: Register new user.
- `POST /login`: Authenticate and return JWT.

#### [NEW] [src/routes/room.routes.ts](file:///Users/karan/Desktop/Projects/Sentinel/apps/api/src/routes/room.routes.ts)
- `POST /`: Create a room.
- `GET /`: List user's rooms.
- `POST /:roomId/join`: Join a room.

#### [NEW] [src/routes/friend.routes.ts](file:///Users/karan/Desktop/Projects/Sentinel/apps/api/src/routes/friend.routes.ts)
- `POST /request`: Send friend request.
- `POST /accept`: Accept friend request.
- `GET /`: List friends.

#### [MODIFY] [src/index.ts](file:///Users/karan/Desktop/Projects/Sentinel/apps/api/src/index.ts)
- Register new routers.

### Gateway (`apps/gateway`)
#### [MODIFY] [src/auth/socket.auth.ts](file:///Users/karan/Desktop/Projects/Sentinel/apps/gateway/src/auth/socket.auth.ts)
- Ensure it validates the JWT issued by API.

### Frontend (`apps/frontend`)
#### [NEW] [app/auth/page.tsx](file:///Users/karan/Desktop/Projects/Sentinel/apps/frontend/app/auth/page.tsx)
- Login/Signup form.

#### [NEW] [app/chat/page.tsx](file:///Users/karan/Desktop/Projects/Sentinel/apps/frontend/app/chat/page.tsx)
- Main chat interface with Sidebar (Rooms/Friends) and Chat Area.

## Verification Plan

### Automated Tests
- I will create a test script `scripts/test-flow.ts` to:
    1.  Call API to Signup & Login (verify JWT).
    2.  Call API to Create Room.
    3.  Connect WS Gateway with JWT.
    4.  Send/Receive messages.

### Manual Verification
- **Run the App**: `npm run dev` in root.
- **Frontend**: Navigate to `/auth`, signup, then redirected to `/chat`.
- **Chat**: Create a room, send a message.
- **Multi-user**: Open incognito window, signup as another user, join same room, verify real-time chat.
