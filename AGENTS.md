# CivicTechExchange AI Agent Instructions

> This file is for AI coding agents (Claude Code, OpenAI Codex, Aider, etc.).
> GitHub Copilot users: see `.github/copilot-instructions.md`.
> Feature-specific docs: see `docs/`.

## Project Overview

**CivicTechExchange** is a platform by DemocracyLab that connects skilled volunteers with civic technology projects. It's a full-stack web application built with Django (backend) and React with Flux architecture (frontend).

### Key Technologies

**Backend:**
- Django 4.2.3 with Python 3.10
- PostgreSQL with PostGIS (geographic database)
- Django REST Framework for API endpoints
- Django-allauth for OAuth2 authentication (GitHub, Google, LinkedIn, Facebook)
- Redis for caching and background jobs (via django-rq)
- AWS S3 for file storage
- Gunicorn as WSGI server

**Frontend:**
- React 16.11
- Flux architecture for state management (using flux/utils)
- Webpack 5 for bundling
- Sass for styling
- Babel for transpilation
- Flow for type checking (see .jsx files with `// @flow` comments)

**Additional Services:**
- Salesforce integration for volunteer tracking
- Mailchimp for email campaigns
- New Relic for monitoring
- QiqoChat for event conference rooms

## Architecture

### Backend Structure

**Django Apps:**
- `civictechprojects/` - Core project/group/event models and views
- `common/` - Shared components, utilities, models (tags, visibility)
- `democracylab/` - Main Django app with settings and auth
- `oauth2/` - Custom OAuth2 providers for social login
- `salesforce/` - Salesforce API integration

**Key Models:**
- `Project` - Civic tech projects
- `Group` - Organizations/groups
- `Event` - Events and hackathons
- `VolunteerRelation` - Project volunteer relationships
- `EventProject` - Projects associated with events
- `ProjectPosition` - Open volunteer positions
- `ProjectFile` - File attachments
- `ProjectFavorite` - User favorites

**API Endpoints:**
- `/api/projects` - Project search and listing
- `/api/groups` - Group search
- `/api/events` - Event listing
- `/api/tags` - Tag categories (Issue Areas, Technologies, Roles, etc.)
- `/api/user/` - User profile management
- `/api/project/{id}/volunteers/` - Volunteer management

### Frontend Structure

**Entry Point:** `common/components/mount-components.js`
- Mounts React components to DOM elements with class `__react-root`

**Main Controllers:**
- `MainController.jsx` - Main application controller
- `CreateProjectController.jsx` - Project creation flow
- `LogInController.jsx` - Authentication

**State Management (Flux):**
- `UniversalDispatcher.js` - Central dispatcher
- Stores: `EntitySearchStore`, `FormFieldsStore`, `NavigationStore`, `FavoritesStore`, `PageOffsetStore`

**Components organized by section:**
- `componentsBySection/FindProjects/` - Project discovery and search
- `componentsBySection/FindGroups/` - Group discovery
- `componentsBySection/FindEvents/` - Event listing
- `componentsBySection/AboutProject/` - Project detail pages
- `componentsBySection/CreateProject/` - Project creation forms

**URL Routing:**
- Frontend URLs defined in `common/components/urls/urls_v2.json`
- Django serves single-page app and handles API routing

### Build Process

**Webpack Configuration:**
- `webpack.common.js` - Shared config
- `webpack.dev.js` - Development build
- `webpack.prod.js` - Production build
- Entry: `common/components/mount-components.js` + `civictechprojects/static/css/styles.scss`
- Output: `common/static/js/[name].bundle.js` and `css/[name].styles.css`

**Build Commands:**
```bash
npm run build      # Production build
npm run dev        # Development build
npm run watch      # Watch mode for development
```

## Development Workflow

### Local Development Setup

1. Set up PostgreSQL with PostGIS extension
2. Install Python dependencies: `pip install -r requirements.txt`
3. Install Node dependencies: `npm install`
4. Set environment variables (see `example.env`)
5. Run migrations: `python manage.py migrate`
6. Build frontend: `npm run dev`
7. Start Django server: `python manage.py runserver`

Node.js version required: **16.20.1**

### Code Conventions

**React/JavaScript:**
- **Component Type**: All NEW components MUST be functional components (not class components)
- **Flow Types**: Use Flow type annotations in .jsx files (`type Props = {| ... |}`)
- **Return Type**: Functions should specify `React$Node` return type
- Components use Flux Container pattern for state management
- API utilities in `common/components/utils/`
- Shared enums in `common/components/enums/`

**Django/Python:**
- Follow Django conventions for models, views, serializers
- Use `@api_view` decorator for DRF endpoints
- Caching strategy: `@cache_page` for expensive queries
- Models inherit from `Archived` base class for soft deletion

**File Organization:**
- Static files in `common/static/` and `civictechprojects/static/`
- Templates in app-specific `templates/` directories
- Migrations in app-specific `migrations/` directories

### Styling (SCSS) Conventions

**CRITICAL: All new SCSS files must follow this pattern:**

1. **File Location**: All SCSS files MUST be in `civictechprojects/static/css/partials/` with `_` prefix
   - Example: `_VARSubmitButton.scss`, `_VARFormDivider.scss`

2. **Global Import**: Each new SCSS file MUST be imported in `civictechprojects/static/css/styles.scss` WITHOUT the `_` prefix
   - Example: `@import "partials/VARSubmitButton";`
   - This loads styles globally for the entire application

3. **NO Component Imports**: DO NOT import SCSS files in component `.jsx` files
   - ❌ Wrong: `import "./VARSubmitButton.scss"` in component file
   - ✅ Correct: SCSS loaded globally via `styles.scss`

4. **Design System Colors**: ALWAYS use color variables from `civictechprojects/static/css/_vars.scss`
   - ❌ Wrong: `background: #F79E02;`
   - ✅ Correct: `background: $color-brand-70;`
   - Common variables:
     - `$color-brand-70` - Brand orange (#F79E02)
     - `$color-text-strongest` - Primary text (#191919)
     - `$color-text-strong` - Secondary text (#222629)
     - `$color-neutral-25` - Disabled background (#F2F2F2)
     - `$color-border-weakest` - Default borders (#D4D4D4)
     - `$color-border-weak` - UI borders (#BDBDBD)
     - `$color-border-strong` - Strong borders (#828282)
     - `$color-red-10`, `$color-red-20`, `$color-red-50` - Error/critical colors
     - See `_vars.scss` for complete list

5. **Responsive Design**: Use media queries for mobile breakpoints
   - Desktop: default styles
   - Mobile: `@media (max-width: 48rem) { ... }` (equivalent to 768px at default font size)

6. **Font Awesome Icons**: Use Font Awesome for icons
   - Example: `<i className="fa fa-exclamation-circle" aria-hidden="true"></i>`
   - Common icons: `fa-exclamation-circle`, `fa-check-circle`, `fa-info-circle`

## Testing

- Jest for JavaScript tests: `npm test`
- Storybook for component development: `npm run storybook`
- Django tests: `python manage.py test`

### Storybook Story Conventions

**Follow modern Storybook CSF 3.0 format:**

1. **Use Args Format** for simple stories (preferred):
   ```javascript
   export const Default = {
     args: {
       propName: value,
     },
   };
   ```

2. **Default Story**: Should render ONLY the component without wrapper divs or headings.

3. **Viewport Parameters**: Use viewport parameters instead of wrapper divs with maxWidth
   ```javascript
   export const MobileView = {
     args: { ... },
     parameters: {
       viewport: { defaultViewport: 'mobile1' },  // 375px
     },
   };
   export const DesktopView = {
     args: { ... },
     parameters: {
       viewport: { defaultViewport: 'desktop1' },  // 1024px
     },
   };
   ```
   Available viewports (defined in `.storybook/preview.js`):
   - `mobile1` - 375px, `tablet1` - 768px, `desktop1` - 1024px

4. **Separate Responsive Stories**: Create `DesktopView` and `MobileView` stories with viewport parameters — don't combine them.

5. **Interaction Tests**: Use `play` function for testing interactions.

6. **Story Organization**:
   - `Default` - Basic component with default props
   - `[VariantName]` - Different states (e.g., `Clicked`, `Disabled`, `Error`)
   - `DesktopView` / `MobileView` - Viewport-specific views
   - `InContext` - Component used within a form or larger UI

## Deployment

- Platform: Heroku
- Uses Docker (see `Dockerfile`)
- Static files: Django's `collectstatic` command
- Database: Heroku Postgres with PostGIS
- File storage: AWS S3
- Release tasks: `release-tasks.sh`

## Feature Docs

See `docs/` for feature-specific specifications and history:
- `docs/RESPONSIVE-COMPONENTS.md` - Guidelines for building reusable responsive React components
- `docs/VAR-COMPONENTS-SPEC.md` - Volunteer Activity Reporting component specs
- `docs/VAR-PHASE1-CHAT-LOG.md` - VAR Phase 1 implementation history
