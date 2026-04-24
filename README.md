# EduGame AI

An AI-powered educational platform that bridges the communication gap between students and teachers, making learning interactive, personalized, and gamified. Built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

## Primary Goals
1. Bridge the communication gap between students and teachers.
2. Make learning interactive, personalized, and gamified.
3. Provide accurate academic answers, summaries, quizzes, and feedback using AI.

## User Roles

### Student Capabilities
- **Doubt Solver:** Answer academic doubts with accurate step-by-step explanations.
- **AI Summarizer:** Summarize notes, lectures, and PDFs into key points, flashcards, and quick quiz questions.
- **Quiz Arena:** Generate quizzes based on any topic and provide explanations.
- **Study Planner:** Help with assignments by explaining concepts.
- **Explain My Mistake (Unique Feature):** Upload a wrong answer and the AI will explain the mistake, how to correct it, provide a correct solution, and give 1-3 similar practice questions.

### Teacher Capabilities
- **Quiz Generator:** Create quizzes with difficulty levels, marks, and explanations.
- **Assignments:** Help create assignments and use AI to evaluate them and assign marks with feedback.
- **Analytics:** Analyze class and student performance based on provided data.
- **AI Lesson Planner (Unique Feature):** Generate detailed lesson plans including learning objectives, teaching activities, common mistakes, quick quiz questions, and suggested class flow.

## Tech Stack
- **Frontend:** React + TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend & Database:** Supabase (PostgreSQL, Edge Functions for AI, Storage)
- **Package Manager:** npm / bun

## ⚙️ Installation & Setup

### 1. Clone the repository
\\\ash
git clone https://github.com/Nitin-G-A/EduGame.git
cd EduGame
\\\

### 2. Install dependencies
\\\ash
npm install
# or
bun install
\\\

### 3. Setup Environment Variables
Create a \.env\ file in the root directory and add your Supabase credentials:
\\\env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
\\\

### 4. Start the development server
\\\ash
npm run dev
# or
bun run dev
\\\

## Available Scripts
- \
pm run dev\ - Start the Vite development server
- \
pm run build\ - Build the project for production
- \
pm run preview\ - Preview the production build locally
- \
pm run lint\ - Run ESLint

## Deployment
This app can be smoothly deployed to Vercel, Netlify, or any static hosting service.
- **Build command:** \
pm run build\
- **Publish directory:** \dist\

Make sure to add your Supabase environment variables in your hosting provider's dashboard.

## Contact
**Nitin G A**  
GitHub: [https://github.com/Nitin-G-A](https://github.com/Nitin-G-A)
