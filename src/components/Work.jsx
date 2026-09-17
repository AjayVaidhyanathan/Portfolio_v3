const PROJECTS = [
  { num: '01', bg: '/img/work-1.svg', fg: '/img/device-1.svg', c1: '#1f2a44', c2: '#3b5bdb', tags: ['AI', 'Product', 'SaaS'], title: 'Lexora', desc: 'An AI workspace for legal teams. Placeholder description: the problem, your role and the outcome.' },
  { num: '02', bg: '/img/work-2.svg', fg: '/img/device-2.svg', c1: '#1d3b2a', c2: '#2f9e44', tags: ['Web', 'CMS', 'Motion'], title: 'Project Two', desc: 'Placeholder description. One or two lines about what was built and why it matters.' },
  { num: '03', bg: '/img/work-3.svg', fg: '/img/device-3.svg', c1: '#3d2a1e', c2: '#e8590c', tags: ['Mobile', 'API'], title: 'Project Three', desc: 'Placeholder description. One or two lines about what was built and why it matters.' },
  { num: '04', bg: '/img/work-4.svg', fg: '/img/device-1.svg', c1: '#2b1f3d', c2: '#7048e8', tags: ['Dashboard', 'Data'], title: 'Project Four', desc: 'Placeholder description. One or two lines about what was built and why it matters.' },
  { num: '05', bg: '/img/work-5.svg', fg: '/img/device-2.svg', c1: '#1e3a3d', c2: '#15aabf', tags: ['E-commerce', 'SEO'], title: 'Project Five', desc: 'Placeholder description. One or two lines about what was built and why it matters.' },
  { num: '06', bg: '/img/work-6.svg', fg: '/img/device-3.svg', c1: '#3d1e2c', c2: '#d6336c', tags: ['Brand', 'Web'], title: 'Project Six', desc: 'Placeholder description. One or two lines about what was built and why it matters.' },
];

export default function Work() {
  return (
    <section className="work" id="work" data-dark="">
      <div className="work-sticky">
        <div className="work-inner">
          <div className="work-head" data-reveal-scope="">
            <div>
              <div className="label label--dark" data-reveal="label" data-once="">Selected work</div>
              <h2 className="h2 h2--white" data-reveal="lines" data-once="">Designed to Ship,<br />Built to Perform</h2>
            </div>
            <p className="work-lead" data-reveal="lines" data-once="">Over the years I’ve helped teams across different industries turn their ideas into products that look and work exactly how they imagined. Here’s a look at some of that work.</p>
          </div>

          <div className="work-track-wrap">
            <div className="work-track">
              {PROJECTS.map((p) => (
                <a className="work-card" href="#" data-cursor="View" style={{ '--c1': p.c1, '--c2': p.c2 }} key={p.num}>
                  <img className="work-bg" src={p.bg} alt="" />
                  <div className="work-fg"><img src={p.fg} alt="" /></div>
                  <div className="work-shade"></div>
                  <div className="work-content">
                    <div className="work-tags">
                      <span className="tag">{p.num}</span>
                      <span className="tag-group">{p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</span>
                    </div>
                    <div className="work-bottom">
                      <h3 className="work-title">{p.title}</h3>
                      <p className="work-desc">{p.desc}</p>
                      <span className="work-arrow" aria-hidden="true"><svg viewBox="0 0 16 16"><path fill="currentColor" d="M4 3h9v9h-2V6.4l-6.3 6.3-1.4-1.4L9.6 5H4V3Z" /></svg></span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
