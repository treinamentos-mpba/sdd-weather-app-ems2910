# Especificação do aplicativo de previsão do tempo

## Visão geral
Aplicação web de previsão do tempo para consultar as condições atuais de uma cidade e planejar os próximos dias. O fluxo principal é buscar uma cidade, selecioná-la explicitamente e consultar o clima atual e a previsão diária de hoje mais os quatro dias seguintes. A interface será em português do Brasil (pt-BR), com temperaturas em Celsius por padrão e opção de Fahrenheit.
A fonte de geocodificação e dados meteorológicos será Open-Meteo, sem API key. A aplicação não terá autenticação nem persistência de dados no servidor.
**Direção visual:** a interface terá aparência deliberadamente kitsch, exagerada e “feia”, inspirada em sites pessoais GeoCities dos anos 1990. A composição deve parecer intencionalmente carregada e nostálgica, sem comprometer leitura, operação por teclado ou adaptação a telas pequenas. A direção será construída sem depender de imagens de terceiros.
Personas principais:

- Pessoa que planeja a rotina diária e consulta o clima para decidir o que vestir e como se preparar.
- Viajante que busca a cidade de destino e consulta a previsão para organizar a viagem.
- Pessoa que prefere Celsius ou Fahrenheit e alterna a unidade para interpretar as temperaturas.

## Requisitos funcionais

- **FR-01 - Buscar cidades:** aceitar uma consulta por nome de cidade. Remover espaços no início e no fim; se o campo ficar vazio, não consultar a API.
- **FR-02 - Identificar resultados:** cada resultado deve mostrar nome da cidade, país e região administrativa quando fornecida pela API. Não selecionar resultados automaticamente; o usuário escolhe o local.
- **FR-03 - Consultar clima atual:** após a seleção, consultar Open-Meteo pelas coordenadas do local e exibir temperatura e condição meteorológica atual com rótulo em pt-BR.
- **FR-04 - Consultar previsão diária:** exibir exatamente cinco datas locais, começando pela data atual do local selecionado. Cada data mostra condição e temperaturas mínima e máxima.
- **FR-05 - Alternar unidades:** iniciar em Celsius e permitir alternar para Fahrenheit. Aplicar a escolha à temperatura atual e a todas as mínimas e máximas, mantendo cidade e período.
- **FR-06 - Informar estados da consulta:** distinguir carregamento, resultados vazios, falha de busca e falha de previsão. Em falha recuperável, permitir repetir a consulta sem redigitar a cidade.
- **FR-07 - Localizar interface:** apresentar textos, condições meteorológicas e formatos de data da interface em pt-BR; datas da previsão seguem o fuso horário do local consultado.
- **FR-08 - Usar em dispositivos móveis:** permitir busca, seleção e leitura das informações em telas móveis, mantendo disponíveis as funções principais.
- **FR-09 - Operar sem conta ou persistência no servidor:** não exigir login e não armazenar buscas, locais ou preferências em um servidor da aplicação.

## Histórias de usuário

- **US-01 - Consulta diária:** Como pessoa que planeja a rotina diária, quero buscar minha cidade e ver o clima atual para decidir como me preparar para o dia.
- **US-02 - Planejamento de viagem:** Como viajante, quero buscar a cidade de destino e ver a previsão de hoje e dos quatro dias seguintes para planejar a viagem.
- **US-03 - Preferência de unidade:** Como pessoa com preferência por uma escala de temperatura, quero alternar entre Celsius e Fahrenheit para entender os valores com facilidade.
- **US-04 - Uso móvel:** Como usuário de dispositivo móvel, quero buscar cidades e consultar o clima em uma tela pequena para acessar as informações fora de casa.
- **US-05 - Experiência visual kitsch:** Como pessoa usuária, quero uma interface visualmente exagerada e inspirada em sites pessoais dos anos 1990 para ter uma experiência marcante, sem perder legibilidade nem facilidade de uso.

## Critérios de aceite

- **AC-01 - Consulta vazia:** Dado que o campo de busca está vazio ou contém apenas espaços, quando o usuário envia a busca, então a aplicação não envia uma requisição e mantém a interface utilizável.
- **AC-02 - Resultados de busca:** Dada uma consulta não vazia com correspondências, quando a busca termina, então cada opção mostra cidade e país, inclui a região administrativa quando disponível e pode ser selecionada por ação explícita do usuário.
- **AC-03 - Sem resultados:** Dada uma consulta sem correspondências, quando a busca termina, então a aplicação mostra uma mensagem em pt-BR indicando que nenhuma cidade foi encontrada e permite editar a consulta.
- **AC-04 - Seleção e identificação do local:** Dado que o usuário seleciona um resultado, quando a consulta meteorológica termina, então a aplicação mantém visível o nome e contexto geográfico desse local e usa suas coordenadas, não apenas o texto digitado, para obter os dados.
- **AC-05 - Clima atual:** Dada uma resposta válida do provedor para o local selecionado, quando a aplicação exibe o clima atual, então mostra temperatura em Celsius por padrão e a condição meteorológica com texto em pt-BR.
- **AC-06 - Previsão de cinco dias:** Dada uma resposta válida com previsão diária, quando a aplicação exibe a previsão, então mostra cinco datas consecutivas em ordem cronológica, começando pela data local atual do local selecionado, cada uma com condição e mínima/máxima.
- **AC-07 - Alternância de unidade:** Dado que os dados estão visíveis, quando o usuário alterna a unidade, então todas as temperaturas atuais e mínimas/máximas mostram a unidade escolhida e nenhuma cidade ou data muda. Cada valor deve identificar °C ou °F.
- **AC-08 - Carregamento e falhas:** Dado que uma consulta está em andamento ou falha, quando a aplicação recebe a resposta ou detecta a falha, então exibe o estado correspondente; falhas recuperáveis oferecem nova tentativa e não apresentam dados incompletos como previsão completa.
- **AC-09 - Idioma e datas:** Dado qualquer estado da aplicação, quando textos ou datas são exibidos, então a interface está em pt-BR e as cinco datas correspondem ao fuso horário do local selecionado.
- **AC-10 - Teclado e viewport móvel:** Dado que o usuário navega por teclado ou usa um viewport incluído na matriz de suporte, quando realiza busca e seleção, então consegue alcançar os controles, identificar o foco e selecionar um resultado sem depender do ponteiro; não há sobreposição nem corte de conteúdo essencial.
- **AC-11 - Sem conta ou armazenamento no servidor:** Dada uma sessão de uso, quando o usuário consulta uma cidade ou altera a unidade, então o fluxo não exige autenticação e a aplicação não grava esses dados em armazenamento persistente no servidor.
- **AC-12 - Paleta kitsch:** Dada a interface em qualquer estado, quando a tela é inspecionada, então ela usa pelo menos quatro cores saturadas e visualmente contrastantes da paleta (magenta `#FF00A8`, ciano `#00E5FF`, amarelo `#FFF000`, roxo `#7B2CFF` e verde-limão `#39FF14`) em áreas de destaque, fundos ou ornamentos; texto e informação essencial usam combinações legíveis, sem alegar conformidade com uma norma formal de contraste.
- **AC-13 - Tipografia e fundos decorativos:** Dada a tela carregada, quando a direção visual é inspecionada, então títulos e chamadas usam tipografia serifada ou display com aparência retrô e pelo menos uma área de fundo emprega padrão repetido/tiled ou gradiente; esses recursos não substituem nem obscurecem texto informativo.
- **AC-14 - Ornamentos e componentes emoldurados:** Dada a tela com resultados ou previsão, quando a interface é inspecionada, então há pelo menos uma divisória decorativa claramente visível e cartões ou botões apresentam borda em relevo/bevel ou moldura marcada; ornamentos não são confundidos com controles nem prejudicam a identificação dos controles reais.
- **AC-15 - Validação visual responsiva e acessível:** Dada a interface exibida em 320 px de largura e em um viewport desktop, quando o fluxo de busca, seleção e consulta é percorrido por teclado e visualmente, então nenhum conteúdo essencial fica cortado ou sobreposto, todos os textos e rótulos permanecem legíveis, os controles continuam identificáveis e utilizáveis por teclado, e o foco visível e a ordem de navegação lógica são preservados.
- **AC-16 - Movimento decorativo:** Dado que haja animação puramente decorativa, quando a preferência `prefers-reduced-motion` estiver ativa, então a animação é removida ou reduzida; nenhuma informação ou estado depende de animação para ser percebido.

## Requisitos não funcionais

- **NFR-01 - Idioma/localização:** textos da interface e descrições meteorológicas devem estar em pt-BR; datas e intervalo diário devem usar o fuso horário do local selecionado.
- **NFR-02 - Responsividade:** busca e previsão devem ser utilizáveis em todos os viewports definidos na matriz de suporte. A matriz ainda precisa ser aprovada.
- **NFR-03 - Acessibilidade:** controles devem ter rótulos acessíveis, foco visível e ordem de navegação lógica; todo fluxo principal deve funcionar por teclado. O padrão de conformidade e a meta de contraste ainda precisam ser definidos.
- **NFR-04 - Usabilidade:** cidade selecionada, unidade ativa e estados de carregamento, erro e ausência de resultados devem ser identificáveis sem ambiguidade.
- **NFR-05 - Confiabilidade:** validar respostas da API antes de exibi-las; falhas ou dados incompletos não podem ser apresentados como previsão completa. Falhas recuperáveis devem permitir nova tentativa.
- **NFR-06 - Desempenho:** definir metas de latência para busca e carregamento meteorológico, incluindo percentil e condições de rede; a meta numérica ainda está pendente.
- **NFR-07 - Integração externa:** usar Open-Meteo para geocodificação e meteorologia sem API key. Uso, atribuição e tratamento de limites devem cumprir os termos vigentes do provedor.
- **NFR-08 - Dados e privacidade:** não exigir autenticação nem persistir buscas, localização selecionada ou unidade em servidor da aplicação. Persistência local da unidade ainda precisa de decisão.
- **NFR-09 - Direção visual:** aplicar a estética kitsch/GeoCities dos anos 1990 descrita na visão geral: cores saturadas e contrastantes, tipografia serifada/display, fundos tiled ou gradientes, divisórias decorativas e aparência bevel/moldura em botões ou cartões. A estética deve permanecer subordinada à leitura, aos labels, ao foco, ao uso por teclado e à responsividade entre 320 px e desktop. Não exigir imagens de terceiros; animações decorativas devem respeitar `prefers-reduced-motion` e não transmitir informação necessária.

## Casos de borda

- Campo de busca vazio ou contendo apenas espaços.
- Nenhuma cidade encontrada para o termo informado.
- Várias cidades com o mesmo nome ou resultados sem dados suficientes para diferenciá-las.
- Falha de rede, timeout, limite de requisições ou indisponibilidade da Open-Meteo durante busca ou previsão.
- Resposta inválida, incompleta ou sem dados para uma ou mais datas solicitadas.
- Mudança de data local da cidade durante a consulta, especialmente perto da meia-noite ou em fuso horário diferente do dispositivo do usuário.
- Alternância de unidade enquanto os dados estão carregando; a seleção de cidade deve permanecer intacta e os dados devem usar a unidade escolhida ao serem exibidos.
- Falha de previsão após sucesso na busca ou no clima atual; não apresentar os dados já obtidos como se fossem uma previsão completa.
- Resposta do provedor sem região administrativa ou sem fuso horário; usar campos disponíveis sem bloquear a seleção, e não inferir uma data local sem zona horária válida.
- Teclado ou viewport suportado que possa ocultar resultados, controles ou mensagens de estado.
- Paleta saturada, fundo decorativo, divisórias ou molduras que reduzam a legibilidade do conteúdo ou confundam decoração com controle interativo.
- Viewport de 320 px em que padrões, ornamentos ou componentes emoldurados causem corte, sobreposição ou rolagem horizontal do conteúdo essencial.
- Preferência por movimento reduzido ativa enquanto elementos decorativos animados estiverem presentes.

## Premissas

Decisões confirmadas:

- Open-Meteo será a fonte de geocodificação e dados meteorológicos, sem API key.
- “Cinco dias” significa hoje e os quatro dias seguintes, de acordo com o dia local da cidade consultada.
- A unidade inicial será Celsius; Fahrenheit também estará disponível.
- Não haverá autenticação nem persistência de dados no servidor.
- O idioma da interface será pt-BR.

Premissas de implementação a confirmar:

- A aplicação será acessada pela web, a busca será feita por nome de cidade e a seleção será explícita.
- A troca entre Celsius e Fahrenheit afeta apenas a apresentação das temperaturas.
- O resumo diário exibirá condição meteorológica e temperaturas mínima/máxima; não haverá previsão por hora.
- A direção visual kitsch/GeoCities é um requisito aprovado. A paleta de destaque de referência é magenta `#FF00A8`, ciano `#00E5FF`, amarelo `#FFF000`, roxo `#7B2CFF` e verde-limão `#39FF14`; os usos devem preservar combinações legíveis para texto e informação essencial.
- Os padrões de fundo, gradientes, divisórias e molduras podem ser criados sem imagens de terceiros.

## Riscos

As probabilidades são qualitativas e preliminares: **Baixa** significa improvável nas condições normais de uso; **Média**, plausível durante a operação; **Alta**, provável ou recorrente. As classificações devem ser revistas com dados de uso e operação.

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Cidades homônimas podem levar à seleção do local errado. | Média | Alto: o usuário pode consultar a previsão de uma cidade diferente da pretendida. | Mostrar cidade, país e região administrativa quando disponível; consultar pelo identificador/coordenadas do resultado selecionado. |
| Indisponibilidade, limites de uso ou mudanças na Open-Meteo podem impedir a exibição dos dados. | Média | Alto: busca ou previsão pode ficar indisponível e bloquear o fluxo principal. | Validar respostas, tratar erros e limites, configurar timeout após definição operacional e oferecer nova tentativa. Confirmar termos e atribuição do provedor. |
| Dados desatualizados ou incompletos podem resultar em previsão incorreta ou parcial. | Média | Alto: o usuário pode tomar decisões com informação meteorológica defasada ou faltando dias. | Definir política de atualização, validar integridade e não rotular dados parciais como previsão completa. |
| Experiência móvel inadequada pode dificultar leitura e uso dos controles. | Média | Alto: usuários móveis podem não conseguir completar o fluxo principal. | Definir matriz de viewports e validar busca, seleção, leitura e teclado em cada viewport suportado. |
| A estética deliberadamente carregada pode comprometer legibilidade, reconhecimento dos controles ou uso em telas pequenas. | Média | Alto: a direção visual pode tornar o fluxo principal difícil de utilizar. | Validar AC-12 a AC-16 em 320 px e desktop; manter cores e ornamentos fora do caminho de leitura, preservar labels/foco/teclado e eliminar animações não essenciais com `prefers-reduced-motion`. |
| Cobertura geográfica ou localização das datas inadequada pode confundir usuários. | Média | Médio: cidades esperadas podem não aparecer ou as datas podem divergir do dia local. | Definir países suportados, apresentar o contexto disponível e usar o fuso horário retornado para o local. |

## Fora de escopo

- Autenticação de usuários.
- Persistência de dados no servidor.
- Geolocalização automática do dispositivo; o fluxo começa pela busca manual de cidade.
- Previsões para datas além de hoje e dos quatro dias seguintes.
- Previsão por hora; o produto exibe apenas resumo diário.
- Dados meteorológicos adicionais além de condição atual, temperatura atual, condição diária e temperaturas mínima/máxima diárias.
- Contas, histórico, cidades favoritas, alertas, notificações e mapas meteorológicos.
- Dependência obrigatória de imagens hospedadas por terceiros para compor a direção visual.

## Questões em aberto

- Quais países e regiões devem ser aceitos na busca?
- Quais navegadores e dimensões de viewport compõem a matriz de suporte?
- Qual a política de atualização dos dados meteorológicos (somente ao consultar/atualizar, ou atualização automática) e como informar a hora da última atualização?
- A unidade selecionada deve durar somente até a navegação atual ou persistir localmente após recarregar? O servidor não poderá persistir essa preferência.
- Quais metas de latência devem ser adotadas para busca e clima, incluindo percentil, condições de rede e timeout?
- Qual padrão formal de acessibilidade e quais metas mensuráveis de contraste devem ser adotados? Até essa decisão, exigir combinações legíveis sem alegar conformidade com WCAG ou outra norma.
- Quais fontes específicas, além da categoria serifada/display, serão escolhidas para títulos e chamadas?
- Qual precisão/arredondamento será aplicado às temperaturas exibidas?
- Quais limites de requisição, atribuições e demais obrigações de uso da Open-Meteo se aplicam à publicação do produto?

**Prontidão:** a especificação permite iniciar prototipação e implementação do fluxo principal, mas ainda não é suficiente para declarar a entrega pronta para produção. Os itens acima precisam ser decididos e convertidos em critérios mensuráveis antes de fechar escopo de lançamento, testes de compatibilidade e metas operacionais.

## Matriz de rastreabilidade

| User Story | Acceptance Criteria | Non-Functional Requirements |
| --- | --- | --- |
| US-01 - Consulta diária | AC-01, AC-02, AC-03, AC-04, AC-05, AC-08, AC-09, AC-11 | NFR-01, NFR-03, NFR-04, NFR-05, NFR-06, NFR-07, NFR-08 |
| US-02 - Planejamento de viagem | AC-02, AC-04, AC-06, AC-08, AC-09, AC-11 | NFR-01, NFR-03, NFR-04, NFR-05, NFR-06, NFR-07, NFR-08 |
| US-03 - Preferência de unidade | AC-05, AC-07, AC-11 | NFR-03, NFR-04, NFR-08 |
| US-04 - Uso móvel | AC-01, AC-02, AC-03, AC-10 | NFR-02, NFR-03, NFR-04 |
| US-05 - Experiência visual kitsch | AC-12, AC-13, AC-14, AC-15, AC-16 | NFR-02, NFR-03, NFR-04, NFR-09 |