FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./  
COPY cert /app/cert  
COPY drizzle.config.ts /app/drizzle.config.ts  
COPY tailwind.config.ts /app/tailwind.config.ts  
COPY src/lib/server/db /app/src/lib/server/db  
COPY src/lib/server/db/schema.ts /app/src/lib/server/db/schema.ts  
COPY src/lib/server/db/index.ts /app/src/lib/server/db/index.ts  
COPY build ./build  
COPY .env .env  

RUN npm install

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node","build"]
