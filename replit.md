# Overview

This is a fatigue calculation web application built with a React frontend and Express backend. The application allows workers to assess their fatigue levels by inputting sleep data and work schedules, providing safety recommendations based on industry standards. It's designed for workplace safety management, calculating fatigue scores and providing actionable guidelines to prevent fatigue-related incidents.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod schema validation
- **Routing**: Wouter for lightweight client-side routing

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with a single fatigue calculation endpoint
- **Data Validation**: Zod schemas for input validation
- **Storage**: In-memory storage implementation with interface for future database integration
- **Error Handling**: Centralized error handling middleware

## Database and Storage
- **Current**: In-memory storage using Map data structures
- **Configured For**: PostgreSQL with Drizzle ORM ready for production deployment
- **Migration Support**: Drizzle Kit configured for database schema management

## Development Environment
- **Build System**: Vite for frontend, esbuild for backend bundling
- **Type Safety**: Full TypeScript implementation across frontend, backend, and shared schemas
- **Development Server**: Hot module replacement with Vite dev server
- **Code Organization**: Monorepo structure with shared types and utilities

## Key Design Decisions

### Fatigue Calculation Algorithm
The application implements a multi-factor fatigue scoring system that considers:
- Sleep in last 24 hours (0-4 point penalty based on hours)
- Total sleep in 48 hours (1-3 point penalty for sleep deficit)
- Time awake before work shift (escalating penalties for extended wakefulness)
- Results categorized into Low (1-3), Moderate (4-6), High (7-8), and Extreme (9-10) levels

### Component Architecture
- Modular component design with separation of concerns
- Form component handles input collection with real-time validation
- Results component displays calculated scores with visual indicators
- Action guidelines component provides safety recommendations
- Auto-calculation triggers when all required fields are completed

### Validation Strategy
- Client-side validation using Zod schemas for immediate feedback
- Server-side validation using the same schemas for security
- Type-safe data flow between frontend and backend using shared schema definitions

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form for frontend functionality
- **Express.js**: Backend server framework with middleware support
- **TypeScript**: Full type safety across the application stack

## UI and Styling
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe CSS class management

## Data and Validation
- **Zod**: Schema validation for both client and server
- **TanStack Query**: Server state management and caching
- **Drizzle ORM**: Database ORM with PostgreSQL support

## Database Integration
- **Neon Database**: Serverless PostgreSQL database provider
- **Connect PG Simple**: PostgreSQL session store for Express
- **Drizzle Kit**: Database migration and schema management tools

## Development Tools
- **Vite**: Frontend build tool and development server
- **esbuild**: Fast JavaScript/TypeScript bundler for backend
- **PostCSS**: CSS processing with Tailwind integration
- **Replit Plugins**: Development environment integration for Replit platform