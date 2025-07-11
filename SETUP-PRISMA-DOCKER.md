# 🚀 Setup Prisma + Docker - Sistema SESC

Este guia explica como configurar e executar o sistema SESC com Prisma ORM, SQL Server e Docker.

## 📋 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Git

## 🗄️ Configuração do Banco de Dados

### Prisma ORM

O projeto utiliza Prisma como ORM para interagir com o SQL Server. Os principais arquivos são:

- `backend/prisma/schema.prisma` - Schema do banco de dados
- `backend/prisma/seed.ts` - Dados iniciais (seed)
- `backend/.env` - Variáveis de ambiente

### Modelos do Banco

- **Admin** - Administradores do sistema
- **Cliente** - Clientes/usuários
- **Responsavel** - Responsáveis por clientes menores de idade
- **Atividade** - Atividades oferecidas pelo SESC
- **Inscricao** - Inscrições dos clientes nas atividades
- **Avaliacao** - Avaliações das atividades pelos clientes

## 🐳 Executando com Docker

### 1. Subir todos os serviços

```bash
# Na raiz do projeto
docker-compose up -d
```

Este comando irá:
- Subir o SQL Server na porta 1433
- Executar as migrations do Prisma
- Popular o banco com dados iniciais (seed)
- Iniciar o backend na porta 3000
- Iniciar o frontend na porta 4200

### 2. Verificar logs

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f sqlserver
docker-compose logs -f frontend
```

### 3. Parar os serviços

```bash
docker-compose down
```

### 4. Parar e remover volumes (limpar dados)

```bash
docker-compose down -v
```

## 🛠️ Desenvolvimento Local

### 1. Configurar variáveis de ambiente

```bash
# Backend
cp backend/.env.example backend/.env
# Editar backend/.env com suas configurações
```

### 2. Instalar dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Subir apenas o SQL Server

```bash
docker-compose up -d sqlserver
```

### 4. Executar migrations e seed

```bash
cd backend

# Gerar cliente Prisma
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# Popular banco com dados iniciais
npm run prisma:seed
```

### 5. Iniciar aplicações em modo desenvolvimento

```bash
# Backend (terminal 1)
cd backend
npm run start:dev

# Frontend (terminal 2)
cd frontend
npm start
```

## 📊 Scripts do Prisma

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Criar e aplicar migration
npm run prisma:migrate

# Aplicar migrations em produção
npm run prisma:deploy

# Popular banco com dados iniciais
npm run prisma:seed

# Abrir Prisma Studio (interface visual)
npm run prisma:studio

# Reset completo do banco
npm run db:reset
```

## 🔑 Credenciais Padrão

### Administrador
- **Email:** admin@sesc.com.br
- **Senha:** admin123

### SQL Server
- **Host:** localhost:1433
- **Usuário:** sa
- **Senha:** YourStrong@Passw0rd
- **Database:** sesc_db

## 🌐 URLs de Acesso

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:3000
- **Swagger/Documentação:** http://localhost:3000/api
- **Prisma Studio:** http://localhost:5555 (quando executado)

## 📁 Estrutura de Arquivos

```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Schema do banco
│   │   └── seed.ts           # Dados iniciais
│   ├── src/                  # Código fonte
│   ├── Dockerfile           # Docker do backend
│   └── .env                 # Variáveis de ambiente
├── frontend/
│   ├── src/                 # Código fonte React
│   ├── Dockerfile          # Docker do frontend
│   └── .env                # Variáveis de ambiente
└── docker-compose.yml      # Orquestração dos serviços
```

## 🔧 Troubleshooting

### Erro de conexão com SQL Server

1. Verificar se o container está rodando:
   ```bash
   docker-compose ps
   ```

2. Verificar logs do SQL Server:
   ```bash
   docker-compose logs sqlserver
   ```

3. Testar conexão:
   ```bash
   docker-compose exec sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong@Passw0rd
   ```

### Erro nas migrations

1. Reset do banco:
   ```bash
   cd backend
   npm run db:reset
   ```

2. Recriar migrations:
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```

### Problemas com Docker

1. Limpar cache do Docker:
   ```bash
   docker system prune -a
   ```

2. Rebuild dos containers:
   ```bash
   docker-compose build --no-cache
   docker-compose up -d
   ```

## 📚 Documentação Adicional

- [Prisma Documentation](https://www.prisma.io/docs/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://reactjs.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido para o Sistema de Inscrições SESC** 🏢