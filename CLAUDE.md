# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Product Scorecard is a data-driven SaaS application for e-commerce entrepreneurs to analyze, validate, and score products for market viability. It features an **intelligent 8-step wizard** with **contextual AI coaching** powered by Google Gemini API.

### 🚀 Recent Major Updates (2024)
- **NEW: Multi-step Wizard UI** - Replaced single-page form with guided 8-step process
- **NEW: Contextual AI Coaching** - Dynamic prompts that adapt to user's specific product data
- **NEW: Enhanced UX** - Progress indicators, step validation, modern interface
- **REMOVED: TemplateSelector** - Simplified workflow, removed complex template system

## Development Commands

### Database Setup
```bash
# PostgreSQL with Docker (recommended)
docker-compose up -d

# Database operations
npm run db:generate     # Generate Prisma client
npm run db:push         # Sync schema to database
npm run db:migrate      # Create migrations
npm run db:seed         # Populate with templates
npm run db:studio       # Open Prisma Studio interface

# Migration from localStorage (if needed)
npm run db:migrate-localStorage
```

### Development
```bash
npm run dev            # Start development server
npm run build          # Production build
npm run lint           # ESLint checks
```

## Architecture

### Core Data Flow
1. **Wizard Navigation**: Multi-step UI with `currentSection` state management
2. **Form State Management**: Zustand store (`productFormStore`) with localStorage persistence
3. **Step Validation**: Each step validates required fields before allowing progression
4. **Contextual AI Integration**: Dynamic prompts that use previous step data for personalized guidance
5. **Progressive Enhancement**: UI adapts and provides feedback based on completed fields
6. **Database Layer**: PostgreSQL with Prisma ORM for data persistence

### Key Components Structure

**Wizard Architecture**:
- `ProductWizard.tsx` - Main wizard controller with navigation, progress tracking, and validation
- `Step1_EssentialInfo.tsx` through `Step8_FinancialStrategic.tsx` - Individual wizard steps
- `AIAssistancePanel.tsx` - Modern modal interface for AI assistance
- **REMOVED:** `TemplateSelector.tsx` - Simplified workflow without templates

**AI Integration (Enhanced)**:
- `/api/ai/assistance` - Endpoint with **contextual prompt generation system**
- **Dynamic Prompts**: `generateContextualGuidancePrompt()` creates personalized instructions
- **Fallback System**: Graceful degradation when Gemini API is overloaded
- **Context Injection**: Uses `productName`, `category`, and `description` from previous steps
- Gemini model: `gemini-1.5-flash` for optimal performance

**Database Schema** (Updated Schema):
- `ProductAnalysis` - Core product data across 8 analysis sections (40+ fields)
  - **Updated Fields**: `simplicity` (was `explanationSimplicity`), `competitionLevel`, `socialProofStrength`, etc.
  - **New Fields**: `minimumStock`, `deliveryTime`, `storageCostPerUnit`, `initialInvestment`, `marketingBudget`
- `AnalysisReport` - AI-generated reports with SWOT, persona, marketing strategy
- `ProductTemplate` - Category-specific pre-filled form data (**NOTE**: Currently unused)
- NextAuth integration ready for user management

### State Management Pattern
- **Wizard State**: `currentSection` tracks which step user is on (1-8)
- **Form Data**: Zustand store persists all form data to localStorage for draft recovery
- **Step Navigation**: `setCurrentSection()` with validation checks before step progression
- **Real-time Validation**: Each step validates required fields and shows progress indicators
- **Progressive Enhancement**: UI adapts based on completed fields and shows contextual hints
- Successful submission redirects to dashboard with real-time data

### API Routes Structure
- `/api/analyses` - CRUD operations for product analyses
- `/api/analyses/[id]/generate-report` - AI report generation with scoring algorithm
- `/api/ai/assistance` - **Enhanced contextual AI assistance** (major upgrade)
- `/api/templates` - Product template management (**NOTE**: Currently unused)

## Key Development Patterns

### Enhanced AI Assistance Integration
Each form field can trigger contextual AI help via the new modal system:
```tsx
// OLD Pattern (deprecated)
<AIAssistanceButton
  section="essential"
  field="productName"
  productName={formData.productName}
  category={formData.category}
/>

// NEW Pattern (current)
<AIAssistancePanel
  section="essential"
  field="productName"
  context={{
    productName: formData.productName,
    category: formData.category,
    description: formData.productDescription
  }}
  onClose={() => setActiveAssistance(null)}
/>
```

### Contextual AI Prompt System
The AI now generates **dynamic, personalized prompts** instead of generic advice:
```tsx
// Example: Instead of "Use Google Trends"
// AI now says: "Go to trends.google.com, search exactly 'Correcteur de posture intelligent', 
// set to Canada, 12 months, note if >40 = good sign..."
```

### Wizard Step Development
Each step follows consistent patterns:
- **Step Component**: `Step{N}_{SectionName}.tsx` in `/wizard-steps/`
- **State Management**: Zustand store integration with `updateFormData()`
- **AI Assistance**: Modern modal system with `AIAssistancePanel`
- **Progress Tracking**: Step-level progress indicators and validation
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Required Field Validation**: Each step validates before allowing progression

### Database Operations
- Always use Prisma client for database operations
- Include user relations for multi-tenancy readiness
- Handle JSON fields for flexible data (competitor prices, SWOT analysis)
- Maintain cascade deletes for data integrity

## Environment Configuration

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `GEMINI_API_KEY` - Google Gemini API key
- `NEXTAUTH_SECRET` - Authentication secret
- `NEXTAUTH_URL` - Application URL

## Scoring Algorithm

The final product score (0-100) weighs:
- Pricing & Margins: 20 points
- Market Trend: 15 points  
- Search Volume: 10 points
- Qualitative Criteria: 25 points (5 points each for wow factor, simplicity, ease of use, before/after potential, plus 5 points each for problem-solving and innovation)
- Competition Level: 15 points (inverse relationship)
- Social Proof: 10 points
- Market Growth: 5 points

## Database Management

### PostgreSQL with Docker
The application uses PostgreSQL in Docker with PgAdmin interface. Connection details:
- Database: `product_scorecard`
- User: `postgres` 
- Password: `password123`
- PgAdmin: http://localhost:8080 (admin@productscorecard.com / admin123)

### Data Migration
When migrating from localStorage to PostgreSQL, use the migration script to preserve existing analysis data.

## Common Issues & Solutions

### Gemini API Issues
- **Model**: Use `gemini-1.5-flash` (not `gemini-pro` which is deprecated)
- **Rate Limiting**: API has fallback system for overload errors (503)
- **Error Handling**: Graceful degradation provides basic help when API fails

### Database Schema Sync
- **After schema changes**: Always run `db:push` before `db:seed`
- **Field Renames**: Recent schema update renamed several fields (see Database Schema section)
- **Migration Required**: Current schema needs sync with recent field changes

### Wizard State Management
- **Step Navigation**: Use `setCurrentSection()` not direct state manipulation
- **Form Persistence**: Zustand store persists form data automatically to localStorage
- **Reset Function**: Use `resetForm()` method to clear state and return to step 1
- **Progress Tracking**: Each step validates required fields before allowing progression

### Development Workflow
```bash
# After making wizard changes
npm run dev            # Test wizard functionality
npm run build          # Check for TypeScript errors
npm run db:push        # Sync schema if DB changes made
```

### Missing Dependencies
- **Progress Component**: Now uses custom implementation (no Radix UI dependency)
- **UI Components**: All required components are in `/components/ui/`

## Wizard Features & UX Improvements

### Navigation System
- **Visual Progress**: Top progress bar shows completion percentage
- **Step Indicators**: Numbered circles show current, completed, and pending steps
- **Smart Validation**: "Next" button disabled until required fields completed
- **Breadcrumb Navigation**: Click on completed steps to navigate back

### Enhanced User Experience
- **Real-time Feedback**: Progress indicators update as user completes fields
- **Contextual Help**: AI assistance adapts to user's specific product details
- **Error Prevention**: Validation prevents incomplete submissions
- **Mobile Responsive**: Optimized for all screen sizes
- **Persistent State**: Form data saved automatically during navigation

### AI Coaching System
- **Personalized Instructions**: AI uses product name, category, and description for specific guidance
- **Action-Oriented**: Provides step-by-step instructions instead of generic advice
- **Context-Aware**: Later steps reference data from earlier steps
- **Fallback Support**: Provides basic help when AI service is unavailable

### Form Field Enhancements
- **Progress Tracking**: Each step shows completion status
- **Interactive Elements**: Hover states, focus indicators, smooth transitions
- **Smart Defaults**: Logical field grouping and tab order
- **Accessibility**: Proper labels, keyboard navigation, screen reader support