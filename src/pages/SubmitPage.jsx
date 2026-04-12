import { SectionTitle } from '../components/SectionTitle';

export function SubmitPage() {
  return (
    <div className="stack-lg">
      <SectionTitle title="Submit your short drama" desc="Future-ready submission workflow shell." />
      <form className="form-grid panel">
        <label>
          Series title
          <input className="input" placeholder="Enter working title" />
        </label>
        <label>
          Synopsis
          <textarea className="input" rows={4} placeholder="Drama synopsis" />
        </label>
        <label>
          Video source link (CDN/hosted)
          <input className="input" placeholder="https://cdn.example.com/playlist.m3u8" />
        </label>
        <label>
          Upload cover (placeholder)
          <input className="input" type="file" />
        </label>
        <label>
          Teaser / trailer asset link
          <input className="input" placeholder="Promo short URL" />
        </label>
        <label>
          Distribution target
          <select className="input">
            <option>Platform only</option>
            <option>TikTok + Platform</option>
            <option>Campaign test group</option>
          </select>
        </label>
        <button className="btn btn-primary" type="button">
          Submit for review
        </button>
      </form>
    </div>
  );
}
