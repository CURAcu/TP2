# TP2 BACKEND - CLON DE SLACK

Este proyecto consiste en un trabajo parecido a Slack

## Tecnologías Utilizadas

- Node.js
- Express
- MongoDB
- JWT
- React (Vite)

## Deploy

- Frontend
https://tp2-frontend.vercel.app

- Backend
https://tp2-backend.vercel.app

## Variables:

### Backend

PORT= puerto del servidor

MONGODB_URI= Conexion a MongoDB

MONGO_DB_NAME= Nombre de la base de datos utilizada

JWT_SECRET_KEY= Clave para JTW

GMAIL_USERNAME= Mail usado

GMAIL_PASSWORD= Contraseña usada

URL_FRONTEND= URL base del frontend

URL_BACKEND= URL base del backend

### Frontend

VITE_API_URL= URL base del backend

## Instrucciones de Instalacion:

### Clonar el repositorio:

1. git clone https://github.com/CURAcu/TP2.git
2. cd REPO

### Backend:

1. cd backend
2. npm install
3. Crear archivo .env basado en lo indicado anteriormente.
4. npm run dev

### Frontend:

1. cd frontend
2. npm install
3. Crear archivo .env basado en lo indicado anteriormente.
4. npm run dev

## Endpoints:

### Auth:

#### Registro de ususario (envia mail de verificacion)
- POST
- api/auth/register
- Body -> { username, email, password }

#### Verificar mail mediante token
- GET
- api/auth/verify-email?verification_email_token=

#### Login de ususario
- POST
- api/auth/login
- Body -> { email, password }

### Workspaces:

#### Crea workspace
- POST
- api/workspace
- Auth -> Bearer Token -> Token
- Body -> { title, description }

#### Lista workspaces del usuario
- GET
- api/workspace
- Auth -> Bearer Token -> Token

#### Editar workspace
- PUT
- api/workspace/workspace_id
- Auth -> Bearer Token -> Token
- Body -> { title, description }

#### Obtiene workspace por id
- GET
- api/workspace/workspace_id
- Auth -> Bearer Token -> Token

#### Elimina workspace
- DELETE
- api/workspace/workspace_id
- Auth -> Bearer Token -> Token

#### Invitar usuario
- POST
- api/workspace/workspace_id/members
- Auth -> Bearer Token -> Token
- Body -> { email, role } (rol admin o member)

### Channels:

#### Crear canal
- POST
- api/workspace/workspace_id/channels
- Auth -> Bearer Token -> Token
- Body -> { name }

#### Lista de canales del workspace del usuario
- GET
- api/workspace/workspace_id/channels
- Auth -> Bearer Token -> Token

#### Eliminar canal
- DELETE
- api/workspace/workspace_id/channels/channel_id
- Auth -> Bearer Token -> Token

### Messages:

#### Crear mensaje
- POST
- api/workspace/workspace_id/channels/channel_id/messages
- Auth -> Bearer Token -> Token
- Body -> { content }

#### Lista de mensajes del usuario
- GET
- api/workspace/workspace_id/channels/channel_id/messages
- Auth -> Bearer Token -> Token
