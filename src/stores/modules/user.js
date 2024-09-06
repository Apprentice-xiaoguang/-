import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getInfoService } from '@/api/user'
//用户模块 token setToken removeToken
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }
    const userInfo = ref({})
    const getUserInfo = async () => {
      const res = await getInfoService()
      userInfo.value = res.data.data
    }
    const setUserInfo = (obj) => {
      userInfo.value = obj
    }
    return {
      token,
      setToken,
      removeToken,
      userInfo,
      getUserInfo,
      setUserInfo
    }
  },
  {
    persist: true
  }
)
