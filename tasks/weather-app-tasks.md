# Weather App — Backlog de Tarefas

Backlog derivado de [`weather-app-plan.md`](../plans/weather-app-plan.md) e
[`weather-app-spec.md`](../specs/weather-app-spec.md). A ordem abaixo respeita
as dependências; tarefas sem dependências explícitas podem ser executadas em
paralelo.

> **Decisões pendentes da spec:** aprovar a matriz de viewports, metas de
> latência/timeout, padrão e meta de contraste de acessibilidade, precisão de
> arredondamento e obrigações vigentes da Open-Meteo antes de declarar
> prontidão para produção. Não inventar metas para essas decisões durante a
> implementação.

## Entrega 1 — Base da aplicação e contratos

### T-01 — Criar a estrutura base da aplicação

- **Descrição:** estabelecer a entrada React e a página principal, preservando
  a configuração existente de Vite, Tailwind e TypeScript.
- **Critérios de aceite:**
  - A aplicação inicia e compila com `pnpm build`.
  - A página renderiza uma estrutura semântica pt-BR, sem autenticação ou
    persistência de dados no servidor.
  - A base visual é responsiva e não impede busca nem leitura em viewport
    estreito; os viewports definitivos dependem da matriz ainda pendente.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `src/main.tsx`, `src/App.tsx`,
  `src/components/CurrentWeather.tsx`, `src/index.css`.
- **Tipo:** Infra
- **Requisitos:** FR-07, FR-08, FR-09; AC-09, AC-10, AC-11.

### T-02 — Definir os modelos internos e externos

- **Descrição:** criar os tipos compartilhados para localidades, unidade,
  condições atuais, dias de previsão e respostas mínimas da Open-Meteo.
- **Critérios de aceite:**
  - Os modelos representam cidade, coordenadas, país, região opcional, fuso,
    identificador da localidade, temperaturas canônicas em Celsius, condições
    atuais e cinco dias.
  - Os tipos das respostas externas não afirmam validade dos dados recebidos;
    a validação fica a cargo dos serviços.
  - A compilação TypeScript strict passa sem casts inseguros.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `src/types/weather.ts`; a validação de payloads externos
  fica no serviço `src/services/weatherService.ts`.
- **Tipo:** Data
- **Requisitos:** FR-02, FR-03, FR-04, FR-05; AC-04 a AC-07; NFR-05.

## Entrega 2 — Dados e regras meteorológicas

### T-03 — Implementar conversão de temperatura e rótulos meteorológicos

- **Descrição:** criar funções puras para apresentar Celsius/Fahrenheit e
  traduzir códigos WMO para condições em pt-BR.
- **Critérios de aceite:**
  - Celsius é a unidade canônica; Fahrenheit é convertido sem alterar os
    dados recebidos.
  - Códigos WMO conhecidos retornam rótulos pt-BR e códigos desconhecidos
    retornam um rótulo genérico pt-BR sem lançar erro.
  - Os resultados identificam a unidade escolhida; o arredondamento respeita
    a decisão registrada na spec quando definida.
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/utils/temperature.ts` e o mapeamento WMO em
  `src/services/weatherService.ts`.
- **Tipo:** Data
- **Requisitos:** FR-03, FR-05, FR-07; AC-05, AC-07, AC-09.

### T-04 — Integrar a busca de localidades à Open-Meteo

- **Descrição:** normalizar consultas e buscar/mapear opções de localidade,
  sem selecionar um resultado automaticamente.
- **Critérios de aceite:**
  - Espaços no início e no fim são removidos; consulta vazia ou só com espaços
    não aciona `fetch`.
  - A requisição usa a API de geocodificação da Open-Meteo e resultados válidos
    preservam `id`, nome, país, região quando disponível, coordenadas e fuso
    quando disponível.
  - Resposta vazia produz lista vazia; falha HTTP, de rede ou JSON inválido é
    reportada como erro, não como ausência de resultados.
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/services/weatherService.ts`,
  `src/types/weather.ts`.
- **Tipo:** Data
- **Requisitos:** FR-01, FR-02, FR-06; AC-01 a AC-03; NFR-05, NFR-07.

### T-05 — Testar utilitários e geocodificação

- **Descrição:** cobrir as regras puras e os cenários da integração de busca
  com testes unitários.
- **Critérios de aceite:**
  - Testes cobrem consulta normalizada/vazia, mapeamento de cidade com e sem
    região, resultado vazio e respostas/falhas HTTP, rede e JSON inválido.
  - Testes cobrem conversão nos dois sentidos e códigos WMO conhecidos e
    desconhecidos.
  - Os testes passam isoladamente pelo runner Vitest.
- **Dependências:** T-03, T-04.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`,
  `tests/unit/App.test.tsx`.
- **Tipo:** Test
- **Requisitos:** FR-01 a FR-03, FR-05, FR-06; AC-01 a AC-03, AC-05, AC-07.

### T-06 — Integrar e validar a previsão meteorológica

- **Descrição:** consultar o forecast pelas coordenadas do local selecionado e
  validar os dados antes de produzir um relatório interno.
- **Critérios de aceite:**
  - A requisição usa coordenadas, temperatura em Celsius, `timezone=auto` e
    cinco dias; solicita temperatura e condição atuais, além dos campos diários.
  - O serviço exige dados atuais válidos, fuso válido e cinco datas locais
    consecutivas com condição, mínima e máxima.
  - Respostas incompletas, arrays inconsistentes, unidades incompatíveis,
    JSON inválido e falhas HTTP/rede são rejeitados explicitamente; não há
    relatório parcial apresentado como completo.
  - As datas são mantidas conforme o fuso retornado pelo provedor, sem depender
    do fuso do navegador.
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/services/weatherService.ts`,
  `src/types/weather.ts`.
- **Tipo:** Data
- **Requisitos:** FR-03, FR-04, FR-06, FR-07; AC-04, AC-05, AC-06, AC-08,
  AC-09; NFR-05, NFR-07.

### T-07 — Testar validação do forecast

- **Descrição:** verificar parâmetros, mapeamento e rejeição de respostas
  meteorológicas inválidas por meio de `fetch` controlado.
- **Critérios de aceite:**
  - Testes verificam parâmetros da requisição e mapeamento de resposta válida.
  - Testes cobrem HTTP, rede, JSON inválido, fuso ausente, arrays
    inconsistentes e previsão com menos de cinco dias.
  - Uma resposta inválida nunca produz um relatório completo.
- **Dependências:** T-06.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`.
- **Tipo:** Test
- **Requisitos:** FR-03, FR-04, FR-06, FR-07; AC-05, AC-06, AC-08, AC-09;
  NFR-05.

## Entrega 3 — Busca, consulta e apresentação

### T-08 — Criar formulário e resultados de busca acessíveis

- **Descrição:** implementar entrada de busca e opções de localidade com
  seleção explícita.
- **Critérios de aceite:**
  - O formulário permite enviar por teclado, impede busca vazia e mantém o
    texto editável.
  - Cada opção mostra cidade e país, inclui região disponível e pode ser
    selecionada por teclado ou ponteiro.
  - Resultados não são selecionados automaticamente; foco e rótulos acessíveis
    são identificáveis.
- **Dependências:** T-01, T-02.
- **Arquivos prováveis:** `src/components/SearchBar.tsx`,
  `src/components/SearchResults.tsx`.
- **Tipo:** UI
- **Requisitos:** FR-01, FR-02, FR-08; AC-01, AC-02, AC-10; NFR-03, NFR-04.

### T-09 — Orquestrar busca, previsão e recuperação de erros

- **Descrição:** conectar serviços e interface pelo hook de estado da página,
  incluindo carregamento, vazio, sucesso, erros e nova tentativa.
- **Critérios de aceite:**
  - O status diferencia idle, loading, sucesso, busca vazia e erro; durante
    loading, a operação identifica se a busca ou previsão está em andamento.
  - Uma busca com resultados apresenta opções para seleção explícita; não
    seleciona automaticamente a primeira cidade.
  - A seleção explícita consulta usando as coordenadas do local escolhido.
  - Nova tentativa preserva a consulta ou o local da operação que falhou.
  - Respostas antigas não sobrescrevem resultados mais recentes; erros não
    removem silenciosamente a cidade/relatório anterior.
  - Mensagens visíveis são pt-BR e nenhum dado meteorológico incompleto é
    publicado como sucesso.
- **Dependências:** T-04, T-06, T-08.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`, `src/App.tsx`,
  `src/components/states/Error.tsx`.
- **Tipo:** UI
- **Requisitos:** FR-01 a FR-04, FR-06, FR-07; AC-03, AC-04, AC-08, AC-09;
  NFR-04, NFR-05.

### T-10 — Exibir clima atual e previsão de cinco dias

- **Descrição:** apresentar o contexto geográfico, condições atuais e cartões
  diários em ordem cronológica.
- **Critérios de aceite:**
  - A cidade selecionada e seu contexto geográfico permanecem visíveis.
  - O clima atual mostra temperatura e condição em pt-BR.
  - A previsão mostra exatamente cinco datas locais consecutivas, cada uma com
    condição e temperaturas mínima/máxima.
  - Loading, erro e ausência de dados são estados distinguíveis e acessíveis.
- **Dependências:** T-03, T-09.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`,
  `src/components/ForecastList.tsx`, `src/components/ForecastCard.tsx`,
  `src/App.tsx`.
- **Tipo:** UI
- **Requisitos:** FR-03, FR-04, FR-06, FR-07; AC-04 a AC-06, AC-08, AC-09;
  NFR-01, NFR-04.

### T-11 — Alternar unidade em todas as temperaturas

- **Descrição:** adicionar controle Celsius/Fahrenheit e propagar a unidade
  ativa a todos os valores apresentados.
- **Critérios de aceite:**
  - A unidade inicial é Celsius e o controle identifica acessivelmente as
    opções °C e °F.
  - Alternar a unidade atualiza temperatura atual, mínimas e máximas, com
    identificação °C ou °F em cada valor.
  - A troca não altera cidade, datas ou dados canônicos nem dispara nova busca
    meteorológica.
  - A preferência permanece apenas em memória durante a sessão; não é gravada
    em servidor.
- **Dependências:** T-03, T-09, T-10.
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`,
  `src/components/CurrentWeather.tsx`,
  `src/components/ForecastList.tsx`, `src/components/ForecastCard.tsx`,
  `src/App.tsx`.
- **Tipo:** UI
- **Requisitos:** FR-05, FR-09; AC-07, AC-11; NFR-03, NFR-08.

## Entrega 4 — Qualidade e fluxo completo

### T-12 — Validar responsividade e acessibilidade do fluxo

- **Descrição:** ajustar o fluxo principal para teclado, foco visível e telas
  móveis, sem presumir viewports ainda não aprovados.
- **Critérios de aceite:**
  - Busca, seleção, consulta e alternância de unidade podem ser concluídas por
    teclado, com ordem lógica e foco visível.
  - Controles e anúncios de estado têm rótulos semânticos acessíveis.
  - Em viewports de verificação, controles e conteúdo essencial não se
    sobrepõem nem são cortados.
  - Não se declara conformidade formal nem meta de contraste que ainda não
    tenha sido aprovada na spec.
- **Dependências:** T-08, T-10, T-11.
- **Arquivos prováveis:** `src/components/*.tsx`, `src/index.css`.
- **Tipo:** UI
- **Requisitos:** FR-08; AC-10; NFR-02, NFR-03, NFR-04.

### T-13 — Testar componentes e estados da interface

- **Descrição:** validar interações, acessibilidade e estados de busca e clima
  com Testing Library.
- **Critérios de aceite:**
  - Testes cobrem loading, sucesso, resultado vazio, erro e retry preservando a
    consulta/local.
  - Testes cobrem seleção por teclado e ponteiro, rótulos e foco.
  - Alternar unidade atualiza todas as temperaturas sem alterar cidade ou
    datas.
  - Testes cobrem exatamente cinco dias e não exibem relatório inválido.
- **Dependências:** T-09, T-10, T-11, T-12.
- **Arquivos prováveis:** `tests/unit/SearchBar.test.tsx`,
  `tests/unit/App.test.tsx`, `tests/unit/UnitToggle.test.tsx`,
  `tests/unit/WeatherStates.test.tsx`.
- **Tipo:** Test
- **Requisitos:** FR-01 a FR-08; AC-01 a AC-10; NFR-03 a NFR-05.

### T-14 — Cobrir o fluxo principal com testes E2E

- **Descrição:** automatizar o fluxo completo de busca, seleção, visualização,
  alternância de unidade e recuperação de falha.
- **Critérios de aceite:**
  - Com respostas de rede controladas, o teste percorre busca, seleção, clima
    atual, cinco dias e alternância °C/°F.
  - Um cenário de falha verifica mensagem apropriada e retry sem redigitação.
  - Um cenário por teclado verifica navegação e seleção sem ponteiro.
  - A verificação de layout cobre a matriz de viewports aprovada; enquanto ela
    estiver pendente, registra os viewports usados sem alegar cobertura
    universal.
- **Dependências:** T-12, T-13.
- **Arquivos prováveis:** `tests/e2e/weather-flow.spec.ts`,
  `playwright.config.ts`.
- **Tipo:** Test
- **Requisitos:** FR-01 a FR-08; AC-01 a AC-10; NFR-02 a NFR-05.

## Entrega 5 — Direção visual GeoCities

### T-15 — Definir o tema GeoCities e as instruções de Tailwind

- **Descrição:** substituir a direção antiga de dark glassmorphism por um
  sistema visual kitsch/GeoCities compartilhado, documentando no tema Tailwind
  e nas instruções do workspace os tokens, utilitários e limites de uso.
- **Critérios de aceite:**
  - O tema nomeia as cores aprovadas `#FF00A8`, `#00E5FF`, `#FFF000`,
    `#7B2CFF` e `#39FF14`, permitindo usar pelo menos quatro em cada estado
    relevante sem depender de cores ou estilos de glassmorphism.
  - As instruções orientam tipografia serifada/display com fallbacks locais,
    padrões tiled ou gradientes, divisórias e bevel/molduras, sempre
    subordinados à legibilidade, ao foco, ao teclado e à responsividade.
  - As instruções proíbem imagens de terceiros e novas dependências e exigem
    `prefers-reduced-motion` para qualquer movimento decorativo.
- **Dependências:** T-01.
- **Arquivos prováveis:** `tailwind.config.js`,
  `.github/instructions/tailwind.instructions.md`,
  `src/styles/visual-system.css`.
- **Tipo:** Infra
- **Requisitos:** US-05; AC-12 a AC-16; NFR-09.

### T-16 — Implementar a camada CSS visual GeoCities

- **Descrição:** criar os tokens e utilitários CSS compartilhados para
  tipografia retrô, fundos tiled/gradientes, divisórias decorativas,
  bevel/molduras e estados de foco, sem imagens externas ou bibliotecas novas.
- **Critérios de aceite:**
  - A camada fornece decoração estática e combinações de texto/informação
    legíveis, sem ocultar conteúdo, labels ou estados da aplicação.
  - Botões e cartões podem receber moldura marcada ou relevo, e existe uma
    divisória claramente decorativa que não é confundida com controle.
  - Qualquer animação decorativa é dispensável, não comunica estado e é
    removida ou reduzida sob `prefers-reduced-motion`.
  - O CSS não adiciona imagens de terceiros nem dependências ao projeto.
- **Dependências:** T-15.
- **Arquivos prováveis:** `src/styles/visual-system.css`, `src/index.css`,
  `tailwind.config.js`.
- **Tipo:** UI
- **Requisitos:** US-05; AC-12 a AC-14, AC-16; NFR-09.

### T-17 — Aplicar a camada GeoCities aos estados e componentes

- **Descrição:** aplicar o sistema visual compartilhado à casca, busca,
  resultados, clima atual, previsão, alternância de unidade e estados vazio,
  loading e erro, preservando o fluxo e o conteúdo existentes.
- **Critérios de aceite:**
  - A interface usa pelo menos quatro cores saturadas aprovadas em áreas de
    destaque, fundos ou ornamentos em todos os estados relevantes.
  - Títulos/chamadas usam tipografia serifada ou display retrô; existe fundo
    tiled ou gradiente, divisória decorativa e cartões/controles emoldurados.
  - Ornamentos ficam fora do caminho de leitura, não se passam por controles e
    não alteram a semântica, os labels ou a ordem do fluxo.
- **Dependências:** T-08, T-09, T-10, T-11, T-16.
- **Arquivos prováveis:** `src/App.tsx`, `src/components/*.tsx`,
  `src/styles/visual-system.css`, `src/index.css`.
- **Tipo:** UI
- **Requisitos:** US-05; AC-12 a AC-14; NFR-09.

### T-18 — Validar manualmente a composição responsiva e acessível

- **Descrição:** revisar a camada visual aplicada durante o fluxo de busca,
  seleção e consulta em 320 px e em viewport desktop, incluindo estados e
  navegação exclusivamente por teclado.
- **Critérios de aceite:**
  - Em 320 px e desktop, não há conteúdo essencial cortado ou sobreposto; os
    textos, labels, controles e quatro cores saturadas permanecem legíveis e
    identificáveis.
  - Tabulação, seleção e ativação funcionam sem ponteiro, com ordem lógica e
    foco visível preservado apesar dos ornamentos e molduras.
  - Com `prefers-reduced-motion` ativo, nenhuma animação decorativa permanece
    necessária nem transmite informação ou estado.
  - A revisão registra os viewports usados e corrige qualquer conflito entre
    decoração, leitura, foco e operação antes de aprovar a direção visual.
- **Dependências:** T-12, T-17.
- **Arquivos prováveis:** `src/components/*.tsx`, `src/index.css`,
  `src/styles/visual-system.css`, `playwright.config.ts`.
- **Tipo:** Test
- **Requisitos:** US-05; AC-12 a AC-16; NFR-02, NFR-03, NFR-04, NFR-09.

### T-19 — Automatizar a validação visual e de movimento

- **Descrição:** ampliar os testes de componente e E2E para verificar a
  direção GeoCities nos estados relevantes e o fluxo responsivo/acessível,
  combinando assertions de estrutura, estilos, teclado e viewport em vez de
  depender apenas de comparação de pixels.
- **Critérios de aceite:**
  - Os cenários executam em 320 px e desktop e verificam ausência de corte ou
    sobreposição, legibilidade, identificação dos controles, foco visível e
    ordem de teclado.
  - Os estados carregado, vazio, loading e erro verificam pelo menos quatro
    cores da paleta, tipografia retrô, fundo tiled/gradiente, divisória e
    bevel/moldura sem substituir conteúdo informativo.
  - Um cenário com `prefers-reduced-motion` confirma que movimento decorativo é
    removido/reduzido e que nenhum estado depende dele.
  - A validação não requer imagens de terceiros nem instalação de dependência.
- **Dependências:** T-13, T-14, T-18.
- **Arquivos prováveis:** `tests/components/*.test.tsx`,
  `tests/e2e/weather-flow.spec.ts`, `playwright.config.ts`.
- **Tipo:** Test
- **Requisitos:** US-05; AC-12 a AC-16; NFR-02, NFR-03, NFR-04, NFR-09.

### T-20 — Consolidar a revisão da direção visual aprovada

- **Descrição:** executar a revisão final da implementação GeoCities e
  confirmar que tema, CSS, instruções do workspace e validações permanecem
  alinhados à spec, sem reintroduzir dark glassmorphism.
- **Critérios de aceite:**
  - `pnpm lint`, `pnpm test` e `pnpm build` passam após a atualização visual.
  - A revisão confirma a presença dos quatro requisitos visuais principais,
    uso em 320 px e desktop, foco/teclado, legibilidade, ausência de
    corte/sobreposição e comportamento de movimento reduzido.
  - Nenhum arquivo de spec, plano ou código é alterado por esta tarefa de
    planejamento.
- **Dependências:** T-18, T-19.
- **Arquivos prováveis:** `tasks/weather-app-tasks.md`,
  `src/styles/visual-system.css`, `.github/instructions/tailwind.instructions.md`,
  `tests/e2e/weather-flow.spec.ts`.
- **Tipo:** Test
- **Requisitos:** US-05; AC-12 a AC-16; NFR-02, NFR-03, NFR-04, NFR-09.
