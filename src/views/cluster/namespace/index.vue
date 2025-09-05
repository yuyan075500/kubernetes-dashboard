<template>
  <div class="app-container">

    <!-- 表格搜索 -->
    <el-form :inline="true">
      <el-form-item label="名称">
        <el-input v-model="queryParams.name" placeholder="请输入名称空间名称" size="small" prefix-icon="el-icon-search" clearable />
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
    </el-row>

    <!-- 表格 -->
    <namespace-table
      v-loading="loading"
      :table-data="tableData"
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
        :loading="loading"
        @close="yamlDialog = false"
        @submit="handleYAMLSubmit"
      />
    </el-dialog>

    <!-- 新增 -->
    <el-dialog
      v-if="namespaceAddDialog"
      :title="formTitle"
      :visible.sync="namespaceAddDialog"
      :show-close="false"
      width="500px"
      :close-on-click-modal="false"
      @closed="handleClose"
    >
      <namespace-add-form
        ref="form"
        :form="currentValue"
        :loading="loading"
        @close="handleClose"
        @submit="handleSubmit"
      />
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { formatYAML } from '@/utils/yaml'
import { addNamespace, deleteNamespace, updateNamespace, getNamespaceList, getNamespaceYAML } from '@/api/cluster/namespace'
import NamespaceTable from './table'
import NamespaceAddForm from './form'

export default {
  components: {
    NamespaceTable,
    NamespaceAddForm
  },
  data() {
    return {
      loading: true,
      total: 0,
      tableData: [],
      queryParams: {
        name: '',
        page: 1,
        limit: 10
      },
      formTitle: '',
      yamlDialog: false,
      namespaceAddDialog: false,
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
      getNamespaceList(this.queryParams).then((res) => {
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
      this.loading = true
      // 更改Dialog标题
      this.formTitle = '修改'
      // 获取YAML
      getNamespaceYAML(value).then((res) => {
        this.currentValue = formatYAML(res.data)
        this.loading = false
      })
    },

    handleAdd() {
      // 打开Dialog
      this.namespaceAddDialog = true
      // 更改Dialog标题
      this.formTitle = '新增'
    },

    /* 表单提交 */
    handleSubmit(value) {
      this.loading = true
      addNamespace(value).then((res) => {
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
    handleYAMLSubmit(value) {
      this.loading = true
      updateNamespace(value).then((res) => {
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

    /* 删除分组 */
    handleDelete(rowData) {
      this.$confirm('点击确认将永久删除当前名称空间。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            deleteNamespace(rowData).then((res) => {
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

    /* 表单关闭 */
    handleClose() {
      // 关闭所有Dialog
      this.yamlDialog = false
      this.namespaceAddDialog = false
      // 关闭loading状态
      this.loading = false
      // 清空校验规则
      this.$refs.form.$refs.form.resetFields()
      // 清空表单数据
      this.currentValue = undefined
      // 获取最新数据
      this.getList()
    }
  }
}
</script>
