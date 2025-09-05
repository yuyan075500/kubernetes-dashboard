<template>
  <div class="app-container">

    <!-- 表格搜索 -->
    <el-form :inline="true">
      <el-form-item label="名称">
        <el-input v-model="queryParams.name" placeholder="请输入StatefulSet名称" size="small" prefix-icon="el-icon-search" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格头 -->
    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini">新增</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <stateful-set-table
      v-loading="loading"
      :table-data="tableData"
      @yaml="handleYAML"
    />

    <!-- 分页 -->
    <el-pagination
      background
      :current-page="queryParams.page"
      :page-sizes="[10, 15, 20, 50, 100, 500]"
      :page-size="queryParams.limit"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handlePageSizeChange"
      @current-change="handlePageChange"
    />

    <el-dialog
      v-if="yamlDialog"
      :title="formTitle"
      :visible.sync="yamlDialog"
      :show-close="false"
      width="1000px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <!-- YAML 组件 -->
      <yaml-editor
        ref="form"
        :value="currentValue"
        @close="yamlDialog = false"
      />
    </el-dialog>
  </div>
</template>

<script>
import { formatYAML } from '@/utils/yaml'
import { getStatefulSetList, getStatefulSetYAML } from '@/api/controller/statefulset'
import StatefulSetTable from './table'

export default {
  components: {
    StatefulSetTable
  },
  data() {
    return {
      loading: true,
      total: 0,
      tableData: [],
      queryParams: {
        namespace: localStorage.getItem(this.$route.query.cluster + '_namespace'),
        name: '',
        page: 1,
        limit: 10
      },
      formTitle: '',
      yamlDialog: false,
      currentValue: undefined
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /* 查找数据 */
    searchList() {
      this.queryParams.page = 1
      this.getList()
    },

    /* 获取表格数据 */
    getList() {
      this.loading = true
      getStatefulSetList(this.queryParams).then((res) => {
        this.tableData = res.data.items
        this.total = res.data.total
        this.loading = false
      })
    },

    /* 监听page size变化 */
    handlePageSizeChange(newSize) {
      this.queryParams.limit = newSize
      this.getList()
    },

    /* 监听page number的变化 */
    handlePageChange(newPage) {
      this.queryParams.page = newPage
      this.getList()
    },

    /* page size的变化 */
    handleCurrentChange(newPage) {
      this.queryParams.limit = newPage
      this.getList()
    },

    /* YAML */
    handleYAML(value) {
      // 打开Dialog
      this.yamlDialog = true
      // 更改Dialog标题
      this.formTitle = '编辑'
      // 获取YAML
      getStatefulSetYAML(value).then((res) => {
        this.currentValue = formatYAML(res.data)
      })
    },

    /* Dialog 关闭 */
    handleClose() {
      // 关闭所有 Dialog
      this.yamlDialog = false
      // 清空表单数据
      this.currentValue = undefined
      // 获取最新数据
      this.getList()
    }
  }
}
</script>
