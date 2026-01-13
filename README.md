# DentaCare Pro

live link 🔗: https://dentacarepro.netlify.app/

Premium multi-page landing site for a modern dental clinic. Includes hero, gallery, service highlights, pricing, FAQs, and dedicated About/Services/Contact pages with light interactivity.


## Features
- Animated hero with floating card, stats, and CTA buttons
- Responsive navigation with mobile hamburger menu
- AI image gallery, embedded YouTube clinic tour, and feature highlights
- Pricing plans, FAQs, and service call-to-action buttons
- About page with differentiators and badges; Services page with cards; Contact page with info + demo form
- Scroll-triggered animations via Intersection Observer

## Pages
- Home: Hero, gallery, video tour, featured services, pricing, FAQs
- About: Clinic story, value props, badges, mission CTA
- Services: Grid of primary treatments with CTA buttons
- Contact: Clinic details, quick call button, demo contact form

## Tech Stack
- HTML5, CSS3, vanilla JavaScript
- Google Fonts (Poppins)
- YouTube embed for the clinic tour

## Getting Started
1) Clone or download this repository.
2) Open `index.html` directly in a browser **or** serve the folder locally (recommended for correct routing of relative assets):
   - Python: `python -m http.server 8000`
   - Node (serve): `npx serve .`
3) Visit `http://localhost:8000` (or the URL shown in your server output).

## Project Structure
- `index.html` – Home page
- `about.html` – About page
- `services.html` – Services page
- `contact.html` – Contact page
- `style.css` – Global styles, layout, and responsive rules
- `script.js` – Animations, mobile menu toggle, FAQ toggle, and demo alerts
- `images/` – AI-generated clinic imagery used across pages

## Behavior Notes
- Contact form and CTA buttons use demo alerts only; no backend submission is wired.
- Mobile nav toggles with the hamburger icon; `.nav-links.show-menu` controls visibility.
- Animations appear as elements enter the viewport (Intersection Observer, threshold 0.2).

## Customization
- Update clinic name/logo text in the nav bars across pages.
- Swap accent colors (`#42d2ff`, `#7b2cff`) or gradients in `style.css`.
- Replace images in `images/` while keeping aspect ratios for layout stability.
- Swap the YouTube video URL in the iframe on `index.html`.
- Wire the contact form to your backend or service (e.g., Netlify Forms, Formspree) instead of alerts.

## License
No license file is included. Add one (e.g., MIT) if you plan to share or deploy publicly.
