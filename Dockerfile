# # Image de base : Alpine légère
# FROM alpine:3.20

# # Répertoire de travail
# WORKDIR /app

# # Paquets nécessaires (Node.js + npm)
# RUN apk add --no-cache nodejs npm

# # (Option sécurité minimale) créer un user non-root
# RUN addgroup -S node && adduser -S node -G node

# # Copier manifestes d'abord pour profiter du cache
# COPY package*.json ./
# # Installer TOUTES les deps (prod + dev) pour pouvoir builder TypeScript
# RUN npm ci

# # Copier le code
# COPY tsconfig.json ./
# COPY src ./src

# # Build TypeScript -> dist/
# RUN npm run build


# # Droits non-root
# USER node

# # Exposer le port interne de l'app (dans ton code c'est 8000)
# EXPOSE 8000

# # Démarrer l'app
# CMD ["node", "dist/index.js"]
 # -------- STAGE 1 : build --------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src

RUN npm run build
RUN npm prune --omit=dev   # garder seulement deps de prod

# -------- STAGE 2 : run --------
FROM alpine:3.20 AS runner
WORKDIR /app
RUN apk add --no-cache nodejs

# user non-root
RUN addgroup -S node && adduser -S node -G node
USER node

# copier uniquement ce qui est utile à l'exécution
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules

EXPOSE 8000
CMD ["node", "dist/index.js"]