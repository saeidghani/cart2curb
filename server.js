const express = require('express')
const next = require('next')
const { createProxyMiddleware } = require("http-proxy-middleware")

const port = parseInt(process.env.PORT, 10) || 3002
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const apiPath = {
    target: process.env.NEXT_PUBLIC_API_BASE_URL,
    pathRewrite: {
        '^/api' : '/v1'
    },
    changeOrigin: true
}


app.prepare().then(() => {
    const server = express()

    server.use('/v1', createProxyMiddleware(apiPath));

    server.all('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
}).catch(err => {
    console.log('Error:::::', err)
})