# Student Study Planner & Grade Dashboard

A static web application built with HTML, CSS, and JavaScript for the Vibe Coding project.

## Versions

- **Version 1 / Basic:** Add, edit, and delete courses and assignments; change assignment priority and status; refresh-safe `localStorage` persistence; course grades and completion summary.
- **Version 2 / Enhanced:** Everything in Version 1 plus dashboard metrics, assignment search and status filtering, overdue highlighting, next-focus guidance, and study-session tracking.

## Run locally

Open `index.html` in a browser, or serve the folder with any static web server. No build step or dependencies are required.

## Version 1 test checklist

1. Add a course, then use **Edit** and **Delete**.
2. Add several courses and an assignment.
3. Edit the assignment, change its priority, and change its status from the inline status menu.
4. Delete an assignment.
5. Refresh the browser and confirm the remaining data is still present.

## GitHub Pages

Push the repository to GitHub, then choose **Settings > Pages > Deploy from a branch**, select the default branch and `/ (root)`, and save. GitHub Pages will serve `index.html` directly.