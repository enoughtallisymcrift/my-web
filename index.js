import compression from 'compression'
import express from 'express'
import session from 'express-session'
import https from 'https'
import path from 'path'
import { cwd, GUEST_ID, isProduction, PORT, secret, SESSION_TTL, tls, token, vite } from './global.js'
import initDb from './mongodb/index.js'
import connectDb from './mongodb/session.js'
import filesRoute from './routes/files/index.js'
import pagesRoute from './routes/pages/index.js'
import todosRoute from './routes/todos/index.js'
import usersRoute from './routes/users/index.js'

async function createServer() {
    const app = express()

    /* initialize mongodb
        只在第一次运行程序时初始化数据库的collection和expired字段，并不是打开也不是连接db
    */
    await initDb()

    if (!isProduction) {
        /* vite middlewareMode */
        app.use(vite.middlewares)
    }
    else {
        /* session middleware */
        app.use(session({
            secret,
            store: new (connectDb(session))(undefined, SESSION_TTL),
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: SESSION_TTL,
                secure: true,
                sameSite: 'strict'
            }
        }))

        /* compression */
        app.use(compression())
        /* parse json */
        app.use(express.json())
        /* static */
        app.use(express.static(
            path.resolve(cwd, 'dist/client'),
            { index: false }//http://expressjs.com/en/4x/api.html#express.static
        ))

        /* api routes */
        const apiRouter = express.Router()
        /* validate token and initialize userId */
        apiRouter.use((req, res, next) => {
            if (req.get('token') !== token) {
                return res.end()
            }
            if (req.session.userId === undefined) {
                req.session.userId = GUEST_ID
            }
            next()
        })
        usersRoute(apiRouter)
        todosRoute(apiRouter)
        filesRoute(apiRouter)
        app.use('/api', apiRouter)
    }

    /* ssr */
    pagesRoute(app)

    /* error handler */
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
        res.status(500).send(err.stack)
    })

    return https.createServer(tls, app)
}

createServer().then(app => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
})
