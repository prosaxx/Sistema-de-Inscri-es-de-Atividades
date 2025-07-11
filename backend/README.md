# Sistema de Inscrições SESC - Backend

Backend do sistema de gerenciamento de inscrições em atividades do SESC, desenvolvido com NestJS, Firebase Firestore e TypeScript.

## 🚀 Funcionalidades

### Módulos Implementados

#### 1. **Clientes**
- Cadastro, consulta, atualização e exclusão de clientes
- Validação de duplicidade por nome e data de nascimento
- Verificação de inscrições ativas antes da exclusão
- Campos: nome, data de nascimento, endereço completo

#### 2. **Responsáveis**
- Gerenciamento de responsáveis pelas atividades
- Validação de matrícula única (letras maiúsculas e números)
- Verificação de atividades vinculadas antes da exclusão
- Campos: nome, matrícula

#### 3. **Atividades**
- Cadastro e gerenciamento de atividades do SESC
- Vinculação com responsáveis
- Organização por unidade SESC
- Validação de duplicidade por nome na mesma unidade
- Contagem automática de inscrições
- Campos: nome, descrição, unidade SESC, responsável

#### 4. **Inscrições**
- Sistema completo de inscrições em atividades
- Status: ativa, cancelada, concluída, pendente
- Validação de duplicidade de inscrições ativas/pendentes
- Controle de datas de início e fim
- Relacionamento com clientes e atividades

#### 5. **Avaliações**
- Sistema de feedback dos clientes
- Tipos: crítica, sugestão, elogio
- Sistema de notas (1-5)
- Resposta da administração
- Vinculação opcional com atividades específicas
- Estatísticas de avaliações

#### 6. **Administradores**
- Gerenciamento de usuários administrativos
- Autenticação com email e senha criptografada
- Sistema de ativação/desativação
- Controle de último login
- Validação de email e matrícula únicos

#### 7. **CEP**
- Consulta de endereços por CEP
- Integração com APIs ViaCEP e Postmon
- Validação de formato de CEP

## 🛠️ Tecnologias Utilizadas

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem de programação
- **Firebase Firestore** - Banco de dados NoSQL
- **Swagger/OpenAPI** - Documentação da API
- **Class Validator** - Validação de dados
- **Bcrypt** - Criptografia de senhas
- **Axios** - Cliente HTTP para APIs externas

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Conta no Firebase com projeto configurado
- Arquivo de credenciais do Firebase

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto:
```env
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_PRIVATE_KEY=sua-private-key
FIREBASE_CLIENT_EMAIL=seu-client-email
```

4. **Configure o Firebase**
- Coloque o arquivo de credenciais do Firebase na pasta `src/config/`
- Atualize o caminho no `firebase.service.ts` se necessário

## 🚀 Executando a aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

A API estará disponível em `http://localhost:3000`

## 📚 Documentação da API

Acesse a documentação Swagger em: `http://localhost:3000/api`

## 🗂️ Estrutura do Projeto

```
src/
├── modules/
│   ├── admin/           # Módulo de administradores
│   ├── atividade/       # Módulo de atividades
│   ├── avaliacao/       # Módulo de avaliações
│   ├── cep/             # Módulo de consulta CEP
│   ├── cliente/         # Módulo de clientes
│   ├── firebase/        # Serviço do Firebase
│   ├── inscricao/       # Módulo de inscrições
│   └── responsavel/     # Módulo de responsáveis
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

## 🔐 Endpoints Principais

### Clientes
- `GET /clientes` - Listar clientes
- `POST /clientes` - Criar cliente
- `GET /clientes/:id` - Buscar cliente por ID
- `PATCH /clientes/:id` - Atualizar cliente
- `DELETE /clientes/:id` - Excluir cliente

### Atividades
- `GET /atividades` - Listar atividades
- `POST /atividades` - Criar atividade
- `GET /atividades/:id` - Buscar atividade por ID
- `PATCH /atividades/:id` - Atualizar atividade
- `DELETE /atividades/:id` - Excluir atividade

### Inscrições
- `GET /inscricoes` - Listar inscrições
- `POST /inscricoes` - Criar inscrição
- `GET /inscricoes/:id` - Buscar inscrição por ID
- `PATCH /inscricoes/:id` - Atualizar inscrição
- `PUT /inscricoes/:id/cancelar` - Cancelar inscrição
- `DELETE /inscricoes/:id` - Excluir inscrição

### Avaliações
- `GET /avaliacoes` - Listar avaliações
- `POST /avaliacoes` - Criar avaliação
- `GET /avaliacoes/estatisticas` - Estatísticas
- `PUT /avaliacoes/:id/responder` - Responder avaliação

### Administradores
- `POST /admins` - Criar administrador
- `POST /admins/login` - Login
- `GET /admins` - Listar administradores
- `PUT /admins/:id/status` - Ativar/Desativar

## 🧪 Validações Implementadas

- **Duplicidade**: Validação de registros duplicados
- **Relacionamentos**: Verificação de dependências antes de exclusões
- **Datas**: Validação de períodos e datas válidas
- **Formatos**: CEP, email, matrícula, etc.
- **Obrigatoriedade**: Campos obrigatórios
- **Tipos**: Enums para status e tipos

## 📊 Recursos Avançados

- **Filtros**: Busca por múltiplos critérios
- **Relacionamentos**: Inclusão opcional de dados relacionados
- **Estatísticas**: Dashboards de avaliações
- **Auditoria**: Controle de datas de criação e atualização
- **Segurança**: Criptografia de senhas
- **APIs Externas**: Integração com serviços de CEP

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Desenvolvedor** - *Trabalho inicial* - [Seu GitHub](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- SESC por fornecer os requisitos do sistema
- Comunidade NestJS pela excelente documentação
- Firebase pela infraestrutura de banco de dados