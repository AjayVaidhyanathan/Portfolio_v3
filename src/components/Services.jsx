export default function Services() {
  return (
    <section className="services" id="services">
      <div className="wrap">
        <div className="label" data-reveal="label">Services</div>
        <div className="head head--split" data-reveal-scope="">
          <h2 className="title" data-reveal="chars">Solutions<br />That Deliver</h2>
          <p className="lead" data-reveal="lines">Same quality, same attention to detail. The only difference is the scope of what we build together.</p>
        </div>

        <div className="plans">
          <article className="plan">
            <h3>Starter Build</h3>
            <p className="plan-price">€<span data-price="5000">5,000</span></p>
            <p className="plan-desc">A clean MVP or website, ready to launch in a few weeks.</p>
            <ul>
              <li>Up to 6 screens or pages</li>
              <li>Design system setup</li>
              <li>Mid-level animations and interactions</li>
              <li>Analytics and SEO basics</li>
              <li>Launch within two to three weeks</li>
            </ul>
            <a className="btn btn--line plan-btn" href="#contact"><span className="roll"><span>Get started</span></span></a>
          </article>
          <article className="plan plan--featured">
            <span className="plan-badge">Most popular</span>
            <h3>Ongoing Support</h3>
            <p className="plan-price">€<span data-price="3000">3,000</span> <small>/ 30 hours</small></p>
            <p className="plan-desc">Your dedicated product engineer, 30 hours a month.</p>
            <ul>
              <li>New features, pages and flows</li>
              <li>Iterations based on user feedback</li>
              <li>Maintenance, bug fixes and updates</li>
              <li>Performance and quality improvements</li>
              <li>Unused hours roll over (up to 3 months)</li>
            </ul>
            <a className="btn btn--yellow plan-btn" href="#contact"><span className="roll"><span>Book a Call</span></span></a>
          </article>
          <article className="plan">
            <h3>Custom Project</h3>
            <p className="plan-price">Let’s talk</p>
            <p className="plan-desc">High-end product development for complex projects.</p>
            <ul>
              <li>Advanced interaction and animation systems</li>
              <li>Scalable architecture and data models</li>
              <li>AI features and integrations</li>
              <li>API-driven and multi-platform builds</li>
              <li>30 days post-launch support included</li>
            </ul>
            <a className="btn btn--line plan-btn" href="#contact"><span className="roll"><span>Start a conversation</span></span></a>
          </article>
        </div>
      </div>
    </section>
  );
}
