# Naxum Assessment - Backend API

## Setup Instructions

1.  **Prerequisites**: Node.js, PostgreSQL (or Docker).
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Copy `.env.example` to `.env` and update DB credentials if necessary.
    ```bash
    cp .env.example .env
    ```
4.  **Database**:
    Ensure PostgreSQL is running.
    If you have Docker, you can run:
    ```bash
    docker run --name naxum-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
    ```
5.  **Run Development Server**:
    ```bash
    npm run dev
    ```
6.  **Run Tests**:
    ```bash
    npm test
    ```

## Architecture
*   **Express + TypeScript**: For type-safe, scalable API.
*   **Sequelize**: ORM for PostgreSQL.
*   **Layered Architecture**: Controllers -> Services -> Models.
*   **Auth**: JWT based stateless authentication.

## Testing Strategy
*   **Unit Tests**: Focused on `Services` which contain business logic (e.g., `AuthService`).
*   **Integration Tests**: Could be added for Controllers using `supertest`.
*   Run tests via `npm test` (Uses Jest).
