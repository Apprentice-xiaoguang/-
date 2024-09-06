<script setup>
import { artGetChannelService } from '@/api/article'
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { artDeleteChannelService } from '@/api/article.js'
const channelList = ref([])
const loading = ref(false)
const dialog = ref()

const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelService()
  channelList.value = res.data.data
  loading.value = false
}
getChannelList()

const onEditChanel = (row, $index) => {
  dialog.value.open(row)
}
const onDelChanel = async (row, $index) => {
  await artDeleteChannelService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}
const onAddChannel = () => {
  dialog.value.open({})
}
const onSuccess = () => {
  getChannelList()
}
</script>

<template>
  <PageContainer title="文章分类">
    <template #extra>
      <el-button @click="onAddChannel">添加分类</el-button>
    </template>
    <el-table :data="channelList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column label="分类名称" prop="cate_name"></el-table-column>
      <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row, $index }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChanel(row, $index)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChanel(row, $index)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- dialog弹框 -->
    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
  </PageContainer>
</template>

<style lang="scss" scoped></style>
