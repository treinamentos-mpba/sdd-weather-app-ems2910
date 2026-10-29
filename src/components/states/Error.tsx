interface ErrorProps {
  onRetry: () => void;
}

function WeatherError({ onRetry }: ErrorProps) {
  return (
    <section
      aria-labelledby="weather-error-title"
      className="rounded-[2rem] border border-rose-300/20 bg-rose-400/[0.06] p-8 shadow-glass"
      role="alert"
    >
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-rose-200">Não foi possível exibir os dados</p>
          <h2 className="mt-1 text-xl font-semibold text-white" id="weather-error-title">
            Algo deu errado
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
            Este é um estado de erro demonstrativo. Tente novamente para voltar aos dados de
            demonstração.
          </p>
        </div>
        <button
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
          onClick={onRetry}
          type="button"
        >
          Tentar novamente
        </button>
      </div>
    </section>
  );
}

export default WeatherError;
