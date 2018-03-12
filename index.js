const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
const bodyParser = require('koa-bodyparser')
const { spawn, execSync } = require('child_process')
const { appendFileSync } = require('fs')
const logfile = 'output.log'
const port = process.env.PORT || 9200

app.use(bodyParser())

execSync(`touch ${logfile}`)

router.post('/cmd', (ctx, next) => {
  try {
    const body = ctx.request.body
    const childProc = spawn(body.cmd, body.args)

    childProc.stdout.on('data', (data) => {
      appendFileSync(`./${logfile}`, data, 'utf8')
    })

    childProc.stderr.on('data', (data) => {
      appendFileSync(`./${logfile}`, data, 'utf8')
    })

    ctx.status = 200
    ctx.body = {
      status: true,
      message: 'Command issued successfully.'
    }
  } catch (e) {
    ctx.status = 500
    ctx.body = {
      status: false,
      message: e.message
    }
  }
})

app.use(router.routes())
app.listen(port)

process.stdout.write(`Server running at port ${port}...`)
