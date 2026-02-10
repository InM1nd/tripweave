# Tasks

- [x] Phase 1: Project Setup
  - [x] Create Next.js app with TypeScript
  - [x] Setup Tailwind CSS (validated config)
  - [x] Setup Shadcn/ui (User installed components)
  - [x] Configure Prisma with Postgres (Schema created)
  - [-] Setup Clerk authentication (Disabled for Vercel build)
  - [x] Create base layouts (DashboardLayout, TripLayout, AuthLayout created)
  - [x] Setup environment variables (.env.example exists)
  - [x] Initialize Git repo (Implied)
  
- [-] Phase 2: Database & Models (Postponed)
  - [x] Write Prisma schema
  - [ ] Configure .env with database credentials <!-- id: 6 -->
  - [ ] Run initial migration (init) <!-- id: 7 -->
  - [ ] Create seed script <!-- id: 8 -->
  - [ ] Generate Prisma Client types <!-- id: 9 -->

- [x] Phase 3: Trip Management (UI Focus)
  - [x] Create TripCard component
  - [x] Create Dashboard page with mock data
  - [x] Create CreateTripModal component

- [x] Phase 4: Mobile UI Polish & Trip Details
  - [x] Implement sidebar-based DashboardLayout (collapsible)
  - [x] Update TripCard with better mobile styling
  - [x] Add dark/light theme toggle
  - [x] Update color scheme to green (travel theme)
  - [x] Create TripHeader component
  - [x] Create TripTabs component (scrollable horizontal nav)
  - [x] Update TripLayout with new components
  - [x] Create Timeline page with mock events
  - [x] Create Budget page with expense tracking
  - [x] Create Members page with role management

- [/] Phase 5: Timeline & Events (Backend & Logic)
  - [x] Timeline UI (Vertical layout, grouped by day)
  - [x] Event Cards (Type styling)
  - [x] Add Event Modal (UI done, Drawer for mobile) <!-- id: 20 -->
  - [ ] Connect to Database (API Routes) <!-- id: 21 -->
  - [ ] Edit/Delete Event functionality <!-- id: 22 -->

- [-] Phase 6: Map Integration
  - [x] Setup React Leaflet <!-- id: 23 -->
  - [x] Create Map Page (`/trip/[id]/map`) (UI done, Mock data) <!-- id: 24 -->
  - [x] Display event pins on map (Mock data) <!-- id: 25 -->
  - [x] Event Popup implementation <!-- id: 26 -->

- [-] Phase 7: Budget Tracker (Backend & Logic)
  - [x] Budget Overview UI (Cards, Progress bars)
  - [x] Expenses List UI
  - [x] Category Breakdown UI
  - [x] Add Expense Modal (UI done, Drawer for mobile) <!-- id: 27 -->
  - [ ] Connect to Database (API Routes) <!-- id: 28 -->

- [-] Phase 8: Document Management
  - [x] Create Documents Page (`/trip/[id]/documents`) (UI done, Mock data) <!-- id: 29 -->
  - [ ] Setup File Upload (UploadThing/Cloudinary) <!-- id: 30 -->
  - [x] Document Grid/List UI <!-- id: 31 -->
  - [ ] Connect to Database <!-- id: 32 -->

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
