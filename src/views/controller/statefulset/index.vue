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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-delete" size="mini" @click="handleDelete(selectData)">删除</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <stateful-set-table
      v-loading="loading"
      :table-data="tableData"
      @select-change="handleSelect"
      @yaml="handleYAML"
      @delete="handleDelete"
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

    <!-- 新增 -->
    <el-dialog
      v-if="yamlAddDialog"
      :title="formTitle"
      :visible.sync="yamlAddDialog"
      :show-close="false"
      width="1000px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <yaml-editor
        ref="form"
        :value="currentValue"
        @close="yamlAddDialog = false"
        @submit="handleAddSubmit"
      />
    </el-dialog>

    <el-dialog
      v-if="yamlUpdateDialog"
      :title="formTitle"
      :visible.sync="yamlUpdateDialog"
      :show-close="false"
      width="1000px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <!-- YAML 组件 -->
      <yaml-editor
        ref="form"
        :value="currentValue"
        @close="yamlUpdateDialog = false"
        @submit="handleUpdateSubmit"
      />
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { formatYAML } from '@/utils/yaml'
import { addStatefulSet, deleteStatefulSet, updateStatefulSet, getStatefulSetList, getStatefulSetYAML } from '@/api/controller/statefulset'
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
      selectData: [],
      formTitle: '',
      yamlAddDialog: false,
      yamlUpdateDialog: false,
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

    /* 更新选中的数据 */
    handleSelect(value) {
      this.selectData = value
    },

    /* 新增 */
    handleAdd() {
      // 打开Dialog
      this.yamlAddDialog = true
      // 更改Dialog标题
      this.formTitle = '新增'
      this.currentValue = undefined
    },

    /* YAML */
    handleYAML(value) {
      // 打开Dialog
      this.yamlUpdateDialog = true
      // 更改Dialog标题
      this.formTitle = '编辑'
      // 获取YAML
      getStatefulSetYAML(value).then((res) => {
        this.currentValue = formatYAML(res.data)
      })
    },

    /* 表单提交 */
    handleAddSubmit(value) {
      this.loading = true
      addStatefulSet(value).then((res) => {
        if (res.code === 0) {
          Message({
            message: res.msg,
            type: 'success',
            duration: 1000
          })
          this.loading = false
          this.handleClose()
        }
      }, () => {
        this.loading = false
      })
    },

    /* 表单提交 */
    handleUpdateSubmit(value) {
      this.loading = true
      updateStatefulSet(value).then((res) => {
        if (res.code === 0) {
          Message({
            message: res.msg,
            type: 'success',
            duration: 1000
          })
          this.loading = false
          this.handleClose()
        }
      }, () => {
        this.loading = false
      })
    },

    /* 删除 */
    handleDelete(value) {
      const result = this.generateStatefulSetDeleteData(value)
      this.$confirm('点击确认将删除当前工作负载。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            deleteStatefulSet(result).then((res) => {
              if (res.code === 0) {
                Message({
                  message: res.msg,
                  type: 'success',
                  duration: 1000
                })
                instance.confirmButtonLoading = false
                done()
                this.getList()
              }
            }).finally(() => {
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '确定'
            })
          } else {
            done()
          }
        }
      }).then(() => {}).catch(() => {})
    },

    generateStatefulSetDeleteData(value) {
      const result = {
        statefulSets: []
      }

      if (Object.prototype.toString.call(value) === '[object Object]') {
        result.statefulSets.push({
          name: value.metadata.name,
          namespace: value.metadata.namespace
        })
      } else if (Array.isArray(value)) {
        value.forEach(item => {
          result.statefulSets.push({
            name: item.metadata.name,
            namespace: item.metadata.namespace
          })
        })
      }
      return result
    },

    /* Dialog 关闭 */
    handleClose() {
      // 关闭所有 Dialog
      this.yamlUpdateDialog = false
      this.yamlAddDialog = false
      // 清空表单数据
      this.currentValue = undefined
      // 获取最新数据
      this.getList()
    }
  }
}
</script>
