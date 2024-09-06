<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { userRegisterService, userLoginService } from '@/api/user'
import { watch } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import { useRouter } from 'vue-router'

const isRegister = ref(false)
const ruleForm = ref({
  username: '',
  password: '',
  repassword: ''
})
const rules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    },
    {
      min: 3,
      max: 9,
      message: '用户名必须是3-9个字符',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      pattern: /^\S{6,10}$/,
      message: '密码必须是6-10个非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      pattern: /^\S{6,10}$/,
      message: '密码必须是6-10个非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== ruleForm.value.password) {
          callback('输入密码不一致')
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
const form = ref()
const register = async () => {
  await form.value.validate()
  await userRegisterService(ruleForm.value)
  ElMessage({
    message: '注册成功',
    type: 'success',
    plain: true
  })
  isRegister.value = false
}

const userstore = useUserStore()
const router = useRouter()
const login = async () => {
  await form.value.validate()
  const res = await userLoginService(ruleForm.value)
  ElMessage({
    message: '登录成功',
    type: 'success',
    plain: true
  })
  userstore.setToken(res.data.token)
  router.push('/')
}

watch(isRegister, () => {
  ruleForm.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="请输入用户名"
            v-model="ruleForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="ruleForm.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <el-form
        ref="form"
        size="large"
        autocomplete="off"
        v-else
        :model="ruleForm"
        :rules="rules"
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="ruleForm.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
