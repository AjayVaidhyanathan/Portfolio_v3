const CHIPS = [
  {
    start: 'top 80%',
    icon: 'm8.6 6.3 1.4 1.4L5.7 12l4.3 4.3-1.4 1.4L2.9 12l5.7-5.7Zm6.8 0L21.1 12l-5.7 5.7-1.4-1.4 4.3-4.3-4.3-4.3 1.4-1.4Z',
    title: 'Product Engineering',
    desc: 'Fast, scalable web apps with clean architecture your team can keep building on.',
  },
  {
    start: 'top 63%',
    icon: 'M3 13h4v8H3v-8Zm7-6h4v14h-4V7Zm7-4h4v18h-4V3Z',
    title: 'Growth-Ready Setup',
    desc: 'Solid structure, speed and analytics so the product can grow with you.',
  },
  {
    start: 'top 47%',
    icon: 'M10.3 2h3.4l.5 2.6 1.6.7 2.2-1.5 2.4 2.4-1.5 2.2.7 1.6 2.6.5v3.4l-2.6.5-.7 1.6 1.5 2.2-2.4 2.4-2.2-1.5-1.6.7-.5 2.6h-3.4l-.5-2.6-1.6-.7-2.2 1.5-2.4-2.4 1.5-2.2-.7-1.6L2 13.7v-3.4l2.6-.5.7-1.6-1.5-2.2 2.4-2.4 2.2 1.5 1.6-.7.3-2.4ZM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z',
    title: 'Custom Integrations',
    desc: 'APIs, AI models and third-party tools wired together into one smooth workflow.',
  },
  {
    start: 'top 39%',
    icon: 'M12 2c.6 4.8 3.2 7.4 8 8-4.8.6-7.4 3.2-8 8-.6-4.8-3.2-7.4-8-8 4.8-.6 7.4-3.2 8-8Zm6 12c.3 2.4 1.6 3.7 4 4-2.4.3-3.7 1.6-4 4-.3-2.4-1.6-3.7-4-4 2.4-.3 3.7-1.6 4-4Z',
    title: 'Interaction & Motion',
    desc: 'Smooth, purposeful animation that makes the product feel alive and easy to use.',
  },
  {
    start: 'top 25%',
    icon: 'M12 3a10 10 0 0 1 10 10c0 2.4-.8 4.6-2.3 6.3l-1.5-1.3A8 8 0 1 0 4 13c0 1.9.7 3.7 1.8 5l-1.5 1.3A10 10 0 0 1 12 3Zm4.2 4.4 1.4 1.4-4.2 4.2a1.5 1.5 0 1 1-1.4-1.4l4.2-4.2Z',
    title: 'Performance & Quality',
    desc: 'Faster, cleaner, tested and built to last with solid technical foundations.',
  },
];

function Chip({ c }) {
  return (
    <span className="chip" data-chip-start={c.start}>
      <span className="chip-card">
        <span className="chip-top">
          <svg className="chip-icon" viewBox="0 0 24 24"><path fill="currentColor" d={c.icon} /></svg>
          <i className="chip-arrow"></i>
        </span>
        <span className="chip-bottom"><span className="chip-bottom-inner"><strong>{c.title}</strong><span>{c.desc}</span></span></span>
      </span>
    </span>
  );
}

export default function Capabilities() {
  return (
    <section className="capa section" id="overview">
      <div className="container capa-inner">
        <h2 className="h2-big" data-reveal="lines" data-start="top 85%">What<br />You Get?</h2>
        <div className="label" data-reveal="label" data-trigger=".capa-text" data-start="top 100%">Capabilities overview</div>

        <p className="capa-text">
          Strategy, precision, and{' '}
          <Chip c={CHIPS[0]} />{' '}
          engineering combined - turning{' '}
          <Chip c={CHIPS[1]} />{' '}
          your ideas into a powerful digital{' '}
          <Chip c={CHIPS[2]} />{' '}
          product{' '}
          <Chip c={CHIPS[3]} />{' '}
          that feels effortless.{' '}
          <Chip c={CHIPS[4]} />
        </p>
      </div>
    </section>
  );
}
