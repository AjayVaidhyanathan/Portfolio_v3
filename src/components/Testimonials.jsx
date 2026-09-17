const LOGOS = ['Lexora', 'Northwind', 'Brightpath', 'Fieldnote', 'Kestrel', 'Arcadia Labs', 'Monolith', 'Parcel'];

const QUOTES = [
  { title: 'Trusted long-term collaborator.', text: 'Placeholder testimonial. A short quote about working together: communication, speed, quality and the result for the team.', avatar: '/img/avatar-1.svg' },
  { title: 'Thinks through the entire product.', text: 'Placeholder testimonial. What stood out: thinking beyond the ticket, caring about the user and shipping without compromises.', avatar: '/img/avatar-2.svg' },
  { title: 'Reliable, sharp and easy to work with.', text: 'Placeholder testimonial. A few words about reliability, ownership and how the collaboration felt day to day.', avatar: '/img/avatar-3.svg' },
  { title: 'Clear ownership from day one.', text: 'Placeholder testimonial. How the project was led, the technical decisions taken and the outcome it delivered.', avatar: '/img/avatar-4.svg' },
  { title: 'Detail-obsessed in the best way.', text: 'Placeholder testimonial. Mention the polish, the motion and the small details that made the difference.', avatar: '/img/avatar-2.svg' },
];

export default function Testimonials() {
  return (
    <section className="quotes" id="clients">
      <div className="wrap">
        <div className="head head--split" data-reveal-scope="">
          <div>
            <div className="label" data-reveal="label">Testimonials</div>
            <h2 className="title" data-reveal="chars">From People<br />I’ve Worked with</h2>
          </div>
          <div className="rail-nav">
            <button type="button" className="rail-btn" data-magnet data-dir="-1" aria-label="Previous">←</button>
            <button type="button" className="rail-btn" data-magnet data-dir="1" aria-label="Next">→</button>
          </div>
        </div>
      </div>
      {/* Placeholder client names: swap for real logos */}
      <div className="logos" aria-label="Clients">
        <div className="logos-row">{LOGOS.map((l) => <span key={l}>{l}</span>)}</div>
        <div className="logos-row" aria-hidden="true">{LOGOS.map((l) => <span key={l}>{l}</span>)}</div>
      </div>
      <div className="rail">
        {QUOTES.map((q, i) => (
          <article className="quote" key={i}>
            <h3>{q.title}</h3>
            <p>{q.text}</p>
            <div className="quote-person">
              <img src={q.avatar} alt="" />
              <div><strong>Client Name</strong><span>Role, Company</span></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
