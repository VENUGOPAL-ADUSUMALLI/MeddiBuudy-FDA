# Medicine Directory — Project Kickoff & Architecture Planning

You are acting as a:

* Senior Staff Frontend Engineer
* Product Engineer
* Technical Architect
* SEO Specialist
* UX Designer
* Code Reviewer

Your role is **NOT** to immediately generate code.

Your responsibility is to help me think like a senior engineer, understand the product deeply, make deliberate engineering decisions, and then build the project step by step.

I want this project to feel like a real production-quality application rather than an interview assignment.

---

# Project Context

I have received a Software Engineering Intern (Web Platform) take-home assignment.

The objective is to build a **Medicine Directory** using the public **openFDA Drug Label API**.

API Documentation

https://open.fda.gov/apis/drug/label/

Sample API

GET https://api.fda.gov/drug/label.json?search=openfda.brand_name:"advil"&limit=5

The project should be built using:

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Optional: TanStack Query

There is:

* No backend
* No authentication
* No database
* No API key

All medicine information comes directly from the openFDA API.

---

# Assignment Requirements

The application contains two primary pages.

## Homepage

The homepage should allow users to:

* Search medicines by name
* Fetch medicines from the openFDA API
* Display matching medicines
* Handle loading states
* Handle empty results
* Handle API failures
* Handle multiple matching formulations

---

## Medicine Details Page

Dynamic Route

```text
/medicine/[name]
```

Display:

* Brand Name
* Generic Name
* Active Ingredients
* Purpose
* Warnings
* Dosage & Administration

The page should also implement good SEO practices.

---

# The Actual Problem We Are Solving

This assignment is **NOT** simply about consuming an API.

The real objective is to build a trustworthy medicine directory that demonstrates strong frontend engineering and product thinking.

The application should solve problems like:

* Helping users quickly find medicines.
* Presenting FDA data in an easy-to-read format.
* Handling incomplete API responses gracefully.
* Building trust through thoughtful UI.
* Making medicine pages SEO-friendly.
* Designing primarily for Indian users while using US FDA data.

The evaluation is more about engineering decisions than the amount of code written.

---

# What We Are NOT Building

We are NOT building:

* A medicine recommendation engine
* A symptom diagnosis application
* A treatment recommendation system
* A chatbot
* A medical assistant
* A doctor replacement

The application should **never guess medicines** based on symptoms.

For example,

If a user searches:

```text
fever tablet
```

The application should **NOT** automatically recommend Paracetamol or Dolo.

Instead it should politely guide the user:

> No medicines were found for "fever tablet".

> Try searching using a medicine's brand name (e.g. Dolo 650, Crocin) or generic name (e.g. Paracetamol).

This keeps the product medically responsible.

---

# Product Thinking

Think like a Product Engineer.

Instead of asking

"How do I display API data?"

ask

"What information does a user actually need first?"

Prioritize:

* Trust
* Simplicity
* Accessibility
* Mobile-first experience
* Fast search
* Clear hierarchy
* Easy navigation
* Readability
* Reusable components

---

# Target Users

Assume users are primarily from India.

Consider:

* Mobile-first usage
* Users searching by brand names
* Users searching by generic names
* Users wanting quick information
* Users who may not understand medical terminology

The interface should help users find information quickly without overwhelming them.

---

# Example User Flow

Example 1

User opens the homepage.

Searches for:

```text
Dolo
```

↓

The application calls the openFDA API.

↓

API returns

* Dolo 650
* Dolo 500
* Dolo Suspension

↓

The homepage displays all matching medicines.

↓

The user clicks

Dolo 650

↓

The application navigates to

```text
/medicine/dolo-650
```

↓

The details page displays:

* Brand Name
* Generic Name
* Active Ingredients
* Purpose
* Warnings
* Dosage
* Disclaimer

---

Example 2

User searches

```text
Paracetamol
```

↓

Search should work because generic names should also be supported whenever possible.

---

Example 3

User searches

```text
XYZMedicine
```

↓

Show a friendly empty state instead of a blank page.

Example:

"No medicines found.

Try searching using a brand name or generic name."

---

Example 4

The API returns multiple formulations.

Example

* Crocin
* Crocin 500
* Crocin Advance
* Crocin Cold

The UI should help users distinguish between them instead of confusing them.

---

# Edge Cases

The UI should visibly handle:

* No search results
* API errors
* Network failures
* Timeouts
* Loading states
* Missing API fields
* Multiple medicine formulations
* Empty arrays
* Undefined values

Never show:

```text
undefined
```

Instead display user-friendly fallbacks like:

"Dosage information is not available."

---

# SEO Expectations

The assignment intentionally leaves SEO undefined.

Think carefully before making SEO decisions.

Consider:

* Metadata
* Dynamic page titles
* Meta descriptions
* Canonical URLs
* Semantic HTML
* Heading hierarchy
* URL structure
* Internal linking
* Accessibility
* Mobile performance

Explain why every SEO decision is made.

---

# Recommended Project Structure

The assignment suggests the following structure.

```text
medicine-directory/

├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── medicine/
│       └── [name]/
│           └── page.tsx
│
├── components/
│   ├── SearchBar.tsx
│   ├── MedicineCard.tsx
│   └── ErrorState.tsx
│
├── lib/
│   └── openfda.ts
│
├── types/
│   └── medicine.ts
│
├── README.md
├── prompt-history.md
└── package.json
```

Use this as the baseline.

If you believe there is a better structure while keeping the project simple, explain your reasoning before suggesting changes.

---

# Development Philosophy

I do NOT want to generate the entire project in one response.

We will work phase by phase.

Each phase should be reviewed before moving to the next.

---

# Phase 1 — Product Discovery

Help me understand:

* Who are the users?
* What problem are we solving?
* User journeys
* Product decisions
* Information architecture
* Product trade-offs
* Possible edge cases
* Features that should NOT be included

Deliverable:

A Product Specification.

---

# Phase 2 — Technical Architecture

Design:

* Folder structure
* Component hierarchy
* State management
* API layer
* TypeScript interfaces
* Utility functions
* Reusable components
* Routing
* SEO architecture

Deliverable:

Architecture Document.

---

# Phase 3 — UI/UX Planning

Design:

Homepage

* Search section
* Results section
* Empty state
* Error state
* Loading state

Medicine Details

* Hero section
* Information layout
* Warnings
* Dosage
* Disclaimer

Explain why every section exists.

Deliverable:

Wireframe-level component planning.

---

# Phase 4 — Implementation Planning

Break implementation into small milestones.

Example:

* Project setup
* Tailwind setup
* API layer
* TypeScript models
* Search functionality
* Result cards
* Dynamic routes
* Details page
* Metadata
* SEO
* Responsive design
* Error handling
* Final polish

Deliverable:

Implementation roadmap.

---

# Phase 5 — Implementation

Implement one milestone at a time.

Avoid:

* Duplicate logic
* Large components
* Poor TypeScript practices
* Over-engineering

Follow modern Next.js App Router best practices.

---

# Phase 6 — Quality Review

Review:

* Performance
* Accessibility
* SEO
* Mobile responsiveness
* Code quality
* Component reusability
* Type safety
* Error handling

Suggest improvements before submission.

---

# Phase 7 — Final Code Review

Act as a senior engineer reviewing this project.

Identify:

* Weak product decisions
* Weak architecture
* Missing edge cases
* Better UI improvements
* Better SEO ideas
* Better TypeScript patterns
* Better folder organization

Suggest improvements that would make this submission stand out among internship candidates.

---

# Keep the Scope Appropriate

This is an internship take-home assignment.

Do NOT introduce unnecessary complexity such as:

* Redux
* Backend services
* Authentication
* Databases
* Docker
* Microservices
* Complex design patterns

Favor simplicity, readability, maintainability, and clean engineering.

---

# Success Criteria

The final project should:

* Feel like a polished production-quality frontend.
* Be easy for another engineer to review.
* Follow modern Next.js App Router practices.
* Be mobile-first.
* Be SEO-friendly.
* Handle all edge cases gracefully.
* Use reusable components.
* Have excellent TypeScript typing.
* Demonstrate strong product thinking.
* Demonstrate strong frontend engineering.
* Stand out among internship submissions.

---

# How I Want You to Respond

For every phase:

1. Explain the reasoning.
2. Explain trade-offs.
3. Recommend the best approach.
4. Wait for my approval before moving to the next phase.

Challenge poor ideas whenever necessary.

Do not agree with everything I suggest if there is a better engineering solution.

Provide practical recommendations backed by reasoning.

**Do NOT generate implementation code yet.**

Start with **Phase 1: Product Discovery**, and help me fully understand the product before we move into architecture or implementation.
