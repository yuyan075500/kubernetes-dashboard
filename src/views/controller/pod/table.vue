<template>
  <el-table :data="tableData" tooltip-effect="dark" style="width: 100%; margin-top:10px;" size="mini" border>
    <el-table-column type="selection" width="40" />
    <el-table-column show-overflow-tooltip prop="metadata.name" label="名称" min-width="7%" />
    <el-table-column show-overflow-tooltip prop="metadata.namespace" label="名称空间" min-width="4%" />
    <el-table-column prop="status.phase" label="状态" min-width="3%">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.status.phase === 'Running'" type="success" size="mini">{{ scope.row.status.phase }}</el-tag>
        <el-tag v-else type="danger" size="mini">{{ scope.row.status.phase }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="就绪" min-width="2%">
      <template slot-scope="scope">
        {{ scope.row.status.containerStatuses ? scope.row.status.containerStatuses.filter(c => c.ready).length : 0 }}/{{ scope.row.spec.containers ? scope.row.spec.containers.length : 0 }}
      </template>
    </el-table-column>
    <el-table-column prop="status.podIP" label="IP 地址" min-width="4%" />
    <el-table-column show-overflow-tooltip prop="spec.nodeName" label="运行节点" min-width="5%" />
    <el-table-column show-overflow-tooltip prop="spec.containerStatuses.restartCount" label="重启次数" min-width="3%">
      <template slot-scope="scope">
        {{ scope.row.status.containerStatuses ? scope.row.status.containerStatuses.reduce((sum, c) => sum + c.restartCount, 0) : 0 }}
      </template>
    </el-table-column>
    <el-table-column :formatter="dateFormat" prop="metadata.creationTimestamp" label="创建时间" min-width="5%" />
    <el-table-column label="操作" min-width="7%" align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="handleYAML(scope.row)">YAML</el-button>
        <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
        <el-dropdown style="margin-left: 10px" trigger="click">
          <el-button size="mini" type="text">更多<i class="el-icon-arrow-down el-icon--right" /></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-button class="el-button-text" size="mini" type="text" @click="handleTerminal(scope.row)">终端</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button class="el-button-text" size="mini" type="text">日志</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button class="el-button-text" size="mini" type="text">强制删除</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button class="el-button-text" size="mini" type="text">文件管理</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import moment from 'moment'

export default {
  name: 'PodTable',
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

    /* 终端 */
    handleTerminal(value) {
      this.$emit('terminal', value)
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
