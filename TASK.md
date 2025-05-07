# TASK.md - Real-Time User Action Tracker

**Last Updated:** 2025-05-02

## 🎯 Current Active Tasks

### Phase 1: Foundation Setup
- [x] Initialize React project with Vite
  - [x] Configure TypeScript
  - [x] Set up ESLint and Prettier
  - [x] Configure Tailwind CSS
- [x] Set up Supabase project
  - [x] Create new Supabase project
  - [x] Note down Project URL and Anon Key
  - [x] Set up environment variables (`.env` already created)
- [x] Create database schema
  - [x] Run migrations for `profiles` table
  - [x] Run migrations for `button_clicks` table
  - [x] Set up Row Level Security policies
- [ ] Initialize Edge Functions
  - [x] Create /supabase/functions/ directory
  - [x] Create /supabase/functions/auth/ directory and index.ts
  - [x] Set up Supabase CLI
  - [x] Create /supabase/functions/log-action/ directory and index.ts
  - [x] Create /supabase/functions/get-profile/ directory and index.ts
  - [x] Create /supabase/functions/realtime-handler/ directory and index.ts
  - [x] Configure Deno environment

### Tailwind CSS Configuration
- [x] Create `tailwind.config.js` file
- [x] Create `postcss.config.js` file
- [x] Update `vite.config.ts` with Tailwind plugin
- [x] Add Tailwind directives to `src/index.css`

### Project Structure Setup
- [x] Create `/src/components/auth/` folder
- [x] Create `/src/components/dashboard/` folder
- [x] Create `/src/components/common/` folder
- [x] Create `/src/hooks/` folder
- [x] Create `/src/pages/` folder
- [x] Create `/src/services/` folder
- [x] Create `/src/types/` folder

### Auth Edge Function
- [x] Create authentication Edge Function at `/supabase/functions/auth/index.ts`
  - [ ] Implement user registration endpoint
  - [ ] Implement user login endpoint
  - [ ] Add JWT validation helper
  - [ ] Add error handling

### Frontend Authentication
- [x] Create Supabase client configuration in `/src/services/supabase.ts`
- [x] Implement `useAuth` hook in `/src/hooks/useAuth.ts`
  - [x] Scaffold hook file
  - [ ] Add sign in functionality
  - [ ] Add sign up functionality
  - [ ] Add sign out functionality
  - [ ] Add current user state management
- [ ] Create Login component at `/src/components/auth/Login.tsx`
  - [ ] Add form validation
  - [ ] Add error handling
  - [ ] Add loading states
- [ ] Create Register component at `/src/components/auth/Register.tsx`
  - [ ] Add form validation
  - [ ] Add password confirmation
  - [ ] Add terms acceptance

### Core Action Tracking Features
- [ ] Create `log-action` Edge Function at `/supabase/functions/log-action/index.ts`
  - [ ] Receive button click data
  - [ ] Validate user authentication
  - [ ] Store action in database
  - [ ] Return success response
- [ ] Create `get-profile` Edge Function at `/supabase/functions/get-profile/index.ts`
  - [ ] Retrieve user profile data
  - [ ] Handle missing profiles
  - [ ] Add caching mechanism

### Real-Time System
- [ ] Implement real-time subscription in `/src/hooks/useRealtime.ts`
  - [ ] Subscribe to `button_clicks` table changes
  - [ ] Handle connection errors
  - [ ] Implement reconnection logic
- [ ] Create `realtime-handler` Edge Function
  - [ ] Set up WebSocket management
  - [ ] Handle client connections
  - [ ] Broadcast events to all clients

### Dashboard UI
- [ ] Create Dashboard page at `/src/pages/Dashboard.tsx`
  - [ ] Layout: Buttons left, feed right (1/3)
  - [ ] Add logout functionality
  - [ ] Show user information
- [ ] Create Button component at `/src/components/dashboard/Button.tsx`
  - [ ] Make buttons clickable and responsive
  - [ ] Add visual feedback on click
  - [ ] Pass button name as prop
- [ ] Create ActionFeed component at `/src/components/dashboard/ActionFeed.tsx`
  - [ ] Display real-time action log
  - [ ] Format: "<username> clicked button <button_name>"
  - [ ] Add scroll for long lists
  - [ ] Add timestamp display

### Testing
- [ ] Set up Jest and React Testing Library
- [ ] Write tests for `useAuth` hook
  - [ ] Test successful login
  - [ ] Test login errors
  - [ ] Test logout functionality
- [ ] Write tests for `useRealtime` hook
  - [ ] Test subscription setup
  - [ ] Test event handling
  - [ ] Test error handling
- [ ] Write component tests
  - [ ] Login component tests
  - [ ] Button component tests
  - [ ] ActionFeed component tests

### Deployment & DevOps
- [ ] Configure Vercel deployment
- [ ] Set up environment variables in Vercel
- [ ] Create deployment documentation
- [ ] Set up CI/CD pipeline

## 🔄 Milestones

1. **M1: Authentication System** - User can sign up/login
2. **M2: Button Click Recording** - Users can click buttons, data is stored
3. **M3: Real-time Display** - Button clicks appear in real-time feed
4. **M4: Full Application** - Complete, tested, and deployed application

## 📝 Discovered During Work

### Potential Future Enhancements
- [ ] Add user avatars to action feed
- [ ] Implement click statistics dashboard
- [ ] Add sound notifications for new actions
- [ ] Create admin panel for moderation
- [ ] Add button categories
- [ ] Implement user presence indicator

### Technical Considerations
- [ ] Investigate rate limiting for Edge Functions
- [ ] Consider caching strategies for user profiles
- [ ] Evaluate need for connection pooling in database
- [ ] Research WebSocket connection management in Edge Functions

### TODOs
- [ ] Create missing files: `src/pages/Dashboard.tsx`, `src/components/dashboard/Button.tsx`, `src/components/dashboard/ActionFeed.tsx` (Discovered During Work)
- [ ] Create `tailwind.config.js` and `postcss.config.js` if custom Tailwind/PostCSS configuration is needed (Discovered During Work)
- [x] Deployed and tested `/register` and `/login` endpoints for auth Edge Function (return 501 as expected) on 2024-06-01

## 📌 Blockers / Dependencies

### Environment Setup
- Requires Supabase account and project creation
- Need to configure CORS for local development
- May need to adjust RLS policies based on testing

### Known Issues to Address
- Handle network disconnections gracefully
- Implement proper error boundaries in React
- Add loading states for all async operations
- Consider adding animation for new action items

## 🚀 Quick Actions

### Database Migration Commands
```bash
# Create migration for profiles table
supabase migration new create_profiles_table

# Create migration for button_clicks table
supabase migration new create_button_clicks_table

# Apply migrations
supabase db push
```

### Edge Function Deployment
```bash
# Deploy single function
supabase functions deploy auth

# Deploy all functions
supabase functions deploy
```

### Development Commands
```bash
# Start local development
npm run dev

# Run tests
npm test

# Build for production
npm run build
```