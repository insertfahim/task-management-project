# Task Management System

A comprehensive task management web application built with modern technologies including Next.js, TypeScript, PostgreSQL, and Prisma ORM.

## Features

### Core Features

-   ✅ **User Authentication** - Secure login and registration system
-   ✅ **Task CRUD Operations** - Create, read, update, and delete tasks
-   ✅ **Task Categories** - Organize tasks with customizable categories
-   ✅ **Priority System** - High, Medium, Low priority levels
-   ✅ **Task Status** - Mark tasks as complete or incomplete
-   ✅ **Due Dates** - Schedule tasks with deadline tracking
-   ✅ **Search & Filter** - Find tasks by category, status, or priority
-   ✅ **Task Sorting** - Sort by date, priority, or alphabetically
-   ✅ **CSV Export** - Export task data for external use
-   ✅ **Dark/Light Mode** - Theme toggle for better user experience
-   ✅ **Responsive Design** - Works on desktop and mobile devices

### Technical Features

-   **Database**: PostgreSQL (Neon DB) with Prisma ORM
-   **Authentication**: NextAuth.js with JWT sessions
-   **Styling**: Tailwind CSS with responsive design
-   **API**: RESTful API routes with TypeScript
-   **Validation**: Zod schema validation
-   **State Management**: React hooks and server state
-   **Notifications**: Real-time toast notifications

## Tech Stack

-   **Framework**: Next.js 14+ (App Router)
-   **Language**: TypeScript
-   **Database**: PostgreSQL (Neon DB)
-   **ORM**: Prisma
-   **Authentication**: NextAuth.js
-   **Styling**: Tailwind CSS
-   **UI Components**: Custom components with Radix UI primitives
-   **Validation**: Zod
-   **Notifications**: React Hot Toast
-   **Icons**: Lucide React
-   **Date Handling**: date-fns

## Getting Started

### 🎯 Quick Demo

**Try the application immediately without setup!**

Visit the application and click "Try Demo Account" on the sign-in page, or use these credentials:

-   **Email**: `demo@taskmanagement.com`
-   **Password**: `demo123`

The demo account includes:

-   ✅ Pre-populated sample tasks
-   ✅ Multiple categories (Work, Personal, Shopping, Health)
-   ✅ Tasks with different priorities and due dates
-   ✅ Completed and pending tasks
-   ✅ Full access to all features

### Prerequisites

-   Node.js 18+ and npm
-   A Neon PostgreSQL database (or any PostgreSQL database)

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd task-management
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Environment Setup**

    Copy `.env` and update the following variables:

    ```env
    DATABASE_URL="your-postgresql-connection-string"
    NEXTAUTH_SECRET="your-secret-key-here"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4. **Database Setup**

    ```bash
    # Push schema to database
    npx prisma db push

    # Generate Prisma client
    npx prisma generate
    ```

5. **Run the development server**

    ```bash
    npm run dev
    ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses the following main entities:

### User

-   id, email, name, password
-   timestamps (createdAt, updatedAt)

### Category

-   id, name, color, userId
-   Relationships: belongs to User, has many Tasks

### Task

-   id, title, description, completed, priority, dueDate, userId, categoryId
-   timestamps (createdAt, updatedAt)
-   Relationships: belongs to User and Category

### Priority Enum

-   LOW, MEDIUM, HIGH

## API Endpoints

### Authentication

-   `POST /api/auth/register` - User registration
-   `POST /api/auth/signin` - User login (handled by NextAuth)

### Tasks

-   `GET /api/tasks` - Get all tasks with filtering and sorting
-   `POST /api/tasks` - Create a new task
-   `GET /api/tasks/[id]` - Get a specific task
-   `PATCH /api/tasks/[id]` - Update a task
-   `DELETE /api/tasks/[id]` - Delete a task
-   `GET /api/tasks/export` - Export tasks as CSV

### Categories

-   `GET /api/categories` - Get all user categories
-   `POST /api/categories` - Create a new category

## Project Structure

```
src/
├── app/                    # Next.js 13+ app router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── providers.tsx      # Context providers
│   ├── task-dashboard.tsx # Main dashboard
│   └── theme-provider.tsx # Theme management
├── lib/                   # Utility functions
│   ├── auth.ts            # NextAuth configuration
│   ├── db.ts              # Database connection
│   └── utils.ts           # General utilities
└── types/                 # TypeScript type definitions
    ├── index.ts           # Main types
    └── next-auth.d.ts     # NextAuth type extensions
prisma/
└── schema.prisma          # Database schema
```

## Development

### Available Scripts

-   `npm run dev` - Start development server with Turbopack
-   `npm run build` - Build for production
-   `npm run start` - Start production server
-   `npm run lint` - Run ESLint
-   `npm run seed:demo` - Create demo user with sample data
-   `npx prisma studio` - Open Prisma Studio for database management

### VS Code Tasks

The project includes VS Code tasks for common operations:

-   **Start Development Server** - Runs `npm run dev` in the background

## Database Management

Use Prisma Studio to manage your database:

```bash
npx prisma studio
```

To reset the database:

```bash
npx prisma db push --force-reset
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please create an issue in the repository.
