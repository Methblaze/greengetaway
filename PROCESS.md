# How I redesigned GreenGetaway

GreenGetaway started in 2023 as a group project for the ITU course Programming Mobile Applications, where my part was the eco score list and the Leaderboard. In 2026 I came back to it on my own to audit it, redesign it and put both versions online side by side. This file is how I went about it, the decisions I made along the way and what I would still do. The finished case is in [`case/greengetaway-case.md`](case/greengetaway-case.md).

## The brief I set myself

- **A refresh, not a rebrand.** The same five tabs, the same 13 attractions and the same eco scores, so the comparison is fair. What changes is how the app explains and records things.
- **Keep 2023 untouched.** The original web build stays online exactly as it was, so the portfolio can show 2023 and 2026 together.
- **Every change has a reason.** Each one is written as problem, change and why, in the commit history as well as in the case.
- **British English, and accessible by measurement.** Contrast is checked against WCAG 2.2 with real numbers rather than by eye.

## How I worked

1. **Freeze the baseline first.** Before touching anything, I tagged the 2023 state (`v2023-web`) and moved the 2023 web build into its own folder. I changed the build script so it can never overwrite that folder, and added a check that compares it with the tag.
2. **Audit with evidence.** I went through the 2023 app screen by screen and measured every text and colour pair. The worst was the pink Add button at 1.58:1. I wrote down eight problems before designing anything.
3. **Tokens and data before screens.** One file for colours, spacing, type and radius, with every colour contrast-checked. One data file for the 13 attractions, so the screens could no longer disagree about names or scores.
4. **One screen at a time, with checkpoints.** Home, Map, Log a visit, Ranking, Profile and sign-in, in that order. After each one I compared screenshots of 2023 and 2026 at 390 by 844 and approved the screen before moving on.
5. **Verify, then review twice.** The full journey was run in both versions with an automated contrast scan and keyboard tests. Then I reviewed the work against Vercel's React best-practices rules and against the UI/UX Pro Max guidelines, and fixed what they found.
6. **Make the comparison part of the product.** A compare page shows both apps in one phone frame with a 2023 and 2026 switch that wipes across like a windscreen wiper.

## Decisions and trade-offs

- **Explain the scores, do not recalculate them.** The eco scores are the 2023 group's approximations, built from available data and logical reasoning. Rather than invent a new method, the app now shows each score as colour, number and band, and says plainly how the scores were made.
- **One exception to "untouched".** In 2026 the map tile provider started requiring an API key, which left the 2023 map blank. I swapped its two tile URLs for keyless ones, because a blank map would have judged 2023 on something that had nothing to do with its design. A script proves nothing else in the 2023 build changed.
- **Stacked picks instead of a sideways row.** Home first showed the greenest places as a horizontal row, but testing in a desktop browser showed that a mouse cannot drag-scroll it, so the third pick was out of reach.
- **Overlapping pins.** At the zoom that fits all 13 places, the city-centre pins overlap. I kept the overview and chose the stacking order on purpose: red over amber over green, so the places worth avoiding stay visible, and the higher score on top within a band, so the best place in a cluster is the one you can tap.
- **Where logout lives.** The audit moved Logout out of every header. On review I brought it back as a quiet icon on the main screens, plus a clear button on Profile, so leaving does not mean a trip to Profile first.
- **Correcting my own notes.** The audit notes had the wrong Logout colour and said the 2023 web detail card had no photos. Checking against the code put both right before they reached the case.

## What I checked

- Both versions, start to finish, at 390 by 844: log in, map, pin, detail, log a visit with a photo, profile, ranking. No errors from the app's own code.
- 153 visible text elements across nine screens and sheets: no contrast failures.
- Keyboard: map pins open with Enter, sheets trap focus and close with Escape, and focus returns to where it was.
- Performance: the JavaScript bundle went from 1,704 KB to 1,392 KB, and the photos on the ranking from 6.8 MB to 1.86 MB.

The full results are in [`case/verification.md`](case/verification.md).

## What I would do next

- **Test the native app on a phone.** It builds for iOS and Android, but it has only been run in the browser.
- **Keep visits between sessions.** Visits live in memory for now, as they did in 2023.
- **Own the photos.** The attraction photos are hotlinked from other sites, and five of the 2023 links had died by 2026. Licensed or self-taken photos would be more reliable.
- **Revisit the scoring.** A documented method with sources per attraction would make the eco score something people could check, not only read.

## Tools

React Native and Expo SDK 49, with a browser build for the portfolio. Leaflet with OpenStreetMap and Esri tiles for the web map. DM Sans for type. Headless Microsoft Edge with Playwright for the screenshots and checks. I worked with Claude Code as an implementation partner: I set the brief, made the design decisions at each checkpoint and reviewed every screen before it was committed.
