const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#process', label: 'Process' },
  { href: '#services', label: 'Services' },
  { href: '#faq', label: 'FAQ' },
];

export default function Nav() {
  return (
    <header className="nav">
      <a href="#home" className="nav-brand wordmark">AJAY</a>
      <nav className="nav-links" aria-label="Main">
        <span className="nav-pill" aria-hidden="true"></span>
        {LINKS.map((l) => (
          <a href={l.href} key={l.href}>{l.label}</a>
        ))}
      </nav>
      <a className="btn btn--yellow nav-cta" href="#contact" data-magnet><span className="roll"><span>Book a Call</span></span></a>
    </header>
  );
}
