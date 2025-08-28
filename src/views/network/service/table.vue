<template>
  <el-table :data="tableData" tooltip-effect="dark" style="width: 100%; margin-top:10px;" size="mini" border>
    <el-table-column type="selection" width="40" />
    <el-table-column show-overflow-tooltip prop="metadata.name" label="名称" min-width="7%" />
    <el-table-column show-overflow-tooltip prop="metadata.namespace" label="名称空间" min-width="5%" />
    <el-table-column prop="spec.type" label="类型" min-width="4%" />
    <el-table-column label="External IP" min-width="4%">
      <template slot-scope="scope">
        <div>
          <template v-if="scope.row.status && scope.row.status.loadBalancer && scope.row.status.loadBalancer.ingress && scope.row.status.loadBalancer.ingress.length">
            <div v-for="(item, index) in scope.row.status.loadBalancer.ingress" :key="index">
              {{ item.ip }}
            </div>
          </template>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="spec.clusterIP" label="Cluster IP" min-width="4%" />
    <el-table-column label="端口映射" min-width="5%">
      <template slot-scope="scope">
        <span v-for="(p, index) in getPorts(scope.row)" :key="index">
          {{ p }}<div v-if="index < scope.row.spec.ports.length - 1" />
        </span>
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
  name: 'ServiceTable',
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

    /* 获取端口 */
    getPorts(row) {
      if (!row.spec || !row.spec.ports) return []
      const isNodePort = row.spec.type === 'NodePort'
      return row.spec.ports.map(p => {
        const externalPort = isNodePort && p.nodePort ? p.nodePort : p.port
        return `${externalPort}:${p.targetPort}/${p.protocol}`
      })
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
