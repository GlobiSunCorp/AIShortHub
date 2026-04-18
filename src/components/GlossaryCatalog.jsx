import { GLOSSARY, GLOSSARY_CATEGORIES } from '../data/glossary';
import { GlossaryTerm } from './GlossaryTerm';

export function GlossaryCatalog() {
  return (
    <div className="grid cards-2">
      {GLOSSARY_CATEGORIES.map((category) => {
        const terms = Object.entries(GLOSSARY).filter(([, item]) => item.category === category);
        return (
          <article className="mini-card" key={category}>
            <h4>{category}</h4>
            <div className="stack-sm">
              {terms.map(([id, item]) => <p key={id} className="small-text">{item.term} <GlossaryTerm id={id} compact /></p>)}
            </div>
          </article>
        );
      })}
    </div>
  );
}
