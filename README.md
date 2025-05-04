
# Rastreador de Satélites - ISS

Este projeto tem como objetivo rastrear a posição da Estação Espacial Internacional (ISS) em tempo real, exibindo sua localização em um mapa interativo. Utiliza a API `open-notify.org` para obter a posição da ISS e a API `wheretheiss.at` para obter informações detalhadas sobre o satélite.

A interface apresenta um mapa interativo (usando o Leaflet), com a posição da ISS marcada. Além disso, o projeto exibe informações como altitude, velocidade, visibilidade e coordenadas no rodapé da página.

## Tecnologias Utilizadas

- **React**: Framework para construir a interface de usuário.
- **Leaflet**: Biblioteca para criar mapas interativos.
- **Axios**: Biblioteca para realizar requisições HTTP.
- **CSS**: Para o estilo da aplicação.

## Funcionalidades

- Exibição da posição da ISS em tempo real no mapa.
- Exibição de informações detalhadas sobre a ISS, como:
  - Altitude
  - Velocidade
  - Coordenadas
  - Visibilidade
  - Timestamp
- Barra de progresso indicando o tempo de atualização da posição.

## Como Executar o Projeto

Siga as instruções abaixo para rodar o projeto localmente.

### Pré-requisitos

Antes de começar, você precisa ter o **Node.js** e o **npm** instalados na sua máquina. Se não tiver, você pode fazer o download [aqui](https://nodejs.org/).

### Passo 1: Clonar o repositório

Clone o repositório para sua máquina local.

```bash
git clone https://github.com/seuusuario/seu-repositorio.git
```

### Passo 2: Instalar as dependências

Dentro do diretório do projeto, instale as dependências:

```bash
cd seu-repositorio
npm install
```

### Passo 3: Rodar o servidor local

Para iniciar o servidor de desenvolvimento:

```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`.

### Passo 4: Visualizar o Projeto

Abra o navegador e acesse o endereço `http://localhost:3000`. O mapa será exibido, e a ISS será rastreada em tempo real.

## Como Contribuir

1. Faça o fork deste repositório.
2. Crie uma nova branch para suas mudanças (`git checkout -b minha-feature`).
3. Faça as alterações necessárias e commit com uma mensagem clara (`git commit -am 'Adiciona nova funcionalidade'`).
4. Envie para o repositório remoto (`git push origin minha-feature`).
5. Abra um pull request para revisão.

## Licença

Este projeto está licenciado sob a [MIT License](https://opensource.org/licenses/MIT).
