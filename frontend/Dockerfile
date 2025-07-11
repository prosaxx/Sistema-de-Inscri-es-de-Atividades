# Dockerfile para o Frontend React
FROM node:18-alpine AS base

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Estágio de build
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Estágio de produção com servidor de desenvolvimento
FROM node:18-alpine AS production

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 reactjs

WORKDIR /app

# Copiar dependências
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package*.json ./

# Copiar código fonte
COPY --chown=reactjs:nodejs . .

# Mudar para usuário não-root
USER reactjs

# Expor porta
EXPOSE 4200

# Comando de inicialização (modo desenvolvimento para hot reload)
CMD ["npm", "start"]