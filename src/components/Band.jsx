const TOOLS = ['React', 'Next.js', 'TypeScript', 'Node', 'Figma', 'GSAP', 'Postgres', 'AI'];

export default function Band() {
  return (
    <div className="band" aria-hidden="true">
      <div className="band-row">
        {[...TOOLS, ...TOOLS].map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}
