# FitPulse 💪
### AI-Powered Fitness & Wellness App

> A full-stack fitness app with AI recommendations, smart meal coaching, vitals tracking, and wearable sync — built for mobile with Capacitor.

[![TypeScript](https://img.shields.io/badge/TypeScript-95%25-3178C6?logo=typescript)](https://typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)](https://supabase.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-Mobile-119EFF?logo=capacitor)](https://capacitorjs.com/)
[![React](https://img.shields.io/badge/React-UI-61DAFB?logo=react)](https://reactjs.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-Styling-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

---

## Overview

FitPulse is a cross-platform fitness and wellness application built with React, Supabase, and Capacitor. It combines AI-powered workout recommendations, smart meal coaching, vitals tracking, and real-time wearable sync into a single mobile-first experience — available on both Android and iOS.

---

## Features

### 🏠 Home Tab
- Daily summary — calories burned, workouts completed, vitals trends
- AI-generated motivational tips and adaptive goal cards
- Push reminders for workouts, hydration, and meals
- Streaks and achievement highlights

### 💪 Workout Plans Tab
- View, create, and edit personal or AI-generated workout plans
- Plan types: Strength, HIIT, Yoga, Endurance, and more
- Auto-log exercises with progress sync to Supabase
- Short clip upload for AI-powered form analysis

### 🍽️ Diet Tab
- Nutritionix / MyFitnessPal API integration
- AI meal recognition — photo to macro breakdown
- Smart food suggestions based on daily nutrition targets
- Visual comparison of intake vs. nutrition goals

### 📊 Tracking Tab
- Log and visualise key metrics: weight, body fat %, BP, heart rate, sleep
- Week / month / year trend charts (Recharts / Chart.js)
- Wearable sync: Fitbit, Google Fit, Apple Health
- AI-powered insights ("Your average sleep improved by 12% this month")
- Export or share progress reports

---

## AI Features

- **Workout Recommender** — Personalised plans based on history, vitals, and progress
- **Form Correction** — Computer vision posture analysis with real-time tips
- **Smart Meal Coach** — Macro-balancing meal suggestions throughout the day
- **Trend Analyzer** — Identifies performance patterns and plateaus
- **Motivational Engine** — Adaptive goals and AI-generated quotes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Styling | Tailwind CSS |
| Backend | Supabase (Postgres + Auth + Edge Functions) |
| Mobile | Capacitor (Android + iOS) |
| Charts | Recharts / Chart.js |
| AI | Gemini Models via Supabase Edge Functions |
| Notifications | Capacitor Push API |
| Offline | IndexedDB / SQLite |

---

## Database Schema

    users               → id, name, email, age, gender, height, weight
    workout_plans       → id, user_id, plan_name, duration, difficulty, schedule (JSON)
    exercise_logs       → id, user_id, workout_plan_id, exercise_name, sets, reps, weight, duration
    goals               → id, user_id, goal_type, target_value, current_value, progress, deadline
    achievements        → id, user_id, badge_name, description, points, achieved_at
    meals               → id, user_id, name, calories, protein, carbs, fats, logged_at
    nutrition_goals     → id, user_id, daily_calories_target, protein_target, carb_target, fat_target
    vitals_logs         → id, user_id, weight, body_fat, heart_rate, blood_pressure, sleep_hours
    device_sync         → id, user_id, source, last_synced_at, data_summary (JSON)

---

## API Integrations

- **Fitness Trackers** — Fitbit, Apple Health, Google Fit
- **Nutrition** — MyFitnessPal / Nutritionix
- **Notifications** — Capacitor Push API
- **Weather (optional)** — Outdoor vs. indoor workout suggestions

---

## Getting Started

    git clone https://github.com/archiee04/kinetic-mind-hub.git
    cd kinetic-mind-hub
    npm install

Add your environment variables in `.env`:

    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

Run in browser:

    npm run dev

Build for mobile:

    npm run build
    npx cap sync
    npx cap open android

---

## Project Structure

    kinetic-mind-hub/
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── pages/            # Home, Workout, Diet, Tracking tabs
    │   ├── lib/              # Supabase client, API helpers
    │   └── hooks/            # Custom React hooks
    ├── supabase/
    │   ├── migrations/       # DB schema
    │   └── functions/        # Edge functions (AI, wearable sync)
    ├── public/
    ├── capacitor.config.ts
    └── README.md

---

## Author

**Archie Srivastava** — [LinkedIn](https://linkedin.com/in/archie-srivastava-36b81835b) · [Email](mailto:archie.srivastava04@gmail.com)  
Thapar Institute of Engineering & Technology, Patiala
