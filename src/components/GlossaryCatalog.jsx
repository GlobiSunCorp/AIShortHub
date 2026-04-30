import { GLOSSARY, GLOSSARY_CATEGORIES } from '../data/glossary';
import { GlossaryTerm } from './GlossaryTerm';

export function GlossaryCatalog() {
  return (
    <div className="grid cards-2">
      {GLOSSARY_CATEGORIES.map((category) => {
        const terms = Object.entries(GLOSSARY).filter(([, item]) => item.category === category);
        return (
          <article className="mini-card stack-sm" key={category} style={{ borderRadius: '24px' }}>
            <div className="row wrap center" style={{ justifyContent: 'space-between' }}>
              <h4 className="ds-h3" style={{ margin: 0 }}>{category}</h4>
              <span className="meta-pill">{terms.length} terms</span>
            </div>
            <div className="stack-sm">
              {terms.map(([id, item]) => (
                <p key={id} className="small-text" style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center' }}>
                  <span>{item.term}</span>
                  <GlossaryTerm id={id} compact />
                </p>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
