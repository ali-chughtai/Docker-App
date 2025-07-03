# User Management CRUD Application

This is a [Next.js](https://nextjs.org) project with MongoDB integration that provides a complete CRUD (Create, Read, Update, Delete) interface for user management.

## Features

- ✅ Create new users with name, email, and age
- ✅ View all users in a responsive list
- ✅ Update existing user information
- ✅ Delete users with confirmation
- ✅ Form validation and error handling
- ✅ Real-time updates without page refresh
- ✅ Responsive design with Tailwind CSS

## Prerequisites

Before running this application, make sure you have:

- Node.js (version 14 or higher)
- MongoDB installed locally OR a MongoDB Atlas account
- npm, yarn, pnpm, or bun package manager

## Setup Instructions

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up MongoDB:**

   **Option A: Local MongoDB**
   - Install MongoDB on your machine
   - Start MongoDB service
   - The default connection string `mongodb://localhost:27017/crud-app` will work

   **Option B: MongoDB Atlas (Cloud)**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string
   - Replace the MONGODB_URI in `.env.local`

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and update the MONGODB_URI if needed.

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open the application:**
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Endpoints

The application provides the following REST API endpoints:

- `GET /api/users` - Fetch all users
- `POST /api/users` - Create a new user
- `GET /api/users/[id]` - Fetch a specific user
- `PUT /api/users/[id]` - Update a specific user
- `DELETE /api/users/[id]` - Delete a specific user

## Project Structure

```
src/
├── app/
│   ├── api/users/          # API routes for user operations
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page with UserManager
├── components/
│   ├── UserForm.tsx        # Form component for creating/editing users
│   ├── UserList.tsx        # Component for displaying users
│   └── UserManager.tsx     # Main component that orchestrates CRUD operations
├── lib/
│   └── mongodb.ts          # MongoDB connection utility
└── models/
    └── User.ts             # Mongoose user model and schema
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
