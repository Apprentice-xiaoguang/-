<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelete from './components/ChannelSelete.vue'
import { artGetChannelLisetService, artDeleteService } from '@/api/article'
import { formatTime } from '@/utils/format'
import ArticleEdit from './components/ArticleEdit.vue'
import { ElMessage } from 'element-plus'

const articleList = ref([])
const total = ref()
const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})
const loading = ref(false)
const articleEditRef = ref()

const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}
const onDeleteArticle = async (row) => {
  await artDeleteService(row.id)
  ElMessage.success('删除成功')
  getArticleList()
}
const getArticleList = async () => {
  loading.value = true
  const res = await artGetChannelLisetService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
const onSizeChange = (size) => {
  params.value.pagenum = 1
  params.value.pageSize = size
  getArticleList()
}
const onCurrentChange = (page) => {
  params.value.pagenum = page
  getArticleList()
}
const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}
const onSet = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

const onAddArticle = () => {
  articleEditRef.value.open({})
}
const onSuccess = (type) => {
  if (type === 'add') {
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
  }
  getArticleList()
}

getArticleList()
</script>

<template>
  <PageContainer title="文章管理">
    <template #extra>
      <el-button @click="onAddArticle">添加文章</el-button>
    </template>
    <!-- el-form -->
    <el-form inline>
      <el-form-item label="文章分类:">
        <ChannelSelete
          v-model="params.cate_id"
          style="width: 100px"
        ></ChannelSelete>
      </el-form-item>
      <el-form-item label="发布状态:">
        <el-select
          placeholder="请选择"
          v-model="params.state"
          style="width: 100px"
        >
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onSet">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- el-table -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发布时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 4, 5, 10]"
      :background="true"
      layout="jumper,total, sizes, prev, pager, next,"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 30px; justify-content: flex-end"
    />
    <!-- Drawer抽屉 -->
    <ArticleEdit ref="articleEditRef" @success="onSuccess"></ArticleEdit>
  </PageContainer>
</template>
<style lang="scss" scoped></style>
