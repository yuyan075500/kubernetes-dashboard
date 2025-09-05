<template>
  <div class="app-container">

    <!-- 表格搜索 -->
    <el-form :inline="true">
      <el-form-item label="名称">
        <el-input v-model="queryParams.name" placeholder="请输入Pod名称" size="small" prefix-icon="el-icon-search" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格头 -->
    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-delete" size="mini" @click="handleDelete(selectData)">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-delete-solid" size="mini" @click="handleDelete(selectData, 0)">强制删除</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <pod-table
      v-loading="loading"
      :table-data="tableData"
      @select-change="handleSelect"
      @yaml="handleYAML"
      @terminal="handleTerminal"
      @log="handleLog"
      @delete="handleDelete"
      @delete-force="handleDelete"
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
import { Message } from 'element-ui'
import { formatYAML } from '@/utils/yaml'
import { deletePods, getPodList, getPodYAML } from '@/api/controller/pod'
import PodTable from './table'

export default {
  components: {
    PodTable
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
      getPodList(this.queryParams).then((res) => {
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
      getPodYAML(value).then((res) => {
        this.currentValue = formatYAML(res.data)
      })
    },

    /* 更新选中的数据 */
    handleSelect(value) {
      this.selectData = value
    },

    /* 终端 */
    handleTerminal(value) {
      const containers = value.spec.containers.map(container => ({
        name: container.name
      }))
      const routeData = this.$router.resolve({
        path: '/terminal',
        query: {
          ...this.$route.query,
          PodName: value.metadata.name,
          Containers: JSON.stringify(containers),
          ContainerName: value.spec.containers[0].name,
          Namespace: value.metadata.namespace
        }
      })
      window.open(routeData.href, '_blank')
    },

    /* 日志 */
    handleLog(value) {
      const containers = value.spec.containers.map(container => ({
        name: container.name
      }))
      const routeData = this.$router.resolve({
        path: '/log',
        query: {
          ...this.$route.query,
          PodName: value.metadata.name,
          Containers: JSON.stringify(containers),
          ContainerName: value.spec.containers[0].name,
          Namespace: value.metadata.namespace
        }
      })
      window.open(routeData.href, '_blank')
    },

    /* 删除 */
    handleDelete(value, force = null) {
      const result = this.generatePodDeleteData(value)
      if (force === 0) {
        result.force = force
      }
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
            deletePods(result).then((res) => {
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

    generatePodDeleteData(value, force = null) {
      const result = {
        force: force,
        pods: []
      }

      if (Object.prototype.toString.call(value) === '[object Object]') {
        result.pods.push({
          name: value.metadata.name,
          namespace: value.metadata.namespace
        })
      } else if (Array.isArray(value)) {
        value.forEach(item => {
          result.pods.push({
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
      this.yamlDialog = false
      // 清空表单数据
      this.currentValue = undefined
      // 获取最新数据
      this.getList()
    }
  }
}
</script>
