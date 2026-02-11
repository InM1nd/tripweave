# TripWeave — AI Agent Prompts

## Development Phase Prompts for Cursor/Antigravity

Use these prompts sequentially for each development phase. Copy-paste into your AI agent (Cursor, Antigravity, etc.) and adapt as needed.

---

## Phase 1: Project Setup

### Prompt 1.1: Initialize Next.js Project

Create a new Next.js 16 project with TypeScript and the following configuration:

Project name: tripweave

Setup requirements:

Next.js 16 with App Router

TypeScript with strict mode enabled

Tailwind CSS with default configuration

ESLint + Prettier for code formatting

src/ directory structure

Install these dependencies:

@clerk/nextjs (authentication)

@prisma/client & prisma (database ORM)

@tanstack/react-query (data fetching)

react-hook-form (forms)

zod (validation)

date-fns (date utilities)

lucide-react (icons)

Create this folder structure:
/src
/app
/dashboard
/trip/[id]
/api
/(auth)
/sign-in
/sign-up
/components
/ui
/trip
/event
/budget
/document
/layout
/lib
/utils.ts
/prisma.ts
/types
/index.ts

Create configuration files:

tsconfig.json (strict mode)

.eslintrc.json

.prettierrc

tailwind.config.ts

next.config.js

Create .env.example with these variables:
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
RESEND_API_KEY=

Output the complete project structure with all config files.

---

### Prompt 1.2: Setup Shadcn/ui

Setup Shadcn/ui component library in the project:

Initialize Shadcn with:
npx shadcn-ui@latest init

Configuration:

Style: Default

Base color: Slate

CSS variables: Yes

Tailwind config: Yes

Component location: @/components/ui

Install these Shadcn components:

button

card

dialog

dropdown-menu

form

input

label

select

textarea

toast

tabs

avatar

badge

calendar

popover

separator

skeleton

table

tooltip

Create components/ui/index.ts that exports all UI components

Setup toast provider in root layout

Output all component files and necessary configuration.

---

### Prompt 1.3: Create Base Layouts

Create three base layouts for the application:

DashboardLayout (src/components/layout/DashboardLayout.tsx):

Header with:

App logo/name

Navigation (Dashboard, Notifications, Profile)

User avatar dropdown (with sign out)

Main content area

Mobile responsive with hamburger menu

TripLayout (src/components/layout/TripLayout.tsx):

Trip header with:

Trip name

Destination

Date range

Member avatars

Edit button

Tab navigation:

Timeline

Map

Budget

Documents

Members

Main content area

Back to dashboard link

AuthLayout (src/app/(auth)/layout.tsx):

Centered auth forms

App branding

Simple, clean design

Use Shadcn components for UI elements.
Ensure mobile responsiveness.
Include proper TypeScript types.

Output all three layout components.

---

## Phase 2: Database & Models

### Prompt 2.1: Prisma Schema

Create a complete Prisma schema for a travel planning app.

File: prisma/schema.prisma

Requirements:

PostgreSQL database

Use cuid() for all IDs

Proper relations with onDelete: Cascade

Timestamps (createdAt, updatedAt) on all models

Models to create:

User

id, clerkId (unique), email (unique), name, avatar

Relations: trips (through TripMember), votes

Gamification: totalTrips (int), achievements (string array)

Timestamps

Trip

id, name, destination, startDate, endDate, coverImage, currency, timezone

Relations: members (TripMember), events, documents, budget

createdBy (string)

Timestamps

TripMember

id, tripId, userId, role (enum: OWNER, ADMIN, MEMBER)

Gamification stats: eventsAdded, documentsAdded, totalSpent

joinedAt timestamp

Unique constraint on [tripId, userId]

Event

id, tripId, title, description, type (enum: FLIGHT, HOTEL, ACTIVITY, RESTAURANT, TRANSPORT, OTHER)

Timing: startTime, endTime, allDay (boolean)

Location: location, address, lat, lng (optional floats)

Budget: cost, currency, category, paidBy, splitBetween (string array)

Engagement: votes (relation), attachments (string array), url

Notifications: reminderSent (boolean), reminderTime

createdBy (string)

Relations: trip, votes

Timestamps

Vote

id, eventId, userId

Relations: event, user

Unique constraint on [eventId, userId]

createdAt

Document

id, tripId, name, type (enum: TICKET, BOOKING, PASSPORT, VISA, INSURANCE, ITINERARY, OTHER)

url, fileSize, mimeType

linkedEventId (optional)

uploadedBy (string)

Relations: trip

createdAt

Budget

id, tripId (unique), totalBudget, currency

Relations: trip, categories

Timestamps

BudgetCategory

id, budgetId, name, allocated, color

Relations: budget

Notification

id, userId, tripId, eventId (optional)

type (enum: EVENT_REMINDER, MEMBER_JOINED, EVENT_ADDED, BUDGET_ALERT, DOCUMENT_ADDED)

title, message, read (boolean)

createdAt

Output complete schema.prisma file with all models, relations, and enums.

---

### Prompt 2.2: Prisma Client Setup

Create Prisma client utilities and seed script:

Create lib/prisma.ts:

Initialize Prisma Client with singleton pattern

Handle connection pooling

Export prisma client instance

TypeScript types

Create prisma/seed.ts:

Sample data for testing:

2 users (with Clerk IDs placeholders)

1 trip (Japan 2026, Tokyo/Kyoto, 7 days)

2 trip members (owner + member)

5 events:

Flight (Vienna → Tokyo)

Hotel booking (Tokyo)

Activity (Senso-ji Temple)

Restaurant (Sushi dinner)

Transport (Train Tokyo → Kyoto)

1 budget (€3000, with categories)

2 documents (flight ticket, hotel booking)

Use realistic dates (relative to today)

Update package.json:

Add seed script: "prisma:seed": "tsx prisma/seed.ts"

Create types/prisma.ts:

Export useful Prisma types

Example: TripWithMembers, EventWithVotes, etc.

Run migration command:
npx prisma migrate dev --name init

Output all files and migration instructions.

---

## Phase 3: Trip Management

### Prompt 3.1: Dashboard Page

Create the main dashboard page that displays user's trips.

File: src/app/dashboard/page.tsx

Requirements:

Fetch user's trips using React Query

Display trips as cards in a responsive grid (1 col mobile, 2 col tablet, 3 col desktop)

Each card shows:

Cover image (with fallback gradient)

Trip name

Destination

Date range (formatted)

Member avatars (max 3 visible, +X more)

Quick stats (events count, budget spent %)

"Create New Trip" button (opens modal)

Empty state when no trips

Loading skeleton while fetching

Component: src/components/trip/TripCard.tsx

Props: trip data

Click → navigate to /trip/[id]

Hover effects

API Route: src/app/api/trips/route.ts

GET: Fetch current user's trips (via Clerk userId)

Include trip members, event count, budget info

Use Prisma to query

Use:

Clerk's useUser() hook

React Query for data fetching

Shadcn Card component

Next.js Image for cover images

date-fns for date formatting

Output page component, TripCard component, and API route.

---

### Prompt 3.2: Create Trip Modal

Create a modal for creating new trips.

Component: src/components/trip/CreateTripModal.tsx

Modal form fields:

Trip name (required, min 3 chars)

Destination (required)

Start date (required, date picker)

End date (required, must be after start date)

Currency (select: EUR, USD, JPY, GBP, etc.)

Total budget (optional, number)

Cover image (optional, upload or URL)

Validation with Zod:

Create schema in lib/validations/trip.ts

Validate dates (end > start)

Validate budget (positive number)

Form handling:

Use React Hook Form

Show validation errors inline

Submit button disabled while submitting

Show toast on success/error

API Route: src/app/api/trips/route.ts

POST: Create new trip

Set current user as owner

Create initial budget if provided

Create default budget categories (Flights, Hotels, Food, Activities, Transport)

Return created trip

On success:

Close modal

Invalidate trips query (React Query)

Navigate to new trip page

Show success toast

Use Shadcn Dialog, Form, Input, Select, Calendar components.

Output modal component, validation schema, and API route updates.

---

### Prompt 3.3: Trip Overview Page

Create the main trip page with tabs navigation.

File: src/app/trip/[id]/page.tsx (redirects to /trip/[id]/timeline)

Component: src/components/trip/TripHeader.tsx
Display:

Trip name (editable on click)

Destination with location icon

Date range with calendar icon

Days until trip / days remaining / completed status

Member avatars (with popover showing names)

Edit trip button (opens edit modal)

Share button (copy link)

Component: src/components/trip/TripTabs.tsx
Tabs:

Timeline (default)

Map

Budget

Documents

Members

Each tab is a separate route:

/trip/[id]/timeline

/trip/[id]/map

/trip/[id]/budget

/trip/[id]/documents

/trip/[id]/members

Layout: src/app/trip/[id]/layout.tsx

Fetch trip data (with members, event count, budget)

Show TripHeader

Show TripTabs

Render children (tab content)

Handle loading/error states

Check user access (must be trip member)

API Route: src/app/api/trips/[id]/route.ts

GET: Fetch single trip with relations

PATCH: Update trip details

DELETE: Delete trip (owner only)

Use:

Clerk for user auth

React Query for data

Next.js parallel routes for tabs

Shadcn Tabs component

Output layout, header, tabs components, and page structure.

---

### Prompt 3.4: Edit Trip Modal

Create modal for editing trip details.

Component: src/components/trip/EditTripModal.tsx

Similar to CreateTripModal but:

Pre-fill form with existing trip data

Add delete trip button (with confirmation dialog)

Only owner/admin can edit

Can update cover image

Additional features:

Mark trip as completed checkbox

Change timezone (for date/time display)

Delete confirmation:

Shadcn AlertDialog

Warn: "This will delete all events, documents, and budget data"

Require typing trip name to confirm

API updates in /api/trips/[id]/route.ts:

PATCH: Update trip fields

DELETE: Cascade delete (Prisma handles via schema)

On successful update:

Invalidate trip query

Close modal

Show success toast

On successful delete:

Redirect to dashboard

Show success toast

Output edit modal and delete confirmation dialog.

---

## Phase 4: Member Management

### Prompt 4.1: Members Page

Create members management page.

File: src/app/trip/[id]/members/page.tsx

Display:

Member list (cards or table):

Avatar

Name, email

Role badge (Owner/Admin/Member)

Join date

Stats:

Events added

Documents uploaded

Amount spent

Actions (remove, change role) - owner/admin only

"Invite Member" button (opens modal)

Pending invites section (if any):

Email/link

Sent date

Resend/Cancel buttons

Component: src/components/trip/MemberCard.tsx

Display member info

Role badge with color coding

Stats in grid

Action dropdown (3-dot menu)

Component: src/components/trip/MemberStats.tsx

Displays gamification stats

Achievement badges (if earned)

API Route: src/app/api/trips/[id]/members/route.ts

GET: List trip members with stats

DELETE: Remove member (owner/admin only)

API Route: src/app/api/trips/[id]/members/[userId]/route.ts

PATCH: Update member role

Use React Query for data fetching and mutations.

Output members page and related components.

---

### Prompt 4.2: Invite System

Create member invitation system.

Component: src/components/trip/InviteMemberModal.tsx

Two invite methods:

Email Invite:

Input field for email

Role selector (Admin or Member)

"Send Invite" button

Sends email via Resend API

Shareable Link:

Generate unique invite token (crypto.randomUUID())

Display link with copy button

Set expiration (7 days)

Model: Add InviteToken to Prisma schema:

id, tripId, token (unique), email (optional), role, expiresAt, createdBy

Used flag (boolean)

API Route: src/app/api/trips/[id]/invite/route.ts

POST: Create invite token

Send email if email provided

Return invite link

Email template (using Resend):

Subject: "You're invited to [Trip Name]"

Body HTML:

Trip details (name, destination, dates)

Inviter name

"Accept Invitation" button (link to /invite/[token])

Expiration notice

Page: src/app/invite/[token]/page.tsx

Validate token (not expired, not used)

Show trip preview

If user not logged in → redirect to sign-in (with return URL)

If logged in → "Accept Invitation" button

API Route: src/app/api/invite/[token]/accept/route.ts

POST: Accept invite

Validate token

Check user not already member

Add user to trip (TripMember)

Mark token as used

Return trip ID

On accept:

Redirect to trip page

Show welcome toast

Output all invite components, API routes, and email template.

---

## Phase 5: Timeline & Events

### Prompt 5.1: Timeline View

Create timeline page with events display.

File: src/app/trip/[id]/timeline/page.tsx

Layout:

Vertical timeline grouped by day

Filter buttons: All, Flights, Hotels, Activities, Restaurants, Transport

Sort dropdown: By date, By cost, By votes

"Add Event" floating action button (bottom right)

Component: src/components/event/Timeline.tsx

Fetch events for trip

Group by date (same day = one group)

Render TimelineDay for each day

Component: src/components/event/TimelineDay.tsx

Props: date, events

Day header:

Day name + date (e.g., "Monday, Mar 15")

Day of trip (e.g., "Day 3")

Total cost for day

List of EventCard components

Component: src/components/event/EventCard.tsx

Type icon with color:

✈️ Flight (blue)

🏨 Hotel (red)

🍜 Restaurant (orange)

🎭 Activity (green)

🚇 Transport (purple)

Title

Time range (e.g., "14:00 - 16:30" or "All day")

Location (with pin icon)

Cost (if set)

Vote button + count

Action menu (edit, delete) - for event creator

Interactions:

Click card → expand to show full details

Click vote → toggle vote

Click edit → open edit modal

Click delete → confirm dialog

API Route: src/app/api/trips/[id]/events/route.ts

GET: Fetch all events for trip (with votes, creator info)

POST: Create new event

Use:

React Query with filters (type, sort)

date-fns for grouping by day

Framer Motion for smooth expand/collapse

Output timeline components and API route.

---

### Prompt 5.2: Add Event Modal

Create comprehensive event creation modal.

Component: src/components/event/AddEventModal.tsx

Form fields:

Event type (required):

Radio buttons with icons

Flight, Hotel, Activity, Restaurant, Transport, Other

Title (required):

Text input

Placeholder based on type (e.g., "Flight number" for flights)

Date & Time:

Start date/time (required)

End date/time (optional)

"All day" checkbox (hides time pickers)

Location:

Text input with autocomplete (optional)

"Use current location" button

Hidden fields for lat/lng (for map)

Cost (optional):

Number input

Currency (inherited from trip)

Budget category select (from trip budget categories)

"Paid by" select (trip members)

"Split between" multi-select (trip members)

Description (optional):

Textarea

Markdown support mention

Attachments (optional):

File upload (images, PDFs)

Max 5 files, 10MB each

Website/Booking link (optional):

URL input

Validation (Zod schema):

Title: min 1, max 200 chars

Start time required

End time must be after start

Cost must be positive

URL must be valid

Form behavior:

Dynamic placeholders based on event type

Show/hide fields based on type (e.g., cost optional for activities)

Auto-suggest location from Google Places API (optional)

Preview uploaded files

API Route: src/app/api/trips/[tripId]/events/route.ts

POST: Create event

Upload attachments to UploadThing

Update budget spent if cost provided

Increment member's eventsAdded stat

Create notification for trip members

On success:

Close modal

Invalidate events query

Scroll timeline to new event

Show success toast

Use:

Shadcn Dialog, Form components

React Hook Form + Zod

date-fns for date handling

Output add event modal and API route.

---

### Prompt 5.3: Edit/Delete Event

Create event editing and deletion functionality.

Component: src/components/event/EditEventModal.tsx

Same as AddEventModal but pre-filled with event data

Only event creator, trip owner, or admin can edit

Can update all fields except event type (locked after creation)

Component: src/components/event/DeleteEventDialog.tsx

Shadcn AlertDialog

Confirm deletion with warning

Show event title in confirmation

Only event creator, trip owner, or admin can delete

API Route: src/app/api/events/[id]/route.ts

GET: Fetch single event (with relations)

PATCH: Update event

Check permissions (creator, owner, admin)

Update budget if cost changed

Handle attachment updates

DELETE: Delete event

Check permissions

Delete attachments from storage

Update budget

Decrement member's eventsAdded stat

Optimistic updates:

Update UI immediately

Revert on error

Use React Query's optimistic update pattern

On successful edit:

Close modal

Show success toast

Update timeline

On successful delete:

Remove from timeline

Show success toast

Output edit modal, delete dialog, and API route.

---

### Prompt 5.4: Event Voting

Implement voting (likes) on events.

Component: src/components/event/VoteButton.tsx

Heart icon (filled if user voted, outline if not)

Vote count next to icon

Click → toggle vote

Optimistic UI update

Disabled state while mutating

Component: src/components/event/VotesList.tsx (optional)

Tooltip or popover showing who voted

Avatar list of voters

"You and 4 others"

API Route: src/app/api/events/[id]/vote/route.ts

POST: Toggle vote

If user already voted → remove vote

If not voted → add vote

Return updated vote count

Database:

Vote model already in schema (eventId, userId, unique constraint)

UI updates:

Optimistic update (instant feedback)

React Query mutation

Invalidate event query on success

Add vote sorting:

In timeline, add sort option "By popularity"

Sort events by vote count descending

Output vote button component and API route.

---

## Phase 6: Map Integration

### Prompt 6.1: Trip Map View

Create interactive map page showing all event locations.

File: src/app/trip/[id]/map/page.tsx

Setup React Leaflet:

Install: react-leaflet, leaflet

Import Leaflet CSS in layout

Component: src/components/map/TripMap.tsx

Map configuration:

Use OpenStreetMap tiles

Auto-fit bounds to show all event markers

Default zoom level 12

Mobile-responsive height

Features:

Display markers for events with coordinates

Custom marker icons based on event type:

Use Leaflet.divIcon with emoji or Lucide icons

Color-coded (same as timeline)

Marker clusters if many events in same area (optional)

Click marker → open popup with event summary

Component: src/components/map/EventMarker.tsx

Props: event data

Custom icon based on event.type

Popup content:

Event title

Date/time

Type badge

"View in timeline" button

Component: src/components/map/EventPopup.tsx

Shadcn-styled popup content

Show event details

Action buttons (edit, delete if permitted)

Link to timeline (scroll to event)

Map controls:

Filter events by type (same as timeline)

"Center on map" button (fit all markers)

Search location (optional)

Handle events without coordinates:

Show list below map: "Events without location"

Allow quick "Add location" action

Utils: src/lib/map-utils.ts

calculateBounds(events): get LatLngBounds for all events

geocodeAddress(address): convert address to lat/lng (use Nominatim API)

Output map components and utilities.

---

### Prompt 6.2: Location Geocoding

Add location search and geocoding to event forms.

Component: src/components/event/LocationInput.tsx

Autocomplete search input

Uses OpenStreetMap Nominatim API for free geocoding

Dropdown with search results

Select result → populate location, address, lat, lng

API Route: src/app/api/geocode/route.ts

GET: Proxy to Nominatim API (avoid CORS)

Query params: q (search query)

Return: array of {name, address, lat, lng}

Integration:

Add LocationInput to AddEventModal and EditEventModal

Store lat/lng in event model

Display on map automatically

Features:

Debounced search (500ms)

Loading indicator while searching

Clear button

"Use current location" button (browser geolocation API)

Optional: Show mini map preview in modal when location selected

Output LocationInput component and geocoding API route.

---

## Phase 7: Budget Tracker

### Prompt 7.1: Budget Overview Page

Create budget tracking page.

File: src/app/trip/[id]/budget/page.tsx

Layout sections:

Budget Header:

Total budget vs spent (large numbers)

Remaining amount (color: green if OK, yellow if >80%, red if over)

Progress bar (visual representation)

Per-person split (total / member count)

Edit budget button (opens modal)

Category Breakdown:

Grid of category cards

Each card shows:

Category name with icon

Allocated amount

Spent amount

Progress bar

Percentage

Color-coded by category

Budget Chart:

Pie chart showing spending by category

Use Recharts library

Legend with percentages

Expenses List:

Table or list of all expenses

Columns: Date, Event/Item, Category, Amount, Paid by

Filter by category

Sort by date/amount

Show event link if expense is from event

Quick Add Expense button (FAB):

Opens modal for standalone expense

Component: src/components/budget/BudgetOverview.tsx

Display total budget stats

Progress bar with gradient (green → yellow → red)

Component: src/components/budget/CategoryCard.tsx

Individual category display

Progress bar

Click to filter expenses by category

Component: src/components/budget/BudgetChart.tsx

Recharts PieChart

Responsive sizing

Custom colors per category

Legend

Component: src/components/budget/ExpensesList.tsx

Table using Shadcn Table component

Sortable columns

Filter dropdown

Pagination if many expenses

API Route: src/app/api/trips/[id]/budget/route.ts

GET: Get budget with categories and all expenses (from events)

PATCH: Update budget settings (total, category allocations)

Calculate expenses from events:

Sum all events with cost, group by category

Include paid by and split between data

Output budget page and all components.

---

### Prompt 7.2: Edit Budget Modal

Create modal for editing budget configuration.

Component: src/components/budget/EditBudgetModal.tsx

Form fields:

Total budget (number input, required)

Currency (select, matches trip currency)

Budget categories (dynamic list):

Category name (text input)

Allocated amount (number input)

Color picker (for chart)

Remove button

"Add Category" button

Default categories: Flights, Hotels, Food, Activities, Transport, Other

Validation:

Total budget must be positive

Sum of category allocations should equal total budget (show warning if not)

Category names must be unique

Display:

Visual feedback if allocations ≠ total

Percentage next to each allocation

API updates in /api/trips/[id]/budget/route.ts:

PATCH: Update budget and categories

Handle category creation/update/deletion

On save:

Update budget

Recalculate category spending

Invalidate budget query

Show success toast

Output edit budget modal with category management.

---

### Prompt 7.3: Quick Add Expense

Create quick expense form for standalone expenses (not linked to events).

Component: src/components/budget/AddExpenseModal.tsx

This is for expenses that don't fit in timeline events (e.g., ATM withdrawal, random purchase).

Form fields:

Description (required) - what was purchased

Amount (required, number)

Category (select from budget categories)

Date (date picker, defaults to today)

Paid by (select trip member)

Split between (multi-select members, defaults to all)

Note: These create special "expense-only" events with type OTHER, not shown prominently in timeline

Alternative approach (simpler):

Just add cost directly to budget tracking

Don't create event

Store in separate Expense model

Decide: Do we want standalone expenses or always link to events?
Recommendation: Always create event (type: OTHER) for consistency

API: Use existing /api/trips/[tripId]/events/route.ts

Create event with type OTHER, minimal info

Output quick expense modal.

---

## Phase 8: Document Management

### Prompt 8.1: Documents Page

Create document management page.

File: src/app/trip/[id]/documents/page.tsx

Layout:

Filter tabs:

All

Tickets

Bookings

Passports

Visas

Insurance

Itineraries

Other

View toggle: Grid / List

Upload button + drag-drop zone

Document grid/list:

Each document shows:

File icon based on type and extension

File name

File size

Upload date

Uploaded by (member name)

Linked event (if any)

Action menu (preview, download, delete)

Empty state when no documents

Component: src/components/document/DocumentGrid.tsx

Responsive grid (2 cols mobile, 3 tablet, 4 desktop)

Document cards with hover effects

Component: src/components/document/DocumentCard.tsx

File preview thumbnail (if image)

File icon (if PDF/other)

File metadata

Action dropdown menu

Component: src/components/document/UploadZone.tsx

Drag-and-drop area (Shadcn style)

Click to browse files

Show upload progress

Support multiple files

File type restrictions (images, PDFs)

Size limit (10MB per file)

API Route: src/app/api/trips/[id]/documents/route.ts

GET: List all documents for trip (with filters)

POST: Handle document metadata after upload

Setup UploadThing:

Install uploadthing package

Create upload route: src/app/api/uploadthing/route.ts

Configure allowed file types and sizes

Generate signed URLs for uploads

On upload success:

Save document metadata to database

Increment member's documentsAdded stat

Create notification (optional)

Show success toast

Output documents page and upload components.

---

### Prompt 8.2: Document Preview & Actions

Create document preview and action functionality.

Component: src/components/document/DocumentPreview.tsx

Full-screen modal

Display based on file type:

Images: Full-size with zoom controls

PDFs: Embedded PDF viewer (react-pdf or iframe)

Other: Download prompt

Navigation arrows (prev/next document)

Document info panel:

Name, size, upload date

Uploaded by

Linked event (with link)

Actions:

Download

Delete (with confirmation)

Edit metadata (rename, change type, link to event)

Component: src/components/document/EditDocumentModal.tsx

Form to update:

Document name

Document type

Link to event (dropdown of trip events)

API Route: src/app/api/documents/[id]/route.ts

GET: Fetch single document with presigned URL

PATCH: Update document metadata

DELETE: Delete document

Remove from UploadThing storage

Remove from database

Decrement member's documentsAdded stat

Download functionality:

Generate temporary download URL

Trigger browser download

Track downloads (optional)

Output preview modal and document actions.

---

## Phase 9: Notifications

### Prompt 9.1: Notification System

Create notification system for event reminders and updates.

Model: Already in Prisma schema (Notification)

Component: src/components/layout/NotificationBell.tsx

Bell icon in header

Badge with unread count

Click → open dropdown with recent notifications

Component: src/components/notification/NotificationDropdown.tsx

List of 5 most recent notifications

Each notification shows:

Icon based on type

Title

Message

Time ago (e.g., "2 hours ago")

Unread indicator (blue dot)

"Mark all as read" button

"View all" link (to full notifications page)

Component: src/components/notification/NotificationItem.tsx

Clickable (navigates to related trip/event)

Mark as read on click

Relative timestamp

Page: src/app/notifications/page.tsx

Full list of notifications (paginated)

Filter: All, Unread, Read

Group by date (Today, Yesterday, This week, Older)

API Route: src/app/api/notifications/route.ts

GET: Fetch user's notifications (with pagination, filters)

POST: Create notification (internal use)

API Route: src/app/api/notifications/[id]/route.ts

PATCH: Mark as read

DELETE: Delete notification

API Route: src/app/api/notifications/read-all/route.ts

POST: Mark all as read

Notification triggers (create utility: lib/notifications.ts):

Member joined trip

New event added

Event edited/deleted

Budget threshold reached (80%, 100%)

Document uploaded

Event reminder (handled separately with cron)

Output notification components and API routes.

---

### Prompt 9.2: Event Reminders (Email)

Create event reminder system with email notifications.

Setup Resend:

Install @resend/resend

Configure API key

Create email templates

Email template: emails/event-reminder.tsx

Use React Email or simple HTML

Subject: "Reminder: [Event Title] in 2 days"

Body:

Trip name

Event details (title, date, time, location)

"View Trip" button (link)

Unsubscribe link (optional)

Cron job: src/app/api/cron/reminders/route.ts

Vercel Cron (runs daily at 9 AM)

Query events starting in 2 days

Filter events where reminderSent = false

Send email to all trip members

Mark reminderSent = true

Create in-app notification

Configure cron in vercel.json:
{
"crons": [{
"path": "/api/cron/reminders",
"schedule": "0 9 * * *"
}]
}

Utility: src/lib/email.ts

sendEventReminder(event, members)

Email formatting helpers

Error handling

Alternative to cron (for development):

Button in UI to test reminders

Manual trigger API route

User preferences (future):

Notification settings page

Toggle email notifications

Choose reminder timing (2 days, 1 day, same day)

Output cron job, email template, and Resend setup.

---

## Phase 10: Voting System

### Prompt 10.1: Implement Voting (Already covered in Phase 5.4)

This was completed in Phase 5.4: Event Voting.

Verify implementation includes:

Vote button on event cards

Toggle vote functionality

Vote count display

Optimistic UI updates

API route for voting

Sort events by vote count

If not completed, refer to Phase 5.4 prompt.

---

## Phase 11: Gamification

### Prompt 11.1: Achievement System

Create gamification with achievements and stats.

File: src/lib/achievements.ts

Define achievements:
export const ACHIEVEMENTS = [
{
id: 'planner_pro',
name: 'Planner Pro',
description: 'Added 10+ events to a trip',
icon: '🎖️',
condition: (stats: MemberStats) => stats.eventsAdded >= 10,
},
{
id: 'budget_master',
name: 'Budget Master',
description: 'Stayed within trip budget',
icon: '💰',
condition: (trip: Trip) => trip.budget.spent <= trip.budget.totalBudget,
},
{
id: 'jet_setter',
name: 'Jet Setter',
description: 'Created 3+ trips',
icon: '✈️',
condition: (user: User) => user.totalTrips >= 3,
},
{
id: 'documentarian',
name: 'Documentarian',
description: 'Uploaded 5+ documents',
icon: '📸',
condition: (stats: MemberStats) => stats.documentsAdded >= 5,
},
{
id: 'popular_pick',
name: 'Popular Pick',
description: 'Event got 5+ votes',
icon: '❤️',
condition: (event: Event) => event.votes.length >= 5,
},
{
id: 'explorer',
name: 'Explorer',
description: 'Added 20+ locations to trips',
icon: '🗺️',
condition: (user: User) => user.totalLocations >= 20, // Track separately
},
{
id: 'early_bird',
name: 'Early Bird',
description: 'Planned trip 6+ months in advance',
icon: '🐦',
condition: (trip: Trip) => {
const monthsUntil = differenceInMonths(trip.startDate, trip.createdAt);
return monthsUntil >= 6;
},
},
]

Utility functions:

checkAchievements(user, trips, stats): Check all achievement conditions

unlockAchievement(userId, achievementId): Add to user.achievements

getUnlockedAchievements(userId): Get user's achievements

Component: src/components/gamification/AchievementBadge.tsx

Display achievement icon and name

Locked state (grayed out with lock icon)

Unlocked state (colored with shine effect)

Tooltip with description and progress

Component: src/components/gamification/AchievementNotification.tsx

Toast-style notification when achievement unlocked

Confetti animation (use react-confetti)

"Achievement Unlocked!" message

Update member stats display (Members page):

Show achievement badges

Display stats (events added, docs uploaded, spent)

Leaderboard section (optional): Top contributors

API Route: src/app/api/achievements/check/route.ts

POST: Check and unlock achievements

Called after: event creation, document upload, trip creation

Returns newly unlocked achievements

Trigger checks:

After creating event → check planner_pro, popular_pick

After uploading doc → check documentarian

After creating trip → check jet_setter, early_bird

When trip ends → check budget_master

Output achievement system with components and logic.

---

### Prompt 11.2: Member Stats & Leaderboard

Enhanced member statistics display.

Component: src/components/gamification/MemberStats.tsx
Props: member (TripMember with stats)

Display:

Stats cards:

Events added (with trophy if top contributor)

Documents uploaded

Total spent

Achievements earned count

Achievement showcase:

Grid of unlocked achievements

Show max 6, "+X more" if more than 6

Progress bars:

Progress toward next achievement

Example: "7/10 events for Planner Pro"

Optional: Trip Leaderboard
Component: src/components/gamification/TripLeaderboard.tsx

Show rankings:

Most events added

Most documents uploaded

Most voted events (if event creator)

Display as podium (1st, 2nd, 3rd) with medals 🥇🥈🥉

Use Framer Motion for animations when stats update.

Output enhanced stats display.

---

## Phase 12: PWA & Offline Mode

### Prompt 12.1: PWA Configuration

Convert app to Progressive Web App.

Install next-pwa:
npm install next-pwa

Update next.config.js:
const withPWA = require('next-pwa')({
dest: 'public',
register: true,
skipWaiting: true,
disable: process.env.NODE_ENV === 'development',
})

module.exports = withPWA({
// existing Next.js config
})

Create public/manifest.json:
{
"name": "TripWeave",
"short_name": "TripWeave",
"description": "Collaborative travel planning app",
"start_url": "/",
"display": "standalone",
"background_color": "#ffffff",
"theme_color": "#3b82f6",
"icons": [
{
"src": "/icon-192.png",
"sizes": "192x192",
"type": "image/png"
},
{
"src": "/icon-512.png",
"sizes": "512x512",
"type": "image/png"
}
]
}

Add to app/layout.tsx <head>:

<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#3b82f6" />
<link rel="apple-touch-icon" href="/icon-192.png" />

Generate PWA icons:

Use https://realfavicongenerator.net/

Generate 192x192 and 512x512 icons

Add to /public

Service Worker strategy:

NetworkFirst for API routes (fresh data, fallback to cache)

CacheFirst for static assets (images, fonts)

StaleWhileRevalidate for pages

Output PWA configuration and manifest.

---

### Prompt 12.2: Offline Support with IndexedDB

Implement offline data persistence.

Install Dexie.js:

npm install dexie

npm install dexie

Create src/lib/db.ts:
Define IndexedDB schema for offline storage:

trips table

events table

documents table (metadata only, not files)

pendingSync table (for queued mutations)

Wrapper functions:

saveTripsOffline(trips)

getTripsOffline()

saveEventsOffline(tripId, events)

queueMutation(type, data) - for offline changes

Component: src/components/layout/OnlineStatus.tsx

Shows online/offline indicator in header

Green dot (online) or red dot (offline)

Toast when connection lost/restored

Offline behavior:

When offline:

Load data from IndexedDB

Queue mutations (create/update/delete) in pendingSync table

Show "Offline mode" banner

When back online:

Show "Syncing..." toast

Process pendingSync queue

Refetch fresh data

Show "Synced" success toast

Sync strategy:

Use Background Sync API (if supported)

Fallback to sync on app open

Page: src/app/offline/page.tsx

Shown by service worker when offline and no cache

Friendly message

List cached trips (clickable)

Utility: src/lib/sync.ts

syncPendingChanges()

processSyncQueue()

Test offline:

Chrome DevTools → Network → Offline

Verify data loads from IndexedDB

Create event offline → queue mutation

Go online → verify sync

Output offline support implementation.

---

### Prompt 12.3: Install Prompt

Add PWA install prompt for mobile users.

Component: src/components/pwa/InstallPrompt.tsx

Features:

Detect if app is installable (beforeinstallprompt event)

Show banner with "Install App" button

Dismiss button (remember preference)

Only show on mobile (hide on desktop)

Implementation:

Listen for beforeinstallprompt event

Store prompt deferral

Trigger prompt on button click

Track installation (appinstalled event)

Hide prompt after install

UI:

Bottom banner (non-intrusive)

App icon + "Install TripWeave" message

"Install" and "Not now" buttons

Local storage:

Save dismiss state

Don't show again for 7 days if dismissed

Output install prompt component.

---

## Phase 13: Polish & Testing

### Prompt 13.1: Responsive Design Audit

Ensure app is fully responsive across devices.

Breakpoints (Tailwind):

Mobile: < 640px

Tablet: 640px - 1024px

Desktop: > 1024px

Pages to review:

Dashboard:

Single column on mobile

2 columns on tablet

3 columns on desktop

Trip Overview:

Stack tabs vertically on mobile (dropdown)

Horizontal tabs on tablet+

Timeline:

Full width on mobile

Event cards stack

Readable font sizes (min 16px for body)

Map:

Full screen on mobile

Adjust map height for different screens

Touch-friendly markers

Forms/Modals:

Full screen on mobile

Centered dialog on desktop

Scrollable content

Bottom action buttons always visible

Budget charts:

Responsive chart sizing

Horizontal scroll for tables on mobile

Touch targets:

Min 44x44px for buttons (mobile)

Adequate spacing between interactive elements

Fonts:

Base 16px (mobile)

Scale up on larger screens

Navigation:

Hamburger menu on mobile

Full nav on desktop

Test on:

iPhone SE (375px)

iPad (768px)

Desktop (1920px)

Use Chrome DevTools device emulation.

Output list of responsive design fixes needed.

---

### Prompt 13.2: Loading States & Skeletons

Add loading states and skeleton screens.

Create skeleton components:

Component: src/components/ui/TripCardSkeleton.tsx

Skeleton mimicking TripCard layout

Shimmer animation effect

Component: src/components/ui/TimelineSkeleton.tsx

Multiple EventCard skeletons

Day header skeletons

Component: src/components/ui/MapSkeleton.tsx

Gray rectangle for map area

Component: src/components/ui/TableSkeleton.tsx

For budget expenses table

Use Shadcn Skeleton component as base.

Update pages to show skeletons:

Dashboard → TripCardSkeleton (3x)

Timeline → TimelineSkeleton

Map → MapSkeleton

Budget → BudgetSkeleton

Button loading states:

Add loading prop to buttons

Show spinner + "Loading..." text

Disable button while loading

Form submission:

Disable all inputs while submitting

Show spinner on submit button

Use React Query's isLoading and isFetching states.

Output skeleton components and loading state updates.

---

### Prompt 13.3: Error Handling

Implement comprehensive error handling.

Error Boundary:
File: src/components/ErrorBoundary.tsx

Catch React component errors

Show friendly error UI

"Try again" button (reload)

Report error (optional: Sentry integration)

Wrap app in error boundary (layout.tsx)

API Error handling:
Utility: src/lib/error-handler.ts

Parse API errors

Return user-friendly messages

Handle different error types:

400 Bad Request → Show validation errors

401 Unauthorized → Redirect to login

403 Forbidden → "Permission denied"

404 Not Found → "Resource not found"

500 Server Error → "Something went wrong"

Toast notifications:
Use Shadcn Toast for error messages:

Red toast for errors

Yellow toast for warnings

Green toast for success

React Query error handling:

onError callback in mutations

Show toast with error message

Retry logic for transient errors

Form validation errors:

Show inline error messages (red text below input)

Highlight invalid fields (red border)

Disable submit until valid

Empty states:

No trips: "Create your first trip"

No events: "Add your first event"

No documents: "Upload documents"

No internet: "You're offline"

404 page:
File: src/app/not-found.tsx

Friendly 404 message

"Back to dashboard" link

Output error handling components and utilities.

---

### Prompt 13.4: Performance Optimization

Optimize app performance.

Image optimization:

Use next/image for all images

Set proper width/height

Lazy load images below fold

WebP format

Code splitting:

Dynamic imports for heavy components:

Map (React Leaflet)

Charts (Recharts)

PDF viewer

Use next/dynamic with loading component

React Query optimization:

Set staleTime (5 minutes for trips)

Enable caching

Prefetch on hover (trip cards)

Bundle size:

Analyze with @next/bundle-analyzer

Tree-shake unused code

Remove unused dependencies

Database query optimization:

Use Prisma select to fetch only needed fields

Add database indexes:

tripId on Event, Document, TripMember

userId on Vote, Notification

Pagination for large lists

Debounce expensive operations:

Search inputs (500ms)

Geocoding API calls (500ms)

Auto-save (1000ms)

Lighthouse audit:

Run on all pages

Aim for scores: Performance 90+, Accessibility 100, Best Practices 100, SEO 90+

Fonts:

Use next/font for optimal font loading

Subset fonts (only needed characters)

Output performance optimization checklist and implementations.

---

### Prompt 13.5: Final Testing Checklist

Comprehensive testing before launch.

Functional Testing:

Authentication:

Sign up works

Sign in works

Sign out works

Protected routes redirect to login

Trip Management:

Create trip

Edit trip

Delete trip

View trip details

Navigate between tabs

Member Management:

Invite by email

Invite by link

Accept invite

Remove member

Change member role

Events:

Add all event types

Edit event

Delete event

Vote on event

Filter events

Sort events

Map:

Events display on map

Markers show correct icons

Popup shows event details

Map auto-fits bounds

Budget:

Set budget

Add expenses

View budget breakdown

Charts display correctly

Category filtering works

Documents:

Upload documents (single & multiple)

Preview PDF

Preview images

Download documents

Delete documents

Filter by type

Notifications:

Event reminders sent

In-app notifications appear

Mark as read works

Notification bell badge updates

Gamification:

Achievements unlock correctly

Stats update in real-time

Badges display on profile

PWA:

App installs on mobile

Works offline

Syncs when back online

Manifest loads correctly

Cross-browser Testing:

Chrome (desktop & mobile)

Safari (desktop & mobile)

Firefox

Edge

Device Testing:

iPhone SE (small screen)

iPhone 12/13

iPad

Android phone

Desktop (1920px+)

Edge Cases:

Long trip names

Many events (50+)

Large file uploads

Slow network (3G)

No internet (offline)

Multiple members (10+)

Security:

Can't access other user's trips

Can't edit trip if not member

API routes check permissions

File uploads have size limits

SQL injection prevention (Prisma)

Output any bugs found and fixes needed.

---

## Additional Prompts

### Prompt: Deploy to Vercel

Deploy app to Vercel for production.

Steps:

Push code to GitHub

Connect Vercel:

Go to vercel.com

Import project from GitHub

Select repository

Configure environment variables in Vercel:

DATABASE_URL (Vercel Postgres or Supabase)

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

CLERK_SECRET_KEY

UPLOADTHING_SECRET

UPLOADTHING_APP_ID

RESEND_API_KEY

Deploy settings:

Framework: Next.js

Build command: npm run build

Output directory: .next

Database setup:

Run Prisma migrations:
npx prisma migrate deploy

Or use Vercel Postgres (auto-migration)

Custom domain (optional):

Add in Vercel project settings

Update DNS records

Enable Vercel Cron (for event reminders):

Create vercel.json with cron config

Deploy

Test production:

Visit deployed URL

Run full testing checklist

Check logs for errors

Monitor:

Setup Vercel Analytics

Optional: Add Sentry for error tracking

Output deployment checklist and any issues.

---

### Prompt: Seed with Real Data

Create realistic seed data for your actual Japan trip.

Update prisma/seed.ts with:

Trip details:

Name: "Japan 2026"

Destination: "Tokyo, Kyoto, Osaka"

Dates: Your actual travel dates

Budget: Your estimated budget

Events (realistic examples):

Flight: Vienna (VIE) → Tokyo (NRT) with actual flight time

Hotel: Tokyo hotel with real address

Activities:

Senso-ji Temple (Asakusa)

Tokyo Skytree

Shibuya Crossing

Tsukiji Market

Restaurants:

Sushi restaurant in Ginza

Ramen shop in Shinjuku

Transport:

Shinkansen Tokyo → Kyoto

JR Pass activation

Add real coordinates (lat/lng) for map testing.

Budget categories with allocations:

Flights: €800

Hotels: €1200

Food: €600

Activities: €400

Transport: €200

Documents:

Flight ticket PDF (placeholder)

Hotel booking confirmation

Run seed and test with real data.

Output updated seed script.

---

## Usage Instructions

1. **Sequential execution**: Start with Phase 1 and complete each phase before moving to the next.

2. **Copy-paste prompts**: Copy entire prompt block into Cursor/Antigravity.

3. **Adapt as needed**: Modify prompts based on your specific requirements or agent responses.

4. **Test after each phase**: Don't move to next phase until current features work.

5. **Commit frequently**: Git commit after completing each phase.

6. **Review generated code**: AI agents can make mistakes—always review output.

7. **Ask for clarifications**: If agent output is unclear, ask follow-up questions.

8. **Combine prompts**: Some phases can be done together if related.

9. **Skip optional features**: Mark prompts as [OPTIONAL] if you want to skip for MVP.

10. **Document changes**: Keep notes on any deviations from plan.

---

**Ready to build! Start with Phase 1, Prompt 1.1** 🚀

Good luck with TripWeave development!
