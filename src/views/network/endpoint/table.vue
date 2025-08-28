<template>
  <el-table :data="tableData" tooltip-effect="dark" style="width: 100%; margin-top:10px;" size="mini" border>
    <el-table-column type="selection" width="40" />
    <el-table-column show-overflow-tooltip prop="metadata.name" label="名称" min-width="4%" />
    <el-table-column prop="metadata.namespace" label="名称空间" min-width="3%" />
    <el-table-column label="Endpoints" min-width="7%">
      <template slot-scope="scope">
        <div>
          <el-tag
            v-for="(addr, index) in getPodIPs(scope.row)"
            :key="index"
            style="margin-right: 5px; margin-bottom: 5px;"
            type="info"
            size="mini"
          >
            {{ addr }}
          </el-tag>
        </div>
      </template>
    </el-table-column>
    <el-table-column :formatter="dateFormat" prop="metadata.creationTimestamp" label="创建时间" min-width="3%" />
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
  name: 'EndpointTable',
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

    /* 获取Endpoints的Pod IP列表 */
    getPodIPs(row) {
      if (!row.subsets) return []
      return row.subsets.flatMap(subset => (subset.addresses || []).map(addr => addr.ip)
      )
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
