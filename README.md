# ***P***atient & ***S***cheduling ***I***nformation ***S***ystem

# Sobre

Engenharia de Computação, UEPG - 7º período

Projeto realizado para disciplina Projeto de Software

[Marcos Renan Krul](https://github.com/MarcosKrul) - [Renato Cristiano Ruppel](https://github.com/HERuppel)

# Setup

* Clonar repositório

```
  git clone https://github.com/psisuepg2022/client.git .
```

* Variáveis de ambiente

```
  Na raiz do projeto, criar um arquivo com o nome ".env", copiar e colar o nome
  das variáveis no arquivo ".env.example", encontrado na raiz.

  No valor da chave inserir a URL da api. (Ex: VITE_API_URL=http://localhost:3333)
```

* Instalação de dependências

```
  No terminal, na pasta raiz do projeto, rodar o comando "yarn" para a Instalação
  das bibliotecas necessárias.
```

* Iniciar o projeto em modo desenvolvimento

``` 
  No terminal, na pasta raiz do projeto, rodar o comando "yarn dev". Após isso, acessar
  no browser a url: "http://localhost:3000".
```

* Iniciar o projeto em modo de produção

```
  No terminal, na pasta raiz do projeto, rodar o comando "yarn build". Após a conclusão
  da build, rodar o comando "serve -s dist", caso não possua o "serve" instalado, rodar
  o comando "yarn add serve". Após rodar o comando "serve -s dist", abrir a no browser
  a url: "http://localhost:3000".
```
