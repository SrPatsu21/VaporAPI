# Vapor

## Tecnologias

### API

node, express

### Banco de dados

MongoDB

### Cliente

electron

### Autenticação de Usuário da aplicação

Por meio do app conectando a API usando metodo https

### Versionamento

<!--TODO improve-->

- API
  version.feature.bugfix

- Cliente
  version.feature.bugfix


### Documentação da API

[Documentação](DocumentacaoAPI.md)

#### Contem:

- Detalhes sobre os endpoints:
  - Parâmetros de entrada e saída
  - Exemplos de uso
- Recomendação:
  - Uso de ferramentas como Swagger (facilita o teste e composição da documentação)

### Documentação do Cliente

[Documentação](DocumentacaoCliente.md)
#### Contem:

- Detalhes sobre duncionamente:
  - baixar arquivos
  - publicar arquivos
  - opções de customisação
- Integração com outras tecnologia

## Projeto

### Plano de Projeto

<!--TODO -->
#### Tema do Projeto/Contexto de Projeto

Uma central online de distribuição e compartilhamento de arquivos via protocolo P2P e serviços na nuvem, visa a disseminação da cultura e arte de forma gratuita sendo este um direito da humanidade.

#### Necessidade de Negócio

A grande  dificuldade na hora de disponibilizar conteúdo de fomar digital é a falta de centralizacao e o baixo nivel de organizacao e filtragem. Nosso objetivo é facilitar o acesso a arquivos por diversos métodos de forma segura e centralizada, mantendo padroes, organizacão, filtros avancados e versionamento.

#### Tipo de Projeto

Desenvolvimento de Software

#### Classe de Projeto

Criação de Produto

#### Objetivos do Projeto

##### Objetivo Geral:

Desenvolver uma plataforma de Centralização, organização e disponibilização de arquivos digitais de forma gratuita e online.

##### Objetivos Específicos:

- Criar uma API para, acesso aos links dos arquivos, ferramenta filtragem de busca, autentificacao, permitir novos arquivos.
- Criar um cliente desktop com a funcao de consumir a API.
- Desenvolver uma seção administrativa dentro do aplicativo para que os próprios usuários possam realizar uploads de arquivos
- Aprimoramento da interface do cliente
  - UI
  - UX
- Criar a documentação da API
- Criar a documentação do cliente

#### Metodologia Usada

##### Processo(s):

Será dividido em algumas etapas:
  1. Levantamento de requisitos obrigatórios e opcionais
  2. Definição de um MVP (Minimum Viable Product)
  3. Desenvolvimento do MVP
  4. Testes com o MVP
  5. Publicação do MVP
  6. Desenvolvimento dos requisitos opcionais conforme o tempo

##### Tecnologia(s):

[Tecnologias](#tecnologias)

#### Recursos Alocados (humano/financeiro):

##### Humano(s):

3 desenvolvedores que trabalharam em todas as frentes, sendo 1 mais focado na API, outro mais focado no cliente e o terceiro mais na área de teste e identificação de novos requisitos.

##### Financeiro(s):

Da parte de recursos humanos, sem salário, os custos de desenvolvimento para os devs virá de doação. As ferramentas de software para o desenvolvimento serão todas gratuitas. Infraestrutura para desenvolvimento será a que os devs já possuem para uso pessoal. Deploy, o banco de dados será gratuito, o servidor da api ainda não foi decidido o fornecedor mas, provavelmente será terceirizado.

### Stakeholdes

| **Nome** | **Títulos** | **Experiência** | **Função** |
|:----|:----:|:----:|----:|
| **Matheus dos Santos Wogt** | Técnico de informática | Projeto Solamigos | Desenvolvedor |
| **Paulo Sérgio Pierdoná** | Técnico de informática | Projeto Rota da Amizade | Desenvolvedor |
| **Wellington** | Técnico de informática |  |Desenvolvedor/Tester |

### Cronograma de Entregas

#### Entrega 1: MVP

Data:15/04/2025

Descrição da Entrega: [MVP](#mvp)

#### Entrega 2: Projeto completo

Data: 15/06/2025

Descrição da Entrega: Projeto completo sem funcionalidades extras


### MVP

- API base
  - https
  - Banco de dados
  - Autentificação
  - Postar arquivos. Com nome, descrisao e link
  - Download sem autentificação
  - captcha antibot
  - pesquisa avancada
- Cliente base
  - multiplataforma, (Windows/Linux), talvez (Mac)
  - Consumir api
  - conexão com o qBittorrent

### MLP

- adds (how to do in API?)

### Futuras Features

- Avaliações
- Comentarios
- Comentarios + Avaliações
- pesquisa avancada. Tags, categorias, versionamento, datas
- Perfil de usuario
- Video player
- Image viewer
- Shortcut media launcher

### Listagem das Regras de Negócio

<!--TODO -->

### Diagrama de Casos de Uso

<!--TODO -->

### Matriz de Rastreabilidade de Requisitos/UC

<!--TODO -->

### Histórias de Usuários

<!--TODO -->

### Diagrama de Classes de Análise

<!--TODO -->

### Prototipação Wireframe

<!--TODO -->

### Tema, Resumo e Conclusão

- Dica
  - Pode ser feito no README do Github!
** outro(s) item(s) poderão ser adicionados

<!--TODO -->
- tema
  Uma central online de distribuição e compartilhamento de arquivos via protocolo P2P e serviços na nuvem, visa a disseminação da cultura e arte de forma gratuita sendo este um direito da humanidade.
