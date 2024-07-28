
# Use uma imagem base oficial do Node.js 20
FROM node:20

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copie o package.json e package-lock.json
COPY package*.json ./

# Instale as dependências da aplicação
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Construa a aplicação
RUN npm run build

# Exponha a porta que a aplicação usará
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
