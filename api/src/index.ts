import express, { Express, NextFunction, Request, Response } from 'express'
import cors, { CorsOptions, CorsRequest } from 'cors'
import bodyParser from 'body-parser'
import { Config } from './config'
import { HttpError } from './types/api'
import { healthCheck, mysqlHealthy } from './healthcheck'
import mysql from 'mysql2'
import { AnchorConnect } from './dataSources/AnchorConnect'

const config = new Config()

const logger = config.getLogger()

// const pool = mysql.createPool({
//     uri: config.getMySQLConnectionString(),
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
//     multipleStatements: true,
//     // do not touch dates and return native string representation
//     // see https://github.com/mysqljs/mysql#connection-options
//     dateStrings: true,
// })

const app: Express = express()
const port = config.getExpressPort()

const connectDataSources: { [key: string]: any } = {
    anchor: new AnchorConnect(logger),
}

// extract json payload from body automatically
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }))

// do not show powered by express in headers
app.disable('x-powered-by')

// CORS Handling

const corsAllowList = [
    'http://localhost:3000',
    'https://connect.openpodcast.app',
]

const corsOptions = {
    origin: function (origin: string | undefined, callback: any) {
        if (origin && corsAllowList.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
}

app.use(cors(corsOptions))

app.post('/connect/:connecttype', async (req: Request, res: Response) => {
    const connectType = req.params['connecttype']
    if (!connectDataSources.hasOwnProperty(connectType)) {
        return res.status(400).send('Invalid connect type')
    }
    const connectDataSource = connectDataSources[connectType]

    // connect type specific handling starts here
    // might be a good idea to move this to a separate file when there are multiple connect types

    // check if email and password are present and valid
    const email = req.body.email
    const password = req.body.password
    if (!email || !password || email.length < 4 || password.length < 5) {
        return res.status(400).send('Missing email or password')
    }
    try {
        const sessionData = await connectDataSource.getSessionData(
            req.body.email,
            req.body.password
        )
        res.status(200).send(sessionData)
    } catch (err: any) {
        logger.error(err)
        if (err instanceof HttpError && err.status) {
            res.status(err.status).send(err.message)
        } else {
            res.status(500).send(err.message)
        }
    }
})

// app.get(
//     '/health',
//     healthCheck({
//         db: mysqlHealthy(pool),
//     })
// )

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
    const err = new HttpError('Not Found')
    err.status = 404
    next(err)
})

// error handler
app.use(function (err: Error, req: Request, res: Response) {
    let httpCode = 500
    if (err instanceof HttpError) {
        logger.debug(err)
        httpCode = err.status
    } else {
        // if it is not a known http error, print it for debugging purposes
        logger.error(err)
    }
    res.status(httpCode)
    res.send(err.message)
})

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
