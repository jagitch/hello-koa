const koa = require('koa')
const static = require('koa-static')
const fs = require('fs')
// const bodyparser = require('koa-bodyparser')
const koabody = require('koa-body')
const Router = require('koa-router');
const multer = require('@koa/multer');
const path = require('path')
const { route } = require('../shoutbox/app')
const app = new koa();
const router = new Router();
const upload = multer({dest:'./uploads/'})
const types = upload.single('avatar');
router.get('/user', async (ctx, next) => {
    ctx.response.body = `
        <form action="/user/login" method="post" enctype="multipart/form-data">
            <p>
                <input name="name" type="text" placeholder="请输入用户名" />
            </p>
            <p>
                <input name="password" type="password" placeholder="请输入密码" />
            </p>
            <button>Login</button>
        </form>
    `
})
router.post('/user/login', async (ctx, next) => {
    const { name, password } = ctx.request.body;
    if (name === 'admin' && password === '123456') {
        ctx.response.body = `Hello, ${name}`

    } else {
        ctx.response.body = '账号或密码错误'
    }
})
router.get('/upload', async (ctx, next) => {
    ctx.response.body = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>上传图片</title>
        </head>
        <body>
            <form method='post' action='/profile' enctype="multipart/form-data">
                <label>选择图片：</label>
                <input name="avatar" id="upfile" type="file" />
                <button>上传</button>
            </form>
        </body>
        </html>
    `;
})
router.post('/profile', types, async (ctx, next) => {
    const {
        originalname,
        path: out_path,
        mimetype
    } = ctx.request.file.fhi;
    let newName = out_path + path.parse(originalname).ext;
    let err = fs.renameSync(out_path, newName)
    let result
    if (err) {
        result = JSON.stringify(err)
    } else {
        result = '<h1>upload success</h1>'
    }
    ctx.response.body = result;
}); 
app.on('error', (err, ctx) => {
    ctx.body = 'heofehi';  
    ctx.status = 502;
})
app.use(static(
    path.join(__dirname,'/static')
))
// app.use(koabody({multipart:true,formLimit:'100mb'}));
app.use(router.routes());

app.listen(3000, () => {
    console.log('server on http://localhost:3000')
})
