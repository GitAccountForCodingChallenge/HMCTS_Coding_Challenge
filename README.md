# Coding Challenge Project

### A monorepo Kanban task management application - Using a Java Spring Boot REST API and a React TypeScript Frontend

## Features
 - A Kanban board for your tasks, with Pending, In Progress, and Completed task columns.
 - Create tasks with a title, description, status, and due date.
 - Drag and drop tasks between columns to update their status.
 - Delete tasks with a confirmation dialog.
 - Colour-coded task borders to highlight upcoming and overdue deadlines.
 - Form validation and toast notifications for user feedback.
 - REST API with soft deletion and an H2 in-memory database.
 - Search for active tasks by title using a debounced search, and select a result to view its details.

## Prerequisites 
 - Java Development Kit (JDK) 21
 - Node.js & npm
 - IntelliJ IDEA (recommended for running the backend and its tests)

## Running Locally
Start the Spring Boot backend before running the React frontend. Both applications must be running for the task management functionality to work.

### Running the Backend
 - Navigate to the top menu bar and select Run > Edit Configurations.
 - Click the + (Add New Configuration) icon in the top-left corner of the window.
 - Select Spring Boot from the dropdown list.
 - NAME: Give it a clear name - eg. BackendApplication
 - MAIN CLASS: Type the following entry point: app.Main
 - Apply and Run.


#### The backend should be available at: http://localhost:8080

### Running the Frontend:
#### Open a new terminal window and navigate to the frontend directory
```bash
cd ui
```

#### Install dependencies
```bash
npm install
```

#### Generate the API Client 
 - The frontend uses RTK Query hooks generated from the OpenAPI schema.
```bash
npm run generate:api
```
 - This generates the API client at: `src/services/generated/tasksApi.ts`
 - Regenerate the client whenever the OpenAPI specification changes.

#### Start the React frontend
```bash
npm run dev
```
 - The frontend UI will be available at http://localhost:5173

## Database (H2)
 - While the backend is running, you can access the live H2 database console at:http://localhost:8080/h2-console

#### Connection settings:
```
JDBC URL: jdbc:h2:mem:testdb
Username: sa
Password: password
 ```

#### Initial Data
 - Sample tasks are provided through: `api/src/main/resources/data.sql`

These populate the board when the application starts.

Because H2 is configured as an in-memory database, data does not persist between application restarts.

## Testing

### Frontend Tests

 - Open a new terminal window and navigate to the frontend directory
```bash
cd ui
```
 - Run all tests:
```bash
npm test
```

 - Run tests with coverage:
```bash
npm run test:coverage
```
### The frontend test suite uses:

 - Jest as the test runner.
 - React Testing Library for testing component behaviour.
 - MSW for mocking backend API requests.
 - Isolated Redux test stores for RTK Query integration testing.

### Running the Backend Tests

 - Open the Maven tool window on the right-hand side of the IDE.
 - Expand the coding-challenge-api project.
 - Expand Lifecycle.
 - Double-click test to execute all backend tests.
 - View the results in IntelliJ's Run window.

### The backend test suite uses:

 - JUnit 5 as the test framework.
 - Mockito for mocking repository dependencies in service unit tests.
 - Spring Boot Test for integration testing.
 - Spring Data JPA for testing repository interactions.
 - H2 as an in-memory database for integration tests, populated using data.sql.

## Code Quality and Build
 - Frontend Linting
```bash
npm run lint
```
ESLint checks JavaScript, TypeScript, and React code.

 - Type Checking
```bash
npm run typecheck
```
 - Build
```bash
npm run build
```
 - Run All Frontend Checks
```bash
npm run check
```
This executes linting, type checking, Jest tests, and the build.

## Architecture
The backend follows a Controller → Service → Repository architecture using Spring Data JPA for persistence.

OpenAPI is used to define the API contract, with generated Java models and TypeScript RTK Query hooks keeping communication between the frontend and backend consistent.

The React frontend uses reusable components, RTK Query for API state management, and Formik/Yup for form validation.