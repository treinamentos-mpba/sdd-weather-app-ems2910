interface EmptyProps {
  query: string;
}

function Empty({ query }: EmptyProps) {
  return (
    <section aria-labelledby="empty-weather-title" className="panel empty-panel" role="status">
      <span aria-hidden="true" className="empty-icon">
        ☁
      </span>
      <h2 className="state-title" id="empty-weather-title">
        Nenhuma cidade encontrada
      </h2>
      <p className="state-copy">
        Não encontramos localidades para “{query}”. Confira a escrita e tente novamente.
      </p>
    </section>
  );
}

export default Empty;
