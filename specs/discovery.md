## Contexto

A proposta é desenvolver uma aplicação de previsão do tempo que permita ao usuário consultar as condições meteorológicas de uma cidade. A experiência deve apresentar o clima atual e a previsão para os próximos cinco dias, oferecer alternância entre Celsius e Fahrenheit e funcionar bem em dispositivos móveis.

## Decisões

- **Fonte de dados:** Open-Meteo, sem necessidade de API key.
- **Período da previsão:** hoje e os quatro dias seguintes, considerando o dia local da cidade consultada.
- **Unidade padrão:** Celsius; o usuário poderá alternar para Fahrenheit.
- **Autenticação e persistência:** a aplicação não terá autenticação nem persistência de dados no servidor.
- **Idioma da interface:** português do Brasil (pt-BR).

## Personas

- **Pessoa que planeja a rotina diária:** consulta o clima atual para decidir o que vestir e como se preparar para o dia.
- **Viajante que planeja a semana:** busca a cidade de destino e consulta a previsão de cinco dias para organizar a viagem e a bagagem.
- **Pessoa com preferência por uma unidade específica:** alterna entre Celsius e Fahrenheit para interpretar a temperatura na escala que usa com mais familiaridade.

## Suposições

As suposições abaixo são provisórias e devem ser confirmadas antes de orientar decisões de implementação:

- A aplicação será acessada pela web e terá interface responsiva para uso em dispositivos móveis.
- O usuário encontrará uma cidade por meio de busca e selecionará o local desejado nos resultados.
- A alternância entre Celsius e Fahrenheit mudará a unidade exibida, sem alterar a cidade consultada.
- O suporte à geolocalização ainda não está definido.

## Requisitos funcionais

- Permitir que o usuário busque cidades.
- Exibir o clima atual da cidade selecionada.
- Exibir a previsão para os próximos cinco dias.
- Permitir alternar entre Celsius e Fahrenheit.
- Oferecer uma experiência utilizável em dispositivos móveis.

## Requisitos não funcionais

- **Responsividade:** conteúdo e controles devem se adaptar a telas pequenas.
- **Usabilidade:** busca, seleção de cidade e alternância de unidade devem ser simples e claras.
- **Acessibilidade:** controles devem funcionar por teclado e ter rótulos compreensíveis; contraste e leitura em telas pequenas também devem ser considerados.
- **Confiabilidade:** a aplicação deve lidar com falhas na busca ou na obtenção da previsão sem perder a capacidade de recuperação.
- **Desempenho:** buscas e atualização do clima devem responder em tempo razoável.
- **Compatibilidade:** deve funcionar nos navegadores e dispositivos móveis que forem definidos como suportados.

## Riscos

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Cidades com nomes iguais podem levar à seleção do local errado. | Média | Alto: o usuário pode consultar a previsão de uma cidade diferente da pretendida. | Exibir cidade junto de estado/região e país nos resultados; usar identificador único do local após a seleção. |
| Indisponibilidade, limites de uso ou mudanças na API Open-Meteo podem impedir a exibição dos dados. | Média | Alto: busca ou previsão pode ficar indisponível e bloquear o fluxo principal. | Tratar erros e limites da API, definir timeout e oferecer opção para tentar novamente; validar a resposta antes de exibir os dados. |
| Dados desatualizados ou incompletos podem resultar em uma previsão incorreta ou parcial. | Média | Alto: o usuário pode tomar decisões com informação meteorológica defasada ou faltando dias. | Exibir horário da última atualização, validar a resposta recebida e comunicar indisponibilidade ou lacunas sem apresentar dados antigos como atuais. |
| Uma experiência móvel inadequada pode dificultar a leitura e o uso dos controles em telas pequenas. | Média | Alto: usuários em dispositivos móveis podem não conseguir buscar cidades ou consultar a previsão com facilidade. | Projetar para telas pequenas desde o início e validar busca, leitura e controles em viewports móveis e com teclado. |
| Escopo geográfico indefinido pode deixar a busca e a apresentação de nomes de cidades inconsistentes com o público. | Média | Médio: a aplicação pode não atender às regiões em que os usuários esperam consultar cidades. | Definir as regiões suportadas e exibir contexto geográfico suficiente nos resultados; usar formatação localizada em pt-BR. |

## Perguntas em aberto

| Pergunta | Impacto se não for definida |
| --- | --- |
| A busca deve aceitar apenas cidades ou também localização atual por geolocalização? | O escopo da busca, o tratamento de permissões e os estados de erro podem mudar; a experiência e os testes de localização ficam indefinidos. |
| Como diferenciar cidades homônimas: país, estado/região ou ambos? | Os resultados podem não fornecer contexto suficiente, levando à seleção e exibição do clima da cidade errada. |
| Qual frequência de atualização deve ser esperada e como indicar a atualidade dos dados da Open-Meteo? | Sem uma expectativa de atualização, o usuário pode interpretar dados defasados como atuais; a interface e os critérios de atualização ficam indefinidos. |
| O clima atual deve incluir quais informações, por exemplo, temperatura, sensação térmica, condição e umidade? | O contrato de dados, o layout e os critérios de aceite não podem ser fechados; informações necessárias podem faltar ou ser implementadas sem necessidade. |
| Como os cinco dias devem ser apresentados: resumo diário, temperaturas mínima/máxima ou previsão por hora? | O formato dos dados, a complexidade da interface e o esforço de implementação e teste podem variar significativamente. |
| A unidade escolhida pelo usuário deve permanecer após recarregar ou voltar à aplicação, ou retornar ao padrão Celsius? | O comportamento da preferência e a necessidade de armazenamento no cliente ficam indefinidos; não haverá persistência dessa preferência no servidor. |
| Quais países e formatos de data devem ser suportados, além da interface em pt-BR? | A busca pode não cobrir as regiões esperadas, e datas podem ser apresentadas de forma inconsistente com a localização dos usuários. |
| O que deve aparecer quando a busca não encontra resultados, a API falha ou não há previsão disponível? | Estados de erro e vazio, opções de recuperação e critérios de aceite podem ficar incompletos, prejudicando a usabilidade e a confiabilidade. |
| Quais navegadores e tamanhos de tela fazem parte do suporte esperado? | Não é possível definir a matriz de compatibilidade nem validar responsividade de forma objetiva; problemas podem ser descobertos apenas após a entrega. |