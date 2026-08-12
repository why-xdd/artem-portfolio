import { lazy, Suspense } from 'react'
import { CONTACT, SKILLS, WORKS, type Work } from './content'
import BlockText from './teletext/BlockText'
import { cells } from './teletext/grid'
import { STATUS, TT, type TTColour } from './teletext/palette'
import { Action, Body, Figure, IndexRow, Panel, Rule, Still, Tag } from './teletext/parts'

/* The avatar is the only thing here that needs a 3D library, and it is not
   what the visitor came for. Split it out so the page paints on text alone and
   the renderer arrives afterwards. */
const StylisedAvatar = lazy(() => import('./avatar/StylisedAvatar'))

const TOTAL_TESTS = WORKS.reduce((sum, work) => sum + (work.tests ?? 0), 0)
const LIVE_COUNT = WORKS.filter((work) => work.status === 'LIVE').length

const statusColour = (status: Work['status']): TTColour =>
  status === 'LIVE' ? STATUS.live.colour : status === 'SHIPPED' ? STATUS.shipped.colour : STATUS.private.colour

/** P100 — the front page a set lands on when it is switched on. */
export function FrontPage({ onGo }: { onGo: (page: number) => void }) {
  return (
    <>
      <div className="tt-hero" style={{ marginBottom: cells(1.2) }}>
        <div>
          <h1 style={{ margin: 0 }}>
            <BlockText colour="yellow" cells={3}>
              {['OPEN ANY', 'CLAIM I MAKE']}
            </BlockText>
          </h1>

          <div style={{ height: cells(1) }} />

          <Body>
            Artem — backend and ML. Nine works, {TOTAL_TESTS} tests, one of them
            live in a browser tab. Every figure on this service has a page
            behind it that proves the figure.
          </Body>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: cells(1.2), marginTop: cells(0.6) }}>
            <Action colour="cyan" onClick={() => onGo(200)}>
              WORK 200 &gt;&gt;
            </Action>
            <Action colour="white" onClick={() => onGo(500)}>
              CONTACT 500
            </Action>
          </div>
        </div>

        <div className="tt-hero-picture">
          <Suspense
            fallback={
              <div
                aria-hidden
                style={{
                  aspectRatio: '54 / 58',
                  border: `${cells(0.16)} solid ${TT.blue}`,
                  background: TT.black,
                  display: 'grid',
                  placeItems: 'center',
                  color: TT.cyan,
                  fontSize: 'var(--t-xs)',
                }}
              >
                <span className="tt-blink">TUNING…</span>
              </div>
            }
          >
            <StylisedAvatar label="A stylised block-mosaic avatar of Artem, turning towards the reader" />
          </Suspense>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: cells(0.5),
              marginTop: cells(0.9),
              paddingTop: cells(0.6),
              borderTop: `${cells(0.16)} solid ${TT.cyan}`,
            }}
          >
            <Figure label="WORKS" value={String(WORKS.length)} />
            <Figure label="TESTS" value={String(TOTAL_TESTS)} />
            <Figure label="LIVE" value={String(LIVE_COUNT)} />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onGo(204)}
        className="tt-alert"
        style={{
          background: TT.red,
          color: TT.black,
          border: 0,
          fontFamily: 'inherit',
          cursor: 'pointer',
          padding: `${cells(0.6)} ${cells(0.75)}`,
          fontSize: 'var(--t-sm)',
          minHeight: 'max(44px, calc(var(--cell) * 2))',
          marginBottom: cells(1.5),
        }}
      >
        <span>0.81 MS PER CALL — AND 64% OF THE WHOLE DATABASE</span>
        <span style={{ whiteSpace: 'nowrap' }}>PAGE 204 &gt;&gt;</span>
      </button>

      {/* The nine works belong on the page a visitor lands on. Sending them to
          200 first spends the only minute this service gets on a menu. */}
      <Panel title="THE WORK" right="KEY A NUMBER">
        {WORKS.map((work, i) => (
          <div key={work.page}>
            <IndexRow
              name={work.name}
              status={work.status}
              statusColour={statusColour(work.status)}
              page={work.page}
              onSelect={() => onGo(work.page)}
            />
            {i < WORKS.length - 1 ? <Rule colour="white" /> : null}
          </div>
        ))}
      </Panel>

      <Panel title="WHY THIS SERVICE" right="MORE 400 >">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: cells(1.2),
          }}
        >
          {[
            {
              colour: 'green' as TTColour,
              title: 'MEASURED, NOT CLAIMED',
              body: 'Every number here was produced by a command you can run, and the command is in the README beside it.',
            },
            {
              colour: 'magenta' as TTColour,
              title: 'SHIPPED, NOT STARTED',
              body: 'Six public repositories with tests and green CI. One of them serves real traffic in a browser right now.',
            },
            {
              colour: 'cyan' as TTColour,
              title: 'OPEN IN ONE CLICK',
              body: 'Code, screenshots of the actual output, and a live demo. Nothing on this page asks to be taken on trust.',
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 style={{ color: TT[item.colour], fontSize: 'var(--t-sm)', marginBottom: cells(0.5) }}>
                {item.title}
              </h3>
              <p style={{ color: TT.white, fontSize: 'var(--t-xs)', lineHeight: 2 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

/** P200 — the work index. */
export function WorkIndex({ onGo }: { onGo: (page: number) => void }) {
  return (
    <>
      <h1 style={{ marginBottom: cells(1) }}>
        <BlockText colour="yellow" cells={3}>
          WORK
        </BlockText>
      </h1>

      <Body>
        Nine of them. Key the page number, or press the row. Colour is status:
        green is live, cyan has shipped and is public, yellow is private and
        named without a link.
      </Body>

      <Panel title="INDEX" right="KEY A NUMBER">
        {WORKS.map((work) => (
          <div key={work.page}>
            <IndexRow
              name={work.name}
              status={work.status}
              statusColour={statusColour(work.status)}
              page={work.page}
              onSelect={() => onGo(work.page)}
            />
            <Rule colour="white" />
          </div>
        ))}
      </Panel>
    </>
  )
}

/** P201-209 — one work per page. */
export function WorkPage({ work, onGo }: { work: Work; onGo: (page: number) => void }) {
  const index = WORKS.findIndex((item) => item.page === work.page)
  const next = WORKS[(index + 1) % WORKS.length]

  return (
    <>
      <h1 style={{ marginBottom: cells(0.75) }}>
        <BlockText colour="yellow" cells={2.6}>
          {work.name}
        </BlockText>
      </h1>

      {/* Under the title, not over it: a label above a heading is an eyebrow,
          and the heading is perfectly able to arrive first. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: cells(0.75),
          marginBottom: cells(0.75),
        }}
      >
        <Tag label={work.status} colour={statusColour(work.status)} />
        <span style={{ color: TT.cyan, fontSize: 'var(--t-xs)' }}>{work.stack}</span>
      </div>

      <Body>{work.line}</Body>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${cells(7)}), 1fr))`,
          gap: cells(0.75),
          padding: `${cells(0.75)} 0`,
          borderTop: `${cells(0.16)} solid ${TT.cyan}`,
          borderBottom: `${cells(0.16)} solid ${TT.cyan}`,
          marginBottom: cells(1.2),
        }}
      >
        {work.figures.map((figure) => (
          <Figure key={figure.label} label={figure.label} value={figure.value} />
        ))}
      </div>

      {work.shots.map((shot) => (
        <Still key={shot.src} {...shot} />
      ))}


      {work.body.map((paragraph) => (
        <Body key={paragraph.slice(0, 24)}>{paragraph}</Body>
      ))}

      {work.note ? (
        <p
          style={{
            color: TT.yellow,
            fontSize: 'var(--t-xs)',
            lineHeight: 2,
            padding: `${cells(0.6)} ${cells(0.75)}`,
            border: `${cells(0.16)} solid ${TT.yellow}`,
            marginBottom: cells(1.2),
          }}
        >
          {work.note}
        </p>
      ) : null}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: cells(1.2), marginBottom: cells(1.5) }}>
        {work.live ? (
          <Action colour="green" href={work.live}>
            OPEN IT LIVE &gt;&gt;
          </Action>
        ) : null}
        {work.repo ? (
          <Action colour="cyan" href={work.repo}>
            READ THE CODE &gt;&gt;
          </Action>
        ) : null}
        <Action colour="white" onClick={() => onGo(next.page)}>
          NEXT {next.page} {next.name}
        </Action>
      </div>
    </>
  )
}

/** P300 — what the work is made of. */
export function SkillsPage() {
  return (
    <>
      <h1 style={{ marginBottom: cells(1) }}>
        <BlockText colour="yellow" cells={2.6}>
          WHAT I DO
        </BlockText>
      </h1>

      <Body>
        Five things, in the order I reach for them. Each one is behind at least
        one page in the two hundreds.
      </Body>

      {SKILLS.map((skill, i) => (
        <Panel
          key={skill.name}
          title={skill.name}
          ground={i % 2 === 0 ? 'blue' : 'magenta'}
          titleColour={i % 2 === 0 ? 'yellow' : 'black'}
        >
          <p style={{ color: TT.white, fontSize: 'var(--t-sm)', lineHeight: 2 }}>{skill.body}</p>
        </Panel>
      ))}
    </>
  )
}

/** P400 — the person. */
export function AboutPage({ onGo }: { onGo: (page: number) => void }) {
  return (
    <>
      <h1 style={{ marginBottom: cells(1) }}>
        <BlockText colour="yellow" cells={2.8}>
          ABOUT
        </BlockText>
      </h1>

      <Body>
        I build the parts users never see: queues, batching, backpressure,
        rollout, and the metrics that say which of them just broke. Most of it
        is Python and Go, with a detour into real-time audio that I enjoyed far
        more than expected.
      </Body>

      <Body>
        A computer science student in Moscow, looking for a backend or ML
        internship. The work on this service is what I do when nobody has set
        me a task: pick a problem that is normally hand-waved, build the
        smallest honest thing that answers it, and measure whether it worked.
      </Body>

      <Panel title="HOW I WORK" ground="green" titleColour="black">
        {[
          'A claim without a number is a mood. If I say something got faster, the benchmark is in the repository and you can re-run it.',
          'Tests are for the bugs I have not thought of yet. Seven real ones were caught by the suites on this service; each is written up where it happened.',
          'When I get something wrong in public, I correct it in public. One README here says its earlier number was a bug, and reports the true one.',
        ].map((line) => (
          <div key={line.slice(0, 20)}>
            <p style={{ color: TT.white, fontSize: 'var(--t-sm)', lineHeight: 2 }}>{line}</p>
            <Rule colour="white" />
          </div>
        ))}
      </Panel>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: cells(1.2) }}>
        <Action colour="cyan" onClick={() => onGo(200)}>
          THE WORK 200 &gt;&gt;
        </Action>
        <Action colour="magenta" onClick={() => onGo(500)}>
          CONTACT 500 &gt;&gt;
        </Action>
      </div>
    </>
  )
}

/**
 * P500 — the only page this service exists to deliver a visitor to.
 *
 * So the address is the page, drawn in the same mosaic as the headlines
 * rather than set as body copy under a band that outweighs it.
 */
export function ContactPage({ onGo }: { onGo: (page: number) => void }) {
  return (
    <>
      <h1 style={{ marginBottom: cells(0.9) }}>
        <BlockText colour="yellow" cells={2.8}>
          WRITE TO ME
        </BlockText>
      </h1>

      <Body>
        Open to a backend or ML internship. If anything on this service was
        worth a second look, email is the fastest route — I answer every one,
        the same day, in English or Russian.
      </Body>

      <div
        style={{
          background: TT.magenta,
          padding: `${cells(1)} ${cells(0.9)}`,
          marginBottom: cells(1.2),
        }}
      >
        <div style={{ color: TT.black, fontSize: 'var(--t-xs)', marginBottom: cells(0.7) }}>
          ADDRESS
        </div>
        <a
          href={`mailto:${CONTACT.email}`}
          aria-label={`Email ${CONTACT.email}`}
          style={{ display: 'block', marginBottom: cells(0.9) }}
        >
          <BlockText colour="black" cells={1.9}>
            {['WHY.NOT.LIVE', 'ALONE@GMAIL.COM']}
          </BlockText>
        </a>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: cells(1.2) }}>
          <Action colour="black" href={`mailto:${CONTACT.email}`}>
            <span style={{ color: TT.white }}>SEND MAIL &gt;&gt;</span>
          </Action>
          <Action colour="white" href={CONTACT.github}>
            {CONTACT.githubLabel}
          </Action>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: cells(1.2),
          marginBottom: cells(1.5),
        }}
      >
        <Panel title="WHAT TO EXPECT" ground="blue">
          <p style={{ color: TT.white, fontSize: 'var(--t-sm)', lineHeight: 2 }}>
            A reply the same day. If you want to talk through the private
            work — the card bot in production, or the sorting hub model — I
            will walk through the architecture on a call.
          </p>
        </Panel>

        <Panel title="WHAT I AM AFTER" ground="green" titleColour="black">
          <p style={{ color: TT.white, fontSize: 'var(--t-sm)', lineHeight: 2 }}>
            A backend or ML internship. Computer science student in Moscow.
            Python and Go on the server, with a detour into real-time audio
            that I enjoyed far more than expected.
          </p>
        </Panel>
      </div>

      {/* Nobody should have to press back to find the evidence again. */}
      <Panel title="BEFORE YOU GO" right="THE WORK">
        {WORKS.slice(0, 6).map((work, i) => (
          <div key={work.page}>
            <IndexRow
              name={work.name}
              status={work.status}
              statusColour={statusColour(work.status)}
              page={work.page}
              onSelect={() => onGo(work.page)}
            />
            {i < 5 ? <Rule colour="white" /> : null}
          </div>
        ))}
      </Panel>
    </>
  )
}
