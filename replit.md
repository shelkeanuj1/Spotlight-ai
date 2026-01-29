# SpotLight AI - Smart Parking Prediction Platform

## Overview

SpotLight AI is a smart city web application that helps users find and predict street parking availability using real-time location, interactive maps, and AI-inspired prediction logic. The platform targets users across India, providing parking spot recommendations, EV charging station locations, and intelligent parking insights based on distance, time of day, and traffic patterns.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, bundled using Vite
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS with custom design system using CSS variables for theming (light/dark mode support)
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Maps**: Leaflet with react-leaflet for OpenStreetMap integration
- **Animations**: Framer Motion for smooth UI transitions
- **Location**: Browser Geolocation API with fallback to Mumbai coordinates

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript compiled with tsx
- **API Pattern**: RESTful endpoints defined in shared routes configuration
- **Development**: Vite dev server with HMR proxied through Express

### Data Storage
- **Database**: PostgreSQL using Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Tables**: 
  - `cities` - City configuration with coordinates
  - `parkingSpots` - Parking locations with type and pricing
  - `evStations` - EV charging station data
  - `searches` - User search history
  - `reports` - User feedback and spot reports
- **Migrations**: Managed via Drizzle Kit with `db:push` command

### Shared Code
- **Location**: `shared/` directory contains code used by both client and server
- **Schema**: Drizzle table definitions with Zod validation via drizzle-zod
- **Routes**: API route definitions with path and Zod schemas for type safety
- **Path Aliases**: `@shared/*` maps to shared directory in both client and server

### Build System
- **Development**: `npm run dev` runs tsx with Vite middleware
- **Production**: Custom build script using esbuild for server and Vite for client
- **Output**: Server bundles to `dist/index.cjs`, client to `dist/public/`

## External Dependencies

### Database
- **PostgreSQL**: Required via `DATABASE_URL` environment variable
- **Connection**: Uses pg Pool with Drizzle ORM wrapper

### Maps & Location
- **OpenStreetMap**: Free tile server for map display via Leaflet
- **Browser Geolocation API**: For real-time user location

### UI Framework Dependencies
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Recharts**: Data visualization for analytics

### Session Management
- **connect-pg-simple**: PostgreSQL session store (available but session system not fully implemented)

### External Navigation
- **Google Maps**: Used for turn-by-turn navigation via URL scheme (no API key required)