function Empty() {
  return (
    <section
      aria-labelledby="empty-weather-title"
      className="rounded-[2rem] border border-white/10 bg-white/[0.06] px-6 py-12 text-center shadow-glass backdrop-blur-md sm:px-10"
      role="status"
    >
      <span
        aria-hidden="true"
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl text-slate-300"
      >
        ☁
      </span>
      <h2 className="mt-5 text-xl font-semibold text-white" id="empty-weather-title">
        Nenhum dado disponível
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        Não há uma previsão para mostrar neste estado demonstrativo. Você pode voltar aos dados de
        demonstração pelo seletor abaixo.
      </p>
    </section>
  );
}

export default Empty;
