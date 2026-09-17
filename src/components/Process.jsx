const STEPS = [
  { num: '01', title: 'Discover', time: 'Week 1', desc: 'A focused call and a short audit. We agree on goals, scope and what success looks like.', icon: 'M10 3a7 7 0 0 1 5.6 11.2l5.1 5.1-1.4 1.4-5.1-5.1A7 7 0 1 1 10 3Zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z' },
  { num: '02', title: 'Design', time: 'Week 1–2', desc: 'Flows, wireframes and a design system aligned with your brand before a line of code.', icon: 'M3 17.3V21h3.7L17.8 9.9l-3.7-3.7L3 17.3ZM20.7 7a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.7 3.7L20.7 7Z' },
  { num: '03', title: 'Build', time: 'Week 2–5', desc: 'Small iterations you can click through every few days. No black box, no surprises.', icon: 'm8.6 6.3 1.4 1.4L5.7 12l4.3 4.3-1.4 1.4L2.9 12l5.7-5.7Zm6.8 0L21.1 12l-5.7 5.7-1.4-1.4 4.3-4.3-4.3-4.3 1.4-1.4Z' },
  { num: '04', title: 'Launch', time: 'Week 6', desc: 'Testing, performance, analytics and a calm launch. Then we keep improving.', icon: 'M13 2c4 1 7 4 8 8l-5 5v4l-3 3-2-5-5-5-5-2 3-3h4l5-5Zm2 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM5 16l3 3-4 2 1-5Z' },
];

export default function Process() {
  return (
    <section className="process" id="process">
      <div className="process-pin">
        <div className="wrap process-head">
          <div>
            <div className="label label--dark" data-reveal="label">How I work</div>
            <h2 className="title" data-reveal="chars">From First Call<br />to Launch Day</h2>
          </div>
          <p className="process-count"><span className="process-count-num">01</span> / 04</p>
        </div>
        <div className="process-track">
          {STEPS.map((s) => (
            <article className="pcard" key={s.num}>
              <div className="pcard-top">
                <span className="pcard-num">{s.num}</span>
                <span className="pcard-icon"><svg viewBox="0 0 24 24"><path fill="currentColor" d={s.icon} /></svg></span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <span className="pcard-time">{s.time}</span>
            </article>
          ))}
          <a className="pcard pcard--cta" href="#contact" data-cursor="Let’s go">
            <h3>Ready when<br />you are.</h3>
            <span className="pcard-arrow">→</span>
          </a>
        </div>
        <div className="wrap"><div className="process-bar"><i></i></div></div>
      </div>
    </section>
  );
}
