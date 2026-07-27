import FadeIn from '../components/FadeIn'

const ITEMS = [
  {
    n: '01',
    name: 'Backend & APIs',
    body: 'Async services in Python and Go: FastAPI, PostgreSQL, Redis, WebSockets, packaged with Docker and put behind Nginx on a real VPS.',
  },
  {
    n: '02',
    name: 'Bots & integrations',
    body: 'Telegram bots on aiogram with WebApp frontends, and a MAX Bot API client written against the raw long-polling protocol with the Go standard library.',
  },
  {
    n: '03',
    name: 'Local LLMs & RAG',
    body: 'Retrieval pipelines over pgvector and PostgreSQL, and vision-capable models running locally through Ollama, for cases where nothing may leave the machine.',
  },
  {
    n: '04',
    name: 'Real-time audio',
    body: 'Phase-vocoder pitch shifting in NumPy at streaming latency, with virtual-microphone output so the processed voice works in any application.',
  },
  {
    n: '05',
    name: 'Simulation & modelling',
    body: 'Discrete-event models in SimPy for throughput questions that are cheaper to answer in software than on a warehouse floor.',
  },
]

export default function WhatIDoSection() {
  return (
    <section
      id="stack"
      className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="mb-16 text-center leading-none font-black tracking-tight text-[#0C0C0C] uppercase sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          What i do
        </h2>
      </FadeIn>

      <div className="mx-auto max-w-5xl">
        {ITEMS.map((item, i) => (
          <FadeIn
            key={item.n}
            delay={i * 0.1}
            y={30}
            className="flex items-start gap-6 border-t border-[rgba(12,12,12,0.15)] py-8 last:border-b sm:gap-10 sm:py-10 md:py-12"
          >
            <span
              className="shrink-0 leading-none font-black text-[#0C0C0C]"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
            >
              {item.n}
            </span>
            <div className="pt-1 md:pt-3">
              <h3
                className="font-medium text-[#0C0C0C] uppercase"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {item.name}
              </h3>
              <p
                className="mt-2 max-w-2xl leading-relaxed font-light text-[#0C0C0C] opacity-60"
                style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
              >
                {item.body}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
