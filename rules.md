# TripWeave — Cursor Rules & AI Agent Guidelines
## .cursorrules configuration

Place this file in your project root as `.cursorrules` for Cursor AI to follow these guidelines automatically.

---

## Project Context

You are working on **TripWeave**, a collaborative travel planning Progressive Web App (PWA) built with modern web technologies.

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Storage**: UploadThing for files
- **Email**: Resend
- **Maps**: React Leaflet with OpenStreetMap
- **Charts**: Recharts
- **State Management**: TanStack React Query (React Query v5)
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Vercel

### Project Structure
/src
/app # Next.js App Router pages
/dashboard # User's trips dashboard
/trip/[id] # Trip pages (timeline, map, budget, etc.)
/api # API routes
/(auth) # Auth pages (sign-in, sign-up)
/components
/ui # Shadcn components
/trip # Trip-related components
/event # Event/timeline components
/budget # Budget tracking components
/document # Document management components
/map # Map components
/layout # Layout components (header, nav, etc.)
/gamification # Achievement/stats components
/lib
/prisma.ts # Prisma client
/utils.ts # Utility functions
/validations # Zod schemas
/achievements.ts # Gamification logic
/types # TypeScript types


---

## Core Rules

### 1. Code Style & Formatting

- **TypeScript strict mode**: Always use strict TypeScript. No `any` types unless absolutely necessary.
- **Functional components**: Use React functional components with hooks. No class components.
- **Named exports**: Prefer named exports over default exports for components.
- **File naming**: 
  - Components: PascalCase (e.g., `TripCard.tsx`)
  - Utilities: camelCase (e.g., `formatDate.ts`)
  - Pages: lowercase with hyphens (e.g., `[id]/page.tsx`)
- **Imports order**:
  1. React and Next.js imports
  2. External libraries
  3. Internal components
  4. Types
  5. Utilities
  6. Styles

### 2. Component Guidelines

- **Single Responsibility**: Each component should do one thing well.
- **Props interfaces**: Always define TypeScript interfaces for component props.
- **Component size**: Keep components under 250 lines. Split into smaller components if longer.
- **Composition over inheritance**: Build complex UIs by composing smaller components.
- **Server vs Client Components**:
  - Default to Server Components in App Router
  - Use `'use client'` directive only when needed (hooks, interactivity, browser APIs)
  - Keep Client Components small and focused

Example component structure:
```typescript
'use client' // Only if needed

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Trip } from '@/types'

interface TripCardProps {
  trip: Trip
  onEdit?: () => void
}

export function TripCard({ trip, onEdit }: TripCardProps) {
  // Component logic
  return (
    // JSX
  )
}

### 3. Styling

Tailwind first: Use Tailwind CSS utility classes for styling.

Shadcn components: Use Shadcn/ui components as base. Customize with Tailwind.

Responsive design: Always add responsive classes (sm:, md:, lg:).

Mobile-first: Write mobile styles first, then add breakpoints for larger screens.

No inline styles: Avoid style prop. Use Tailwind or CSS modules if necessary.

Dark mode ready: Use Tailwind's dark mode utilities where appropriate.

Example:

```tsx
<div className="flex flex-col gap-4 p-4 md:flex-row md:gap-6 md:p-6">
  <Button className="w-full md:w-auto">Action</Button>
</div>
```

### 4. State Management

React Query for server state: Use TanStack React Query for all API data fetching.

Local state: Use useState for component-local UI state.

Form state: Use React Hook Form for all forms.

No Redux: This project doesn't use Redux or other global state libraries.

React Query patterns:

```typescript
// Queries
const { data, isLoading, error } = useQuery({
  queryKey: ['trips'],
  queryFn: fetchTrips,
  staleTime: 5 * 60 * 1000, // 5 minutes
})

// Mutations
const mutation = useMutation({
  mutationFn: createTrip,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['trips'] })
    toast.success('Trip created!')
  },
  onError: (error) => {
    toast.error(error.message)
  },
})
```

### 5. Forms & Validation

React Hook Form: Use for all forms.

Zod schemas: Define validation schemas in /lib/validations.

Type-safe: Infer TypeScript types from Zod schemas with z.infer<typeof schema>.

Error handling: Show validation errors inline below inputs.

Example:

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const tripSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  startDate: z.date(),
  endDate: z.date(),
}).refine(data => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
})

type TripFormData = z.infer<typeof tripSchema>

export function TripForm() {
  const form = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
  })
  
  // Form logic
}
```

### 6. API Routes

RESTful conventions:

GET: Fetch data

POST: Create resource

PATCH: Update resource

DELETE: Remove resource

Error handling: Always return proper HTTP status codes.

Type safety: Use TypeScript for request/response types.

Authentication: Check Clerk auth in all protected routes.

Prisma queries: Use Prisma Client for all database operations.

Example API route:

```typescript
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const trips = await prisma.trip.findMany({
      where: {
        members: {
          some: { userId }
        }
      },
      include: {
        members: {
          include: { user: true }
        },
        _count: {
          select: { events: true }
        }
      }
    })
    
    return NextResponse.json(trips)
  } catch (error) {
    console.error('Error fetching trips:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 7. Database (Prisma)

Transactions: Use Prisma transactions for multi-step operations.

Relations: Always include necessary relations in queries.

Select fields: Use select to fetch only needed fields for performance.

Error handling: Catch Prisma errors and return user-friendly messages.

Example:

```typescript
const trip = await prisma.trip.findUnique({
  where: { id: tripId },
  select: {
    id: true,
    name: true,
    destination: true,
    members: {
      select: {
        user: {
          select: { id: true, name: true, avatar: true }
        }
      }
    }
  }
})
```

### 8. Performance

Dynamic imports: Lazy load heavy components (maps, charts).

Image optimization: Always use next/image.

Memoization: Use useMemo and useCallback for expensive computations.

Pagination: Paginate large lists (>50 items).

Debouncing: Debounce search inputs and API calls.

Example:

```typescript
import dynamic from 'next/dynamic'

const TripMap = dynamic(() => import('@/components/map/TripMap'), {
  loading: () => <MapSkeleton />,
  ssr: false, // Disable SSR for Leaflet
})
```

### 9. Error Handling

Try-catch: Wrap API calls and async operations in try-catch.

User-friendly messages: Show clear, actionable error messages.

Toast notifications: Use toast for success/error feedback.

Error boundaries: Wrap components that might error.

Logging: Log errors to console (or external service in production).

### 10. Accessibility

Semantic HTML: Use proper HTML elements (<button>, <nav>, <main>, etc.).

ARIA labels: Add aria-label to icons and non-text elements.

Keyboard navigation: Ensure all interactive elements are keyboard accessible.

Focus management: Manage focus in modals and dynamic content.

Color contrast: Ensure WCAG AA compliance (4.5:1 ratio).

### 11. Testing

Manual testing: Test each feature after implementation.

Edge cases: Test with empty states, large datasets, slow networks.

Cross-browser: Test on Chrome, Safari, Firefox.

Mobile testing: Test on actual mobile devices, not just DevTools.

Offline testing: Test PWA offline functionality.

### Specific Guidelines

#### Authentication (Clerk)

Use auth() in Server Components and API routes

Use useUser() hook in Client Components

Always check authentication before rendering protected content

Redirect to sign-in for unauthenticated users

```typescript
// Server Component
import { auth } from '@clerk/nextjs'

export default async function Page() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')
  // ...
}

// Client Component
'use client'
import { useUser } from '@clerk/nextjs'

export function Component() {
  const { user, isLoaded } = useUser()
  if (!isLoaded) return <Spinner />
  // ...
}
```

#### Data Fetching

Server Components: Fetch data directly in Server Components when possible

Client Components: Use React Query for data fetching

Prefetching: Prefetch data on hover for better UX

Caching: Set appropriate staleTime for React Query

#### File Structure for New Features

When adding a new feature, create:

Page component in /app

Feature components in /components/[feature]

API routes in /app/api/[feature]

Zod schemas in /lib/validations/[feature].ts

Types in /types/[feature].ts

#### Naming Conventions

Components: PascalCase (e.g., EventCard.tsx)

Hooks: use prefix (e.g., useTrips.ts)

Utils: camelCase (e.g., formatDate.ts)

Constants: UPPER_SNAKE_CASE (e.g., MAX_FILE_SIZE)

Types/Interfaces: PascalCase (e.g., TripFormData)

#### Comments

Avoid obvious comments: Code should be self-documenting

Complex logic: Add comments for non-obvious business logic

TODOs: Use // TODO: for future improvements

API documentation: Document API route parameters and responses

### AI Agent Specific Instructions

#### When Generating Code

Ask for clarification if requirements are ambiguous

Provide complete code - don't use placeholders like // ... rest of code

Include imports - always show all necessary imports

TypeScript types - define interfaces/types for all props and data

Error handling - include try-catch and error states

Loading states - include loading UI for async operations

Responsive design - add mobile/tablet/desktop breakpoints

Accessibility - include ARIA labels where needed

#### When Refactoring

Preserve functionality - ensure existing behavior doesn't break

Maintain types - keep TypeScript types accurate

Update imports - fix import paths if files are moved

Test suggestions - suggest how to test refactored code

#### When Debugging

Identify root cause - explain why the bug occurs

Provide fix - show exact code changes needed

Prevent recurrence - suggest how to avoid similar bugs

Test steps - describe how to verify the fix

#### Code Review Checklist

Before submitting generated code, verify:

- TypeScript compiles without errors
- All imports are correct
- Component has proper types for props
- Error handling is present
- Loading states are shown
- Responsive classes are added
- Accessibility attributes are included
- Code follows project conventions
- No hardcoded values (use constants/env vars)
- Console logs are removed (except intentional logging)

### Common Patterns

#### Modal Pattern

```tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MyModal({ open, onOpenChange }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modal Title</DialogTitle>
        </DialogHeader>
        {/* Modal content */}
      </DialogContent>
    </Dialog>
  )
}
```

#### Form Pattern

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { mySchema, type MyFormData } from '@/lib/validations/my-feature'

export function MyForm() {
  const form = useForm<MyFormData>({
    resolver: zodResolver(mySchema),
    defaultValues: { /* ... */ },
  })

  const onSubmit = async (data: MyFormData) => {
    // Handle submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fieldName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  )
}
```

#### API Client Pattern

```typescript
// lib/api/trips.ts
export async function fetchTrips() {
  const response = await fetch('/api/trips')
  if (!response.ok) throw new Error('Failed to fetch trips')
  return response.json()
}

export async function createTrip(data: CreateTripData) {
  const response = await fetch('/api/trips', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create trip')
  return response.json()
}

// In component
import { useQuery, useMutation } from '@tanstack/react-query'
import { fetchTrips, createTrip } from '@/lib/api/trips'

const { data: trips } = useQuery({
  queryKey: ['trips'],
  queryFn: fetchTrips,
})

const createMutation = useMutation({
  mutationFn: createTrip,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['trips'] })
  },
})
```

### Environment Variables

Required environment variables (add to .env.local):

```env
# Database
DATABASE_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

# UploadThing
UPLOADTHING_SECRET="sk_..."
UPLOADTHING_APP_ID="..."

# Resend (Email)
RESEND_API_KEY="re_..."
```

Never commit .env.local to version control. Use .env.example for documentation.

### Dependencies

#### Core Dependencies

```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "@clerk/nextjs": "latest",
  "@prisma/client": "latest",
  "@tanstack/react-query": "^5.0.0",
  "react-hook-form": "^7.0.0",
  "zod": "^3.0.0",
  "date-fns": "^3.0.0",
  "lucide-react": "latest"
}
```

#### UI Libraries

```json
{
  "tailwindcss": "^3.4.0",
  "@radix-ui/react-*": "latest",
  "class-variance-authority": "latest",
  "clsx": "latest",
  "tailwind-merge": "latest"
}
```

#### Additional Features

```json
{
  "react-leaflet": "^4.0.0",
  "leaflet": "^1.9.0",
  "recharts": "^2.0.0",
  "uploadthing": "latest",
  "resend": "latest",
  "dexie": "^3.0.0",
  "next-pwa": "^5.6.0"
}
```

### Command Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npx prisma generate     # Generate Prisma Client
npx prisma migrate dev  # Create migration
npx prisma studio       # Open Prisma Studio (DB GUI)
npx prisma db seed      # Seed database

# Linting & Formatting
npm run lint            # Run ESLint
npm run format          # Format with Prettier

# Type checking
npx tsc --noEmit        # Check TypeScript types
```

### Don'ts (Common Mistakes to Avoid)

❌ Don't use any type without good reason
✅ Do define proper TypeScript interfaces

❌ Don't fetch data in Client Components without React Query
✅ Do use React Query for all client-side data fetching

❌ Don't use inline styles or CSS-in-JS
✅ Do use Tailwind CSS utility classes

❌ Don't make API calls directly in components
✅ Do create API client functions in /lib/api

❌ Don't store sensitive data in client-side code
✅ Do keep secrets in environment variables

❌ Don't use default exports for components
✅ Do use named exports

❌ Don't forget to handle loading and error states
✅ Do show spinners/skeletons for loading, toasts for errors

❌ Don't ignore mobile responsiveness
✅ Do add responsive Tailwind classes to all components

❌ Don't commit .env.local or sensitive files
✅ Do add them to .gitignore

❌ Don't make components longer than 250 lines
✅ Do split into smaller, focused components

### Pro Tips

💡 Use Shadcn CLI: Quickly add UI components with npx shadcn-ui@latest add [component]

💡 React Query DevTools: Enable in development for debugging queries:

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<ReactQueryDevtools initialIsOpen={false} />
```

💡 Prisma Studio: Visualize and edit database with npx prisma studio

💡 TypeScript Strict Mode: Catch bugs early with strict type checking

💡 Zod + TypeScript: Infer types from Zod schemas for single source of truth

💡 Optimistic Updates: Update UI immediately for better UX, revert on error

💡 Debounce Heavy Operations: Use useDebouncedValue or lodash.debounce

💡 Server Components by Default: Only use Client Components when necessary

💡 Parallel Routes: Use Next.js parallel routes for complex layouts

💡 Middleware: Use Next.js middleware for auth checks and redirects
