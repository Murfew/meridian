---
name: Meridian
description: A dark-first, restrained scheduling app shell — near-black neutrals with one indigo accent, in Geist.
colors:
  ground-near-black:
    dark: "oklch(0.145 0 0)"
    light: "oklch(1 0 0)"
  ink-near-white:
    dark: "oklch(0.985 0 0)"
    light: "oklch(0.145 0 0)"
  surface-card:
    dark: "oklch(0.205 0 0)"
    light: "oklch(1 0 0)"
  indigo-accent:
    dark: "oklch(0.585 0.233 277.117)"
    light: "oklch(0.511 0.262 276.966)"
  accent-foreground: "oklch(0.985 0 0)"
  ink-muted:
    dark: "oklch(0.708 0 0)"
    light: "oklch(0.556 0 0)"
  hairline-border:
    dark: "oklch(1 0 0 / 10%)"
    light: "oklch(0.922 0 0)"
  signal-destructive:
    dark: "oklch(0.704 0.191 22.216)"
    light: "oklch(0.577 0.245 27.325)"
typography:
  heading:
    fontFamily: "Geist, Geist Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontFamily: "Geist, Geist Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  control: "0.625rem"
  card: "0.875rem"
  badge: "9999px"
spacing:
  tight: "0.25rem"
  field-group: "1rem"
  section: "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.indigo-accent}"
    textColor: "{colors.accent-foreground}"
    rounded: "{rounded.control}"
    padding: "0 0.625rem"
    height: "2rem"
  button-primary-hover:
    backgroundColor: "{colors.indigo-accent}"
  card:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.card}"
    padding: "1.5rem"
---

# Design System: Meridian

## Overview

**Creative North Star: "The Editor's Console"**

Meridian's interface reads like the tools its own audience already trusts to get work done quietly — Vercel's dashboard, Linear's issue tracker: a near-black working surface, one restrained indigo accent spent only where a decision happens, and nothing else asking for attention. This is a deliberate standing exit, not a rolled concept: the brief pinned "modern, minimal, like Vercel or Linear" directly, and the system commits to that canon at full fidelity rather than softening or ironizing it.

The system is dark-first because its primary surface is an admin/setup task — a solo provider configuring their availability, often around client hours — and both reference products default their working surfaces to dark for exactly that reason. Light mode exists and is fully themed, reached by an explicit toggle, never assumed as the visitor's preference.

**Key Characteristics:**
- One accent, spent only on primary actions, links, and focus rings — never decorative
- Elevation is declared once, as a hairline ring/border, never a shadow
- Every screen is a single centered card; no competing visual regions
- Type is a workhorse face (Geist) at two roles only: heading and body

## Colors

Two neutrals plus one accent, in the Restrained strategy — the default for a surface the visitor came to operate, not to be persuaded by.

### Primary
- **Indigo Accent** (`oklch(0.511 0.262 276.966)` light / `oklch(0.585 0.233 277.117)` dark): the only saturated color in the system. Used exclusively for primary buttons, text links, focus rings, and the default status-icon badge. The accent lightens in dark mode for contrast against the near-black ground — the same value would read muddy on `ground-near-black`.

### Neutral
- **Ground Near-Black / White** (`oklch(0.145 0 0)` dark / `oklch(1 0 0)` light): the page field.
- **Ink Near-White / Near-Black** (`oklch(0.985 0 0)` dark / `oklch(0.145 0 0)` light): body and heading text.
- **Surface Card** (`oklch(0.205 0 0)` dark / `oklch(1 0 0)` light): the one card surface every screen is built from.
- **Ink Muted** (`oklch(0.708 0 0)` dark / `oklch(0.556 0 0)` light): subtitles, placeholders, secondary copy.
- **Hairline Border** (`oklch(1 0 0 / 10%)` dark / `oklch(0.922 0 0)` light): the card's and every input's single elevation device.

### Named Rules
**The One Accent Rule.** Indigo appears only on the element the visitor is meant to act on (a primary button, a link, a focused input's ring) or the one badge signaling a positive outcome. It never fills a background region or decorates a static element.

## Typography

**Body/Heading Font:** Geist, with `Geist Fallback, ui-sans-serif, system-ui, sans-serif` as fallback — a workhorse system-style face, chosen deliberately for an Operate-mode surface rather than a face with a point of view.

**Character:** Quiet and legible; the type carries no personality of its own so the layout and the accent color do the work.

### Hierarchy
- **Heading** (500 weight, 1.5rem, 1.3 line-height): the one line naming what this screen is for ("Welcome back," "Create an account").
- **Body** (400 weight, 0.875rem, 1.5 line-height): subtitles, field labels, button labels, and helper text.

## Layout

Every screen is a single flex-centered column filling the viewport, holding one card (420px for single-purpose forms, 600px for the sign-up form's two-column name row). There is no secondary content region, sidebar, or footer on these screens — the task is the whole page. Field spacing runs a three-tier rhythm: a 0.25rem gap between a label and its paired helper link, ~1rem between fields inside a group, and 1.5rem between the title block, the field group, and the action block.

## Elevation & Depth

Flat, bordered — never shadowed. The card and every input declare their edge once, as a hairline ring (`ring-1 ring-foreground/10` on the card; a 1px `border-input` on inputs), and nothing in the system layers a second depth cue on top of it.

### Named Rules
**The Single Edge Rule.** An element gets a border or a ring, never both, and never a shadow in addition. Depth is implied by the near-black/card contrast, not by a shadow system.

## Shapes

Corners are soft but tight: inputs and buttons round at `0.625rem`, cards at `0.875rem`. The one exception is the circular status-icon badge (forgot-password, reset-password, verify-email), fully rounded to signal "state," distinct from every rectangular control on the page.

## Components

### Buttons
- **Shape:** `0.625rem` radius, `2rem` height at default size.
- **Primary:** indigo background, near-white text — reserved for the one action a screen wants taken (Sign in, Create account, Reset password).
- **Outline / Ghost / Link:** neutral border or no border, used for every secondary action (verify-email's resend, all "back to sign in" links) so the primary accent never has to compete with a second colored control on the same screen.
- **Loading:** a spinner replaces no other content; the button label stays visible beside it, and the button disables for the duration (`LoadingButton` in `components/loading-button.tsx`).

### Cards
- **Corner Style:** `0.875rem`.
- **Background:** `surface-card`.
- **Elevation:** hairline ring only, no shadow.
- **Internal Padding:** `1.5rem`.

### Inputs / Fields
- **Style:** hairline border, transparent fill, `0.625rem` radius.
- **Focus:** the border and a 3px ring both shift to the indigo accent.
- **Error:** the border and ring shift to the destructive red; the message renders directly beneath the field (`components/ui/field.tsx`'s `FieldError`).
- **Password fields:** a visibility toggle (eye icon) sits inside the field's trailing edge (`components/ui/password-input.tsx`) — the one control that lives inside an input rather than beside it.

### Status Icon Badge
A circular, fully-rounded badge (`components/status-icon-badge.tsx`) pairing a Lucide icon with a tinted background: indigo for an informational state (an email was sent), a muted green for a completed one (password successfully reset). It is the only place in the system a second color appears, and it appears only inside this one component.

## Do's and Don'ts

### Do:
- **Do** spend the indigo accent only on the primary action, links, focus rings, and the default status badge.
- **Do** declare elevation with exactly one device — a ring or a border, never a shadow.
- **Do** keep every screen to a single centered card; resist adding a second visual region.

### Don't:
- **Don't** introduce a second saturated accent color outside the status badge's success variant.
- **Don't** add a shadow to a card or control that already carries a border/ring.
- **Don't** reach for a display/personality typeface — this system's type is deliberately a workhorse face.
