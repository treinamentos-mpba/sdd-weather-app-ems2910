---
applyTo: 'src/**/*.{ts,tsx,css}'
---

# Instruções — Tailwind CSS (GeoCities kitsch)

- Use os tokens GeoCities definidos em `tailwind.config.js`: `geo.magenta`
  (`#FF00A8`), `geo.cyan` (`#00E5FF`), `geo.yellow` (`#FFF000`),
  `geo.purple` (`#7B2CFF`) e `geo.lime` (`#39FF14`). Combine ao menos quatro
  em destaques/ornamentos sem sacrificar a legibilidade do conteúdo.
- Prefira títulos serifados/display retrô com fallbacks locais. Use padrões
  tiled, estrelas, listras e gradientes feitos somente em CSS.
- Cartões e controles podem ter bordas grossas, molduras duplas ou bevel
  exagerado; divisórias decorativas devem ser claramente não interativas.
- Mantenha texto, labels e mensagens úteis legíveis, foco de teclado evidente,
  ordem de tabulação lógica e layouts utilizáveis a partir de 320 px.
- Decoração nunca pode encobrir conteúdo nem substituir semântica/estado. Todo
  movimento é dispensável, puramente decorativo e removido sob
  `prefers-reduced-motion`.
- Não use imagens/assets GeoCities de terceiros, fontes remotas ou novas
  dependências. Preserve o skip link e o comportamento dos serviços/hooks.
