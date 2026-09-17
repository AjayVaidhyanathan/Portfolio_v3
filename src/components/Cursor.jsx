export default function Cursor() {
  return (
    <>
      <div className="cursor" aria-hidden="true"><span className="cursor-label">View</span></div>
      <i className="progress" aria-hidden="true"></i>
      <div className="preview" aria-hidden="true"><img src="/img/work-1.svg" alt="" /></div>
    </>
  );
}
