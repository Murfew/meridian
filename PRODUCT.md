# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Solo service providers — e.g. hair stylists, tutors, consultants, coaches — who need to publish their availability and let clients book open time slots. Their clients are a secondary audience who interact only with a booking flow and do not need an account of their own (unconfirmed whether that public booking surface is built yet — see Capabilities and Constraints).

## Product Purpose

Meridian lets a solo service provider set up their availability once (working hours, default appointment length, buffer time between bookings, timezone) and then share a link so clients can book an open slot without back-and-forth scheduling. Success means the provider can go from sign-up to a shareable, bookable calendar quickly, with sensible defaults doing most of the work.

## Positioning

This is a portfolio/demonstration project, not a commercially positioned product. There is no confirmed competitive differentiator versus tools like Calendly or Cal.com, and none should be invented or implied in copy, marketing surfaces, or comparisons. Where the project's purpose matters to a design decision, treat "demonstrates current, high-quality implementation practice" as part of the goal alongside the end-user experience.

## Operating Context

- Auth flow (built): sign up, verify email, sign in (by username or email), forgot/reset password.
- Dashboard (planned, not yet built): sections for Availability, Bookings, and Settings, reached via a sidebar; includes sign-out.
- Confirmed per-user scheduling fields already modeled server-side: `timezone`, `defaultDurationMinutes` (default 30), `bufferMinutes` (default 0), plus a free-text `description`.
- The client-facing booking surface (what an outside client actually sees/uses to book a slot) has not been discussed or built in this project yet — treat it as undecided, not as an existing feature.

## Capabilities and Constraints

- Auth is email/password plus a username plugin only — no social/OAuth sign-in.
- No middleware-based route protection; protected routes must call `requireUser()` (in `lib/auth-guard.ts`) themselves.
- Booking-page mechanics (how a client picks a slot, confirms, gets reminded, cancels/reschedules) are undecided product facts, not yet designed or built.

## Brand Commitments

- Name: Meridian. Domain: meridianbooking.com.
- Indigo has been the consistent accent color across the existing auth pages, but this is implementation history, not a locked brand commitment — it's an open question for the upcoming visual-world decision, not something future design work must preserve.

## Evidence on Hand

- No real customer names, testimonials, case studies, or business content exist. The sign-up form's placeholder text ("Jane Doe Hair Salon") is illustrative UI copy only — future design/content work must not treat it as a real customer or fabricate similar-sounding ones.

## Product Principles

- Setup should be fast enough that a solo provider finishes it in one sitting — favor sensible defaults (e.g. 30-minute default duration) over asking for every detail up front.
- The client-facing booking step (once built) must require no account and minimal friction — the provider did the setup work so their clients don't have to.
- Because this is a portfolio project, the visible quality of the implementation itself is part of the goal, not just the end-user experience.
- The product represents someone's livelihood/time being scheduled — the tone and craft should read as professional and trustworthy, not playful or throwaway.
