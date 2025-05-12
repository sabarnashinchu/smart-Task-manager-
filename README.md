# Task Manager Application

A full-stack task management application built with React and Spring Boot, designed to help users organize, track, and analyze their tasks efficiently.

## Features

### Task Management
- Create, edit, delete, and mark tasks as complete
- Set priority levels (high, medium, low) with color coding
- Categorize tasks and add custom tags
- Set due dates and reminders
- Search and filter tasks

### Multiple Views
- **List View**: Traditional task list with sorting options
- **Board View**: Kanban-style drag-and-drop interface
- **Calendar View**: Schedule tasks by date
- **Analytics**: Visual reports of task completion and productivity

### Productivity Tools
- Pomodoro Timer with work/break cycles
- Task completion statistics and insights
- Custom tags with color coding
- Real-time notifications

### UI/UX
- Responsive Material-UI design
- Light/Dark theme toggle
- Interactive animations and transitions
- Confetti celebration on task completion

## Technologies Used

### Frontend
- **Framework**: React.js
- **UI Components**: Material-UI (MUI)
- **State Management**: React Hooks and Context API
- **HTTP Client**: Axios
- **Visualization**: Chart.js and react-chartjs-2
- **Drag and Drop**: @hello-pangea/dnd
- **Date Handling**: date-fns and MUI Date Pickers

### Backend
- **Framework**: Spring Boot 3.2.3
- **Database**: H2 in-memory database
- **ORM**: Hibernate/JPA
- **API Style**: RESTful API
- **Build Tool**: Maven
- **Java Version**: Java 17

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- Java JDK 17
- Maven

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Build the application:
   ```
   mvn clean install
   ```
3. Run the Spring Boot application:
   ```
   mvn spring-boot:run
   ```
4. The backend server will start at `http://localhost:8085`

### Frontend Setup
1. Install dependencies:
   ```
   npm install
   ```
2. Start the development server:
   ```
   npm start
   ```
3. The frontend application will open at `http://localhost:3000`

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task

### Filters
- `GET /api/tasks/search?query={query}` - Search tasks
- `GET /api/tasks/category/{category}` - Get tasks by category
- `GET /api/tasks/priority/{priority}` - Get tasks by priority
- `GET /api/tasks/status/{completed}` - Get tasks by completion status

## Project Structure

### Frontend
```
src/
├── components/     # UI components
├── services/       # API services
├── theme/          # Theme configuration
├── App.js          # Main application component
└── index.js        # Entry point
```

### Backend
```
src/main/
├── java/com/taskmanager/
│   ├── controller/    # REST controllers
│   ├── model/         # Data entities
│   ├── repository/    # Data access layer
│   ├── service/       # Business logic
│   └── TaskManagerApplication.java
└── resources/
    ├── application.properties  # App configuration
    ├── schema.sql              # Database schema
    └── data.sql                # Initial data
```

## Future Enhancements
- User authentication and multiple user support
- Task sharing and collaboration
- Mobile application
- Advanced reporting and analytics
- Cloud synchronization

## License
This project is licensed under the MIT License - see the LICENSE file for details.
