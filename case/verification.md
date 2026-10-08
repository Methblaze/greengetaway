# Verification before merge

Run on 7 October 2026 against the built site in `docs/`, in headless Microsoft Edge at 390 by 844 with a fake camera. Each item is from the brief's verification list.

## Full flow in both versions

| Step | 2023 (`docs/2023/`) | 2026 (`docs/app/`) |
| --- | --- | --- |
| Log in | Yes | Yes |
| Home or Overview | Overview shows | Home shows Greenest picks |
| Map | 13 pins | 13 score pins |
| Tap a pin | Detail card with "Go back" | Detail sheet with "Get directions" |
| Log a visit from the pin | Not possible, the card has no way to it | "Log a visit here" opens the form with the attraction chosen |
| Add a photo | Camera, then a loose photo list | Camera photo attached to the visit |
| See it in Profile | One entry, overwritten by the next | Saved as one visit with its photo: "1 visit, average eco score 99, low impact" |
| Leaderboard | 9 rows, 9 "See details" links | 13 ranked rows, no "See details" |
| Console errors from our own code | None | None |
| Errors from third-party photos | None | None, after dead photo URLs were removed (see below) |

## Contrast

Every visible text element was measured against the background behind it, using WCAG 2.2 (4.5:1 for normal text, 3:1 for large text). Disabled controls were left out, as WCAG allows.

| Screen | Text elements | Lowest ratio | Failures |
| --- | --- | --- | --- |
| Log in | 7 | 6.01 | 0 |
| Home | 27 | 5.02 | 0 |
| How eco score works | 11 | 5.02 | 0 |
| Map | 23 | 4.84 | 0 |
| Detail sheet | 7 | 5.96 | 0 |
| Log a visit | 18 | 5.40 | 0 |
| Your visits | 20 | 5.40 | 0 |
| Ranking | 38 | 5.40 | 0 |
| Compare control | 2 | 6.64 | 0 |

The 4.84 on the map is the map attribution line. Graphics were checked against the tokens by calculation: field borders 3.4:1 on white and 3.1:1 on the background, white on the band colours 6.4, 5.0 and 6.6:1, white on the centre button 6.6:1 (2023: 1.58:1).

## Keyboard

- A map pin can be reached with Tab and opened with Enter or Space.
- Focus stays inside the open sheet, Escape closes it, and focus returns to the pin.
- The compare control is the first Tab stop. Enter and Space switch version, and the change is announced.
- The hidden version in the compare frame is inert, so Tab never lands in it.

## The 2023 baseline

`node scripts/patch-2023-tiles.js --verify`: 50 files, 49 byte-identical to the `v2023-web` tag's `docs/app/`, and the app bundle differs only by the sanctioned tile swap (CARTO now requires an API key).

## Other checks

- `grep -r "AIza" docs/` returns nothing.
- The compare sweep takes 1.6 seconds, and is instant under reduced motion.
- The compare page fits the 420 by 900 embed without scrolling.
- iOS and Android bundles build with `npx expo export`. The native app has not been run on a device or simulator.

## After a React best-practices review

A review against Vercel's React best-practices rules found two oversized imports and a listener leak. After the fixes, every check above was run again with the same results.

| | Before | After |
| --- | --- | --- |
| JavaScript bundle | 1,704 KB | 1,400 KB |
| Files in `docs/app/` | 78 | 20 |
| Size of `docs/app/` | 9.6 MB | 2.5 MB |
| Icon sets shipped | 16 | 2 (Ionicons and Feather) |
| DM Sans files shipped | 18 | 3 |

The location context also stopped adding two event listeners on every render, a 2023 leak that grew every five seconds on a phone.

## After a UI/UX Pro Max review

A second review, against the UI/UX Pro Max skill's UX and React Native guidelines, led to five changes. Every check above was run again with the same results, and with no third-party photo errors left.

- **Photos.** The 13 photos on Ranking now weigh 1.86 MB with no failed requests. The first photos alone used to weigh 6.8 MB, including a 3.8 MB original for a 56 point thumbnail, and three of them no longer existed. Each list now starts with a photo that loads, uses a resized rendition where the host offers one, and drops dead URLs. Ranking renders its first six rows first.
- **Keyboard on phones.** Sheets rise with the on-screen keyboard on iOS, so the attraction search results stay visible, and a tap on a result chooses it at once. This is native behaviour and has not yet been tested on a device.
- **Hover.** Cards, rows and buttons give hover feedback on the web through colour only: on a card, the border went from #E2DBD2 to #848D86 with its size unchanged.
- **Wide screens.** Opened in a desktop window, the app is a centred 560 wide column, so the Home introduction runs about 64 characters a line instead of about 150. Sheets share the cap. Phones and the portfolio embed are unchanged.
- **One icon set.** The centre button uses Ionicons like every other icon, so the Feather font left the build. The bundle is now 1,392 KB, and `docs/app/` holds 18 files.
