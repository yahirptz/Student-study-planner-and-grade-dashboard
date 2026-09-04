# Student Study Planner & Grade Dashboard

A React, TypeScript, Tailwind CSS, and shadcn-compatible web application for the Vibe Coding project.

## Versions

- **Version 1 / Basic:** The original light planner UI with add, edit, and delete courses and assignments; priority and status changes; refresh-safe `localStorage` persistence; course grades and completion summary.
- **Version 2 / Enhanced:** The original Version 1 UI plus dashboard metrics, assignment search and status filtering, overdue highlighting, next-focus guidance, and study-session tracking.
- **Version 3 / Studio:** A React and TypeScript rebuild using `src/components/ui`, the supplied animated gradient, liquid-glass buttons, metal buttons, Lucide icons, Tailwind CSS, and shadcn conventions. It retains the Version 1/2 data model and adds a glass workspace presentation.
- **Version 4 / Analytics:** Keeps Version 3 available and adds a semester progression chart, clickable priority breakdown/filtering, reversible study-session logging, and a syllabus calculator. Paste or upload a text syllabus with Homework, Tests/Quizzes, Midterm, and Final percentages; V4 parses the weights, shows the total, and lets you adjust them per course.

## Run locally

```bash
npm install
npm run dev
```

The default component path is `src/components/ui`, as configured in `components.json`. Keeping reusable shadcn components there makes imports predictable and allows future shadcn CLI additions to work without moving files. Shared class utilities live in `src/lib/utils.ts`.

## Version 1 test checklist

1. Add a course, then use **Edit** and **Delete**.
2. Add several courses and an assignment.
3. Edit the assignment, change its priority, and change its status from the inline status menu.
4. Delete an assignment.
5. Refresh the browser and confirm the remaining data is still present.

## GitHub Pages

Build the app and publish the generated `dist` folder with GitHub Pages:

```bash
npm run build
```

Configure GitHub Pages to deploy the `dist` artifact from your chosen branch or GitHub Actions workflow. Vite is configured with a relative base path so the built app works from a repository subpath.