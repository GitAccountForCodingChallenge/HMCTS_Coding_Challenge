# Coding Challenge Project
### Monorepo webapplication - Java Springboot Backend and React Frontend

### Prerequisites 
 - Java Development Kit (JDK) 21
 - Node.js & npm

### Running Locally

#### Backend Run Config Setup - 
 - Navigate to the top menu bar and select Run > Edit Configurations.
 - Click the + (Add New Configuration) icon in the top-left corner of the window.
 - Select Spring Boot from the dropdown list.
 - NAME: Give it a clear name - eg. BackendApplication
 - MAIN CLASS: Type the following entry point: org.example.Main
 - Apply and Run.

#### Running the React Frontend - 
 - Open a new terminal window and navigate to the frontend directory
`````
cd ui
`````
 - Install dependencies
`````
npm install
`````
 - Start the development server
`````
npm run dev
`````
 - The frontend UI will be available at http://localhost:5173

#### Database (H2 Console)
 - While the backend is running, you can access the live H2 database console at:http://localhost:8080/h2-console
 - JDBC URL: jdbc:h2:mem:testdb
 - Username: sa
 - Password: password can be found in application.properties