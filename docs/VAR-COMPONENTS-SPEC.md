# Volunteer Activity Reporting (VAR) Components Specification

## Overview
This document specifies all components needed for the Volunteer Activity Reporting feature. Each component includes props, file locations, storybook tests, and implementation questions.

**Component Pattern:** All new VAR components are implemented as functional components (not class components). This follows modern React best practices and simplifies the codebase.

**Data Collection Pattern:** All form components use standard HTML input elements with `name` attributes. Form data is collected by `MyActivityController` on submission using native form serialization, following the existing pattern used in `CreateProjectController` and other form controllers in this project. No `onUpdate` callbacks are used.

---

## Phase 1: Simple Components (No Dependencies)

### 1. VARFormDivider ([#1121](https://github.com/DemocracyLab/CivicTechExchange/issues/1121))
**Purpose:** Visual separator between form sections

**Figma:** [VAR Form Divider](https://www.figma.com/design/WADcmVjJh5ARVoZ09xlpfdFN/DemocracyLab?node-id=39337-89449&t=2mfsTMQ1bhMOILO0-4)

![VAR Form Divider](https://private-user-images.githubusercontent.com/74802797/436764900-6bf28bf4-950f-4b55-8d54-29f3d842879e.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjE3Nzc4MDQsIm5iZiI6MTc2MTc3NzUwNCwicGF0aCI6Ii83NDgwMjc5Ny80MzY3NjQ5MDAtNmJmMjhiZjQtOTUwZi00YjU1LThkNTQtMjlmM2Q4NDI4NzllLnBuZyIsInJlcG8iOiIxMjMxMDUyMTAiLCJleHAiOjE3NjE3Nzc4MDR9)

**Files:**
- Component: `common/components/componentsBySection/VolunteerActivityReporting/VARFormDivider.jsx`
- Story: `common/components/componentsBySection/VolunteerActivityReporting/stories/VARFormDivider.stories.jsx`
- Styles: `civictechprojects/static/css/partials/_VARFormDivider.scss` (auto-loaded)

**Props:**
```typescript
// No props - purely presentational
<VARFormDivider />
```

**Storybook Tests:**
- Default state: Renders visible divider
- Responsive design: Confirm divider resizes correctly

**Questions:**
- ✅ None - straightforward component

---

### 2. VARErrorNotification ([#1133](https://github.com/DemocracyLab/CivicTechExchange/issues/1133))
**Purpose:** Display error messages to users when form validation fails

**Figma:** [VAR Error Notification](https://www.figma.com/design/WADcmVjJh5ARVoZ09xlpfdFN/DemocracyLab?node-id=39340-84880&t=KPcLW0nctl77aaFZ-4)

![VAR Error Notification](https://private-user-images.githubusercontent.com/74802797/465528372-1e51188b-09f4-43c2-ac5d-575a0d4240da.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjE3Nzc4MTgsIm5iZiI6MTc2MTc3NzUxOCwicGF0aCI6Ii83NDgwMjc5Ny80NjU1MjgzNzItMWU1MTE4OGItMDlmNC00M2MyLWFjNWQtNTc1YTBkNDI0MGRhLnBuZyIsInJlcG8iOiIxMjMxMDUyMTAiLCJleHAiOjE3NjE3Nzc4MTh9)

**Files:**
- Component: `common/components/componentsBySection/VolunteerActivityReporting/VARErrorNotification.jsx`
- Story: `common/components/componentsBySection/VolunteerActivityReporting/stories/VARErrorNotification.stories.jsx`
- Styles: `civictechprojects/static/css/partials/_VARErrorNotification.scss` (auto-loaded)

**Props:**
```typescript
<VARErrorNotification
  showError={boolean}  // If true, renders warning icon + message
/>
```

**Storybook Tests:**
- Default state (`showError={true}`): Renders warning emoticon and hardcoded message
- Hidden state (`showError={false}`): Renders nothing

**Questions:**
1. ✅ Should the error message be hardcoded or customizable via props? **Answer: Hardcoded**
2. ❓ What's the exact error message text? From Figma: "Please fill in all required fields"

**Updated Props:**
```typescript
<VARErrorNotification
  showError={boolean}
  // Message is hardcoded: "Please fill in all required fields"
/>
```

---

### 3. VARSubmitButton ([#1134](https://github.com/DemocracyLab/CivicTechExchange/issues/1134))
**Purpose:** Form submission button with visual state feedback

**Figma:** [VAR Submit Button](https://www.figma.com/design/WADcmVjJh5ARVoZ09xlpfdFN/DemocracyLab?node-id=39340-85026&t=KPcLW0nctl77aaFZ-4)

![VAR Submit Button](https://private-user-images.githubusercontent.com/74802797/465530371-4f5bcb17-24c6-41e3-b9c8-d7c242ade2c6.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjE3Nzc4MjAsIm5iZiI6MTc2MTc3NzUyMCwicGF0aCI6Ii83NDgwMjc5Ny80NjU1MzAzNzEtNGY1YmNiMTctMjRjNi00MWUzLWI5YzgtZDdjMjQyYWRlMmM2LnBuZyIsInJlcG8iOiIxMjMxMDUyMTAiLCJleHAiOjE3NjE3Nzc4MjB9)

**Files:**
- Component: `common/components/componentsBySection/VolunteerActivityReporting/VARSubmitButton.jsx`
- Story: `common/components/componentsBySection/VolunteerActivityReporting/stories/VARSubmitButton.stories.jsx`
- Styles: `civictechprojects/static/css/partials/_VARSubmitButton.scss` (auto-loaded)

**Props:**
```typescript
<VARSubmitButton
  isClicked={boolean}   // true = gray/bold, false = orange/regular
  onClick={function}    // Callback when button clicked
/>
```

**Storybook Tests:**
- Default state (`isClicked={false}`): Orange button, regular text
- Clicked state (`isClicked={true}`): Gray button, bold text
- onClick interaction: Verify callback fires

**Questions:**
1. ✅ Should `isClicked` be `isSubmitted` or `disabled` for clarity? **Answer: Use `isSubmitted`**
2. ✅ Should the button be disabled when `isClicked={true}` to prevent double-submission? **Answer: Yes**

**Updated Props:**
```typescript
<VARSubmitButton
  isSubmitted={boolean}   // Controls visual state and disabled state
  onClick={function}      // Callback when button clicked
  disabled={boolean}      // Auto-set to true when isSubmitted=true
/>
```

---

## Phase 2: Form Input Components

### 4. VolunteerActivityReportingCardIntro ([#1118](https://github.com/DemocracyLab/CivicTechExchange/issues/1118))
**Purpose:** Project card header with toggle to log activity

**Figma:** [Var Card Intro](https://www.figma.com/design/WADcmVjJh5ARVoZ09xlpfdFN/DemocracyLab?node-id=39337-90134&t=deWirqbNmFVIPX40-4)

![VAR Card Intro](https://private-user-images.githubusercontent.com/65760886/434960601-beacff5d-8150-4808-b7a4-41361d8c9806.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjE3Nzc4MDMsIm5iZiI6MTc2MTc3NzUwMywicGF0aCI6Ii82NTc2MDg4Ni80MzQ5NjA2MDEtYmVhY2ZmNWQtODE1MC00ODA4LWI3YTQtNDEzNjFkOGM5ODA2LnBuZyIsInJlcG8iOiIxMjMxMDUyMTAiLCJleHAiOjE3NjE3Nzc4MDN9)

**Files:**
- Component: `common/components/componentsBySection/VolunteerActivityReporting/VolunteerActivityReportingCardIntro.jsx`
- Story: `common/components/componentsBySection/VolunteerActivityReporting/stories/VolunteerActivityReportingCardIntro.stories.jsx`
- Styles: `civictechprojects/static/css/partials/_VolunteerActivityReportingCardIntro.scss` (auto-loaded)

**Props:**
```typescript
<VolunteerActivityReportingCardIntro
  className={string}       // Optional CSS class
  projectName={string}     // Display name of project
  projectId={string}       // Project ID for form input name
  defaultChecked={boolean} // Initial toggle state
/>
```

**Form Integration:**
Renders a checkbox input with `name="project_{projectId}_log_activity"` that will be gathered on form submission.

**Storybook Tests:**
- Default state: Display project name and toggle
- Checked state: Toggle is checked by default
- Unchecked state: Toggle is unchecked, shows "No activity to log" message
- Interaction: Toggle changes state correctly

**Questions:**
- ✅ None - follows standard form input pattern

---

### 5. VARSelectWeek ([#1122](https://github.com/DemocracyLab/CivicTechExchange/issues/1122))
**Purpose:** Week selection dropdown for logging activities

**Figma:** [Var Week Select](https://www.figma.com/design/WADcmVjJh5ARVoZ09xlpfdFN/DemocracyLab?node-id=38877-82877&t=deWirqbNmFVIPX40-4)

![VAR Select Week](https://private-user-images.githubusercontent.com/65760886/435054764-4ffb7d5f-7f4c-4e0b-b08f-ad5a6f64ca52.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjE3Nzc4MDMsIm5iZiI6MTc2MTc3NzUwMywicGF0aCI6Ii82NTc2MDg4Ni80MzUwNTQ3NjQtNGZmYjdkNWYtN2Y0Yy00ZTBiLWIwOGYtYWQ1YTZmNjRjYTUyLnBuZyIsInJlcG8iOiIxMjMxMDUyMTAiLCJleHAiOjE3NjE3Nzc4MDN9)

**Files:**
- Component: `common/components/componentsBySection/VolunteerActivityReporting/VARSelectWeek.jsx`
- Story: `common/components/componentsBySection/VolunteerActivityReporting/stories/VARSelectWeek.stories.jsx`
- Styles: `civictechprojects/static/css/partials/_VARSelectWeek.scss` (auto-loaded)

**Props:**
```typescript
<VARSelectWeek
  name="week_start"       // Form input name
  defaultValue={string}   // ISO date format: "2025-08-12" (optional)
  errorMessage={string}   // Optional error message
  weeksBack={12}          // How many past weeks to show (default: 12)
  allowFuture={false}     // Can select future weeks? (default: false)
/>
```

**Form Integration:**
Renders a `<select>` element with options containing ISO date values. Component internally generates week options using date-fns. The selected value (ISO date string) will be gathered on form submission.

**Storybook Tests:**
- Default state: Heading, dropdown with default caption, instructions
- Week options: All valid week ranges in dropdown (last 12 weeks)
- Selected week: Dropdown shows pre-selected week from defaultValue
- Error state: Red border + error message
- Responsive design: Mobile/desktop resizes correctly

**Questions:**
1. ✅ Good - the team discussed using date-fns and ISO format
2. ✅ Default to 12 weeks back (configurable via prop)
3. ✅ Default to past/current only (configurable via prop)
4. ✅ Component generates week list internally

---

### 6. VARQ1 ([#1123](https://github.com/DemocracyLab/CivicTechExchange/issues/1123))
**Purpose:** Numeric input for hours worked (rounded to nearest quarter-hour)
**Status:** ✅ Already implemented and merged in [PR #1130](https://github.com/DemocracyLab/CivicTechExchange/pull/1130)

**Figma:** [VAR-Q1](https://www.figma.com/design/WADcmVjJh5ARVoZ09xlpfdFN/DemocracyLab?node-id=39337-90204&t=Yq82JBM9z3MkBKyF-4)

![VARQ1](https://private-user-images.githubusercontent.com/65760886/437099755-b9062b2a-a9e7-4f91-81fc-049a68f44551.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjE4NTg0NjcsIm5iZiI6MTc2MTg1ODE2NywicGF0aCI6Ii82NTc2MDg4Ni80MzcwOTk3NTUtYjkwNjJiMmEtYTllNy00ZjkxLTgxZmMtMD)

**Files:**
- Component: `common/components/componentsBySection/VolunteerActivityReporting/VARQ1.jsx`
- Story: `common/components/componentsBySection/VolunteerActivityReporting/stories/VARQ1.stories.jsx`
- Styles: `civictechprojects/static/css/partials/_VARQ1.scss` (auto-loaded)

**Props:**
```typescript
<VARQ1
  name="hours_spent"       // Form input name
  className={string}       // Optional CSS class
  defaultValue={number}    // Initial value (e.g., 4.25 for 4h 15m)
  error={boolean}          // Show error state and message
/>
```

**Form Integration:**
Renders an `<input type="number">` element that accepts decimal values representing hours (e.g., 4.25 = 4 hours 15 minutes). Only non-negative numbers allowed. Value gathered on form submission.

**Error Message:**
"Please enter your hours as a numeral. If no activity, toggle the log activity switch above to OFF."

**Storybook Tests:**
- Default State: Placeholder value 0.0
- User Input: Values like 3.5, 1.75, 4.25, 2.0
- Validation Error: Empty or non-numeric triggers error state

**Questions:**
- ✅ Component already implemented - verify it follows form data collection pattern

---

### 7. VARQ2 ([#1124](https://github.com/DemocracyLab/CivicTechExchange/issues/1124))
**Purpose:** Single-line text input for activity summary with 150 char limit

**Figma:** [VARQ2](https://www.figma.com/design/WADcmVjJh5ARVoZ09xlpfdFN/DemocracyLab?node-id=38877-82885&t=deWirqbNmFVIPX40-4)

![VARQ2](https://private-user-images.githubusercontent.com/65760886/435093887-04e5e4ca-7a45-4395-bf8c-99f13ab3f7bf.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjE3Nzc4MDMsIm5iZiI6MTc2MTc3NzUwMywicGF0aCI6Ii82NTc2MDg4Ni80MzUwOTM4ODctMDRlNWU0Y2EtN2E0NS00Mzk1LWJmOGMtOTlmMTNhYjNmN2JmLnBuZyIsInJlcG8iOiIxMjMxMDUyMTAiLCJleHAiOjE3NjE3Nzc4MDN9)

**Files:**
- Component: `common/components/componentsBySection/VolunteerActivityReporting/VolunteerActivityReportingQ2.jsx`
- Story: `common/components/componentsBySection/VolunteerActivityReporting/stories/VolunteerActivityReportingQ2.stories.jsx`
- Styles: `civictechprojects/static/css/partials/_VolunteerActivityReportingQ2.scss` (auto-loaded)

**Props:**
```typescript
<VARQ2
  name="activity_summary"  // Form input name
  className={string}       // Optional CSS class
  defaultValue={string}    // Initial value (optional)
  maxLength={150}          // Character limit (default: 150)
  required={boolean}       // Is field required? (default: false)
/>
```

**Form Integration:**
Renders an `<input type="text">` element with character counter. Component manages the counter display and enforces maxLength. Value will be gathered on form submission.

**Storybook Tests:**
- Idle state: Empty input with placeholder "Enter text...", counter shows "0/150"
- Filled state: Input with text, counter updates in real-time
- Max length reached: Text at 150 chars, counter shows "150/150", no further input allowed
- Pre-filled state: defaultValue populates input, counter reflects character count

**Questions:**
- ✅ Component manages character limit internally with maxLength prop
- ✅ Shows live character counter (e.g., "42/150")
- ✅ Hard blocks at maxLength (native HTML maxLength attribute)

---

## Phase 3: Complex Components

### 8. VolunteerActivityReportingAddLinkModal ([#1125](https://github.com/DemocracyLab/CivicTechExchange/issues/1125))
**Purpose:** Modal dialog for adding project links with validation

**Figma:** [VAR Add Link Modal](https://www.figma.com/design/WADcmVjJh5ARVoZ09xlpfdFN/DemocracyLab?node-id=38877-82888&t=deWirqbNmFVIPX40-4)

![VAR Add Link Modal](https://private-user-images.githubusercontent.com/65760886/435113598-57cb00ce-3267-427e-8d03-46dcf8f6c6dc.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjE3Nzc4MDMsIm5iZiI6MTc2MTc3NzUwMywicGF0aCI6Ii82NTc2MDg4Ni80MzUxMTM1OTgtNTdjYjAwY2UtMzI2Ny00MjdlLThkMDMtNDZkY2Y4ZjZjNmRjLnBuZyIsInJlcG8iOiIxMjMxMDUyMTAiLCJleHAiOjE3NjE3Nzc4MDN9)

**Files:**
- Component: `common/components/componentsBySection/VolunteerActivityReporting/VolunteerActivityReportingAddLinkModal.jsx`
- Story: `common/components/componentsBySection/VolunteerActivityReporting/stories/VolunteerActivityReportingAddLinkModal.stories.jsx`
- Styles: `civictechprojects/static/css/partials/_VolunteerActivityReportingAddLinkModal.scss` (auto-loaded)

**Props:**
```typescript
interface LinkData {
  url: string;
  title: string;      // Optional
  category: string;   // Required - one of predefined categories
}

<VolunteerActivityReportingAddLinkModal
  isOpen={boolean}
  onClose={() => {}}
  onSubmit={(data: LinkData) => {}}
/>
```

**Category Options:**
- Code / Code Repository
- Communication
- Design Files
- Files (docs, sheets, etc.)
- Project Management
- Website (live, staging, etc.)
- Other

**Storybook Tests:**
- Default modal state: All fields empty, modal visible
- Filled state: Valid URL, title, category filled
- Validation error: URL or category empty, error shown, Save disabled
- Dropdown interaction: Category selection updates correctly
- Close modal: Cancel triggers `onClose`
- Save modal: Save with valid input triggers `onSubmit`

**Questions:**
1. ✅ Should URL validation be done in the component or parent? **Answer: In the component**
2. ✅ What URL validation rules? (just format or also check if reachable?) **Answer: Just format validation**
3. ✅ Should we use the existing modal component from the codebase? **Answer: Yes, use React Bootstrap Modal**

**Updated Implementation:**
The component should:
- Use `react-bootstrap/Modal` (already used in codebase - see `AlertSignupModal.jsx`)
- Validate URL format internally (e.g., starts with http:// or https://)
- Disable Save button if URL is invalid or category not selected
- Follow pattern from `common/components/componentsBySection/FindProjects/AlertSignupModal.jsx`

---

### 9. VolunteerActivityReportingQ3 ([#1126](https://github.com/DemocracyLab/CivicTechExchange/issues/1126))
**Purpose:** Link manager displaying added links with add/remove functionality

**Figma:** [VARQ3](https://www.figma.com/design/WADcmVjJh5ARVoZ09xlpfdFN/DemocracyLab?node-id=38877-82887&t=deWirqbNmFVIPX40-4)

![VARQ3](https://private-user-images.githubusercontent.com/65760886/435116638-d23b84dd-7e2a-4db4-bdae-f7c6ee4c0bc3.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjE3Nzc4MDMsIm5iZiI6MTc2MTc3NzUwMywicGF0aCI6Ii82NTc2MDg4Ni80MzUxMTY2MzgtZDIzYjg0ZGQtN2UyYS00ZGI0LWJkYWUtZjdjNmVlNGMwYmMzLnBuZyIsInJlcG8iOiIxMjMxMDUyMTAiLCJleHAiOjE3NjE3Nzc4MDN9)

**Files:**
- Component: `common/components/componentsBySection/VolunteerActivityReporting/VolunteerActivityReportingQ3.jsx`
- Story: `common/components/componentsBySection/VolunteerActivityReporting/stories/VolunteerActivityReportingQ3.stories.jsx`
- Styles: `civictechprojects/static/css/partials/_VolunteerActivityReportingQ3.scss` (auto-loaded)

**Props:**
```typescript
interface ProjectDocument {
  name: string;
  category: string;
  url: string;
}

<VolunteerActivityReportingQ3 
  name="project_links"          // Base name for form inputs
  defaultValue={ProjectDocument[]} // Initial links (optional)
  maxLinks={10}                 // Optional limit (default: unlimited)
/>
```

**Form Integration:**
Renders hidden inputs for each link with indexed names: `project_links[0][url]`, `project_links[0][name]`, `project_links[0][category]`, etc. Component manages internal state for add/remove operations. Final array of links will be gathered on form submission. Includes the AddLinkModal component internally.

**Storybook Tests:**
- Initial state: No links, "Add a New Link" button
- Add link: Modal opens, link added to list, hidden inputs created
- Remove link: Link removed from list, hidden inputs removed
- Multiple links: Display all links correctly
- Icons by category: Appropriate icon for each category
- Max links: Button disabled when maxLinks reached

**Questions:**
1. ✅ Component includes AddLinkModal internally
2. ✅ Unified mobile/desktop UI (per discussion in issue)
3. ✅ How are icons determined from category? **Answer: Handled by child IconLinkDisplay component**

---

### 10. VAR Profile Link Card ([#1132](https://github.com/DemocracyLab/CivicTechExchange/issues/1132))
**Purpose:** Display individual link cards (reuses existing IconLinkDisplay)

**Figma:** [VAR Link Card](https://www.figma.com/design/WADcmVjJh5ARVoZ09xlpfdFN/DemocracyLab?node-id=38985-82903&t=deWirqbNmFVIPX40-4)

![VAR Profile Link Card](https://private-user-images.githubusercontent.com/65760886/435235765-44e22dac-e0d9-4b4f-9e07-55ea30937b38.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjE3Nzc4MDMsIm5iZiI6MTc2MTc3NzUwMywicGF0aCI6Ii82NTc2MDg4Ni80MzUyMzU3NjUtNDRlMjJkYWMtZTBkOS00YjRmLTllMDctNTVlYTMwOTM3YjM4LnBuZyIsInJlcG8iOiIxMjMxMDUyMTAiLCJleHAiOjE3NjE3Nzc4MDN9)

**Files:**
- Component: `common/components/chrome/IconLinkDisplay.jsx` (existing)
- Story: Verify works in VAR context

**Props:**
```typescript
interface LinkInfo {
  linkUrl: string;
  linkName: string;
}

<IconLinkDisplay
  link={LinkInfo}
/>
```

**Storybook Tests:**
- Basic render: Card with title, category, matching icon
- External link: Opens in new tab
- Icon based on URL: Correct icon for known domains
- Text overflow: Handles overflow/wrapping

**Questions:**
1. ✅ Using existing component - good!
2. ✅ Does existing component handle all required icons/categories? **Answer: Yes**
3. ✅ Do we need to extend `IconLinkDisplay` or is it sufficient? **Answer: Sufficient as-is**

**Implementation Note:** Reuse `common/components/chrome/IconLinkDisplay.jsx` without modifications

---

## Phase 4: Container Components

### 11. VARFormFrame ([#1136](https://github.com/DemocracyLab/CivicTechExchange/issues/1136))
**Purpose:** Form wrapper that handles submission and error display

**Figma:** [VAR Form Frame](https://www.figma.com/design/WADcmVjJh5ARVoZ09xlpfdFN/DemocracyLab?node-id=38877-82894&t=deWirqbNmFVIPX40-4)

![VAR Form Frame](https://private-user-images.githubusercontent.com/65760886/435273685-48e63fe1-7baa-49b9-851a-0d39eacc5ec1.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjE3Nzc4MDMsIm5iZiI6MTc2MTc3NzUwMywicGF0aCI6Ii82NTc2MDg4Ni80MzUyNzM2ODUtNDhlNjNmZTEtN2JhYS00OWI5LTg1MWEtMGQzOWVhY2M1ZWMxLnBuZyIsInJlcG8iOiIxMjMxMDUyMTAiLCJleHAiOjE3NjE3Nzc4MDN9)

**Files:**
- Component: `common/components/componentsBySection/VolunteerActivityReporting/VARFormFrame.jsx`
- Story: `common/components/componentsBySection/VolunteerActivityReporting/stories/VARFormFrame.stories.jsx`
- Styles: `civictechprojects/static/css/partials/_VARFormFrame.scss` (auto-loaded)

**Props:**
```typescript
<VARFormFrame   
  hasError={boolean}
  hasSubmitted={boolean}
  onSubmit={(e: FormEvent) => {}}
>
  {children}  // Child form components go here
</VARFormFrame>
```

**Form Integration:**
Renders a native `<form>` element. On submit, passes the form event to parent controller which extracts data using FormData or form serialization (following CreateProjectController pattern). Automatically displays VARErrorNotification when hasError is true, and VARSubmitButton at the bottom.

**Storybook Tests:**
- Default state: Renders children in form, no error, submit button enabled
- Error state: Shows VARErrorNotification when `hasError={true}`
- Submit interaction: `onSubmit` called with form event when button clicked
- Submitted state: Submit button shows submitted styling when `hasSubmitted={true}`
- Form validation: Native HTML5 validation (required fields, etc.)

**Questions:**
- ✅ Parent (MyActivityController) handles data collection via form event
- ✅ Uses native `<form>` element with standard form serialization
- ✅ Follows CreateProjectController pattern

---

### 12. ActivityLogWrapper ([#1135](https://github.com/DemocracyLab/CivicTechExchange/issues/1135))
**Purpose:** Wrapper for activity logs with "Show more" pagination

**Files:**
- Component: `common/components/componentsBySection/VolunteerActivityReporting/ActivityLogWrapper.jsx`
- Story: `common/components/componentsBySection/VolunteerActivityReporting/stories/ActivityLogWrapper.stories.jsx`
- Styles: `civictechprojects/static/css/partials/_ActivityLogWrapper.scss` (auto-loaded)

**Props:**
```typescript
interface ActivityLog {
  // Define structure based on VARLogWeek requirements
  id: string;
  weekStart: string;
  weekEnd: string;
  // ... other fields
}

<ActivityLogWrapper 
  activities={ActivityLog[]}
  hasMore={boolean}
  onShowMore={() => {}}
>
  {children}  // Optional: if not provided, renders logs automatically
</ActivityLogWrapper>
```

**Storybook Tests:**
- Renders children properly
- Button appears only when `hasMore={true}`
- Button click triggers `onShowMore`
- Loading more entries works correctly

**Questions:**
1. ✅ Does this component render VARLogWeek internally or receive pre-rendered children? **Answer: Renders VARLogWeek internally**
2. ✅ Per issue #1137 comment: should it call VARLogWeek itself and receive logs as prop **Answer: Yes, receives logs as prop**
3. ❓ What's the structure of an activity log entry? **See VARLogWeek component spec (#1143)** Answer: yes
4. ✅ Requires VARLogWeek component - what's the issue # for that? **Answer: #1143**

**Updated Props:**
```typescript
<ActivityLogWrapper 
  activities={VolunteerActivityReport[]}  // Array of activity reports
  hasMore={boolean}
  onShowMore={() => {}}
  isLoading={boolean}  // Optional: Show loading state
/>
```

---

### 13. VARLogWeek ([#1143](https://github.com/DemocracyLab/CivicTechExchange/issues/1143))
**Purpose:** Display a single week's activity log entry with edit/delete controls

**Figma:** [VAR Log Week](https://www.figma.com/design/WADcmVjJh5ARVoZ09xlpfdFN/DemocracyLab?node-id=39352-84886&t=wTO3gCMrMhz6rfr0-4)

![VAR Log Week](https://private-user-images.githubusercontent.com/3317487/507862621-8cd3db3d-08e6-4860-816a-0f04414c08c8.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjE4NTg0NjcsIm5iZiI6MTc2MTg1ODE2NywicGF0aCI6Ii8zMzE3NDg3LzUwNzg)

**Files:**
- Component: `common/components/componentsBySection/VolunteerActivityReporting/VARLogWeek.jsx`
- Story: `common/components/componentsBySection/VolunteerActivityReporting/stories/VARLogWeek.stories.jsx`
- Styles: `civictechprojects/static/css/partials/_VARLogWeek.scss` (auto-loaded)

**Props:**
```typescript
<VARLogWeek
  report={VolunteerActivityReport}  // Activity report data from API
  isOwner={boolean}                  // Show edit/delete buttons only to owner
  onEdit={() => {}}                  // Callback when edit clicked
  onDelete={() => {}}                // Callback when delete clicked
/>
```

**Display Elements:**
- Week date range (e.g., "Oct 14 - Oct 20, 2025")
- Hours worked
- Activity description
- Links (if any)
- Edit button (owner only) - opens form with pre-populated data
- Delete button (owner only) - shows confirmation popup before deleting

**Responsive Design:**
Figma shows both mobile and desktop views - component should adapt layout accordingly.

**Storybook Tests:**
- Default view: Display all report data, no edit/delete buttons (`isOwner={false}`)
- Owner view: Show edit/delete buttons (`isOwner={true}`)
- With links: Display links using IconLinkDisplay
- No links: Don't show links section
- Edit action: Verify `onEdit` callback fires
- Delete action: Show confirmation dialog, then fire `onDelete` callback

**Questions:**
- ✅ Component receives full VolunteerActivityReport object
- ✅ Edit/delete only visible to report owner
- ❓ Should confirmation dialog be part of this component or parent? **Recommendation: Include in component** Answer: Yes

---

### 14. MyActivityController ([#1139](https://github.com/DemocracyLab/CivicTechExchange/issues/1139))
**Purpose:** Main controller for volunteer activity reporting page

**Figma:** [My Activity Page](https://www.figma.com/design/WADcmVjJh5ARVoZ09xlpfdFN/DemocracyLab?node-id=38877-82895&t=deWirqbNmFVIPX40-4)

![My Activity Controller](https://private-user-images.githubusercontent.com/65760886/435294195-e6d35c4c-1b45-4945-a7c8-2ee09e85284f.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjE3Nzc4MDMsIm5iZiI6MTc2MTc3NzUwMywicGF0aCI6Ii82NTc2MDg4Ni80MzUyOTQxOTUtZTZkMzVjNGMtMWI0NS00OTQ1LWE3YzgtMmVlMDllODUyODRmLnBuZyIsInJlcG8iOiIxMjMxMDUyMTAiLCJleHAiOjE3NjE3Nzc4MDN9)

**Files:**
- Component: `common/components/controllers/MyActivityController.jsx`
- Story: `common/components/controllers/stories/MyActivityController.stories.jsx`

**Responsibilities:**
- Fetch volunteer activity data from API
- Render VARFormFrame with all child components
- Handle form submission via native form event
- Extract form data using FormData API or form serialization
- Post data to backend API
- Manage form state and error handling

**Props:**
```typescript
<MyActivityController
  userId={string | number}
  // Other props as needed
/>
```

**Form Data Collection:**
Follows the CreateProjectController pattern:
1. `onSubmit` handler receives form event
2. Extracts data using `new FormData(event.target)` or similar
3. Transforms/validates data as needed
4. Posts to API endpoint
5. Handles success/error states

**Storybook Tests:**
- No data state: Empty form with default values
- With data state: Form pre-populated with existing activity data
- Form submission: Mock API call, verify correct data sent
- Validation errors: Show inline errors for invalid fields
- Success state: Show success message after submission

**Questions:**
1. ✅ What API endpoint fetches volunteer activity data? **Answer: GET /api/activityreport/{userId}/activity/**
2. ✅ What API endpoint submits new activity reports? **Answer: POST /api/activityreport/**
3. ✅ What's the data structure from API? **Answer: See VolunteerActivityReport interface in Data Models section**
4. ✅ Yes, follows CreateProjectController pattern exactly
5. ❓ Error handling strategy - toast notifications or inline? **Recommendation: Inline errors using VARErrorNotification** Answer: Inline. 

**Dependencies (from #1139):**
- #1136 VARFormFrame (Component #11)
- #1118 VolunteerActivityReportingCardIntro (Component #4)
- #1121 VARFormDivider (Component #1)
- #1123 VARQ1 (Component #6) - ✅ Already implemented
- #1124 VARQ2 (Component #7)
- #1126 VolunteerActivityReportingQ3 (Component #9)
- #1132 VAR Profile Link Card (Component #10)
- #1135 ActivityLogWrapper (Component #12)
- #1143 VARLogWeek (Component #13)

**Recommendation:** Need API spec document for data structures

---

### 15. AboutUserController Modification ([#1137](https://github.com/DemocracyLab/CivicTechExchange/issues/1137))
**Purpose:** Add tabbed navigation to profile page

**Figma:** [My Activity Tab in Profile](https://www.figma.com/design/WADcmVjJh5ARVoZ09xlpfdFN/DemocracyLab?node-id=38877-82909&t=deWirqbNmFVIPX40-4)

![AboutUserController My Activity Tab](https://private-user-images.githubusercontent.com/65760886/435295937-b79bbd42-8148-4e1f-ae74-6d6f6f63beff.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjE3Nzc4MDMsIm5iZiI6MTc2MTc3NzUwMywicGF0aCI6Ii82NTc2MDg4Ni80MzUyOTU5MzctYjc5YmJkNDItODE0OC00ZTFmLWFlNzQtNmQ2ZjZmNjNiZWZmLnBuZyIsInJlcG8iOiIxMjMxMDUyMTAiLCJleHAiOjE3NjE3Nzc4MDN9)

**Files:**
- Component: `common/components/controllers/AboutUserController.jsx` (modify existing)
- Story: Update existing stories

**Changes Required:**
- Modify `_renderAboutMe` method to render tabs
- Use `react-bootstrap/Tabs` and `Tab` components (per LandingController pattern)
- Add "About Me" tab (existing content)
- Add "My Activity" tab (renders MyActivityController or placeholder)

**Props:**
```typescript
// AboutUserController already has props, just modify rendering
// Add internal state for active tab
```

**Storybook Tests:**
- Default state: "About Me" tab selected
- Tab switch: Switch to "My Activity" tab
- AboutMe section: Includes EditUserBioModal
- MyActivity section: Placeholder until #1139 is complete

**Questions:**
1. ✅ Should tabs be visible only to profile owner or to all viewers? **Answer: All viewers**
2. ✅ What should visitors see when viewing someone else's profile? **Answer: They see the activity log but cannot add/edit entries**
3. ✅ Use same styling as LandingController tabs? **Answer: Yes**

**Implementation Note:** 
- Show "My Activity" tab to all viewers
- When viewing own profile: Show VARFormFrame + ActivityLogWrapper
- When viewing others' profile: Show ActivityLogWrapper only (read-only)

---

## Cross-Cutting Concerns

### Additional Components (Now Resolved)
1. ✅ **VARQ1** - Hours worked input field. Issue: [#1123](https://github.com/DemocracyLab/CivicTechExchange/issues/1123) - **Already implemented in PR #1130**
2. ✅ **VARLogWeek** - Displays a single week of activity. Issue: [#1143](https://github.com/DemocracyLab/CivicTechExchange/issues/1143) - **Spec added as Component #13**


### Data Models Needed
updated:
#### VolunteerActivityReport (from backend PR #947)
```typescript
interface VolunteerActivityReport {
  id: number;
  volunteer: number;  // User ID
  project_id: number;    // Project ID
  activity_report_start: string;  // ISO date
  activity_report_end: string;    // ISO date
  hours_spent: number;
  activity_text: string;
  links: ProjectDocument[];
}
```
updated:
#### API Endpoints Needed
- `GET /api/activityreport/{userId}/activity/` - Fetch all reports
- `POST /api/activityreport/` - Submit new report
- `PUT /api/activityreport/{reportId}/` - Update existing report
- `DELETE /api/activityreport/{reportId}/` - Delete report

### Component Architecture
- **Component Type:** All VAR components MUST be functional components (not class components)
- **Flow Types:** Use Flow type annotations for props (`type Props = {| ... |}`)
- **Return Type:** Functions should specify `React$Node` return type

### Styling Consistency
- **SCSS Location:** All SCSS files MUST be in `civictechprojects/static/css/partials/` with `_` prefix (e.g., `_VARFormDivider.scss`)
- **SCSS Import:** Each new SCSS file MUST be imported in `civictechprojects/static/css/styles.scss` WITHOUT the `_` prefix (e.g., `@import "partials/VARFormDivider";`)
- **NO Component Imports:** DO NOT import SCSS files in component `.jsx` files - they are loaded globally via `styles.scss`
- **Color Variables:** ALWAYS use design system color variables from `civictechprojects/static/css/_vars.scss` instead of hardcoded hex values (e.g., use `$color-brand-70` instead of `#F79E02`, `$color-text-strongest` instead of `#191919`, etc.)
- All components should use consistent spacing (handled by parent containers)
- Follow existing DemocracyLab design system
- Ensure accessibility (ARIA labels, keyboard navigation)

### Testing Strategy
Each component needs:
1. **Storybook stories** - Visual testing in isolation
2. **Jest tests** (optional but recommended) - Unit tests for logic
3. **Integration tests** in parent controllers

### File Structure
```
common/components/
├── componentsBySection/
│   └── VolunteerActivityReporting/
│       ├── VARFormDivider.jsx                          (#1)
│       ├── VARErrorNotification.jsx                    (#2)
│       ├── VARSubmitButton.jsx                         (#3)
│       ├── VolunteerActivityReportingCardIntro.jsx     (#4)
│       ├── VARSelectWeek.jsx                           (#5)
│       ├── VARQ1.jsx                                   (#6) ✅ Already implemented
│       ├── VolunteerActivityReportingQ2.jsx            (#7)
│       ├── VolunteerActivityReportingAddLinkModal.jsx  (#8)
│       ├── VolunteerActivityReportingQ3.jsx            (#9)
│       ├── VARFormFrame.jsx                            (#11)
│       ├── ActivityLogWrapper.jsx                      (#12)
│       ├── VARLogWeek.jsx                              (#13)
│       └── stories/
│           ├── VARFormDivider.stories.jsx
│           ├── VARErrorNotification.stories.jsx
│           ├── VARSubmitButton.stories.jsx
│           ├── VolunteerActivityReportingCardIntro.stories.jsx
│           ├── VARSelectWeek.stories.jsx
│           ├── VARQ1.stories.jsx                       ✅ Already exists
│           ├── VolunteerActivityReportingQ2.stories.jsx
│           ├── VolunteerActivityReportingAddLinkModal.stories.jsx
│           ├── VolunteerActivityReportingQ3.stories.jsx
│           ├── VARFormFrame.stories.jsx
│           ├── ActivityLogWrapper.stories.jsx
│           └── VARLogWeek.stories.jsx
├── chrome/
│   └── IconLinkDisplay.jsx                             (#10) ✅ Already exists
└── controllers/
    ├── MyActivityController.jsx                        (#14)
    ├── AboutUserController.jsx                         (#15) Modify existing
    └── stories/
        └── MyActivityController.stories.jsx

civictechprojects/static/css/partials/
├── _VARFormDivider.scss                                ✅ Created
├── _VARErrorNotification.scss                          ✅ Created
├── _VARSubmitButton.scss                               ✅ Created
├── _VolunteerActivityReportingCardIntro.scss
├── _VARSelectWeek.scss
├── _VARQ1.scss                                         ✅ Already exists
├── _VolunteerActivityReportingQ2.scss
├── _VolunteerActivityReportingAddLinkModal.scss
├── _VolunteerActivityReportingQ3.scss
├── _VARFormFrame.scss
├── _ActivityLogWrapper.scss
└── _VARLogWeek.scss

civictechprojects/static/css/styles.scss                ✅ Updated with Phase 1 imports
├── @import "partials/VARFormDivider";                  ✅ Added
├── @import "partials/VARErrorNotification";            ✅ Added
├── @import "partials/VARSubmitButton";                 ✅ Added
└── (Add imports for each new SCSS file)

Note: SCSS files use _ prefix in filename but NOT in import statement.
DO NOT import SCSS files in component .jsx files - they load globally via styles.scss.
```

---

## Priority Questions for Review

### Critical Questions (Must Answer Before Starting):
1. ✅ **Q1 Component** - RESOLVED: Hours worked input, see issue [#1123](https://github.com/DemocracyLab/CivicTechExchange/issues/1123) - **NEEDS SPEC**
2. ✅ **VARLogWeek Component** - RESOLVED: See issue [#1143](https://github.com/DemocracyLab/CivicTechExchange/issues/1143) - **NEEDS SPEC**
3. ✅ **API Endpoints** - RESOLVED: Documented in Data Models section
4. ✅ **Data Flow** - RESOLVED: Uses native form inputs with `name` attributes, gathered via FormData on submission (CreateProjectController pattern)

### Important Questions (Should Answer Soon):
5. ✅ **Week Selection Range** - RESOLVED: Default 12 weeks back, configurable via prop
6. ✅ **Error Messages** - RESOLVED: Hardcoded message: "Please fill in all required fields"
7. ✅ **Profile Visibility** - RESOLVED: Visible to all users; read-only for non-owners
8. ✅ **Icon Mapping** - RESOLVED: Existing IconLinkDisplay supports all required categories

### Nice-to-Have Questions (Can Decide During Implementation):
9. ✅ **Character Counter** - RESOLVED: Yes, shows live character count (e.g., "42/150")
10. ✅ **Link Limits** - RESOLVED: Unlimited by default, but configurable via `maxLinks` prop
11. ✅ **Double-Submit Prevention** - RESOLVED: Yes, button disabled when `isSubmitted={true}`

---

## Implementation Phases

### Phase 1: Foundation
**Components:** #1, #2, #3
- Create directory structure
- Set up SCSS partials
- Build simple components: VARFormDivider, VARErrorNotification, VARSubmitButton (functional components)
- Create storybook infrastructure
- **Status:** ✅ Complete - Components created as functional components

### Phase 2: Form Inputs
**Components:** #4, #5, #6 (done), #7
- VolunteerActivityReportingCardIntro
- VARSelectWeek (with date-fns integration)
- ~~VARQ1~~ ✅ Already implemented
- VolunteerActivityReportingQ2 (VARQ2)
- Test in Storybook
- **Status:** Mostly ready (verify VARQ1 implementation)

### Phase 3: Link Management
**Components:** #8, #9, #10 (exists)
- VolunteerActivityReportingAddLinkModal
- VolunteerActivityReportingQ3
- Verify IconLinkDisplay integration
- Test in Storybook
- **Status:** Needs modal component identification

### Phase 4: Containers & Display
**Components:** #11, #12, #13
- VARFormFrame
- ActivityLogWrapper
- VARLogWeek
- Test in Storybook with mock data
- **Status:** Ready once Phase 2-3 complete

### Phase 5: Controllers & Integration
**Components:** #14, #15
- MyActivityController
- Modify AboutUserController
- API integration
- End-to-end testing
- **Status:** Ready once Phase 4 complete

---

## Success Criteria
- ✅ All components render correctly in Storybook
- ✅ All props are properly typed and documented
- ✅ Form validation works correctly
- ✅ Data submission flows to backend API
- ✅ Responsive design works on mobile and desktop
- ✅ Accessibility requirements met (keyboard nav, ARIA labels)
- ✅ Code follows existing CivicTechExchange patterns
- ✅ No console errors or warnings
- ✅ Integration with existing AboutUserController works

---

---

## Specification Review Summary

### ✅ Resolved Issues
All questions from your answers have been incorporated into the spec:

1. **Error messages:** Hardcoded as "Please fill in all required fields"
2. **Submit button:** Renamed to `isSubmitted`, auto-disabled on submit
3. **URL validation:** Format validation in component
4. **Modal component:** Use React Bootstrap Modal (from `react-bootstrap/Modal`)
5. **Icon mapping:** Handled by child IconLinkDisplay component
6. **Profile visibility:** Visible to all users, read-only for non-owners
7. **Link limits:** Unlimited by default, configurable via `maxLinks` prop
8. **Double-submit prevention:** Button disabled when `isSubmitted={true}`
9. **VARQ1 component:** Already implemented in PR #1130
10. **VARLogWeek component:** Spec added as Component #13
11. **API endpoints:** Documented in Data Models section
12. **Activity log structure:** Uses VolunteerActivityReport from backend PR #947

### 📋 Total Component Count: 15

**New Components to Build:** 13
- Phase 1: 3 components (simple UI)
- Phase 2: 3 components (form inputs) - 1 already exists
- Phase 3: 2 components (modals/links) - 1 component reused
- Phase 4: 3 components (containers/display)
- Phase 5: 2 controllers (1 new, 1 modification)

**Already Implemented:** 2
- VARQ1 (#1123) - ✅ Merged in PR #1130
- IconLinkDisplay - ✅ Existing component reused

### ❓ Remaining Open Questions

**Minor Questions (Can be decided during implementation):**
1. **VARErrorNotification:** What's the exact error message text? Spec uses "Please fill in all required fields" from Figma
2. **MyActivityController:** Error handling - inline errors using VARErrorNotification (recommended)
3. **VARLogWeek:** Should delete confirmation dialog be part of component or parent? (Recommended: include in component)

**Non-Blocking:**
These questions have reasonable defaults in the spec and won't block implementation.

### 🚀 Ready to Start Implementation

**Prerequisites:**
- ✅ All component specs complete with props, files, and tests
- ✅ Data models documented (VolunteerActivityReport)
- ✅ API endpoints identified
- ✅ Form data collection pattern established
- ✅ Existing components identified (VARQ1, IconLinkDisplay, React Bootstrap Modal)
- ✅ File structure defined
- ✅ Implementation phases outlined

**Recommended Next Steps:**
1. Verify VARQ1 implementation follows spec (check PR #1130)
2. Begin Phase 1: Create directory structure and simple components
3. Set up Storybook stories for each component as built
4. Progress through phases sequentially
5. Test integration with MyActivityController in Phase 5

**Key Architectural Decisions**

1. **Component Architecture:** All VAR components are functional components (not class components)
2. **Form Pattern:** Native HTML form inputs with `name` attributes, collected via FormData API (CreateProjectController pattern) - no `onUpdate` callbacks
3. **Modal Component:** React Bootstrap Modal (`react-bootstrap/Modal`)
4. **Date Handling:** date-fns library for week selection
5. **Styling:** SCSS partials in `civictechprojects/static/css/partials/` with `_` prefix. Each new SCSS file must be imported (without the `_` prefix) in `civictechprojects/static/css/styles.scss`. Do NOT import SCSS files in JSX components.
6. **Testing:** Storybook stories for all components
7. **State Management:** Flux pattern via controllers, minimal component state
8. **Reusable Components:** IconLinkDisplay for link display
9. **Responsive:** All components support mobile/desktop views per Figma

---

## Next Steps
1. ✅ **Spec review complete** - All questions answered
2. ✅ **Component specs complete** - All 15 components documented
3. ✅ **API contracts documented** - Endpoints and data models defined
4. **Verify development environment** - Node 16.20.1, dependencies installed
5. **Begin Phase 1 implementation** - Ready to start coding!
