## Contexto

A proposta é desenvolver uma aplicação de previsão do tempo que permita ao usuário consultar as condições meteorológicas de uma cidade. A experiência deve apresentar o clima atual e a previsão para os próximos cinco dias, oferecer alternância entre Celsius e Fahrenheit e funcionar bem em dispositivos móveis.

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

- **Cidades com nomes iguais:** resultados ambíguos podem levar à seleção do local errado.
- **Dependência de API externa:** indisponibilidade, limites de uso ou mudanças na API podem impedir a exibição dos dados.
- **Dados desatualizados ou incompletos:** a aplicação pode apresentar informações antigas ou sem todos os dias da previsão.
- **Interpretação de “cinco dias”:** pode significar os próximos cinco dias corridos ou cinco períodos de 24 horas.
- **Experiência móvel inadequada:** informações e controles podem ficar difíceis de usar em telas pequenas.
- **Escopo de localização indefinido:** sem uma região ou idioma prioritário, busca, nomes de cidades e formatos de data podem ser inconsistentes.

## Perguntas em aberto

- A busca deve aceitar apenas cidades ou também localização atual por geolocalização?
- Como diferenciar cidades homônimas: país, estado/região ou ambos?
- Qual API de geocodificação e previsão será usada? Há requisitos de atualização, limites ou atribuição?
- O clima atual deve incluir quais informações, por exemplo, temperatura, sensação térmica, condição e umidade?
- Como os cinco dias devem ser apresentados: resumo diário, temperaturas mínima/máxima ou previsão por hora?
- A unidade escolhida deve persistir entre visitas ou ser salva apenas durante a sessão?
- Quais idiomas, países e formatos de data devem ser suportados?
- O que deve aparecer quando a busca não encontra resultados, a API falha ou não há previsão disponível?
- Quais navegadores e tamanhos de tela fazem parte do suporte esperado?