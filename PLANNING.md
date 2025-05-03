# PLANNING.md - Real-Time User Action Tracker

## ENV
We already have a .env file. You will not be able to see it since you do not have the permissions. That is ok. But know that we do in fact have it and it is located in the current project inside the vite-project file

## 🎯 Project Vision
A real-time user action tracking application that captures and displays user interactions with buttons in real-time. When a user clicks a button, all connected users see a notification displaying "<username> clicked button <button_name>".

## 🏗️ Architecture Overview

### Frontend
- React application with TypeScript
- Real-time updates using Supabase Realtime subscriptions
- Responsive design
- Components organized by feature

### Backend
- Fully serverless architecture using Supabase Edge Functions
- PostgreSQL database for data persistence
- Real-time broadcasting using Supabase Realtime
- Authentication via Supabase Auth

### Edge Functions Structure
```
/supabase/functions/
├── auth/                    # Authentication management
│   └── index.ts
├── log-action/             # Log user button clicks
│   └── index.ts
├── get-profile/            # Retrieve user profile data
│   └── index.ts
└── realtime-handler/       # Manage WebSocket connections
    └── index.ts
```

## 📋 Feature Requirements

### Authentication
- Email/password login
- User registration
- Session management
- Protected routes

### Real-Time Tracking
- Capture button click events
- Store action data in database
- Broadcast actions to all connected users
- Display format: "<username> clicked button <button_name>"

### User Interface
- Login page (full screen)
- Main dashboard with:
  - Multiple interactive buttons (left side)
  - Real-time action feed (right third)
  - User information display

## 🔄 Data Flow

1. **Authentication Flow**
   - User enters credentials → `auth` Edge Function → Supabase Auth
   - Session token generated → Stored in localStorage
   - Protected routes validate token

2. **Action Logging Flow**
   - User clicks button → Frontend captures event
   - Event sent to `log-action` Edge Function
   - Action stored in `button_clicks` table
   - Realtime subscription notifies all clients

3. **Real-time Updates Flow**
   - Frontend subscribes to `button_clicks` table
   - New records trigger real-time events
   - UI updates to display recent actions

## 📦 Database Schema

### users (managed by Supabase Auth)
- `id` (uuid, primary key)
- `email` (text)
- `created_at` (timestamp)

### button_clicks
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to users)
- `button_name` (text)
- `clicked_at` (timestamp)
- `created_at` (timestamp)

### profiles
- `id` (uuid, primary key, foreign key to users)
- `username` (text)
- `display_name` (text)
- `updated_at` (timestamp)

## 🛠️ Technology Stack

### Frontend
- React 18+ with TypeScript
- Supabase JavaScript client
- React Router for navigation
- Tailwind CSS for styling
- Vite for build tooling

### Backend
- Supabase Edge Functions (TypeScript/Deno)
- PostgreSQL with Row Level Security
- Supabase Realtime
- Supabase Auth

### Development Tools
- ESLint & Prettier
- Jest & React Testing Library
- TypeScript
- Vercel for deployment

## 🔒 Security Considerations

### Row Level Security Policies
```sql
-- button_clicks table
CREATE POLICY "Users can insert their own clicks"
ON button_clicks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view clicks"
ON button_clicks FOR SELECT
TO authenticated
USING (true);
```

### Edge Functions Security
- JWT validation for authenticated endpoints
- Rate limiting to prevent abuse
- Input sanitization
- No sensitive data logging

## 📁 Project Structure
```
/
├── src/
│   ├── components/
│   │   ├── auth/           # Login, Register components
│   │   ├── dashboard/      # Main dashboard components
│   │   └── common/         # Shared components
│   ├── hooks/
│   │   ├── useAuth.ts      # Authentication hook
│   │   └── useRealtime.ts  # Realtime subscription hook
│   ├── pages/
│   │   ├── Login.tsx
│   │   └── Dashboard.tsx
│   ├── services/
│   │   └── supabase.ts     # Supabase client configuration
│   ├── types/
│   │   └── index.ts        # TypeScript interfaces
│   └── main.tsx
├── supabase/
│   ├── functions/          # Edge Functions
│   ├── migrations/         # Database migrations
│   └── config.toml
├── tests/
│   ├── components/
│   └── hooks/
└── package.json
```

## 🚀 Development Phases

### Phase 1: Foundation
- Set up Supabase project
- Implement authentication flow
- Create database schema
- Set up Edge Functions

### Phase 2: Core Features
- Implement button click tracking
- Create real-time subscription system
- Build UI components
- Set up testing framework

### Phase 3: Polish
- Add error handling
- Implement loading states
- Optimize performance
- Deploy to production

## 📚 Key Constraints
- All backend logic must use Edge Functions
- No traditional server setup
- Real-time updates required
- Responsive design for all devices
- TypeScript for type safety
- Maximum 400 lines per file
- Comprehensive testing coverage