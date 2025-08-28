<template>
  <el-table :data="tableData" tooltip-effect="dark" style="width: 100%; margin-top:10px;" size="mini" border>
    <el-table-column type="selection" width="40" />
    <el-table-column show-overflow-tooltip prop="metadata.name" label="名称" min-width="9%" />
    <el-table-column label="状态" min-width="3%">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.status && scope.row.status.phase" :type="statusTagType(scope.row.status.phase)" size="mini" disable-transitions>
          {{ scope.row.status.phase }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="Mode" min-width="4%">
      <template slot-scope="scope">
        {{ scope.row.spec && scope.row.spec.accessModes ? scope.row.spec.accessModes.join(', ') : '-' }}
      </template>
    </el-table-column>
    <el-table-column label="卷类型" min-width="3%">
      <template slot-scope="scope">
        {{ scope.row.spec && scope.row.spec.volumeMode ? scope.row.spec.volumeMode : '-' }}
      </template>
    </el-table-column>
    <el-table-column prop="spec.persistentVolumeReclaimPolicy" label="回收策略" min-width="3%" />
    <el-table-column label="容量 Gi" min-width="3%">
      <template slot-scope="scope">
        {{ scope.row.spec && scope.row.spec.capacity ? scope.row.spec.capacity.storage : '-' }}
      </template>
    </el-table-column>
    <el-table-column :formatter="dateFormat" prop="metadata.creationTimestamp" label="创建时间" min-width="5%" />
    <el-table-column label="操作" min-width="5%" align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="handleYAML(scope.row)">YAML</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import moment from 'moment'

export default {
  name: 'PersistentVolumeTable',
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

    /* 状态颜色映射 */
    statusTagType(status) {
      switch (status) {
        case 'Bound': return 'success'
        case 'Available': return 'info'
        case 'Released': return 'warning'
        case 'Failed': return 'danger'
        default: return ''
      }
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
