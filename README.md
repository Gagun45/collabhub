# CollabHub - a modern Next.js web app for team collaboration and project management

# This project was created as a **capstone** to demonstrate a complete, production-ready workflow — including **authentication**, **file uploads**, **real-time updates**, **state management**, and a clean, modern **UI design system**

# Project is being deployed and can be accessed via link: https://collabhub-blush.vercel.app/

## Features

### User Management

    - Secure authrntication with **Google Account**
    - Personal dashboard with **profile editing**
    - Upload and update **avatar images** via Cloudinary
    - Persistent user data stored in PostgreSQL Database

### Team management

    - Create, join and manage multiple teams
    - Role-based access for members (superadmin, admin, user)

### Projects & Tasks

    - Each team can create **multiple projects**
    - Every project supports **custom columns**
    - **Drag & drop** tasks between columns or sort columns within a project
    - Automatic server synchronization with server actions
    - Optimistic updates for a snappy experience

## Tech Stack

    **Frontend** - Next.js 15, Typescript, RTK Query
    **Backend** - Next.js server actions, Prisma
    **UI** - ReUI, Tailwindcss, Framer Motion, dnd-kit
    **Auth** - next-auth (Google Login)
    **State** - React Redux
    **Media** - Cloudinary for file storage
    **Validation** - Zod
