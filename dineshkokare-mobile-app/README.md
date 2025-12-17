# Naxum Assessment - Mobile App

## Setup Instructions

1.  **Prerequisites**: Node.js, Expo Go (on phone) or Simulator (Xcode/Android Studio).
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run App**:
    ```bash
    npx expo start
    ```
    *   Press `i` for iOS Simulator.
    *   Press `a` for Android Emulator.
    *   Scan QR code with Expo Go.

## Architecture
*   **React Native + Expo**: Managed workflow.
*   **Expo Router**: File-based routing for clean navigation structure.
*   **Zustand**: Lightweight state management for Auth.
*   **Styling**: Custom `StyleSheet` for performance and granular control.

## Key Features
*   **Auth**: Login/Register with JWT storage.
*   **Contacts**: Import from phone and send SMS invites.
*   **Team**: View recruits.
*   **Tasks**: Assign tasks to team members.

## Testing
*   Jest is set up for unit testing stores and utilities.
