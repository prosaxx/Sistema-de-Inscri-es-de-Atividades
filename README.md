# Sistema-de-Inscri-es-de-Atividades

🚀 Setup Prisma + Docker - Sistema SESC
Este guia explica como configurar e executar o sistema SESC com Prisma ORM, SQL Server e Docker.

📋 Pré-requisitos
Node.js 18+
Docker e Docker Compose
Git
🗄️ Configuração do Banco de Dados
Prisma ORM
O projeto utiliza Prisma como ORM para interagir com o SQL Server. Os principais arquivos são:

backend/prisma/schema.prisma - Schema do banco de dados
backend/prisma/seed.ts - Dados iniciais (seed)
backend/.env - Variáveis de ambiente
Modelos do Banco
Admin - Administradores do sistema
Cliente - Clientes/usuários
Responsavel - Responsáveis por clientes menores de idade
Atividade - Atividades oferecidas pelo SESC
Inscricao - Inscrições dos clientes nas atividades
Avaliacao - Avaliações das atividades pelos clientes
🐳 Executando com Docker
1. Subir todos os serviços
# Na raiz do projeto
docker-compose up -d
Este comando irá:

Subir o SQL Server na porta 1433
Executar as migrations do Prisma
Popular o banco com dados iniciais (seed)
Iniciar o backend na porta 3000
Iniciar o frontend na porta 4200
2. Verificar logs
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f sqlserver
docker-compose logs -f frontend
3. Parar os serviços
docker-compose down
4. Parar e remover volumes (limpar dados)
docker-compose down -v
🛠️ Desenvolvimento Local
1. Configurar variáveis de ambiente
# Backend
cp backend/.env.example backend/.env
# Editar backend/.env com suas configurações
2. Instalar dependências
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
3. Subir apenas o SQL Server
docker-compose up -d sqlserver
4. Executar migrations e seed
cd backend

# Gerar cliente Prisma
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# Popular banco com dados iniciais
npm run prisma:seed
5. Iniciar aplicações em modo desenvolvimento
# Backend (terminal 1)
cd backend
npm run start:dev

# Frontend (terminal 2)
cd frontend
npm start
📊 Scripts do Prisma
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
🔑 Credenciais Padrão
Administrador
Email: admin@sesc.com.br
Senha: admin123
SQL Server
Host: localhost:1433
Usuário: sa
Senha: YourStrong@Passw0rd
Database: sesc_db
🌐 URLs de Acesso
Frontend: http://localhost:4200
Backend API: http://localhost:3000
Swagger/Documentação: http://localhost:3000/api
Prisma Studio: http://localhost:5555 (quando executado)
📁 Estrutura de Arquivos
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
🔧 Troubleshooting
Erro de conexão com SQL Server
Verificar se o container está rodando:

docker-compose ps
Verificar logs do SQL Server:

docker-compose logs sqlserver
Testar conexão:

docker-compose exec sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong@Passw0rd
Erro nas migrations
Reset do banco:

cd backend
npm run db:reset
Recriar migrations:

npm run prisma:migrate
npm run prisma:seed
Problemas com Docker
Limpar cache do Docker:

docker system prune -a
Rebuild dos containers:

docker-compose build --no-cache
docker-compose up -d
📚 Documentação Adicional
Prisma Documentation
NestJS Documentation
React Documentation
Docker Compose Documentation
🤝 Contribuição
Para contribuir com o projeto:

Faça um fork do repositório
Crie uma branch para sua feature
Commit suas mudanças
Push para a branch
Abra um Pull Request

Ambiente Docker não foi configurado.
Desenvolvido para o Sistema de Inscrições SESC 🏢
