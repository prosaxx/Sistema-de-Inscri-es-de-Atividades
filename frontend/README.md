# Frontend - Sistema de Inscrições SESC

Este é o frontend do Sistema de Inscrições SESC, desenvolvido em React com TypeScript e Material-UI.

## 🚀 Tecnologias Utilizadas

- **React 19** - Biblioteca para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Material-UI (MUI)** - Biblioteca de componentes React
- **React Router DOM** - Roteamento para aplicações React
- **TanStack Query** - Gerenciamento de estado do servidor
- **Axios** - Cliente HTTP para requisições à API
- **Day.js** - Biblioteca para manipulação de datas

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Backend do sistema rodando na porta 3001

## 🔧 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente (arquivo `.env` já criado):
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_API_TIMEOUT=10000
```

## 🚀 Scripts Disponíveis

### `npm start`
Executa a aplicação em modo de desenvolvimento.
Abra [http://localhost:3000](http://localhost:3000) para visualizar no navegador.

### `npm test`
Executa os testes em modo interativo.

### `npm run build`
Cria o build de produção na pasta `build`.

## 📱 Funcionalidades Implementadas

### ✅ Autenticação
- Login de administradores
- Proteção de rotas
- Gerenciamento de sessão

### ✅ Dashboard
- Visão geral do sistema
- Estatísticas em tempo real
- Cards informativos

### ✅ Gestão de Clientes
- Listagem com busca e filtros
- Cadastro e edição
- Visualização detalhada
- Busca automática de endereço por CEP
- Validação de formulários

### 🚧 Em Desenvolvimento
- Gestão de Responsáveis
- Gestão de Atividades
- Gestão de Inscrições
- Gestão de Avaliações
- Gestão de Administradores

## 🎨 Interface

- Design responsivo com Material-UI
- Sidebar com navegação
- Tema moderno e acessível
- Formulários com validação em tempo real

## 🔐 Autenticação

O sistema utiliza autenticação baseada em token:
- Login com credenciais
- Token armazenado no localStorage
- Interceptors automáticos no Axios
- Proteção de rotas

## 📊 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   └── Layout/         # Layout principal
├── contexts/           # Contextos React
│   └── AuthContext.tsx # Contexto de autenticação
├── pages/              # Páginas da aplicação
│   ├── Login/          # Página de login
│   ├── Dashboard/      # Dashboard principal
│   └── Clientes/       # Gestão de clientes
├── services/           # Serviços de API
│   └── api.ts          # Configuração do Axios
├── types/              # Tipos TypeScript
│   └── index.ts        # Interfaces e tipos
└── App.tsx             # Componente principal
```

## 🌐 Integração com Backend

- API REST em NestJS
- Endpoints para todas as entidades
- Validação de dados
- Tratamento de erros

---

**Desenvolvido para o SESC - Serviço Social do Comércio**
