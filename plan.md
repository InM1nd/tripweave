# TripWeave — Travel Planning App
## MVP Development Plan

**Project Goal**: Collaborative travel planning app for personal use (Japan 2026 trip)
**Timeline**: ~3-4 weeks (part-time development)
**Stack**: Next.js 15, Prisma, Postgres, Clerk, PWA

---

## 🎯 Core Features (MVP)

### Must-Have
1. ✅ Trip creation + member invites
2. ✅ Timeline with events (flights, hotels, activities)
3. ✅ Interactive map with pins
4. ✅ Document upload/storage (tickets, bookings)
5. ✅ Budget tracker with categories
6. ✅ Notifications (event reminders)
7. ✅ PWA + offline mode

### Nice-to-Have (v1.1)
- Voting system (likes on events)
- Gamification (achievements, stats)
- AI suggestions (future)
- Real-time collaboration (future)

---

## 🗂️ Database Schema

### Core Models

```prisma
// schema.prisma

model Trip {
  id          String   @id @default(cuid())
  name        String   // "Japan 2026"
  destination String   // "Tokyo, Kyoto, Osaka"
  startDate   DateTime
  endDate     DateTime
  coverImage  String?
  currency    String   @default("EUR")
  timezone    String   @default("UTC")
  
  members     TripMember[]
  events      Event[]
  documents   Document[]
  budget      Budget?
  
  createdBy   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model TripMember {
  id       String  @id @default(cuid())
  tripId   String
  userId   String
  role     Role    @default(MEMBER)
  
  // Gamification
  eventsAdded    Int @default(0)
  documentsAdded Int @default(0)
  totalSpent     Float @default(0)
  
  trip     Trip    @relation(fields: [tripId], references: [id], onDelete: Cascade)
  user     User    @relation(fields: [userId], references: [id])
  
  joinedAt DateTime @default(now())
  
  @@unique([tripId, userId])
}

model Event {
  id          String    @id @default(cuid())
  tripId      String
  title       String    // "Senso-ji Temple Visit"
  description String?   @db.Text
  type        EventType
  
  // Timing
  startTime   DateTime
  endTime     DateTime?
  allDay      Boolean   @default(false)
  
  // Location
  location    String?
  address     String?
  lat         Float?
  lng         Float?
  
  // Budget
  cost        Float?
  currency    String?
  category    String?   // "Food", "Transport", "Activities"
  paidBy      String?   // userId
  splitBetween String[] // [userId1, userId2]
  
  // Engagement
  votes       Vote[]
  attachments String[]  // File URLs
  url         String?   // External link (booking, restaurant)
  
  // Notifications
  reminderSent Boolean  @default(false)
  reminderTime DateTime? // When to send reminder
  
  createdBy   String
  trip        Trip      @relation(fields: [tripId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Vote {
  id        String   @id @default(cuid())
  eventId   String
  userId    String
  
  event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id])
  
  createdAt DateTime @default(now())
  
  @@unique([eventId, userId])
}

model Document {
  id          String   @id @default(cuid())
  tripId      String
  name        String   // "ANA_Flight_Ticket.pdf"
  type        DocType
  url         String   // Storage URL
  fileSize    Int      // bytes
  mimeType    String
  
  // Optional linking
  linkedEventId String? // Link to specific event
  
  uploadedBy  String
  trip        Trip     @relation(fields: [tripId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime @default(now())
}

model Budget {
  id          String  @id @default(cuid())
  tripId      String  @unique
  totalBudget Float
  currency    String  @default("EUR")
  
  categories  BudgetCategory[]
  trip        Trip    @relation(fields: [tripId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model BudgetCategory {
  id        String  @id @default(cuid())
  budgetId  String
  name      String  // "Flights", "Hotels", "Food", "Activities"
  allocated Float
  color     String  @default("#3b82f6") // For charts
  
  budget    Budget  @relation(fields: [budgetId], references: [id], onDelete: Cascade)
}

model User {
  id            String       @id @default(cuid())
  clerkId       String       @unique // Clerk user ID
  email         String       @unique
  name          String
  avatar        String?
  
  trips         TripMember[]
  votes         Vote[]
  
  // Gamification
  totalTrips    Int      @default(0)
  achievements  String[] // ["planner_pro", "budget_master"]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Notification {
  id        String   @id @default(cuid())
  userId    String
  tripId    String?
  eventId   String?
  
  type      NotificationType
  title     String
  message   String
  read      Boolean  @default(false)
  
  createdAt DateTime @default(now())
}

// Enums

enum Role {
  OWNER
  ADMIN
  MEMBER
}

enum EventType {
  FLIGHT
  HOTEL
  ACTIVITY
  RESTAURANT
  TRANSPORT
  OTHER
}

enum DocType {
  TICKET
  BOOKING
  PASSPORT
  VISA
  INSURANCE
  ITINERARY
  OTHER
}

enum NotificationType {
  EVENT_REMINDER
  MEMBER_JOINED
  EVENT_ADDED
  BUDGET_ALERT
  DOCUMENT_ADDED
}
```

---

## 🎨 Pages & Routes

### Public Routes
- `/` — Landing page (optional for MVP)
- `/sign-in` — Clerk auth
- `/sign-up` — Clerk auth

### Protected Routes

#### Dashboard
- `/dashboard` — Trip list + upcoming events

#### Trip Pages
- `/trip/[id]` — Trip overview (tabs below)
  - `/trip/[id]/timeline` — Default tab, vertical timeline
  - `/trip/[id]/map` — Interactive map with event pins
  - `/trip/[id]/budget` — Budget tracker + spending
  - `/trip/[id]/documents` — File manager
  - `/trip/[id]/members` — Member management + stats
  - `/trip/[id]/settings` — Edit trip details

#### Modals/Drawers (not routes)
- Create/Edit Trip
- Add/Edit Event
- Add Expense
- Upload Document
- Invite Members

#### Other
- `/notifications` — Notification center
- `/profile` — User settings + achievements

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Shadcn/ui
- **State**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Maps**: React Leaflet (OpenStreetMap)
- **Charts**: Recharts
- **Dates**: date-fns
- **Icons**: Lucide React

### Backend
- **API**: Next.js API Routes + tRPC (optional)
- **ORM**: Prisma
- **Database**: Postgres (Supabase/Vercel)
- **Auth**: Clerk
- **Storage**: UploadThing/Cloudinary
- **Email**: Resend

### PWA
- **Plugin**: next-pwa
- **Storage**: IndexedDB (Dexie.js)
- **Sync**: Background Sync API

### DevOps
- **Hosting**: Vercel
- **Monitoring**: Sentry (optional)
- **Analytics**: Plausible (optional)

---

## 🚀 Development Phases

### **Phase 1: Project Setup** (Day 1-2)
**Goal**: Initialize project structure and core dependencies

**Tasks**:
- [ ] Create Next.js 15 app with TypeScript
- [ ] Setup Tailwind + Shadcn/ui
- [ ] Configure Prisma with Postgres
- [ ] Setup Clerk authentication
- [ ] Create base layouts (DashboardLayout, TripLayout)
- [ ] Setup environment variables
- [ ] Initialize Git repo

**Deliverable**: Running app with auth + empty dashboard

---

### **Phase 2: Database & Models** (Day 2-3)
**Goal**: Define schema and seed data

**Tasks**:
- [ ] Write complete Prisma schema (from above)
- [ ] Run migrations
- [ ] Create seed script with sample trip data
- [ ] Setup Prisma Client utilities
- [ ] Create TypeScript types from schema

**Deliverable**: Database with working models + seed data

---

### **Phase 3: Trip Management** (Day 3-5)
**Goal**: Create, view, edit, delete trips

**Tasks**:
- [ ] Dashboard page with trip cards
- [ ] "Create Trip" modal (form with validation)
- [ ] Trip overview page (tabs layout)
- [ ] Edit trip settings
- [ ] Delete trip (with confirmation)
- [ ] Trip cover image upload

**Components**:
- `TripCard.tsx`
- `CreateTripModal.tsx`
- `TripHeader.tsx`
- `TripTabs.tsx`

**Deliverable**: Full trip CRUD functionality

---

### **Phase 4: Member Management** (Day 5-6)
**Goal**: Invite and manage trip members

**Tasks**:
- [ ] Generate shareable invite links
- [ ] Email invites (Resend)
- [ ] Accept invite flow
- [ ] Members list page
- [ ] Role management (Owner/Admin/Member)
- [ ] Remove member functionality

**Components**:
- `InviteMemberModal.tsx`
- `MemberCard.tsx`
- `MembersList.tsx`

**Deliverable**: Working invite system

---

### **Phase 5: Timeline & Events** (Day 6-9)
**Goal**: Add, edit, display events in timeline

**Tasks**:
- [ ] Timeline UI (vertical, grouped by day)
- [ ] Add Event modal (all fields + validation)
- [ ] Event cards (different styles per type)
- [ ] Edit/Delete event
- [ ] Event type icons (✈️🏨🍜🎭🚇)
- [ ] Filter events by type
- [ ] Sort events by date/time

**Components**:
- `Timeline.tsx`
- `TimelineDay.tsx`
- `EventCard.tsx`
- `AddEventModal.tsx`
- `EventTypeSelector.tsx`

**Deliverable**: Full event management + timeline view

---

### **Phase 6: Map Integration** (Day 9-10)
**Goal**: Show events on interactive map

**Tasks**:
- [ ] Setup React Leaflet
- [ ] Display map with trip bounds
- [ ] Add event pins (custom icons per type)
- [ ] Pin click → event popup
- [ ] Popup with event details + link to timeline
- [ ] Optional: draw route between events

**Components**:
- `TripMap.tsx`
- `EventMarker.tsx`
- `EventPopup.tsx`

**Deliverable**: Interactive map with all events

---

### **Phase 7: Budget Tracker** (Day 10-12)
**Goal**: Track spending and visualize budget

**Tasks**:
- [ ] Budget setup (total + categories)
- [ ] Add expense (link to event or standalone)
- [ ] Expenses list (grouped by category)
- [ ] Budget overview (total spent vs allocated)
- [ ] Category breakdown (pie chart)
- [ ] Spending timeline (line chart)
- [ ] Split expenses between members

**Components**:
- `BudgetOverview.tsx`
- `BudgetChart.tsx`
- `ExpensesList.tsx`
- `AddExpenseModal.tsx`
- `CategoryBadge.tsx`

**Deliverable**: Full budget tracking system

---

### **Phase 8: Document Management** (Day 12-13)
**Goal**: Upload, organize, preview documents

**Tasks**:
- [ ] File upload (drag&drop + click)
- [ ] Document grid/list view
- [ ] Filter by type (ticket, booking, etc.)
- [ ] Preview modal (PDF/images)
- [ ] Download documents
- [ ] Link documents to events
- [ ] Delete documents

**Components**:
- `DocumentGrid.tsx`
- `DocumentCard.tsx`
- `UploadZone.tsx`
- `DocumentPreview.tsx`

**Deliverable**: File management system

---

### **Phase 9: Notifications** (Day 13-15)
**Goal**: Remind users about upcoming events

**Tasks**:
- [ ] Notification data model (already in schema)
- [ ] Create notifications on event creation
- [ ] Email reminders (Resend cron job)
- [ ] In-app notification center
- [ ] Mark as read/unread
- [ ] Notification preferences
- [ ] Optional: Push notifications (PWA)

**Components**:
- `NotificationCenter.tsx`
- `NotificationItem.tsx`
- `NotificationBell.tsx`

**Deliverable**: Working notification system

---

### **Phase 10: Voting System** (Day 15-16)
**Goal**: Let members like/vote on events

**Tasks**:
- [ ] Add vote button to event cards
- [ ] Like/unlike functionality
- [ ] Display vote count
- [ ] Show who voted (tooltip)
- [ ] Sort events by popularity (optional)

**Components**:
- `VoteButton.tsx`
- `VoteCount.tsx`

**Deliverable**: Event voting system

---

### **Phase 11: Gamification** (Day 16-17)
**Goal**: Add achievements and stats

**Tasks**:
- [ ] Achievement definitions (JSON config)
- [ ] Achievement checker (on event/doc add)
- [ ] Unlock achievement notifications
- [ ] Member stats display (on Members page)
- [ ] Profile page with all achievements
- [ ] Achievement badges UI

**Achievements**:
- 🎖️ **Planner Pro**: Added 10+ events
- 💰 **Budget Master**: Stayed within budget
- ✈️ **Jet Setter**: Created 3+ trips
- 📸 **Documentarian**: Uploaded 5+ documents
- ❤️ **Popular Pick**: Event got 5+ votes
- 🗺️ **Explorer**: Added 20+ locations

**Components**:
- `AchievementBadge.tsx`
- `MemberStats.tsx`
- `AchievementsList.tsx`

**Deliverable**: Gamification system

---

### **Phase 12: PWA + Offline Mode** (Day 17-19)
**Goal**: Make app work offline

**Tasks**:
- [ ] Setup next-pwa
- [ ] Configure service worker
- [ ] Add manifest.json (icons, theme)
- [ ] Offline page
- [ ] Cache strategies (Network First for API, Cache First for static)
- [ ] IndexedDB setup (Dexie.js)
- [ ] Sync queue for offline changes
- [ ] Online/offline indicator

**Deliverable**: Fully functional PWA

---

### **Phase 13: Polish & Testing** (Day 19-21)
**Goal**: Refine UI and fix bugs

**Tasks**:
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Loading states (skeletons)
- [ ] Error handling (error boundaries)
- [ ] Empty states (no trips, no events)
- [ ] Toast notifications (success/error)
- [ ] Accessibility audit
- [ ] Performance optimization (image lazy loading, code splitting)
- [ ] Test with real Japan trip data
- [ ] Cross-browser testing

**Deliverable**: Production-ready MVP

---

## 🤖 AI Agent Prompts (Cursor/Antigravity)

### Prompt 1: Project Initialization

```
Create a Next.js 15 project with TypeScript and the following setup:

1. Initialize with:
   - App Router structure
   - Tailwind CSS
   - TypeScript strict mode
   - ESLint + Prettier

2. Install and configure:
   - Shadcn/ui (init with default config)
   - Clerk for authentication
   - Prisma with Postgres
   - React Query
   - React Hook Form + Zod

3. Create folder structure:
   /app
     /dashboard
     /trip/[id]
     /api
   /components
     /ui (shadcn components)
     /trip
     /event
     /budget
   /lib
     /prisma
     /utils
   /types

4. Setup environment variables template (.env.example):
   - DATABASE_URL
   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   - CLERK_SECRET_KEY
   - UPLOADTHING_SECRET
   - RESEND_API_KEY

5. Create base layouts:
   - DashboardLayout (with sidebar navigation)
   - TripLayout (with tabs navigation)
   - AuthLayout (for sign-in/up)

Output all necessary config files and folder structure.
```

---

### Prompt 2: Database Schema

```
Using Prisma, create the complete database schema for a travel planning app with these models:

Models needed:
1. Trip (id, name, destination, dates, currency, cover image)
2. TripMember (trip-user relationship, role, gamification stats)
3. Event (timeline items: flights, hotels, activities with location, cost, voting)
4. Vote (many-to-many: users can vote on events)
5. Document (file uploads linked to trips)
6. Budget (per-trip budget with categories)
7. BudgetCategory (flights, hotels, food, etc.)
8. User (Clerk integration, achievements)
9. Notification (event reminders, member actions)

Requirements:
- Use cuid() for IDs
- Proper relations with onDelete: Cascade
- Enums for Role, EventType, DocType, NotificationType
- Timestamps on all models
- Unique constraints where needed

Also create:
- Prisma Client utility (/lib/prisma.ts)
- Seed script with sample data (1 trip, 5 events, 2 members)
- TypeScript types generated from schema

Output schema.prisma and all utility files.
```

---

### Prompt 3: Trip CRUD

```
Create trip management functionality:

Pages:
1. /dashboard - Display user's trips as cards
2. /trip/[id] - Trip overview with tabs

Components needed:
- TripCard: Shows trip name, destination, dates, member avatars, cover image
- CreateTripModal: Form with fields (name, destination, start/end dates, budget, currency)
- TripHeader: Shows trip details, edit button, member count
- TripTabs: Navigation between Timeline/Map/Budget/Documents/Members

API routes:
- POST /api/trips - Create trip
- GET /api/trips - List user's trips
- GET /api/trips/[id] - Get single trip with members
- PATCH /api/trips/[id] - Update trip
- DELETE /api/trips/[id] - Delete trip

Use:
- React Hook Form + Zod for validation
- React Query for data fetching
- Shadcn Dialog for modal
- Clerk useUser() for current user
- Prisma for database operations

Include proper error handling and loading states.
```

---

### Prompt 4: Timeline & Events

```
Create event timeline functionality:

Component: Timeline
- Vertical timeline grouped by day
- Shows day headers with date formatting
- Event cards with:
  - Type icon (✈️ flight, 🏨 hotel, 🍜 restaurant, 🎭 activity, 🚇 transport)
  - Title, time range, location
  - Cost (if set)
  - Vote count + vote button
  - Edit/delete actions (for event creator)
  
Component: AddEventModal
Form fields:
- Title (required)
- Type (dropdown: Flight, Hotel, Activity, Restaurant, Transport, Other)
- Start date/time (required)
- End date/time (optional)
- Location (text input with optional lat/lng)
- Cost + currency
- Description (textarea)
- Attachments (file upload)

API routes:
- POST /api/trips/[tripId]/events - Create event
- PATCH /api/events/[id] - Update event
- DELETE /api/events/[id] - Delete event
- POST /api/events/[id]/vote - Toggle vote

Use:
- date-fns for date formatting
- React Hook Form + Zod validation
- Optimistic updates with React Query
- Proper timezone handling

Include filter/sort options (by type, by date).
```

---

### Prompt 5: Map Integration

```
Create interactive map for trip events:

Component: TripMap
- Use React Leaflet with OpenStreetMap tiles
- Display all events with coordinates as markers
- Custom marker icons based on event type:
  - ✈️ Flight (blue)
  - 🏨 Hotel (red)
  - 🍜 Restaurant (orange)
  - 🎭 Activity (green)
  - 🚇 Transport (purple)

Features:
- Auto-fit bounds to show all markers
- Click marker → open popup with:
  - Event title
  - Date/time
  - Quick actions (View details, Edit)
- Cluster markers if too many in same area (optional)

Component: EventMarker
- Custom icon based on event.type
- Popup with event summary
- Link to event in timeline

Utilities:
- Geocoding helper (convert address to lat/lng using Nominatim API)
- Map bounds calculator

Use Leaflet's default styles and ensure mobile responsiveness.
```

---

### Prompt 6: Budget Tracker

```
Create budget management system:

Page: /trip/[id]/budget

Components:
1. BudgetOverview
   - Total budget vs spent (progress bar)
   - Remaining amount (with color: green if OK, red if over)
   - Per-person split

2. BudgetChart
   - Pie chart showing spending by category
   - Use Recharts library
   - Color-coded categories

3. CategoryBreakdown
   - List of categories (Flights, Hotels, Food, Activities, Transport)
   - Allocated vs spent per category
   - Progress bars

4. ExpensesList
   - All expenses from events with costs
   - Grouped by category
   - Shows: date, event title, amount, paid by (member name)

5. AddExpenseModal
   - Quick expense form (not linked to event)
   - Fields: title, amount, currency, category, paid by, split between

API routes:
- GET /api/trips/[tripId]/budget - Get budget + all expenses
- PATCH /api/trips/[tripId]/budget - Update budget settings
- POST /api/trips/[tripId]/expenses - Add standalone expense

Calculate totals automatically from events with costs.
Use Recharts for visualizations.
```

---

### Prompt 7: Document Management

```
Create document upload and management:

Component: DocumentGrid
- Grid layout of document cards
- Filter tabs by type (All, Tickets, Bookings, Passports, etc.)
- Upload button + drag-drop zone

Component: DocumentCard
- File icon based on type
- File name, size, upload date
- Uploader name
- Actions: Preview, Download, Delete

Component: UploadZone
- Drag-and-drop area
- File type selector (Ticket, Booking, Passport, etc.)
- Support PDF, images (jpg, png)
- Progress bar during upload

Component: DocumentPreview
- Modal with file preview:
  - PDF: embedded viewer
  - Images: full-size display
- Download button
- Link to event (if applicable)

Use UploadThing for file storage:
- Setup UploadThing route
- Configure file size limits (10MB)
- Generate signed URLs

API routes:
- GET /api/trips/[tripId]/documents - List documents
- POST /api/documents/upload - Upload file (UploadThing)
- DELETE /api/documents/[id] - Delete file

Include proper error handling for file uploads.
```

---

### Prompt 8: Member Management & Invites

```
Create member invitation and management:

Component: MembersList
- List of trip members with:
  - Avatar, name, email
  - Role badge (Owner, Admin, Member)
  - Join date
  - Stats: events added, documents uploaded, spent amount
  - Remove button (owner/admin only)

Component: InviteMemberModal
- Two invite methods:
  1. Email invite (input email, send via Resend)
  2. Shareable link (copy to clipboard)
- Role selector (Admin or Member)

Features:
- Generate unique invite tokens
- Invite link: /invite/[token]
- Accept invite flow:
  - Check if user logged in (Clerk)
  - Validate token
  - Add user to trip
  - Redirect to trip page

Email template (Resend):
- Subject: "You're invited to [Trip Name]"
- Body: Trip details + Accept button

API routes:
- POST /api/trips/[tripId]/invite - Generate invite
- POST /api/invites/[token]/accept - Accept invite
- DELETE /api/trips/[tripId]/members/[userId] - Remove member
- PATCH /api/trips/[tripId]/members/[userId] - Change role

Security:
- Only owner/admin can invite
- Tokens expire after 7 days
```

---

### Prompt 9: Notifications System

```
Create notification system:

Component: NotificationCenter
- Dropdown from header bell icon
- List of notifications (latest 10)
- Mark all as read button
- Link to full notification page

Component: NotificationItem
- Icon based on type (✈️ reminder, 👤 member joined, 💰 budget alert)
- Title and message
- Timestamp (relative: "2 hours ago")
- Unread indicator (dot)

Notification triggers:
1. Event reminder (2 days before event start)
2. Member joined trip
3. New event added
4. Budget threshold reached (80%, 100%)
5. Document uploaded

Implementation:
- Background job (Vercel Cron or external scheduler)
- Check upcoming events daily
- Send email via Resend
- Create in-app notification (Notification model)

API routes:
- GET /api/notifications - Get user notifications
- PATCH /api/notifications/[id]/read - Mark as read
- PATCH /api/notifications/read-all - Mark all as read

Email template (event reminder):
- Subject: "Upcoming: [Event Title] in 2 days"
- Body: Event details + link to trip

Use Resend for emails and React Query for real-time updates.
```

---

### Prompt 10: Gamification System

```
Create achievement and gamification system:

Achievement Definitions (lib/achievements.ts):
```typescript
const ACHIEVEMENTS = [
  {
    id: 'planner_pro',
    name: 'Planner Pro',
    description: 'Added 10+ events',
    icon: '🎖️',
    condition: (stats) => stats.eventsAdded >= 10
  },
  {
    id: 'budget_master',
    name: 'Budget Master',
    description: 'Stayed within budget',
    icon: '💰',
    condition: (trip) => trip.budget.spent <= trip.budget.total
  },
  // ... more achievements
]
```

Component: AchievementBadge
- Show icon + name
- Tooltip with description
- Locked/unlocked state

Component: MemberStats (on Members page)
- Events added count
- Documents uploaded count
- Total spent amount
- Achievements earned (badges)

Component: ProfileAchievements
- Grid of all possible achievements
- Highlight earned ones
- Progress bars for in-progress achievements

Logic:
- Check achievements after:
  - Event creation
  - Document upload
  - Trip completion
- Store achievements in User.achievements (string array)
- Show toast when achievement unlocked

API routes:
- POST /api/achievements/check - Check and unlock achievements
- GET /api/users/[id]/achievements - Get user achievements

Add confetti animation when achievement unlocked (react-confetti).
```

---

### Prompt 11: PWA Setup

```
Convert app to Progressive Web App:

1. Install and configure next-pwa:
   - Add to next.config.js
   - Configure cache strategies:
     - Runtime: NetworkFirst for API routes
     - Precache: static assets (CSS, JS, images)

2. Create manifest.json:
   - App name: "TripWeave"
   - Short name: "TripWeave"
   - Description: "Collaborative travel planning"
   - Theme color: #3b82f6
   - Background color: #ffffff
   - Display: standalone
   - Icons: 192x192, 512x512 (generate with PWA asset generator)

3. Offline support:
   - Create /app/offline/page.tsx
   - Show friendly message + cached trips
   - Setup Dexie.js for IndexedDB
   - Cache trip data locally

4. Background sync:
   - Queue failed API calls
   - Retry when online
   - Show sync status indicator

5. Add to components:
   - OnlineStatusIndicator (header)
   - InstallPrompt (for iOS/Android)

Test:
- Lighthouse PWA audit (score 90+)
- Offline functionality
- Add to home screen (iOS/Android)

Output all PWA config files and service worker setup.
```

---

### Prompt 12: Final Polish

```
Polish the app for production:

1. Responsive Design:
   - Test on mobile (320px+), tablet (768px+), desktop (1024px+)
   - Use Tailwind breakpoints (sm:, md:, lg:)
   - Mobile-first approach
   - Touch-friendly buttons (min 44px height)

2. Loading States:
   - Create skeleton components for:
     - TripCardSkeleton
     - TimelineSkeleton
     - MapSkeleton
   - Use Shadcn Skeleton component
   - Loading spinners for actions

3. Error Handling:
   - Error boundaries for pages
   - Toast notifications for errors (Shadcn Toast)
   - Retry buttons for failed requests
   - Validation error messages

4. Empty States:
   - No trips: Show illustration + "Create your first trip" CTA
   - No events: "Start planning" message
   - No documents: Upload prompt

5. Accessibility:
   - Proper ARIA labels
   - Keyboard navigation (tab order)
   - Focus indicators
   - Alt text for images
   - Color contrast check (WCAG AA)

6. Performance:
   - Image optimization (next/image)
   - Code splitting (dynamic imports)
   - Lazy load heavy components (Map, Charts)
   - React Query caching
   - Debounce search/filter inputs

7. Testing Checklist:
   - [ ] Create trip flow
   - [ ] Invite member
   - [ ] Add all event types
   - [ ] Upload documents
   - [ ] Budget tracking
   - [ ] Notifications
   - [ ] Mobile responsive
   - [ ] Offline mode
   - [ ] Cross-browser (Chrome, Safari, Firefox)

Output comprehensive QA checklist and polishing tasks.
```

---

## 📊 Success Metrics (for personal use)

- ✅ Can plan entire Japan trip in app
- ✅ Friends can collaborate without confusion
- ✅ Works offline during travel
- ✅ Budget stays organized
- ✅ All documents easily accessible
- ✅ Notifications prevent missed flights/bookings

---

## 🔮 Future Enhancements (Post-MVP)

### v1.1
- AI suggestions (places to visit, restaurants)
- Real-time collaboration (see friends editing live)
- Calendar integration (Google Calendar, Apple Calendar)
- Weather forecast integration
- Currency converter

### v1.2
- Mobile app (React Native/Expo)
- Trip templates (save itinerary as template)
- Public trip sharing (read-only link)
- Trip duplication
- Packing list

### v2.0
- Social features (follow travelers, share trips publicly)
- Recommendations engine
- Travel blog generation (auto-create blog from trip)
- Integration with booking platforms (Booking.com, Airbnb)
- Expense splitting with payment (Stripe integration)

---

## 📝 Notes

- Focus on UX: clean, intuitive, mobile-friendly
- Use Cursor/Antigravity for rapid development
- Test with real data (your Japan trip)
- Iterate based on friend feedback
- Keep it simple: avoid overengineering MVP
- Prioritize offline functionality for travel use

---

**Ready to start? Begin with Phase 1 and use prompts sequentially.** 🚀
