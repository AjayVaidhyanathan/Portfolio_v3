const STEPS = [
  { year: '19', img: '/img/work-1.svg', title: 'Curiosity turned into code', desc: 'A first website, a lot of broken layouts and the moment I realised I wanted to build things for a living.' },
  { year: '20', img: '/img/work-2.svg', title: 'First real projects', desc: 'First real client. First real deadline. Learning that shipping is a skill of its own.' },
  { year: '22', img: '/img/work-3.svg', title: 'Going deeper into product', desc: 'From features to systems. Design, data and architecture stopped being separate conversations.' },
  { year: '23', img: '/img/work-4.svg', title: 'Shipping for teams', desc: 'Working with founders and product teams, owning builds end to end from the first sketch to launch.' },
  { year: '24', img: '/img/work-5.svg', title: 'Starting Lexora', desc: 'Taking everything I learned and putting it into a product of my own.' },
  { year: '26', img: '/img/work-6.svg', title: 'The journey continues', desc: 'Still obsessed. Now figuring out how AI fits into the way great products get built.' },
];

export default function About() {
  return (
    <section className="about" id="about">
      <div className="wrap about-grid">
        <div className="about-head" data-reveal-scope="">
          <div className="label" data-reveal="label">Start small, grow big</div>
          <h2 className="title" data-reveal="chars">About Me (&amp;)<br />My Journey</h2>
          <p className="lead" data-reveal="lines">Years ago I shipped my first side project. What happened after that is easier to show than explain.</p>
          <div className="about-gl" aria-hidden="true">
            <p className="about-chapter"><span className="about-chapter-num">01</span> / 06</p>
          </div>
        </div>

        <ol className="journey">
          <i className="journey-line" aria-hidden="true"><i className="journey-fill"></i></i>
          {STEPS.map((s) => (
            <li className="step" data-img={s.img} key={s.year}>
              <p className="step-year">’<span data-count={s.year}>{s.year}</span></p>
              <div><h3 data-reveal="lines">{s.title}</h3><p data-reveal="lines">{s.desc}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
