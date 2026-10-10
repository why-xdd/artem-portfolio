# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A recruiter or hiring manager at a Russian big-tech company, screening candidates
for a backend or ML internship. They arrive from a link in Artem's CV or from his
GitHub profile, they have about a minute, and thirty other tabs are open behind
this one. They read English fluently — the site is English-only by decision, and
in Russian tech hiring that reads as confidence rather than as a barrier.

A second, smaller audience is other engineers who follow a link from the GitHub
profile and want to see what the work actually looks like.

## Product Purpose

A personal portfolio site for Artem (`why-xdd`), a CS student in Moscow looking
for a backend or ML internship.

Success is one thing only: **the visitor writes to him.** Everything on the page
exists to make that email likelier — not to accumulate impressions, followers, or
time on page. A visit that ends in a closed tab with no message is a failure even
if the visitor enjoyed the animation.

## Positioning

Every claim on this site can be opened and checked in under a minute. Seven of the
projects are public repositories with tests, green CI, and screenshots of their
real output; one of them is a live application anyone can drive. That is the
thing a neighbouring student portfolio cannot truthfully copy — not the stack
list, which everyone has, but the fact that the evidence is one click away and
holds up when clicked.

The counterpart to this is a hard rule: the site never asserts something it
cannot show.

## Operating Context

- Opened on a desktop browser during a screening pass, and on a phone when a
  recruiter forwards the link to a colleague. Both are primary.
- Read alongside the CV and the GitHub profile, not instead of them.
  `github.com/why-xdd` is the parallel artifact and is currently the stronger of
  the two; the site must at minimum not contradict it.
- The visitor is skimming, not studying. They are looking for a reason to keep
  reading and a reason to stop.

## Capabilities and Constraints

**The work the site presents (ten items, all confirmed):**

| Work | Status | Code |
|---|---|---|
| inferkit | public, 53 tests, CI green | github.com/why-xdd/inferkit |
| voicedata | public, 48 tests, CI green | github.com/why-xdd/voicedata |
| askdocs | public, 29 tests, CI green | github.com/why-xdd/askdocs |
| slowq | public, 35 tests, CI green | github.com/why-xdd/slowq |
| botkit | public, 24 tests, CI green | github.com/why-xdd/botkit |
| queueviz | public, 40 tests, **live at queueviz.vercel.app** | github.com/why-xdd/queueviz |
| VoxShift | public | github.com/why-xdd/voxshift |
| FriendCards | private, in production with live users | no public link |
| Sorting Center | private hackathon submission, delivered 2 Aug 2026 | no public link |
| post-office-twin | public, 376 tests, CI green; **finalist of PostCode Challenge 2026** (Russian Post, Pochtatech × Innopolis University), final on 8 Oct 2026; no hosted demo by decision | github.com/why-xdd/post-office-twin |

- **Private work is named, never linked and never source-quoted.** FriendCards
  and the Sorting Center model live in private repositories. They appear because
  they are real and load-bearing, not with a repository button that 404s.
- **Sorting Center is finished, not in progress.** The hackathon deadline was
  2 Aug 2026 and the submission was delivered. The current site says "In
  progress"; that is stale copy, not a fact.
- **No third-party assets.** Every image is generated locally into `public/gen`
  or derived from Artem's own photo. Nothing is hotlinked, no stock, no HDRI.
  This is an existing project rule and it stays.
- **Motion respects `prefers-reduced-motion`.** The codebase already honours it
  via `useReducedMotion`; any new motion must too.
- The site is not deployed and the repository has no remote. Deployment target
  is Vercel, matching queueviz.
- Not established, and not to be invented: FriendCards user counts, employer
  names, testimonials, availability dates, salary expectations.

## Brand Commitments

- Name: **Artem**. Handle: **why-xdd**. Contact: why.not.live.alone@gmail.com.
- **The hero 3D avatar must be a stylized character avatar** — the kind Telegram
  and Snapchat produce — not a photogrammetry-style likeness. The current
  `src/assets/avatar.glb`, derived from a photograph, is explicitly rejected by
  Artem and is an anti-reference. Recorded as given; the visual treatment around
  it is not decided here.
- Voice, as established across the GitHub profile and the six READMEs: direct,
  specific, numbers over adjectives, willing to name its own bugs. No hype, no
  "passionate about technology".

## Evidence on Hand

Real, on disk or live, with paths:

- Nine 2x screenshots of real tool output at `C:\vibecode\why-xdd\assets\shot-*.png`,
  plus a 920 px recording of queueviz at `assets/queueviz-demo.gif` and a still at
  `assets/queueviz-still.png`. These are captures of the programs running, not
  renders.
- Six drawn project cards at `C:\vibecode\why-xdd\assets\card-*.svg`.
- The live application: <https://queueviz.vercel.app>.
- Measured numbers that can be re-derived by anyone: 229 tests across the six
  repositories; inferkit 214 → 3 579 req/s with batching, p99 304 ms → 21 ms;
  askdocs hybrid retrieval recall 94% at MRR 0.809; queueviz 8.5 kB gzipped with
  zero runtime dependencies.
- Artem's own photograph at `src/assets/portrait.jpg` and its cut-out.
- Locally generated imagery in `public/gen/` (27 renders via Pollinations).

Absent, and not to be fabricated: client work, testimonials, press, company
logos, download counts, GitHub stars.

## Product Principles

1. **Show, then claim.** A number, a screenshot, or a live link earns a sentence;
   a sentence alone earns nothing.
2. **One outcome.** Every section is answerable to "does this make the email
   likelier?" If it does not, it is decoration and it is cut.
3. **A minute is the budget.** The visitor must be able to leave at any scroll
   depth already knowing what Artem does and how to reach him.
4. **Never outrun the evidence.** Private work is named without being linked;
   unknown facts stay unstated rather than being rounded up.
5. **The site must not be weaker than the GitHub profile.** They are read
   together, and the profile currently sets the bar.

## Accessibility & Inclusion

No product-specific standard was established. Two constraints are confirmed from
the existing implementation and carry forward: motion honours
`prefers-reduced-motion`, and the site must be usable on a phone, because
forwarding the link to a colleague is a real part of the screening workflow.
