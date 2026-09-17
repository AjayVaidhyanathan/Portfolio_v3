const LETTERS = ['A', 'J', 'A', 'Y'];

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-gl" aria-hidden="true"></div>
      <div className="wrap footer-top">
        <div data-reveal-scope="">
          <div className="label label--dark" data-reveal="label">Contact</div>
          <h2 className="footer-title" data-reveal="chars">Have something<br />in mind?</h2>
        </div>
        <a className="magnet" href="mailto:hello@getlexora.de" data-magnet="0.35" data-cursor="Say hi"><span className="magnet-inner">Let’s Talk</span></a>
      </div>
      <div className="wrap footer-row">
        <a href="mailto:hello@getlexora.de">hello@getlexora.de</a>
        <span>X · LinkedIn</span>
        <span>© <span>{new Date().getFullYear()}</span> Ajay Vaidhyanathan</span>
      </div>
      <div className="footer-wordmark wordmark" aria-hidden="true">
        {LETTERS.map((l, i) => (
          <span className="hero-mask" key={i}><span className="footer-letter">{l}</span></span>
        ))}
      </div>
    </footer>
  );
}
