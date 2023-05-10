import express, { Express, NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import { Config } from './config'
import { HttpError } from './types/api'
import { healthCheck, mysqlHealthy } from './healthcheck'
import mysql from 'mysql2'
import { AnchorConnect } from './dataSources/AnchorConnect'

const config = new Config()

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
    anchor: new AnchorConnect(),
}

// extract json payload from body automatically
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/connect/:connecttype', async (req: Request, res: Response) => {
    const connectType = req.params['connecttype']
    const connectDataSource = connectDataSources[connectType] || null
    if (!req.body.email || !req.body.password) {
        return res.status(400).send('Missing email or password')
    }
    if (connectDataSource !== null) {
        try {
            const sessionData = await connectDataSource.getSessionData(
                req.body.email,
                req.body.password
            )
            res.status(200).send(sessionData)
        } catch (err) {
            console.log(err)
            if (err instanceof HttpError && err.status) {
                res.status(err.status).send(err.message)
            } else {
                res.status(500).send(err.message)
            }
        }
    } else {
        res.status(400).send('Invalid connect type')
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
        console.log(err)
        httpCode = err.status
    } else {
        // if it is not a known http error, print it for debugging purposes
        console.log(err)
    }
    res.status(httpCode)
    res.send(err.message)
})

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
