# Tasks

- [x] Phase 1: Project Setup
  - [x] Create Next.js app with TypeScript
  - [x] Setup Tailwind CSS (validated config)
  - [x] Setup Shadcn/ui (User installed components)
  - [x] Configure Prisma with Postgres (Schema created)
  - [x] Setup Supabase authentication (Working in actions)
  - [x] Create base layouts (DashboardLayout, TripLayout, AuthLayout created)
  - [x] Setup environment variables (.env.local verified)
  - [x] Initialize Project Structure
  
- [/] Phase 2: Database & Models
  - [x] Write Prisma schema
  - [x] Configure .env with database credentials
  - [x] Run initial migration
  - [x] Create seed script (Mock data exists in some files)
  - [x] Generate Prisma Client types

- [x] Phase 3: Trip Management
  - [x] Create TripCard component
  - [x] Create Dashboard page (Connected to DB)
  - [x] Create CreateTripModal (Connected to DB)
  - [x] Backend Trip CRUD (Server Actions implemented)

- [x] Phase 4: Mobile UI Polish & Trip Details
  - [x] Implement sidebar-based DashboardLayout (collapsible)
  - [x] Update TripCard with better mobile styling
  - [x] Add dark/light theme toggle
  - [x] Update color scheme to green (travel theme)
  - [x] Create TripHeader component
  - [x] Create TripTabs component (scrollable horizontal nav)
  - [x] Update TripLayout with new components
  - [x] Create Timeline page (UI Shell)
  - [x] Create Budget page (UI Shell)
  - [x] Create Members page (Connected to DB)

- [/] Phase 5: Timeline & Events
  - [x] Timeline UI (Vertical layout, grouped by day)
  - [x] Event Cards (Type styling)
  - [x] Add Event Modal (UI done)
  - [/] Connect to Database (API Routes/Server Actions) [x]
  - [x] Edit/Delete Event functionality

- [/] Phase 7: Budget Tracker
  - [x] Budget Overview UI (Cards, Progress bars)
  - [x] Expenses List UI
  - [x] Category Breakdown UI
  - [x] Add Expense Modal (UI Shell)
  - [x] Connect to Database (API Routes/Server Actions)

- [/] Phase 8: Document Management
  - [x] Create Documents Page (`/trip/[id]/documents`) (UI Shell)
  - [x] Setup File Upload (Supabase Storage)
  - [x] Document Grid/List UI
  - [x] Connect to Database

- [ ] Phase 9: Notifications
  - [ ] Notification Data Model <!-- id: 33 -->
  - [x] UI for Notification Center (`/notifications`) (Mock data) <!-- id: 34 -->
  - [ ] Email Reminders (Resend) <!-- id: 35 -->

- [ ] Phase 10: Voting System
  - [ ] Vote Button Component <!-- id: 36 -->
  - [ ] Backend Logic for Voting <!-- id: 37 -->

- [ ] Phase 11: Gamification
  - [x] Profile Page with Stats (Mock data) <!-- id: 38 -->
  - [x] Achievement Badges UI (In Profile) <!-- id: 39 -->
  - [ ] Achievement Logic <!-- id: 40 -->

- [ ] Phase 12: PWA & Offline
  - [ ] Setup next-pwa <!-- id: 41 -->
  - [ ] Service Worker Config <!-- id: 42 -->
  - [ ] Manifest.json <!-- id: 43 -->

- [ ] Phase 13: Polish & Launch
  - [x] Responsive design (Mobile adaptations)
  - [ ] Loading Skeletons <!-- id: 44 -->
  - [ ] Error Boundaries <!-- id: 45 -->
  - [ ] Final Testing <!-- id: 46 -->

- [x] Phase 14: New Pages & Refactoring (Added)
  - [x] Create Maps Page (`/maps`)
  - [x] Create Explore Page (`/explore`) (Recommendations)
  - [x] Refactor Dashboard (Trips + Quick Skills)
  - [x] Move "Your Adventures" to Profile (and back to Dashboard)

- [x] Phase 15: Refinement (Added)
  - [x] Adapt `/maps` for mobile
  - [x] Sidebar adjustments (Narrower on Desktop)
  - [x] Avatar links to Profile

- [x] Phase 16: Backend Integration & Cleanup (Added)
  - [x] Fix User Profile Navigation
  - [x] Trip Settings Page (Update/Delete)
  - [x] Drag-and-Drop Image Upload Component
  - [x] Move Cover Image Upload to Create Trip
  - [x] Event Cover Image (Supabase Storage)
