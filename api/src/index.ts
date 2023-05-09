import express, { Express, NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import { Config } from './config'
import { HttpError } from './types/api'
import { healthCheck, mysqlHealthy } from './healthcheck'
import mysql from 'mysql2'

const config = new Config()

const pool = mysql.createPool({
    uri: config.getMySQLConnectionString(),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
    // do not touch dates and return native string representation
    // see https://github.com/mysqljs/mysql#connection-options
    dateStrings: true,
})

const app: Express = express()
const port = config.getExpressPort()

// extract json payload from body automatically
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }))

app.get(
    '/health',
    healthCheck({
        db: mysqlHealthy(pool),
    })
)

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
