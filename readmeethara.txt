Ethara project
description - this project is a webapplication where users can create projects,saaign tasks and track progress with role bases ccess

#technologies used -
1. backend - experessjs,sequelize (for ORM), JWT for authentication,pg for PostgreSQL
2. frontend - react vite,tailwind(for css) , react router (for routing)
3. datsbase - PostgreSQL


#project Structure
it contains two main directories
1 './backend'- for backend logic and rest api server
2. './frontend' -for client side application


# Working explained
 
1. backend(server side)- 
It is build with node.js and express.js with sequelize fro ORM connection to database. It provides API's for authentication ,managing projects and handling new tasks

  #components
  ->Entry Point (`index.js`)**: Configures the Express server, enables CORS, and mounts the API routes under `/api`. It also initializes the database connection.
  ->Database models:
    1.Entry Point (`index.js`)**: Configures the Express server, enables CORS, and mounts the API routes under `/api`. It also initializes the database connection.

    2.Database Models (`src/models`)**: Defines the schema and relationships:
       `User`: Stores user credentials and details.
       `Project`: Stores project information.
       `ProjectMember`: A junction table managing the many-to-many relationship between

    3.Users and Projects. It includes a `role` field (e.g., ADMIN, MEMBER) for Role-Based Access Control (RBAC).

    4.`Task`: Stores task details (title, description, status, priority, due date) and links to a Project and an Assignee (User).

*   5.Controllers (`src/controllers`):
       `auth.controller.js`: Handles user registration and login, generating JWT tokens for authenticated sessions.
       `project.controller.js`: Handles creating, updating, deleting projects, as well as inviting, removing, and updating members' roles within a project. Checks RBAC to ensure only admins can modify projects or invite users.

    6.   `task.controller.js`: Handles CRUD operations for tasks within a project. Assignees can update the status of their tasks, while admins can manage all aspects of tasks.

    7.Routes (`src/routes`)**: Maps HTTP methods and endpoints to the corresponding controller functions (e.g., `/api/projects`, `/api/tasks`).

    8. Middlewares**: Protects routes by verifying JWT tokens and extracting the authenticated user's ID.



2. Frontend Workflow

The frontend is a Single Page Application (SPA) built with React, bundled by Vite, and styled using Tailwind CSS.

  #Key Components

    1Entry Point (`src/main.jsx` & `src/App.jsx`)**: The application is wrapped in React Router. `App.jsx` defines the routes and uses a `<Protected>` wrapper component to redirect unauthenticated users to the login page.
    2.Authentication Forms (`src/components/forms`)**:
     `Login.jsx` & `Signup.jsx`: Forms for user authentication. Upon successful login, a JWT token is saved to the browser's `localStorage`.
    3.Pages (`src/components/pages`)**:
       `Home.jsx` (Dashboard): Fetches and displays a list of projects the logged-in user belongs to. It also provides a form to create a new project.
    4.             `ProjectDetail.jsx`: The core project management interface. It fetches project details, members, and tasks. Based on the user's role:
        Admins see forms to create new tasks, assign tasks to members, and invite new members via email.
        Members can view the task board.
         Users can update the status of tasks to "TODO", "IN_PROGRESS", or "DONE". Overdue tasks are highlighted automatically.
PI Utilities (`src/utils/api.js`)**: A wrapper around the native `fetch` API that automatically attaches the JWT token from `localStorage` to outgoing requests and handles common errors (like redirecting to login if the token expires).


User Flow Summary

1.  Authentication**: A new user visits the site, signs up, and logs in. A JWT token is stored locally.

2.  Dashboard**: The user is redirected to the `/home` dashboard. They can create a new project, becoming the "ADMIN" of that project.

3.Project Management**: Clicking on a project navigates to `/projects/:projectId`. The Admin can invite other registered users to the project by email.

4.Task Management**: the admin create tasks, also due date and  assigns levels of priority

5.Collaboration**: members tasks are assigned to view their task and update their progress