import request from '@/utils/request'

// 获取文章分类
export const artGetChannelService = () => request.get('/my/cate/list')
//新增文章分类
export const artAddChannelService = (data) => request.post('/my/cate/add', data)
//编辑文章分类
export const artEditChannelService = (data) =>
  request.put('/my/cate/info', data)
//删除文章分类
export const artDeleteChannelService = (id) =>
  request.delete('/my/cate/del', {
    params: {
      id
    }
  })
//获取文章列表
export const artGetChannelLisetService = (params) =>
  request.get('/my/article/list', {
    params
  })
//发布文章form-data类型
export const artPublishService = (data) => request.post('/my/article/add', data)
//h获取文章详情
export const artGetDetailService = (id) =>
  request.get('/my/article/info', {
    params: {
      id
    }
  })
//编辑文章详情
export const artEditService = (data) => request.put('/my/article/info', data)
//删除文章
export const artDeleteService = (id) =>
  request.delete('/my/article/info', {
    params: {
      id
    }
  })
