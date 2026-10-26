# AmCore next — local mockup copy

This folder is a local copy for the next version of the marketing site.
It is not the Herd site and it has no git remote.

- Do not edit `/Users/alexander/Herd/amcore`.
- Do not push. That app's GitHub is untouched.
- Preview: `php -S 127.0.0.1:8900 -t "/Users/alexander/Herd/Amcore website number 2"`

## Built

- `index.html` — homepage. Full-screen statement scroll, including screen 00.
- `operating-systems.html` — ordinary page. Two-column examples with screenshot placeholders.
- `trades.html`, `websites.html`, `how-we-work.html`, `about.html`, `faq.html`, `contact.html`
- `privacy.html` and `terms.html` — plain drafts. An attorney still has to review them.
- `site.css` — shared look for every page except the homepage scroll.
- Case studies stay unlinked. The contact form on this copy does not send a request.
- The local FAQ follows the MSA v6.1 answers, including QuickBooks as the accounting system of record. Those terms come from the Batsons agreement and still need a check against the standard MSA for new clients. No prices are on the page.

## The page pattern

The homepage is its own page. Inner pages share the look and behave like a normal website.

Shared tokens:

- Fog field (`#e4e7ee`), ink `#1b2433`, muted `#4d5968`.
- Bricolage Grotesque.
- The same plain text header. Logo-red `#a6372f` booking buttons, hover `#d6453a`.
- A soft light behind the opening of a page. It does not chase the scroll.
- No invented prices, clients, stats, or testimonials.
- QuickBooks stays off until the open question in the Herd site's WHITEBOARD is answered.

Homepage only:

- Full-screen statement scroll, with snap.
- Screen numbers stay until a live deployment, then they come off.
- The light moves with the current screen.

Inner pages, starting with Operating Systems:

- Ordinary document scroll. No snap, no one-sentence screens, no screen numbers.
- A headline, then the page continues in the same view.
- Sections stack down the page. Open text, not icon cards.

## Pages

Inner pages are ordinary documents in the shared tokens. The homepage stays the statement scroll.

Case studies stay unlinked until a client approves a story.
