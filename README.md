You are a senior full-stack engineer.

Build a **Habit Challenge Web App** where users can create habits and set a goal for how many days they want to complete the habit (for example 30 days meditation challenge).

The app must be clean, minimal, and mobile-friendly.

---

# Product Concept

This is a **habit tracking app based on day challenges**.

Users create habits and define a target number of days.

Example challenges:

* Meditate for 30 days
* Read books for 60 days
* Exercise for 90 days

Users check in every day to track progress.

The app tracks:

* current progress
* streak
* days remaining
* completion rate

---

# Tech Stack

Use the following stack:

Frontend

* Next.js (App Router)
* React
* TailwindCSS
* Shadcn UI components

Backend

* Supabase

Database

* PostgreSQL

Authentication

* Supabase Auth (email login)

---

# Core Features

## 1. Authentication

Users can:

* sign up
* login
* logout

Each user only sees their own habits.

---

## 2. Create Habit Challenge

Users can create a new habit.

Fields:

* habit name
* description
* habit type
* target days (goal)
* icon
* color

Habit types:

* checkbox habit (done or not done)
* numeric habit (e.g. drink 8 glasses of water)
* time habit (e.g. study 60 minutes)

---

## 3. Daily Check-in

Users can mark a habit as completed for the day.

Example:

Today

☑ Meditate
☑ Read book
☐ Exercise

If completed, it records a log for that date.

---

## 4. Progress Tracking

Each habit shows:

Progress example:

Meditation Challenge

12 / 30 days completed

Remaining: 18 days

Display:

* progress bar
* percentage
* days remaining

---

## 5. Streak System

Calculate:

* current streak
* longest streak

Rules:

If user completes the habit on consecutive days → streak increases.

If a day is missed → streak resets.

---

## 6. Dashboard

The dashboard should show:

Today's Habits

Progress cards

Example card:

Meditation Challenge
12 / 30 days

Progress bar

Daily completion summary

Example:

Completed today
2 / 3 habits

---

## 7. Habit Detail Page

When clicking a habit:

Show:

* habit name
* goal days
* current progress
* streak
* completion calendar
* progress graph

---

## 8. Calendar View

Display a monthly calendar showing completion history.

Color legend:

Green → completed
Red → missed
Gray → no data

---

# Database Schema

Users

* id
* email
* created_at

Habits

* id
* user_id
* name
* description
* type
* target_days
* icon
* color
* created_at

Habit_logs

* id
* habit_id
* date
* value
* completed

---

# UI Requirements

Design style:

* minimal
* modern
* clean
* similar to Notion or Linear

Use cards and progress bars.

---

# Pages

Create these pages:

/login

/dashboard

/habits

/habits/new

/habits/[id]

---

# Dashboard Layout

Top section:

User avatar
Quick add habit button

Main section:

Today's habits list

Progress cards

Example card:

Meditation
12 / 30 days

---

# Habit Creation UI

Form fields:

Habit name

Habit type

Target days

Description

Save button

---

# Mobile Experience

The app must be optimized for mobile.

Daily habit check should be easy with one tap.

---

# Extra UX

When a user completes a challenge:

Show celebration message.

Example:

Congratulations 🎉
You completed the 30 Day Meditation Challenge.

---

# Output Requirements

Generate:

* complete Next.js project structure
* Supabase schema
* React components
* Tailwind styling
* basic API integration
* working habit tracking logic

The result should be a functional MVP habit challenge app.
