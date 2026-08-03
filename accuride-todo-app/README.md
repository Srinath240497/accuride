This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

--------------------------------------------------------------------------------------------------------------------------------------------

## Next.js Event Calendar & Todo Management System

A responsive Event Calendar web application built with Next.js 14 (App Router), NextAuth.js, React Big Calendar, and Hygraph (GraphQL CMS). 

The application provides user authentication, individual user event isolation, real-time optimistic UI updates.

--------------------------------------------------------------------------------------------------------------------------------------------

## Features

User Authenticated: Multi-user support with NextAuth session management. Each user's calendar data and todo items are strictly isolated and queried securely via Hygraph GraphQL filters.

Optimistic UI Updates: Instant calendar reflections on Event Create, Edit, and Delete operations without UI lag.

Interactive Calendar View: Powered by `react-big-calendar` with dynamic Month, Week, Day, and Agenda view modes, date navigation, and direct slot-click event creation.

Accessible Modal System: Overlay event popup engineered using React Portals (`createPortal`) to guarantee robust z-index stacking and full-viewport access over complex calendar layouts.

Modern Tailwind Styling: Clean, accessible UI components styled with Tailwind CSS.


--------------------------------------------------------------------------------------------------------------------------------------------


## Tech Stack

- Framework: Next.js 14 (App Router)
- Authentication: NextAuth.js
- GraphQL Client: `graphql-request`
- Headless CMS / Database: Hygraph (GraphCMS)
- Calendar UI: `react-big-calendar`, `moment.js`
- Styling: Tailwind CSS
- State Management: React Hooks (`useState`, `useEffect`, `useSession`, React Portals)


--------------------------------------------------------------------------------------------------------------------------------------------


## Demo Login Details

For testing data isolation between users, log in with the following demo credentials:

| Account | Username          | Password | User ID |
| User 1  | user1@example.com | Test@123 | 1       |
| User 2  | user2@example.com | Test@123 | 2       |

Note: Events created while logged in as `user1@example.com` will not be visible when logged in as `user2@example.com`.