<template>
  <el-table :data="tableData" tooltip-effect="dark" style="width: 100%; margin-top:10px;" size="mini" border>
    <el-table-column type="selection" width="40" />
    <el-table-column show-overflow-tooltip prop="metadata.name" label="名称" min-width="4%" />
    <el-table-column prop="metadata.namespace" label="名称空间" min-width="3%" />
    <el-table-column label="规则" min-width="7%">
      <template slot-scope="scope">
        <div v-if="scope.row.spec && scope.row.spec.rules">
          <div
            v-for="(rule, rIndex) in scope.row.spec.rules"
            :key="rIndex"
            style="margin-bottom: 4px;"
          >
            <div v-for="(path, pIndex) in rule.http.paths" :key="pIndex">
              {{ getProtocol(rule.host) }}://{{ rule.host }}{{ path.path }} <span style="margin: 0 5px; font-weight: bold;">→</span> {{ path.backend.service.name }}
            </div>
          </div>
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
  name: 'IngressTable',
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

    /* 获取协议 */
    getProtocol(host) {
      const row = this.tableData.find(r => r.spec?.rules?.some(rule => rule.host === host))
      if (!row) return 'http'
      return row.spec.tls && row.spec.tls.length ? 'https' : 'http'
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
