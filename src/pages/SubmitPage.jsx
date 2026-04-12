export default function SubmitPage() {
  return (
    <section className="submit-layout">
      <div className="submit-head">
        <div className="pill">Creator Submission</div>
        <h2>Submit Your AI Short Drama</h2>
        <p>
          Send us your finished series for review, publishing, and optional promotion support on
          AIShortHub.
        </p>
      </div>

      <div className="two-col submit-grid">
        <div className="stack-col">
          {[
            [
              "What you can submit",
              "We accept completed AI short dramas, serialized story content, trailers, and teaser materials intended for short-form video audiences.",
            ],
            [
              "What we review",
              "Our team reviews each submission for story clarity, visual consistency, technical format, and overall fit for the AIShortHub platform.",
            ],
            [
              "Optional support",
              "Selected creators may request help with listing setup, title refinement, cover positioning, and promotional distribution support.",
            ],
          ].map(([title, desc]) => (
            <div key={title} className="panel">
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>

        <div className="panel form-panel">
          <div className="form-grid">
            {[
              "Series Title",
              "Genre",
              "Language",
              "Number of Episodes",
              "Total Runtime",
              "Creator / Studio Name",
              "Contact Email",
              "Short Synopsis",
              "Main Selling Point",
              "Target Audience",
              "Existing Trailer Link",
              "Video Upload or Drive Link",
              "Cover Upload",
            ].map((field) => (
              <div key={field} className="form-field">
                <label>{field}</label>
                <div className="fake-input" />
              </div>
            ))}
          </div>

          <div className="check-group">
            <label>
              <input type="checkbox" /> I confirm that I own or control the rights necessary to
              submit this content.
            </label>
            <label>
              <input type="checkbox" /> I confirm that the submitted materials do not knowingly
              infringe third-party rights.
            </label>
            <label>
              <input type="checkbox" /> I agree to the AIShortHub review and publishing policy.
            </label>
          </div>

          <button className="btn btn-light">Submit for Review</button>
        </div>
      </div>
    </section>
  );
}
