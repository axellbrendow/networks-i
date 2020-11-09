# Aplicação Cliente-Servidor - Batalha Naval - Protocolo TCP

Um detalhe interessante desse projeto e que é relacionado à programação é que mesmo sendo feito em JavaScript, o projeto está 100% tipado por meio de JSDocs. Até mesmo os dados enviados nas requisições e nas respostas entre o cliente e o servidor estão com suas tipagens.

## Requisitos para execução

- Node

## Como usar ?

Abra um terminal na pasta `server` e execute: `node server.js 2222`.

Depois abra outro terminal na pasta `client` e execute: `node client.js localhost 2222`

## Problema a ser tratado

O trabalho consiste em desenvolver o jogo batalha naval usando sockets.

## Descrição técnica - arquivos compartilhados

### Arquivos dentro de `shared/`

Todos os arquivos dentro da pasta _shared_ são compartilhados entre o servidor e o cliente.

Dentre eles existem:

- as classes que representam as entidades do jogo
- a tipagem dos dados enviados nas requisições e nas respostas (arquivos \*.d.ts)

## Descrição técnica - servidor

### Arquivos dentro de `server/repositories/`

Dentro da pasta _repositories_ encontra-se os arquivos que representam a camada de acesso aos dados, portanto eles expoem funções para tal propósito com cada uma das entidades do jogo.

### Arquivos dentro de `server/observers/`

Dentro da pasta _observers_ encontra-se os arquivos que representam a camada com as regras de negócio, portanto eles expoem funções para tal propósito com cada uma das ações do jogo.

### Arquivos dentro de `server/`

Dentro da pasta _server_ encontra-se os arquivos que representam a camada de recebimento e decodificação das mensagens.

### Classe `Observers` (`server/Observers.js`)

Essa classe tem um papel muito importante, pois ela foi criada com o intuito de implementar um padrão de projeto de software chamado _Observer_. É um padrão que se encaixa perfeitamente com o recebimento e processamento de mensagens do TCP, pois só é possível identificar o tipo de uma mensagem após recebê-la e interpretá-la. Quando uma mensagem do TCP é recebida, todos os _observers_ (funções no meu caso) são executados, porém cada um checa o tipo da mensagem e decide se ela deve ser processada por ele ou não.

### Classe `ServerSocket` (`server/ServerSocket.js`)

Essa classe tem a responsabilidade de criar o servidor e armazenar os sockets que vierem a se conectar.

### Classe `Messages` (`server/Messages.js`)

Essa classe tem a responsabilidade de gerenciar o envio e o recebimento no servidor. Isso envolve registrar todos os _observers_ dentro de `server/observers/` para escutarem as mensagens que estiverem chegando dos clientes e criar uma função para enviar uma mensagem para um cliente específico.

## Descrição técnica - cliente

### Classe `Observers` (`client/Observers.js`)

Essa classe tem um papel muito importante, pois ela foi criada com o intuito de implementar um padrão de projeto de software chamado _Observer_. É um padrão que se encaixa perfeitamente com o recebimento e processamento de mensagens do TCP, pois só é possível identificar o tipo de uma mensagem após recebê-la e interpretá-la. Quando uma mensagem do TCP é recebida, todos os _observers_ (funções no meu caso) são executados, porém cada um checa o tipo da mensagem e decide se ela deve ser processada por ele ou não.

### Classe `Messages` (`client/Messages.js`)

Essa classe tem a responsabilidade de gerenciar o envio e o recebimento no cliente. Isso envolve criar uma função para enviar uma mensagem e esperar a sua resposta e criar uma função para registrar um _Observer_ para receber mensagens que são enviadas de forma passiva pelo servidor.

### Arquivo `client/clientSocket.js`

Nesse arquivo há a criação do socket do cliente.

### Classe `BoardVisualizer` (`client/BoardVisualizer.js`)

Essa classe tem a responsabilidade de gerar a visualização dos tabuleiros de batalha.

### Classe `ClientMatch` (`client/ClientMatch.js`)

Essa classe tem a responsabilidade de gerenciar a partida, ou seja, gerenciar os turnos de cada jogador e o estado da partida.

## Decisões de implementação

Há três decisões importantes, ambas relacionadas às mensagens transferidas entre o cliente e o servidor:

- Escolhi usar o formato JSON para as mensagens.
- Toda mensagem enviada pelo cliente tem uma resposta do servidor onde o id da mensagem é igual
- Toda mensagem é um objeto que contém pelo menos três atributos:
  ```ts
  type Message = {
    id: string; // Id da mensagem.
    type: string; // Tipo da mensagem
    data: any; // Dados da mensagem. Equivalente ao body no HTTP por exemplo.
  };
  ```

## Testes

Vídeo: https://youtu.be/lvSvES4ENi0

# Conclusão

A implementação do batalha naval usando TCP se mostrou interessante principalmente pela natureza de interação em tempo real do jogo. É um desafio implementar softwares desse tipo devido à arquitetura orientada a eventos. Além disso, ao fazer esse projeto percebi o porquê de existirem alguns padrões no protocolo HTTP como os métodos GET, POST, DELETE e outros.

# Bibliografia

- [Node.js pipe method](https://stackoverflow.com/questions/20085513/using-pipe-in-node-js-net)
- [Node.js TCP client and server](https://gist.github.com/tedmiston/5935757)
- [Observer Design Pattern](https://gameprogrammingpatterns.com/observer.html)
- [Node.js TCP broadcast](https://gist.github.com/bitbandi/1c83ea416e0b6429a374)
