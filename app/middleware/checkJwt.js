module.exports = (options,app)=>{
	return async function checkJwt(ctx,next){
		if(app.config.env==='local') return await next();
		let authorization = ctx.request.header.authorization
		if(!(authorization.length>0)){
			ctx.err('请重新登录',401)
		}
		let token = authorization.split(' ')[1]
		try{
			// console.log(token)
			let info = app.jwt.verify(token, app.config.jwt.secret)
			let result = await ctx.service.login.valid(info)
			if(result){
				await next();
			}else{
				ctx.err('token 不正确，请重新获取',401)
			}
		}catch(e){
			if(e.name === 'TokenExpiredError'){
				ctx.err('token 已过期! 请重新获取令牌',401)
			}else{
				console.log(e)
				ctx.err('其他错误')
			}
		}
	}
}