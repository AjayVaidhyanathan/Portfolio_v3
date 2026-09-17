export default function Cta() {
  return (
    <section className="cta section">
      <div className="container" data-reveal-scope="">
        <h2 className="cta-title" data-reveal="lines" data-once="">Transform Your<br />Product<br /><span className="cta-soft">Experience</span><br /><span className="cta-soft">Journey</span></h2>
        <p className="section-lead" data-reveal="lines" data-once="" data-start="top 65%">Every product has room to grow. You get a clear view of what works, what holds you back and how to move toward a setup that feels faster, lighter and easier to manage.</p>

        <div className="chat">
          <img className="chat-avatar" src="/img/avatar-me.svg" alt="" />
          <div className="chat-col">
            <div className="chat-row chat-row--msg"><div className="chat-bubble"><p className="chat-text">Have something in mind?</p></div></div>
            <div className="chat-row chat-row--btn"><a className="chat-bubble chat-bubble--btn btn btn--yellow" href="mailto:hello@getlexora.de"><span className="roll"><span>Let’s Talk</span></span></a></div>
            <div className="chat-typing"><div className="chat-bubble"><i></i><i></i><i></i></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
