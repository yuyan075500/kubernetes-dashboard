<template>
  <div class="app-container">

    <!-- 表格搜索 -->
    <el-form :inline="true">
      <el-form-item label="关键字">
        <el-input v-model="queryParams.name" placeholder="支持名称和IP地址" size="small" prefix-icon="el-icon-search" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格头 -->
    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-video-pause" size="mini">禁止调度</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-remove" size="mini">驱逐</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-video-play" size="mini">恢复调度</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <node-table
      v-loading="loading"
      :table-data="tableData"
    />

    <!-- 分页 -->
    <el-pagination
      background
      :current-page="queryParams.page"
      :page-sizes="[15, 20, 50, 100, 500]"
      :page-size="queryParams.limit"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handlePageSizeChange"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script>
import { getNodeList } from '@/api/cluster/node'
import NodeTable from './table'

export default {
  components: {
    NodeTable
  },
  data() {
    return {
      loading: true,
      total: 0,
      tableData: [],
      queryParams: {
        uuid: sessionStorage.getItem(this.$route.query.cluster),
        name: '',
        page: 1,
        limit: 10
      }
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
      getNodeList(this.queryParams).then((res) => {
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
    }
  }
}
</script>
