module.exports = (options, app) => {
  return async function checkJwt(ctx, next) {
    if(ctx.request.method.toLowerCase() === 'get'){
      return await next();
    }
    let whiteList = options.whiteList || [];
    let whiteUrl = whiteList.some((item) => ctx.url.startsWith(item));
    if (whiteUrl) {
      // console.log("再白名单");
      return await next();
    }
    let authorization = ctx.request.header.authorization;
    if (!(authorization.length > 0)) {
      ctx.err("没有token请重新登录", 401);
    }
    let token = authorization.split(" ")[1];
    // console.log(token);
    try {
      let info = app.jwt.verify(token, app.config.jwt.secret);
      let result = await ctx.service.login.validUser(info);
      if (result) {
        await next();
      } else {
        console.log('token 解密后与数据库里的信息不符');
        ctx.err("token 不正确，请重新获取", 401);
      }
    } catch (e) {
      if (e.name === "TokenExpiredError") {
        // ctx.err("token 已过期! 请重新获取令牌", 401);
        // TODO 当一次性来多个请求的时候还需要优化解决方案
        console.log('token 已过期! 正在获取令牌');
        let _info = app.jwt.decode(token,app.config.jwt.secret);
        let newtoken = app.jwt.sign({
          account: _info.account,
          pass: _info.pass
        }, app.config.jwt.secret, {
          expiresIn: "30m"
        })
        ctx.newToken = newtoken;
        await next();
      } else {
        console.log(e);
        ctx.err("其他错误", 401);
      }
    }
  };
};