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
  `src/components/WeatherPage.tsx`, `src/index.css`.
- **Tipo:** Infra
- **Requisitos:** FR-07, FR-08, FR-09; AC-09, AC-10, AC-11.

### T-02 — Definir os modelos internos e externos

- **Descrição:** criar os tipos compartilhados para localidades, unidade,
  condições atuais, dias de previsão e respostas mínimas da Open-Meteo.
- **Critérios de aceite:**
  - Os modelos representam cidade, coordenadas, país, região opcional, fuso,
    temperaturas canônicas em Celsius, códigos meteorológicos e cinco dias.
  - Os tipos das respostas externas não afirmam validade dos dados recebidos;
    a validação fica a cargo dos serviços.
  - A compilação TypeScript strict passa sem casts inseguros.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `src/types/weather.ts`, `src/types/openMeteo.ts`.
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
- **Arquivos prováveis:** `src/utils/temperature.ts`,
  `src/utils/weatherCode.ts`.
- **Tipo:** Data
- **Requisitos:** FR-03, FR-05, FR-07; AC-05, AC-07, AC-09.

### T-04 — Integrar a busca de localidades à Open-Meteo

- **Descrição:** normalizar consultas e buscar/mapear opções de localidade,
  sem selecionar um resultado automaticamente.
- **Critérios de aceite:**
  - Espaços no início e no fim são removidos; consulta vazia ou só com espaços
    não aciona `fetch`.
  - A requisição usa a API de geocodificação da Open-Meteo e resultados válidos
    preservam nome, país, região quando disponível, coordenadas e fuso quando
    disponível.
  - Resposta vazia produz lista vazia; falha HTTP, de rede ou JSON inválido é
    reportada como erro, não como ausência de resultados.
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/services/geocoding.ts`,
  `src/types/openMeteo.ts`.
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
- **Arquivos prováveis:** `tests/unit/temperature.test.ts`,
  `tests/unit/weatherCode.test.ts`, `tests/unit/geocoding.test.ts`.
- **Tipo:** Test
- **Requisitos:** FR-01 a FR-03, FR-05, FR-06; AC-01 a AC-03, AC-05, AC-07.

### T-06 — Integrar e validar a previsão meteorológica

- **Descrição:** consultar o forecast pelas coordenadas do local selecionado e
  validar os dados antes de produzir um relatório interno.
- **Critérios de aceite:**
  - A requisição usa coordenadas, temperatura em Celsius, `timezone=auto` e
    cinco dias; solicita campos atuais e diários necessários.
  - O serviço exige dados atuais válidos, fuso válido e cinco datas locais
    consecutivas com condição, mínima e máxima.
  - Respostas incompletas, arrays inconsistentes, unidades incompatíveis,
    JSON inválido e falhas HTTP/rede são rejeitados explicitamente; não há
    relatório parcial apresentado como completo.
  - As datas são mantidas conforme o fuso retornado pelo provedor, sem depender
    do fuso do navegador.
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/services/forecast.ts`,
  `src/types/weather.ts`, `src/types/openMeteo.ts`.
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
- **Arquivos prováveis:** `tests/unit/forecast.test.ts`.
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
- **Arquivos prováveis:** `src/components/SearchForm.tsx`,
  `src/components/SearchResults.tsx`.
- **Tipo:** UI
- **Requisitos:** FR-01, FR-02, FR-08; AC-01, AC-02, AC-10; NFR-03, NFR-04.

### T-09 — Orquestrar busca, previsão e recuperação de erros

- **Descrição:** conectar serviços e interface pelo hook de estado da página,
  incluindo carregamento, vazio, sucesso, erros e nova tentativa.
- **Critérios de aceite:**
  - O fluxo mantém busca e previsão em estados distintos, sem confundir erro
    com resultado vazio.
  - A seleção explícita consulta usando as coordenadas do local escolhido.
  - Nova tentativa preserva a consulta ou o local da operação que falhou.
  - Respostas antigas não sobrescrevem resultados mais recentes; erros não
    removem silenciosamente a cidade/relatório anterior.
  - Mensagens visíveis são pt-BR e nenhum dado meteorológico incompleto é
    publicado como sucesso.
- **Dependências:** T-04, T-06, T-08.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`,
  `src/components/WeatherPage.tsx`.
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
  `src/components/DailyForecast.tsx`, `src/components/WeatherPage.tsx`.
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
  `src/components/DailyForecast.tsx`, `src/hooks/useWeather.ts`.
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
- **Arquivos prováveis:** `tests/components/SearchForm.test.tsx`,
  `tests/components/SearchResults.test.tsx`,
  `tests/components/WeatherPage.test.tsx`,
  `tests/components/UnitToggle.test.tsx`.
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
