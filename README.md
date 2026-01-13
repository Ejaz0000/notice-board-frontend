# Notice Board Frontend

Frontend for the Notice Board application - an employee notice management system where users can view, create, and manage notices.

## Tech Stack

- Next.js 15.5.9 (Turbopack)
- React 19.1.0
- Tailwind CSS 4
- Axios
- Lucide React

## Installation

Clone the repo and install dependencies:

```bash
git clone <repository-url>
cd notice-list-frontend
npm install
```

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Environment Variables

`NEXT_PUBLIC_API_BASE_URL` - Backend API base URL (defaults to `http://localhost:5000`)

## API Base URL

- Dev: `http://localhost:5000`
- Prod: `https://notice-board-backend-sigma.vercel.app`
