const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
const { spawn } = require('child_process')

router.get('/customcmd/:cmdAlias', (ctx, next) => {
  const ls = spawn('whoami')

  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })

  console.log(JSON.stringify(ctx.query))
  ctx.status = 200
  ctx.body = ctx.params.cmdAlias
})

app.use(router.routes())

app.listen(3000)
