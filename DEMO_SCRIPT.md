# Naxum Sales App - Video Demo Script (7 Minutes)

## Part 1: App Walkthrough (5 Minutes)

**1. Intro**
*   "Hi, this is Dinesh Kokare Here presenting the Naxum Sales Team Management App."
*   "I built this using **React Native (Expo)** for the mobile app and **Node.js/Express with PostgreSQL** for the backend."

**2. Authentication (Login)**
*   *Action*: Open the app on your phone/simulator.
*   *Action*: Click "Don't have an account? Sign Up" -> Register a new user (e.g., `demo@test.com`).
*   *Action*: Show the successful login redirecting to the Home Screen.

**3. Home Screen (Dashboard)**
*   *Highlight*: Point out the **Dashboard Stats**. "Here you can see real-time stats like Team Members, Pending Invites, and Task Completion rates."
*   *Highlight*: "I implemented this efficiently by fetching aggregated data from the backend on mount."

**4. Contacts & Invitations**
*   *Action*: Tap "Invite Contact".
*   *Action*: Grant permissions (if asked). Show the list of contacts pulled from the device.
*   *Action*: Use the **Search Bar** to find a specific name.
*   *Action*: Click "Invite". Explain: "This sends the data to the backend API and opens the native SMS app with a pre-filled message."

**5. Team Management**
*   *Action*: Navigate to the "Team" tab.
*   *Action*: Show the list of team members and pending invitations.
*   *Explain*: "This view pulls data from the relational database, linking users via their `inviter_id`."

**6. Task Management**
*   *Action*: Tap "New Task" (or the "+" button).
*   *Action*: Create a task (e.g., "Follow up with John").
*   *Action*: Assign it to a team member (or yourself if testing on one device).
*   *Highlight*: **"You can see the Push Notification appearing instantly on the device."** (Show the notification banner).
*   *Action*: Go to the "Tasks" tab. Show the task appearing there.
*   *Action*: Tap the checkbox to mark it as **Completed**.
*   *Action*: Go back to Home Dashboard and show the stats updating (if you have time).

---

## Part 2: Code & Architecture (2 Minutes)

**1. Folder Structure**
*   *Action*: Switch to VS Code.
*   *Show*: The `mobile-app` and `backend` folders side-by-side.
*   *Explain*: "I used a clean, modular structure.
    *   **Backend**: separate controllers, models, routes, and middleware.
    *   **Mobile**: using `expo-router` for file-based navigation in the `app` directory."

**2. Key Tech Decisions**
*   **TypeScript**: "Used throughout for type safety and to prevent runtime errors."
*   **State Management**: "Used `Zustand` for auth state because it's lightweight and boilerplate-free compared to Redux."
*   **Database**: "PostgreSQL with Sequelize ORM for distinct relational data modeling (Users, Tasks, Invitations)."

**3. Testing**
*   *Action*: Open the terminal.
*   *Action*: Run `npm test` in the `backend` folder.
*   *Say*: "I've implemented unit tests covering Authentication logic and Input Validation utility functions to ensure reliability."
