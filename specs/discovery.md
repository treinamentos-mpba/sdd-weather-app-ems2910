## Contexto

A proposta é desenvolver uma aplicação de previsão do tempo que permita ao usuário consultar as condições meteorológicas de uma cidade. A experiência deve apresentar o clima atual e a previsão para os próximos cinco dias, oferecer alternância entre Celsius e Fahrenheit e funcionar bem em dispositivos móveis.

## Personas

- **Pessoa que planeja a rotina diária:** consulta o clima atual para decidir o que vestir e como se preparar para o dia.
- **Viajante que planeja a semana:** busca a cidade de destino e consulta a previsão de cinco dias para organizar a viagem e a bagagem.
- **Pessoa com preferência por uma unidade específica:** alterna entre Celsius e Fahrenheit para interpretar a temperatura na escala que usa com mais familiaridade.

## Suposições

As suposições abaixo são provisórias e devem ser confirmadas antes de orientar decisões de implementação:

- A aplicação será acessada pela web e terá interface responsiva para uso em dispositivos móveis.
- O usuário encontrará uma cidade por meio de busca e selecionará o local desejado nos resultados.
- Uma fonte externa de dados fornecerá o clima atual e a previsão de cinco dias.
- A alternância entre Celsius e Fahrenheit mudará a unidade exibida, sem alterar a cidade consultada.
- Geolocalização, contas de usuário e salvamento de cidades não fazem parte do escopo inicial, salvo confirmação posterior.

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
| Indisponibilidade, limites de uso ou mudanças na API externa podem impedir a exibição dos dados. | Média | Alto: busca ou previsão pode ficar indisponível e bloquear o fluxo principal. | Escolher uma API com limites e termos adequados; tratar erros e limites, definir timeout e oferecer opção para tentar novamente. |
| Dados desatualizados ou incompletos podem resultar em uma previsão incorreta ou parcial. | Média | Alto: o usuário pode tomar decisões com informação meteorológica defasada ou faltando dias. | Exibir horário da última atualização, validar a resposta recebida e comunicar indisponibilidade ou lacunas sem apresentar dados antigos como atuais. |
| “Cinco dias” pode significar dias corridos ou períodos de 24 horas. | Alta | Médio: diferentes interpretações podem produzir resultados inconsistentes com a expectativa e critérios de aceite. | Definir o intervalo e o fuso horário na especificação antes da implementação e cobrir a regra com testes. |
| Uma experiência móvel inadequada pode dificultar a leitura e o uso dos controles em telas pequenas. | Média | Alto: usuários em dispositivos móveis podem não conseguir buscar cidades ou consultar a previsão com facilidade. | Projetar para telas pequenas desde o início e validar busca, leitura e controles em viewports móveis e com teclado. |
| Escopo de localização indefinido pode deixar busca, nomes de cidades e formatos de data inconsistentes com o público. | Média | Médio: a aplicação pode ser confusa ou inadequada para usuários de regiões e idiomas não considerados. | Definir público, idiomas, regiões e formatos suportados antes de fechar os critérios de aceite; usar formatação localizada. |

## Perguntas em aberto

| Pergunta | Impacto se não for definida |
| --- | --- |
| A busca deve aceitar apenas cidades ou também localização atual por geolocalização? | O escopo da busca, o tratamento de permissões e os estados de erro podem mudar; a experiência e os testes de localização ficam indefinidos. |
| Como diferenciar cidades homônimas: país, estado/região ou ambos? | Os resultados podem não fornecer contexto suficiente, levando à seleção e exibição do clima da cidade errada. |
| Qual API de geocodificação e previsão será usada? Há requisitos de atualização, limites ou atribuição? | A arquitetura de integração, a frequência de atualização e os limites de uso podem exigir retrabalho; custos, disponibilidade e obrigações de atribuição ficam desconhecidos. |
| O clima atual deve incluir quais informações, por exemplo, temperatura, sensação térmica, condição e umidade? | O contrato de dados, o layout e os critérios de aceite não podem ser fechados; informações necessárias podem faltar ou ser implementadas sem necessidade. |
| Como os cinco dias devem ser apresentados: resumo diário, temperaturas mínima/máxima ou previsão por hora? | O formato dos dados, a complexidade da interface e o esforço de implementação e teste podem variar significativamente. |
| A unidade escolhida deve persistir entre visitas ou ser salva apenas durante a sessão? | O comportamento esperado ao recarregar ou retornar à aplicação fica inconsistente, e pode ser necessário alterar a estratégia de armazenamento. |
| Quais idiomas, países e formatos de data devem ser suportados? | Busca, textos, unidades regionais e apresentação de datas podem não atender ao público pretendido; a necessidade de internacionalização pode surgir tardiamente. |
| O que deve aparecer quando a busca não encontra resultados, a API falha ou não há previsão disponível? | Estados de erro e vazio, opções de recuperação e critérios de aceite podem ficar incompletos, prejudicando a usabilidade e a confiabilidade. |
| Quais navegadores e tamanhos de tela fazem parte do suporte esperado? | Não é possível definir a matriz de compatibilidade nem validar responsividade de forma objetiva; problemas podem ser descobertos apenas após a entrega. |