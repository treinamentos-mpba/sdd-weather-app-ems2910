interface ErrorProps {
  message: string;
  onRetry: () => void;
}

function WeatherError({ message, onRetry }: ErrorProps) {
  return (
    <section aria-labelledby="weather-error-title" className="panel weather-error" role="alert">
      <div>
        <div>
          <p className="eyebrow error-kicker">Não foi possível exibir os dados</p>
          <h2 className="state-title" id="weather-error-title">
            Algo deu errado
          </h2>
          <p className="state-copy">{message}</p>
        </div>
        <button className="geo-button error-button" onClick={onRetry} type="button">
          Tentar novamente
        </button>
      </div>
    </section>
  );
}

export default WeatherError;
