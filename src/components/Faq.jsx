const FAQS = [
  { q: 'What do you usually build?', a: 'Web apps, SaaS products, marketing sites and internal tools. Placeholder answer: describe the kind of projects you enjoy most.' },
  { q: 'Already have a product that needs work?', a: 'That’s a big part of what I do. Whether it needs a structural cleanup, new features or better performance, we start with an honest review.' },
  { q: 'What’s the process from start to launch?', a: 'It starts with a conversation about goals, timeline and scope. Then planning, design alignment, build in small iterations and a smooth launch.' },
  { q: 'Do you work under NDA?', a: 'Yes. Confidentiality is standard and I’m happy to sign an NDA before we talk details.' },
  { q: 'Do you handle design, or only development?', a: 'Engineering is my core strength, but I care a lot about design and work closely with designers, or take the design lead on smaller scopes.' },
  { q: 'What does ongoing support look like?', a: 'You get a dedicated block of hours each month for new features, improvements and maintenance, with clear reporting.' },
  { q: 'How do you handle revisions and feedback?', a: 'Revisions are built into the process, not an afterthought. Short feedback loops keep everyone aligned.' },
  {
    q: 'Not sure which plan fits your project?',
    a: <>No stress. Reach out at <a href="mailto:hello@getlexora.de">hello@getlexora.de</a> and tell me what you have in mind. I’ll help you figure out the best fit.</>,
  },
];

export default function Faq() {
  return (
    <section className="faqs" id="faq">
      <div className="wrap faq-layout">
        <div className="faq-side">
          <div className="head" data-reveal-scope="">
            <div className="label" data-reveal="label">FAQ</div>
            <h2 className="title" data-reveal="chars">Got <span className="soft">any</span><br />questions?</h2>
          </div>
          <span className="faq-mark" aria-hidden="true">?</span>
          <p className="faq-note">Still unsure? <a href="mailto:hello@getlexora.de">Write me directly</a>.</p>
        </div>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <details className="faq" key={i}>
              <summary>{f.q}<i className="faq-plus"></i></summary>
              <div className="faq-body"><div><p>{f.a}</p></div></div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
