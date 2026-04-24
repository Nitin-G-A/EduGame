# EduGame AI

> An AI-powered educational platform that bridges the communication gap between students and teachers, making learning interactive, personalized, and gamified.

![React](https://img.shields.io/badge/React-TypeScript-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)

---

## Primary Goals

1. Bridge the communication gap between students and teachers.
2. Make learning interactive, personalized, and gamified.
3. Provide accurate academic answers, summaries, quizzes, and feedback using AI.

---

## User Roles

### Student Capabilities

| Feature | Description |
|---|---|
| **Doubt Solver** | Answer academic doubts with accurate step-by-step explanations. |
| **AI Summarizer** | Summarize notes, lectures, and PDFs into key points, flashcards, and quick quiz questions. |
| **Quiz Arena** | Generate quizzes based on any topic and provide explanations. |
| **Study Planner** | Help with assignments by explaining concepts. |
| **Explain My Mistake**  | Upload a wrong answer — AI explains the mistake, provides the correct solution, and gives 1–3 similar practice questions. |

### Teacher Capabilities

| Feature | Description |
|---|---|
| **Quiz Generator** | Create quizzes with difficulty levels, marks, and explanations. |
| **Assignments** | Create assignments and use AI to evaluate them with marks and feedback. |
| **Analytics** | Analyze class and student performance based on provided data. |
| **AI Lesson Planner**  | Generate detailed lesson plans including learning objectives, teaching activities, common mistakes, quick quiz questions, and suggested class flow. |


---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React + TypeScript, Vite, Tailwind CSS, shadcn/ui |
| **Backend & Database** | Supabase (PostgreSQL, Edge Functions, Storage) |
| **Package Manager** | npm / bun |

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Nitin-G-A/EduGame.git
cd EduGame
```

### 2. Install dependencies

```bash
npm install
# or
bun install
```

### 3. Configure environment variables

Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start the development server

```bash
npm run dev
# or
bun run dev
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the project for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Deployment

This app can be deployed to **Vercel**, **Netlify**, or any static hosting service.

- **Build command:** `npm run build`
- **Publish directory:** `dist`

> Make sure to add your Supabase environment variables in your hosting provider's dashboard.

---

## Contact

**Nitin G A**
GitHub: [https://github.com/Nitin-G-A](https://github.com/Nitin-G-A)