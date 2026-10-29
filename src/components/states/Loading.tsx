interface LoadingProps {
  label?: string;
}

function Loading({ label = 'Carregando previsão...' }: LoadingProps) {
  return (
    <section aria-busy="true" aria-label={label} className="panel" aria-live="polite" role="status">
      <div className="loading-layout">
        <span aria-hidden="true" className="loading-wheel" />
        <div>
          <p className="state-title">{label}</p>
          <p className="state-copy">Só um instante.</p>
        </div>
      </div>
    </section>
  );
}

export default Loading;
