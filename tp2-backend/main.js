
import { connectMongoDB } from "./config/mongoDB.config.js"
import express from 'express'
import authRouter from "./routes/auth.router.js"
import randomMiddleware from "./middlewares/random.middleware.js"
import cors from 'cors'
import workspaceRouter from "./routes/workspace.router.js"
import workspaceRepository from "./repository/workspace.repository.js"
import messagesRepository from "./repository/messages.repository.js"

connectMongoDB()

const app = express()

app.use(cors())

app.use(express.json())

app.use("/api/auth", authRouter)
app.use("/api/workspace", workspaceRouter)

app.listen(
    8080, 
    () => {
        console.log('Nuestra app se escucha en el puerto 8080')
    }
)