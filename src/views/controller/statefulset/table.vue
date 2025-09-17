<template>
  <el-table :data="tableData" tooltip-effect="dark" style="width: 100%; margin-top:10px;" size="mini" border @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="40" />
    <el-table-column show-overflow-tooltip prop="metadata.name" label="名称" min-width="5%" />
    <el-table-column show-overflow-tooltip prop="metadata.namespace" label="名称空间" min-width="5%" />
    <el-table-column show-overflow-tooltip label="状态" min-width="5%">
      <template slot-scope="scope">
        <span>{{ scope.row.status.readyReplicas || 0 }}/{{ scope.row.status.replicas || 0 }}</span>
      </template>
    </el-table-column>
    <el-table-column :formatter="dateFormat" prop="metadata.creationTimestamp" label="创建时间" min-width="5%" />
    <el-table-column label="操作" min-width="5%" align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="handleYAML(scope.row)">YAML</el-button>
        <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import moment from 'moment'

export default {
  name: 'StatefulSetTable',
  props: {
    tableData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  methods: {

    /* 删除按钮 */
    handleDelete(value) {
      this.$emit('delete', value)
    },

    /* 编辑 YAML按钮 */
    handleYAML(value) {
      this.$emit('yaml', value)
    },

    /* 将选中的值传给父组件 */
    handleSelectionChange(value) {
      this.$emit('select-change', value)
    },

    /* 日期时间格式化 */
    dateFormat: function(row, column) {
      const date = row.metadata.creationTimestamp
      if (date === undefined || date === null) {
        return ''
      } else {
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  }
}
</script>

<style scoped>
.el-button-text {
    border-color: transparent;
    color: #606266;
    background: transparent;
    padding-left: 0;
    padding-right: 0;
}
</style>
