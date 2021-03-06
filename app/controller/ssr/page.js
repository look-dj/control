"use strict";
const Controller = require("egg").Controller;

class PageController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.table = "page";
  }
  async read() {
    let { ctx, service, table } = this;
    let req = ctx.request.body;
    let result = await service.ssr.db.get(table, req);
    if (result) return ctx.success("成功查询到一条数据", result);
    ctx.err("未查询到数据");
  }
  async add() {
    let { ctx, service, table } = this;
    let req = ctx.request.body;
    let result = await service.ssr.db.add(table, req);
    if (result) return ctx.success("添加成功");
    ctx.err("添加单页失败");
  }
  async update() {
    let { ctx, service, table } = this;
    let req = ctx.request.body;
    let result = await service.ssr.db.update(table, req);
    if (result) return ctx.success("更新成功");
    ctx.err("更新失败");
  }
  async delete() {
    let { ctx, service, table } = this;
    let req = ctx.request.body;
    let result = await service.ssr.db.deleteSingle(table, req);
    if (result) return ctx.success("删除成功");
    ctx.err("删除失败");
  }
  async readPageByNid() {
    let { ctx, service } = this;
    let req = ctx.request.body;
    let result = await service.ssr.page.getPageByNid(req);
    if (!result)
      return ctx.err("获取失败");
    ctx.success("获取成功", result);
  }
}

module.exports = PageController;