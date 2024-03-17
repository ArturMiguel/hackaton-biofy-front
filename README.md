# IA.GRO - Hackaton Biofy

Solução desenvolvida para o [Hackton da Biofy 2024](https://www.sympla.com.br/evento/hackathon-biofy/2346682).

"IA.GRO" é um assistente que utiliza inteligência artificial para responder dúvidas sobre agronegócio com especialização em identificação de problemas de pragas através de texto, áudio e imagem.

Tecnologias utilizadas para desenvolvimento:

- Front-end
  - Angular compatível com Node.js 16
  - PrimeNG + PrimeFlex

- Back-end:
  - https://github.com/ArturMiguel/hackaton-biofy-back


### Executar projeto localmente

1) Clone o projeto e instale as dependências:

```
npm ci
```

2) Execute o projeto digitando `ng serve` no terminal.

### Executar projeto com Docker

1) Compile o container com docker compose: `docker compose build`

2) Execute o container: `docker compose up`