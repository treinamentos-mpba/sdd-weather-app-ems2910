interface LoadingProps {
  label?: string;
}

function Loading({ label = 'Carregando previsão...' }: LoadingProps) {
  return (
    <section
      aria-busy="true"
      aria-label="Carregando previsão do tempo"
      className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-glass backdrop-blur-md"
      role="status"
    >
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-accent-400 motion-reduce:animate-none"
        />
        <div>
          <p className="font-semibold text-white">{label}</p>
          <p className="mt-1 text-sm text-slate-400">Só um instante.</p>
        </div>
      </div>
      <span className="sr-only">{label}</span>
    </section>
  );
}

export default Loading;
