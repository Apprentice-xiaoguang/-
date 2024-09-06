<script setup>
import { ref } from 'vue'
import { artAddChannelService, artEditChannelService } from '@/api/article.js'
const dialogVisible = ref(false)
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
const formRef = ref()
const rules = {
  cate_name: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur'
    },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名称必须是1-10位非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur'
    },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1-15位字母或数字',
      trigger: 'blur'
    }
  ]
}
const open = (row) => {
  formModel.value = { ...row }
  dialogVisible.value = true
}
const emit = defineEmits(['success'])
const onSubmit = async () => {
  await formRef.value.validate()
  const isEdit = formModel.value.id
  if (isEdit) {
    await artEditChannelService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    await artAddChannelService(formModel.value)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  emit('success')
}
defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="500"
  >
    <el-form
      :model="formModel"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          placeholder="请输入分类名称"
          v-model="formModel.cate_name"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          placeholder="请输入分类别名"
          v-model="formModel.cate_alias"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
