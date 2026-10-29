# Weather App Specification

## Overview

Aplicação web de previsão do tempo para pessoas que precisam consultar as condições atuais de uma cidade ou planejar os próximos dias. O usuário poderá buscar uma cidade, consultar o clima atual e a previsão de hoje mais os quatro dias seguintes, e alternar a temperatura entre Celsius e Fahrenheit. A interface será em português do Brasil (pt-BR) e deverá funcionar em dispositivos móveis.

A fonte de geocodificação e dados meteorológicos será Open-Meteo, sem API key. A aplicação não terá autenticação nem persistência de dados no servidor.

Personas principais:

- Pessoa que planeja a rotina diária e consulta o clima para decidir o que vestir e como se preparar.
- Viajante que busca a cidade de destino e consulta a previsão para organizar a viagem.
- Pessoa que prefere Celsius ou Fahrenheit e alterna a unidade para interpretar as temperaturas.

## Functional Requirements

- **FR-01 - Buscar cidades:** permitir que o usuário pesquise cidades por nome e visualize resultados selecionáveis.
- **FR-02 - Identificar resultados:** apresentar contexto geográfico suficiente nos resultados para ajudar a diferenciar cidades homônimas. Os campos exatos de localização permanecem em aberto.
- **FR-03 - Consultar clima atual:** após a seleção de uma cidade, exibir suas condições meteorológicas atuais, incluindo temperatura e condição do tempo.
- **FR-04 - Consultar previsão:** exibir a previsão para exatamente cinco datas locais: hoje na cidade selecionada e os quatro dias seguintes.
- **FR-05 - Alternar unidades:** iniciar em Celsius e permitir alternar entre Celsius e Fahrenheit. A unidade escolhida deve ser aplicada às temperaturas atuais e às da previsão sem alterar a cidade selecionada.
- **FR-06 - Informar estado da consulta:** apresentar estados de carregamento, resultados vazios e falhas de busca ou consulta meteorológica, com uma forma de tentar novamente quando aplicável.
- **FR-07 - Usar em dispositivos móveis:** permitir realizar a busca e consultar as informações em telas móveis, sem perda das funções principais.

## User Stories

- **US-01 - Consulta diária:** Como pessoa que planeja a rotina diária, quero buscar minha cidade e ver o clima atual para decidir como me preparar para o dia.
- **US-02 - Planejamento de viagem:** Como viajante, quero buscar a cidade de destino e ver a previsão de hoje e dos quatro dias seguintes para planejar a viagem.
- **US-03 - Preferência de unidade:** Como pessoa com preferência por uma escala de temperatura, quero alternar entre Celsius e Fahrenheit para entender os valores com facilidade.
- **US-04 - Uso móvel:** Como usuário de dispositivo móvel, quero buscar cidades e consultar o clima em uma tela pequena para acessar as informações fora de casa.

## Acceptance Criteria

- **AC-01 - Busca e seleção:** Given que o usuário informa o nome de uma cidade, when há resultados correspondentes, then a aplicação mostra opções selecionáveis com contexto geográfico e permite escolher uma delas.
- **AC-02 - Clima atual:** Given que uma cidade foi selecionada e os dados foram carregados, when a consulta termina, then a aplicação identifica a cidade e mostra a temperatura atual em Celsius por padrão e a condição meteorológica atual.
- **AC-03 - Cinco dias:** Given que uma cidade foi selecionada, when a previsão está disponível, then são exibidas cinco datas locais em ordem cronológica, começando por hoje e incluindo os quatro dias seguintes.
- **AC-04 - Alternância de unidade:** Given que clima atual e previsão estão visíveis, when o usuário alterna de Celsius para Fahrenheit ou vice-versa, then todas as temperaturas exibidas passam à unidade escolhida sem mudar a cidade ou o período da previsão.
- **AC-05 - Idioma:** Given qualquer estado da interface, when o usuário navega pela aplicação, then textos, rótulos e mensagens da interface estão em português do Brasil.
- **AC-06 - Estados de consulta:** Given uma busca sem resultados ou uma falha da fonte de dados, when a consulta termina, then a aplicação informa claramente que não há resultados ou que ocorreu uma falha e, em falhas recuperáveis, oferece nova tentativa.
- **AC-07 - Uso móvel e teclado:** Given uma tela móvel ou navegação por teclado, when o usuário realiza a busca e consulta os dados, then os controles e informações permanecem acessíveis e utilizáveis sem conteúdo essencial cortado ou sobreposto.

## Non-Functional Requirements

- **Responsividade:** as funções centrais devem permanecer disponíveis em dispositivos móveis; o conjunto de navegadores e dimensões suportados ainda precisa ser definido.
- **Acessibilidade:** busca e alternância de unidade devem ter rótulos compreensíveis, ordem de foco lógica e operação por teclado. Texto e controles devem ter contraste adequado.
- **Usabilidade:** cidade selecionada, unidade ativa e estados de carregamento, erro ou ausência de resultados devem ser identificáveis sem ambiguidade.
- **Confiabilidade:** respostas inválidas, incompletas ou indisponibilidade da API não devem ser apresentadas como dados atuais válidos; deve ser possível recuperar-se de falhas transitórias.
- **Desempenho:** buscas e atualização do clima devem responder em tempo adequado ao uso. Um limite numérico de latência ainda precisa ser definido.
- **Idioma e localização:** a interface deve usar pt-BR; as datas da previsão devem corresponder ao dia local da cidade consultada.
- **Integração externa:** consultas meteorológicas e geográficas devem usar Open-Meteo sem API key. A aplicação não deve exigir autenticação nem persistir dados no servidor.

## Edge Cases

- Campo de busca vazio ou contendo apenas espaços.
- Nenhuma cidade encontrada para o termo informado.
- Várias cidades com o mesmo nome ou resultados sem dados suficientes para diferenciá-las.
- Falha de rede, timeout, limite de requisições ou indisponibilidade da Open-Meteo durante busca ou previsão.
- Resposta inválida, incompleta ou sem dados para uma ou mais datas solicitadas.
- Mudança de data local da cidade durante a consulta, especialmente perto da meia-noite ou em fuso horário diferente do dispositivo do usuário.
- Alternância de unidade enquanto os dados estão carregando ou após uma falha; a cidade selecionada não deve ser perdida.
- Tela estreita ou navegação por teclado que possa ocultar resultados, controles ou mensagens de estado.

## Assumptions

Decisões confirmadas:

- Open-Meteo será a fonte de geocodificação e dados meteorológicos, sem API key.
- “Cinco dias” significa hoje e os quatro dias seguintes, de acordo com o dia local da cidade consultada.
- A unidade inicial será Celsius; Fahrenheit também estará disponível.
- Não haverá autenticação nem persistência de dados no servidor.
- O idioma da interface será pt-BR.

Premissas a validar:

- A aplicação será acessada pela web e permitirá buscar uma cidade e selecioná-la nos resultados.
- Alternar a unidade altera a apresentação das temperaturas, sem alterar a cidade consultada.
- A necessidade de geolocalização automática não está confirmada e não é assumida como requisito.

## Risks

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Cidades homônimas podem levar à seleção do local errado. | Média | Alto: o usuário pode consultar a previsão de uma cidade diferente da pretendida. | Exibir contexto geográfico nos resultados e usar o identificador do local selecionado nas consultas seguintes. |
| Indisponibilidade, limites de uso ou mudanças na Open-Meteo podem impedir a exibição dos dados. | Média | Alto: busca ou previsão pode ficar indisponível e bloquear o fluxo principal. | Tratar limites e erros, definir timeout, validar respostas e oferecer nova tentativa em falhas recuperáveis. |
| Dados desatualizados ou incompletos podem resultar em previsão incorreta ou parcial. | Média | Alto: o usuário pode tomar decisões com informação meteorológica defasada ou faltando dias. | Verificar integridade e atualidade da resposta; informar horário da última atualização e comunicar lacunas sem apresentar dados antigos como atuais. |
| Uma experiência móvel inadequada pode dificultar a leitura e o uso dos controles. | Média | Alto: usuários móveis podem não conseguir buscar cidades ou consultar a previsão com facilidade. | Validar os fluxos principais em telas móveis e com teclado antes da entrega. |
| Escopo geográfico indefinido pode deixar busca e nomes de cidades inconsistentes com o público. | Média | Médio: a aplicação pode não atender às regiões em que usuários esperam consultar cidades. | Definir regiões suportadas e exibir contexto geográfico suficiente nos resultados; localizar datas em pt-BR. |

## Out of Scope

- Autenticação de usuários.
- Persistência de dados no servidor.
- Previsões para datas além de hoje e dos quatro dias seguintes.
- A especificação não assume geolocalização automática; sua inclusão depende da resposta à pergunta em aberto correspondente.

## Open Questions

- A busca deve aceitar apenas cidades ou também localização atual por geolocalização? A decisão altera o escopo, o tratamento de permissões e os estados de erro.
- Quais dados geográficos (por exemplo, estado/região e país) devem acompanhar cada resultado? Isso define como usuários distinguem cidades homônimas.
- Qual frequência de atualização deve ser esperada e como indicar a atualidade dos dados da Open-Meteo?
- Além de temperatura e condição meteorológica, quais informações devem ser exibidas no clima atual?
- A previsão de cada dia deve ser um resumo diário com temperaturas mínima/máxima ou incluir dados por hora?
- A unidade escolhida deve permanecer após recarregar ou voltar à aplicação, ou retornar ao padrão Celsius? Não haverá persistência dessa preferência no servidor.
- Quais países e formatos de data devem ser suportados além da interface em pt-BR?
- O que deve aparecer quando não há resultados, a API falha ou não há previsão disponível? Quais opções de recuperação são esperadas?
- Quais navegadores e tamanhos de tela fazem parte do suporte esperado?
- Qual é o limite de tempo aceitável para busca e atualização do clima?
- Qual nível ou padrão de conformidade de acessibilidade deve ser adotado?