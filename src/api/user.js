import request from '@/utils/request'

//注册接口
export const userRegisterService = ({ username, password, repassword }) => {
  return request.post('/api/reg', { username, password, repassword })
}

// 登录接口
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', { username, password })

//用戶的个人信息

export const getInfoService = () => request.get('/my/userinfo')

//更新用户信息
export const userUpdateService = ({ id, nickname, email }) =>
  request.put('/my/userinfo', { id, nickname, email })
//更换头像
export const userUpdateImgService = (avatar) =>
  request.patch('/my/update/avatar', {
    avatar
  })
//修改密码
export const userEditPWDService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
