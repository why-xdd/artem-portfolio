import type { TTColour } from './teletext/palette'

export type Status = 'LIVE' | 'SHIPPED' | 'PRIVATE'

export type Shot = {
  src: string
  alt: string
  caption: string
  /** Overrides the frame's source label where a still is not in the eight. */
  source?: string
}

export type Work = {
  page: number
  name: string
  status: Status
  /** A distinction earned outside this site, shown beside the status. */
  honour?: string
  /** One line, in his own voice, that survives being read alone. */
  line: string
  stack: string
  /** Left off where no test suite is published; an absent number is not zero. */
  tests?: number
  /** The measured figures. Each one is re-derivable from the repository. */
  figures: { label: string; value: string }[]
  body: string[]
  shots: Shot[]
  repo?: string
  live?: string
  /** Shown instead of a repository button when the source is not public. */
  note?: string
}

const A = '/work'

export const WORKS: Work[] = [
  {
    page: 201,
    name: 'INFERKIT',
    status: 'SHIPPED',
    line: 'The serving layer around a model you already have.',
    stack: 'PYTHON · FASTAPI · ASYNCIO',
    tests: 53,
    figures: [
      { label: 'THROUGHPUT', value: '214 > 3579/S' },
      { label: 'P99', value: '304MS > 21MS' },
      { label: 'TESTS', value: '53' },
    ],
    body: [
      'Dynamic batching, result caching keyed on the model version, and canary routing that rolls itself back the moment a candidate spends its error budget.',
      'The batching window is measured from now, not from when the first request arrived. Anchoring it to the oldest request is the bug that makes a batcher look like it works while giving you nothing.',
    ],
    shots: [
      {
        src: `${A}/shot-inferkit.png`,
        alt: 'inferkit benchmark: 214 requests per second without batching, 3579 with it, 10598 with batching and cache',
        caption: 'The benchmark, one laptop core. Same model, same 1200 requests.',
      },
      {
        src: `${A}/shot-inferkit2.png`,
        alt: 'The canary panel before and after: the candidate falls to zero weight and tripped after nine failed requests',
        caption: 'Nine bad requests and the candidate is out of rotation. No operator.',
      },
    ],
    repo: 'https://github.com/why-xdd/inferkit',
  },
  {
    page: 202,
    name: 'VOICEDATA',
    status: 'SHIPPED',
    line: 'Raw recordings in, a dataset you can train on out.',
    stack: 'PYTHON · NUMPY · SCIPY',
    tests: 48,
    figures: [
      { label: 'LOUDNESS', value: 'ITU-R BS.1770-4' },
      { label: 'TARGET', value: '-23 LUFS' },
      { label: 'TESTS', value: '48' },
    ],
    body: [
      'Resample, slice on speech, normalise to broadcast loudness with true-peak limiting, find the near-duplicates, and say plainly what is wrong with the rest.',
      'Duplicates are found by how a clip sounds, not by its bytes, so a re-encode of the same take is still caught.',
    ],
    shots: [
      {
        src: `${A}/shot-voicedata.png`,
        alt: 'voicedata report: five files audited, three pass, a clipped phone recording fails and a mostly-silence room tone warns',
        caption: 'Five recordings audited, each verdict carrying the number behind it.',
      },
      {
        src: `${A}/shot-voicedata2.png`,
        alt: 'voicedata dedup: one duplicate group found, interview_02.wav kept, similarity 1.000',
        caption: 'A re-encode shares no bytes with its original. Found anyway.',
      },
    ],
    repo: 'https://github.com/why-xdd/voicedata',
  },
  {
    page: 203,
    name: 'ASKDOCS',
    status: 'SHIPPED',
    line: 'Ask your own documents. Locally, nothing leaving the machine.',
    stack: 'PYTHON · SQLITE · OLLAMA',
    tests: 29,
    figures: [
      { label: 'RECALL', value: '94%' },
      { label: 'MRR', value: '0.809' },
      { label: 'TESTS', value: '29' },
    ],
    body: [
      'BM25 and embeddings fused by reciprocal rank. Ranks, not scores: BM25 scores and cosine similarities are not on the same scale, and their spread changes per query.',
      'The eval ships as a command, so the claim can be checked on your own corpus. An earlier README claimed 100 per cent here. That number was a hashing bug, and the README says so.',
    ],
    shots: [
      {
        src: `${A}/shot-askdocs.png`,
        alt: 'askdocs eval: lexical 88 percent recall at MRR 0.724, dense 94 at 0.731, hybrid 94 at 0.809',
        caption: 'Hybrid ties dense on recall and wins on rank. Rank is what survives.',
      },
      {
        src: `${A}/shot-askdocs2.png`,
        alt: "askdocs with ranks shown: onboarding.md first at bm25 #2 and vector #1, while BM25's own top hit is pushed to second",
        caption: 'BM25 had the wrong page first. The vector ranking knew better.',
      },
    ],
    repo: 'https://github.com/why-xdd/askdocs',
  },
  {
    page: 204,
    name: 'SLOWQ',
    status: 'SHIPPED',
    line: 'One static Go binary that says which query to fix first.',
    stack: 'GO · PG_STAT_STATEMENTS',
    tests: 35,
    figures: [
      { label: 'TOP QUERY', value: '0.81 MS' },
      { label: 'ITS SHARE', value: '64% OF ALL TIME' },
      { label: 'TESTS', value: '35' },
    ],
    body: [
      'Ranked by total time, not by duration. The query worth fixing is almost never the slowest one, and every tool that sorts by mean hides it.',
      'Each finding is explained in a sentence you could paste into a ticket, and index suggestions put equality predicates first so the B-tree can seek.',
    ],
    shots: [
      {
        src: `${A}/shot-slowq.png`,
        alt: 'slowq output: a 0.81 millisecond query taking 64 percent of all execution time, ranked above an 8.6 second report',
        caption: 'The fastest query on the list, and the only one worth fixing first.',
      },
    ],
    repo: 'https://github.com/why-xdd/slowq',
  },
  {
    page: 205,
    name: 'BOTKIT',
    status: 'SHIPPED',
    line: 'The aiogram 3 starter I wish I had had.',
    stack: 'PYTHON · AIOGRAM 3 · SQLALCHEMY',
    tests: 24,
    figures: [
      { label: 'BROADCAST', value: '25 MSG/S' },
      { label: 'LOCALES', value: 'PARITY IN CI' },
      { label: 'TESTS', value: '24' },
    ],
    body: [
      'FSM forms with a way out of every state, i18n resolved in middleware with a CI check that the catalogues stay in parity, roles that compare rank instead of listing every role.',
      'Both screens are rendered from the locale file at build time, so the pictures cannot drift from the strings the bot sends.',
    ],
    shots: [
      {
        src: `${A}/shot-botkit.png`,
        alt: 'The botkit feedback flow: category buttons, the message prompt, a confirmation screen and the thank-you',
        caption: 'Every state has a way out, including the confirmation.',
      },
      {
        src: `${A}/shot-botkit2.png`,
        alt: 'The botkit admin panel: role counts, a broadcast preview naming the audience size, and a delivery report',
        caption: 'The broadcast names its audience before it sends, then reports what landed.',
      },
    ],
    repo: 'https://github.com/why-xdd/botkit',
  },
  {
    page: 206,
    name: 'QUEUEVIZ',
    status: 'LIVE',
    line: 'Queueing theory is taught as algebra and experienced as an outage.',
    stack: 'TYPESCRIPT · CANVAS · NO DEPS',
    tests: 40,
    figures: [
      { label: 'BUNDLE', value: '8.5 KB GZIP' },
      { label: 'RUNTIME DEPS', value: 'ZERO' },
      { label: 'TESTS', value: '40' },
    ],
    body: [
      'A live simulation you can push around: seven presets, four queue disciplines, four admission-control strategies. Watch a queue build at 95 per cent load, then watch it not build once backpressure is on.',
      'Every run is seeded, so the same settings always produce the same trace and two people can argue about the same picture.',
    ],
    shots: [
      {
        src: `${A}/queueviz-demo.gif`,
        alt: 'queueviz at 150 percent offered load: three tenant lanes filling at different rates under weighted fair queueing',
        caption: 'Fair queueing at 150 per cent load. The flooding tenant grows its own lane.',
        source: 'LIVE RECORDING, OWN COLOURS',
      },
      {
        src: `${A}/queueviz-still.png`,
        alt: 'queueviz at 90 percent load: queue depth 13, p50 777 milliseconds, p99 1.49 seconds',
        caption: 'At 90 per cent nothing is overloaded, and p99 is already twice p50.',
      },
    ],
    repo: 'https://github.com/why-xdd/queueviz',
    live: 'https://queueviz.vercel.app',
  },
  {
    page: 207,
    name: 'VOXSHIFT',
    status: 'SHIPPED',
    line: 'A voice changer that holds up at streaming latency.',
    stack: 'PYTHON · NUMPY · SOUNDDEVICE',
    figures: [
      { label: 'METHOD', value: 'PHASE VOCODER' },
      { label: 'OUTPUT', value: 'VIRTUAL MIC' },
    ],
    body: [
      'Pitch shifting in NumPy fast enough to run on live input, effect presets, VU meters, and virtual-microphone output through VB-Cable so the processed voice works in any application that takes a microphone.',
    ],
    shots: [],
    repo: 'https://github.com/why-xdd/voxshift',
    note: 'NO SCREENSHOT PUBLISHED. THE CODE IS THE EVIDENCE.',
  },
  {
    page: 208,
    name: 'FRIENDCARDS',
    status: 'PRIVATE',
    line: 'A collectible-card bot with real users and real money in play.',
    stack: 'PYTHON · AIOGRAM · FASTAPI · SQLITE · DOCKER',
    figures: [
      { label: 'STATE', value: 'IN PRODUCTION' },
      { label: 'DEPLOY', value: 'VPS, ZERO DOWNTIME' },
    ],
    body: [
      'An in-game economy, trading, mini-games, an admin panel and a Telegram WebApp frontend, deployed on a VPS with live users and schema migrations that run without taking the bot down.',
      'The source stays private. Named here because it is the only thing on this page carrying real users, not because there is a link to click.',
    ],
    shots: [],
    note: 'PRIVATE REPOSITORY. HAPPY TO WALK THROUGH THE ARCHITECTURE.',
  },
  {
    page: 209,
    name: 'SORTING CENTRE',
    status: 'PRIVATE',
    line: 'A parcel hub answered in software instead of on the floor.',
    stack: 'PYTHON · SIMPY · FASTAPI · REACT · THREE.JS',
    figures: [
      { label: 'MODELLED', value: '100 000 ITEMS/H' },
      { label: 'DESTINATIONS', value: '400' },
      { label: 'DELIVERED', value: '2 AUG 2026' },
    ],
    body: [
      'A discrete-event model of a sorting hub for the Robozon hackathon, track one: material balance, equipment, floor area and throughput scenarios, from pallet intake to the shipping gates.',
      'Two people, one deadline. Submitted to the organisers, so the repository is theirs and not public.',
    ],
    shots: [],
    note: 'HACKATHON SUBMISSION. REPOSITORY HELD BY THE ORGANISERS.',
  },
  {
    page: 210,
    name: 'POST-OFFICE-TWIN',
    status: 'SHIPPED',
    honour: 'FINALIST · POSTCODE CHALLENGE 2026',
    line: 'A post office floor plan that checks itself against the building code.',
    stack: 'PYTHON · FASTAPI · SHAPELY · REACT · THREE.JS',
    tests: 376,
    figures: [
      { label: 'PROBLEMS', value: '11 > 2' },
      { label: 'PATH IN', value: '0.74 > 1.89 M' },
      { label: 'BEST SPOT', value: '94% VS 61%' },
      { label: 'TESTS', value: '376' },
    ],
    body: [
      'Finalist of PostCode Challenge 2026, the Russian Post engineering hackathon by Pochtatech and Innopolis University. Seventeen rules from five Russian codes, and every finding is a measurement, a norm and a clause number, drawn where the floor is narrowest.',
      "On the organisers' own sample plan one press leaves 2 problems of 11 and widens the path from the entrance to 1.89 metres against a 1.8 norm. An early version reached zero by driving a cashier window into the middle of the hall. Windows are now off-limits, and the README says so.",
    ],
    shots: [
      {
        src: `${A}/shot-post-office-twin.png`,
        alt: "The organisers' sample plan with the proposed fix: dashed arrows show where six objects move, and the panel reads problems 11 to 2, clear path 0.74 to 1.89 metres, waiting seats 24 to 20",
        caption: 'The fix before it is applied. Six moves, and the price named: four seats.',
        source: 'APP CAPTURE, OWN COLOURS',
      },
      {
        src: `${A}/shot-post-office-twin2.png`,
        alt: 'The same plan in 3D: equipment models at their real heights, visitor routes as blue strips, the two objects behind the remaining problems marked in red',
        caption: 'The same plan in 3D, at the heights the equipment dictionary gives.',
        source: 'APP CAPTURE, OWN COLOURS',
      },
    ],
    repo: 'https://github.com/why-xdd/post-office-twin',
    note: 'NO HOSTED DEMO. IT RUNS LOCALLY WITH ONE COMMAND, AND THE README SHOWS HOW.',
  },
]

export const SKILLS = [
  {
    name: 'BACKEND & APIS',
    body: 'Async services in Python and Go: FastAPI, PostgreSQL, Redis, WebSockets, packaged with Docker and put behind Nginx on a real VPS.',
  },
  {
    name: 'BOTS & INTEGRATIONS',
    body: 'Telegram bots on aiogram 3 with WebApp frontends, and a MAX Bot API client written against the raw long-polling protocol with the Go standard library.',
  },
  {
    name: 'RETRIEVAL & LOCAL LLMS',
    body: 'Hybrid retrieval over SQLite and pgvector, and models running locally through Ollama, for the cases where nothing may leave the machine.',
  },
  {
    name: 'REAL-TIME AUDIO',
    body: 'Phase-vocoder pitch shifting in NumPy at streaming latency, broadcast loudness to ITU-R BS.1770-4, and speech detection that survives a noisy room.',
  },
  {
    name: 'SIMULATION & MODELLING',
    body: 'Discrete-event models in SimPy for throughput questions that are cheaper to answer in software than on a warehouse floor.',
  },
]

export const PAGES: { page: number; title: string; colour: TTColour }[] = [
  { page: 100, title: 'INDEX', colour: 'white' },
  { page: 200, title: 'WORK', colour: 'cyan' },
  { page: 300, title: 'WHAT I DO', colour: 'yellow' },
  { page: 400, title: 'ABOUT', colour: 'green' },
  { page: 500, title: 'CONTACT', colour: 'magenta' },
]

export const CONTACT = {
  email: 'why.not.live.alone@gmail.com',
  github: 'https://github.com/why-xdd',
  githubLabel: 'GITHUB.COM/WHY-XDD',
}
