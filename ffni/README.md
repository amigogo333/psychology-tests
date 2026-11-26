# FFNI full-length review build

## Scope

148 original English items, matched Traditional Chinese draft, original item order and 1–5 response format. Not a validated Taiwanese Chinese translation. Original copyright retained in items.js. Author lab's permission statement: https://personality-studies.franklinresearch.uga.edu/assessments

The original 16-item entry can hand off its answers via sessionStorage. FFNI progress and optional background stay in the tab while answering. If the configured receiver is accepting responses, the participant can submit on the last page after reviewing the research notice. The optional invitation email is sent with that submission and saved in a separate sheet. It is excluded from browser storage and personal downloads. See [receiver setup](../integrations/google-sheets/README.md).

## Results

Original UGA facet sums and group sums are retained; UI averages use contributing item counts (not equal facet weights). There are 148 items, 15 facets, 32 reverse items. Thrill-Seeking and Distrust each contain 9 items, other facets contain 10. Vulnerable contains 39, Grandiose 109, Antagonism 78, Extraversion 40, Neuroticism 30. Indifference is re-reversed for Neuroticism. No percentiles, diagnostic categories or normative cutoffs. Descriptive text is custom educational content, not an individual clinical interpretation.

## Verification

Run `node ffni/scoring.test.mjs`. Reference vectors are independently calculated from the original scoring sheet. Inspect the entire UI at desktop and mobile widths. Check the original 16-item flow, demographic skip, no-platform branch, 3-purpose limit, missing-answer navigation, resume, results, export and clear.

## Collection and review

The questionnaire displays a receipt only after the receiver acknowledges the same study ID. Restoring a previous attempt or opening results never sends answers. An unconfirmed submission can be retried with the same ID. Clearing the tab removes only the device copy.

Confirm translation with bilingual review/back-translation and pilot validation before using scores for formal research. Additional instruments are required to measure online self-presentation, feedback need or social comparison directly.
