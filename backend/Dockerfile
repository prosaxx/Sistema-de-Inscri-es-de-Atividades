# Dockerfile para o Backend NestJS com Prisma
FROM node:18-alpine AS base

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Gerar cliente Prisma
RUN npx prisma generate

# Estágio de build
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas as dependências (incluindo dev)
RUN npm ci

# Gerar cliente Prisma
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM node:18-alpine AS production

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

WORKDIR /app

# Copiar dependências de produção
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package*.json ./

# Copiar arquivos do Prisma
COPY --chown=nestjs:nodejs prisma ./prisma/

# Copiar build da aplicação
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Copiar arquivo .env de exemplo
COPY --chown=nestjs:nodejs .env.example .env

# Mudar para usuário não-root
USER nestjs

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "run", "start:prod"]