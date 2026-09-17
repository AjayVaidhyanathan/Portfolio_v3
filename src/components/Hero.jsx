const LETTERS = ['A', 'J', 'A', 'Y'];

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-inner">
        <h1 className="hero-title">Ideas,<br />Built<br />Differently.</h1>

        <div className="hero-aside">
          <p className="hero-lead">Working closely with founders and teams to ship products that merge design, engineering, and long-term value.</p>
          <div className="hero-buttons">
            <a className="btn btn--yellow" href="#contact" data-magnet><span className="roll"><span>Book a Call</span></span></a>
            <a className="btn btn--line" href="#about" data-magnet><span className="roll"><span>About Me</span></span></a>
          </div>
        </div>

        <div className="hero-stat hero-stat--1"><strong>40+</strong><span>Projects<br />shipped</span></div>
        <div className="hero-stat hero-stat--2"><strong>6+</strong><span>Years of<br />experience</span></div>

        <div className="hero-gl" aria-hidden="true"></div>

        <img className="hero-portrait" src="/img/portrait.svg" alt="Portrait of Ajay Vaidhyanathan" />

        <div className="hero-wordmark wordmark" aria-hidden="true">
          {LETTERS.map((l, i) => (
            <span className="hero-mask" key={i}><span className="hero-letter">{l}</span></span>
          ))}
        </div>

        <p className="hero-scroll"><i></i>Scroll</p>
      </div>
    </section>
  );
}
