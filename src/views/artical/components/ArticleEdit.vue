<script setup>
import { ref } from 'vue'
import ChannelSelete from './ChannelSelete.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artPublishService,
  artGetDetailService,
  artEditService
} from '@/api/article'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request'
import axios from 'axios'
const drawer = ref(false)
const defaultForm = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}
const formModel = ref({ ...defaultForm })
const rules = {
  title: [
    {
      required: true,
      message: '文章标题不能为空',
      trigger: 'blur'
    }
  ],
  cate_id: [
    {
      required: true,
      message: '文章分类不能为空',
      trigger: 'blur'
    }
  ]
}
const imgUrl = ref()
const emit = defineEmits(['success'])
const editRef = ref()
const open = async (row) => {
  drawer.value = true
  if (row.id) {
    //编辑文章
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
    imgUrl.value = baseURL + formModel.value.cover_img
    //更新文章，发送请求，图片是file类型，需转化
    const file = await imageUrlToFile(imgUrl.value, formModel.value.cover_img)
    formModel.value.cover_img = file
  } else {
    //新建文章
    formModel.value = { ...defaultForm }
    imgUrl.value = ''
    if (editRef.value) {
      editRef.value.setHTML('')
    }
  }
}
const onSeleteFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  formModel.value.cover_img = uploadFile.raw
}
const onPublish = async (state) => {
  formModel.value.state = state
  //发送文章的参数类型为formdata，需要转化
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
    //发请求
  }
  if (formModel.value.id) {
    await artEditService(fd)
    ElMessage.success('编辑成功')
    drawer.value = false
    emit('success', 'edit')
  } else {
    await artPublishService(fd)
    ElMessage.success('发布成功')
    drawer.value = false
    emit('success', 'add')
  }
}
// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}
defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="drawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    size="30%"
  >
    <!-- 发表文章表单 -->
    <el-form
      :model="formModel"
      ref="formRef"
      label-width="100px"
      :rules="rules"
    >
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <ChannelSelete v-model="formModel.cate_id" width="100%"></ChannelSelete>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSeleteFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <QuillEditor
            theme="snow"
            ref="editRef"
            v-model:content="formModel.content"
            content-type="html"
          ></QuillEditor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
//富文本
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
