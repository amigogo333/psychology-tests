# FFNI full-length review build

## Scope

148 original English items, matched Traditional Chinese draft, original item order and 1–5 response format. Not a validated Taiwanese Chinese translation. Original copyright retained in items.js. Author lab's permission statement: https://personality-studies.franklinresearch.uga.edu/assessments

The original 16-item entry is preserved. A visitor-initiated link hands off the short answers via sessionStorage. FFNI progress and optional background are stored only in the same browser tab. Clear-data removes both datasets. Closing the tab normally clears sessionStorage (browser restore can retain it). Email stays in the DOM only and is excluded from storage and exports. No data is sent over the network, and there is no mail service.

## Results

Original UGA facet sums and group sums are retained; UI averages use contributing item counts (not equal facet weights). There are 148 items, 15 facets, 32 reverse items. Thrill-Seeking and Distrust each contain 9 items, other facets contain 10. Vulnerable contains 39, Grandiose 109, Antagonism 78, Extraversion 40, Neuroticism 30. Indifference is re-reversed for Neuroticism. No percentiles, diagnostic categories or normative cutoffs. Descriptive text is custom educational content, not an individual clinical interpretation.

## Verification

Run `node ffni/scoring.test.mjs`. Reference vectors are independently calculated from the original scoring sheet. Inspect the entire UI at desktop and mobile widths. Check the original 16-item flow, demographic skip, no-platform branch, 3-purpose limit, missing-answer navigation, resume, results, export and clear.

## Before research collection

This version is explicitly a non-collecting review build. Do not change the page to claim submissions until a protected server is deployed and tested. Do not use a public GitHub file, browser storage, or a client-visible admin token as a research database.

Implement a protected collection API with server validation, bounded payload size, rate limiting and encrypted transport. Keep responses and contact records in separate access-restricted tables keyed by a random study ID; export analyses without contact fields. Do not expose participant lookup/list/export without researcher authentication. Define deletion/retention, recruitment eligibility (including any minors), researcher contact and applicable research disclosure/consent before enabling collection. No confirmation checkbox is added to this review build because no research data is collected.

Confirm translation with bilingual review/back-translation and pilot validation before using scores for formal research. Do not replace the source item wording with the abbreviated facet summaries from earlier discussion. Additional instruments are required to measure online self-presentation, feedback need or social comparison directly.
