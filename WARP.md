# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common Development Commands

### Development Workflow
```powershell
# Start development server with Turbopack
npm run dev

# Build production version
npm run build

# Start production server
npm start

# Lint the codebase
npm run lint

# Run slug backfill script (updates categories, subcategories, and stores)
npm run backfill:slugs
```

### Database Operations
```powershell
# Generate Prisma client after schema changes
npx prisma generate

# Push schema changes to database (development)
npx prisma db push

# Create and apply migrations
npx prisma migrate dev

# Run Prisma Studio (database GUI)
npx prisma studio

# Reset database (destructive)
npx prisma migrate reset
```

### Testing Single Components
```powershell
# Run specific test file
npm test -- --testPathPattern=component-name

# Test with watch mode for development
npm test -- --watch
```

## High-Level Architecture

### Technology Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Authentication**: Clerk (handles user management, role-based access)
- **Database**: MySQL with Prisma ORM (relationMode: "prisma")
- **Search**: Elasticsearch integration
- **UI**: Tailwind CSS + shadcn/ui components + Radix UI primitives
- **Images**: Cloudinary for image management
- **Payments**: Stripe and PayPal integration
- **Build Tool**: Turbopack for faster builds

### Core Architecture Pattern
This is a **multivendor e-commerce platform** following a server-action-based architecture:

1. **Server Actions Pattern**: Database queries are organized in `/src/queries/` as server actions
2. **Component Organization**: UI components split into `/src/components/{ui|shared|dashboard}`
3. **Form Validation**: Zod schemas in `/src/lib/schemas.ts` with Italian localization
4. **Type Safety**: Comprehensive TypeScript with generated Prisma types

### Database Schema Overview
The application centers around these key entities:

- **Users**: Role-based (USER, ADMIN, SELLER) with Clerk integration
- **Stores**: Multivendor stores with shipping configurations and status management
- **Products**: Complex product system with variants, sizes, colors, and specifications
- **Orders**: Multi-group orders supporting different stores with individual statuses
- **Categories**: Two-level category system (Categories → SubCategories)
- **Reviews & Ratings**: Product review system with image support
- **Cart & Wishlist**: Persistent shopping cart and wishlist functionality
- **Shipping**: Country-based shipping rates with free shipping rules

### Key Business Logic Areas

#### Multi-Store Architecture
- Each store has independent shipping settings, policies, and product management
- Stores require approval (PENDING → ACTIVE status)
- Orders are grouped by store for separate processing

#### Product Variants System
- Products have multiple variants (colors, sizes, specifications)
- Each variant has independent pricing, inventory, and images
- Complex shipping fee calculation based on method (ITEM, WEIGHT, FIXED)

#### Role-Based Access Control
- **USER**: Basic shopping functionality
- **SELLER**: Store management, product creation
- **ADMIN**: Platform administration, store approval

### Critical Development Notes

#### Slug Management
- Categories, subcategories, stores, and products use slugs for SEO
- Run `npm run backfill:slugs` after bulk data imports to ensure slug consistency
- Slug generation handles Italian characters and ensures uniqueness

#### Authentication Middleware
- Protected routes: `/dashboard` and all sub-routes
- Clerk handles authentication state
- Role checking happens in server actions via `user.privateMetadata.role`

#### Database Relationships
- Uses Prisma's `relationMode: "prisma"` for MySQL compatibility
- Many complex many-to-many relationships (products-variants-sizes, users-stores-orders)
- Careful cascade delete handling for data integrity

#### Image Handling
- Cloudinary integration for all image uploads
- Remote patterns configured for `res.cloudinary.com` and `placehold.co`
- Form schemas expect image arrays with URL structure

### Development Workflow Patterns

#### Creating New Features
1. Define Zod schema in `/src/lib/schemas.ts` if forms are involved
2. Create server actions in appropriate `/src/queries/` file
3. Build UI components in `/src/components/`
4. Implement pages in `/src/app/`
5. Test role-based access controls

#### Database Changes
1. Modify `/prisma/schema.prisma`
2. Run `npx prisma db push` for development or `npx prisma migrate dev` for production
3. Regenerate client with `npx prisma generate`
4. Update TypeScript types in `/src/lib/types.ts` if needed

#### Component Development
- Follow shadcn/ui patterns for consistency
- Use Tailwind CSS classes with CSS variables for theming
- Implement proper loading and error states
- Ensure mobile responsiveness with the `use-mobile` hook

### Environment Dependencies
- Requires MySQL database connection
- Elasticsearch cloud credentials for search functionality
- Cloudinary API keys for image management
- Clerk authentication keys
- Stripe/PayPal API keys for payments

### Italian Localization
- Form validation messages are in Italian
- Error messages and user-facing text use Italian
- Consider this when adding new validation schemas or user feedback
