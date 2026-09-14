/**
 * A specimen plate: each experiment gets a distinct geometric form drawn as a
 * technical study — measured, annotated, lit from behind. Built in CSS so the
 * Lab reads as a laboratory without a second WebGL canvas on the page.
 */
export function Specimen({ index, number, status }: { index: number; number: string; status?: string }) {
  const variant = ["01", "02", "03"][index % 3];

  return (
    <div className={`specimen specimen--${variant}`} role="img" aria-label={`Experiment ${number} specimen plate`}>
      <i className="specimen__light" aria-hidden="true" />
      <span className="specimen__rule specimen__rule--h" aria-hidden="true" />
      <span className="specimen__rule specimen__rule--v" aria-hidden="true" />
      <span className="specimen__form" />
      <span className="specimen__caliper" aria-hidden="true" />
      <span className="specimen__index">{number}</span>
      {status ? <span className="specimen__status">{status}</span> : null}
    </div>
  );
}
