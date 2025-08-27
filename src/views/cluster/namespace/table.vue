<template>
  <el-table :data="tableData" tooltip-effect="dark" style="width: 100%; margin-top:10px;" size="mini" border>
    <el-table-column type="selection" width="40" />
    <el-table-column show-overflow-tooltip prop="metadata.name" label="名称" min-width="6%" />
    <el-table-column label="来源" min-width="2%">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.metadata.name === 'kube-system' || scope.row.metadata.name === 'kube-public' || scope.row.metadata.name === 'kube-node-lease'" type="danger" size="mini">系统</el-tag>
        <el-tag v-else-if="scope.row.metadata.name === 'default'" type="warning" size="mini">默认</el-tag>
        <el-tag v-else size="mini">用户</el-tag>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="metadata.labels" label="标签" min-width="8%">
      <template slot-scope="scope">
        <div v-for="(value, key) in scope.row.metadata.labels" :key="key">
          <el-tag type="info" size="mini">{{ key }}={{ value }}</el-tag>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="status.phase" label="状态" min-width="2%">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.status.phase === 'Active'" type="success" size="mini">{{ scope.row.status.phase }}</el-tag>
        <el-tag v-else type="danger" size="mini">{{ scope.row.status.phase }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column :formatter="dateFormat" prop="metadata.creationTimestamp" label="创建时间" min-width="4%" />
    <el-table-column label="备注" min-width="4%" />
    <el-table-column label="操作" min-width="6%" align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="handleYAML(scope.row)">YAML</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import moment from 'moment'

export default {
  name: 'NamespaceTable',
  props: {
    tableData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  methods: {
    /* 编辑 YAML按钮 */
    handleYAML(value) {
      this.$emit('yaml', value)
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
