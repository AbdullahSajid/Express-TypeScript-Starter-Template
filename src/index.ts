import 'dotenv/config'
import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import morgan from 'morgan'
import config from './config'
import routes from "./routes"
import { connectDB } from "./config/db"

const app: Application = express()
const PORT = process.env.PORT || 7000
const envConfig = config[process.env.NODE_ENV || 'development']
const log = envConfig.log()

connectDB()

app.use(express.urlencoded({ limit: '2mb', extended: true }))
app.use(express.json({ limit: '2mb' }))

app.use(cors())
app.use(compression())
app.use(helmet())
app.use(morgan('dev'))

app.use(envConfig.contextRoot, routes)

app.get('/healthCheck', (req, res) =>
  res.send(`Server is healthy, operating on port ${PORT}`)
)

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error)
  const e: any = { success: false }
  e.msg = error.message || "An error occured"
  e.statusCode = error.statusCode || 400
  if (error.errors) e.errors = error.errors
  // if (error.stack) log.error(error.stack)
  return res.status(e.statusCode).json(e)
})

app.listen(PORT, () =>
  log.info(`Server is listening on port ${PORT} in ${app.get('env')} mode.`)
)
