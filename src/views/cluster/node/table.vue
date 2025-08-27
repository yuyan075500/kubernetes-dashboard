<template>
  <el-table :data="tableData" tooltip-effect="dark" style="width: 100%; margin-top:10px;" size="mini" border>
    <el-table-column type="selection" width="40" />
    <el-table-column show-overflow-tooltip prop="metadata.name" label="名称" min-width="5%" />
    <el-table-column label="IP 地址" min-width="3%">
      <template slot-scope="scope">
        {{ (scope.row.status.addresses.find(a => a.type === 'InternalIP') || {}).address || '-' }}
      </template>
    </el-table-column>
    <el-table-column label="状态" min-width="3%">
      <template slot-scope="scope">
        <el-tag v-if="(scope.row.status.conditions.find(c => c.type === 'Ready') || {}).status === 'True'" type="success" size="mini">Ready</el-tag>
        <el-tag v-else type="danger" size="mini">NotReady</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="角色" min-width="6%">
      <template slot-scope="scope">
        <el-tag v-for="role in getRoles(scope.row)" :key="role" size="mini" style="margin-right: 5px;">{{ role }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="Pods" min-width="2%">
      <template slot-scope="scope">
        {{ scope.row.podsRunning || 0 }} / {{ scope.row.podsCapacity || scope.row.status.allocatable.pods }}
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip label="运行时和操作系统" min-width="5%">
      <template slot-scope="scope">
        <div>{{ scope.row.status.nodeInfo.containerRuntimeVersion }}</div>
        <div>{{ scope.row.status.nodeInfo.osImage }}</div>
      </template>
    </el-table-column>
    <el-table-column label="CPU 用量" min-width="3%" />
    <el-table-column label="内存用量" min-width="3%" />
    <el-table-column label="操作" min-width="5%" align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="handleYAML(scope.row)">YAML</el-button>
        <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'NodeTable',
  props: {
    tableData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  methods: {

    /* 获取节点角色 */
    getRoles(node) {
      if (!node.metadata || !node.metadata.labels) return []
      const labels = node.metadata.labels
      return Object.keys(labels)
        .filter(key => key.startsWith('node-role.kubernetes.io/'))
        .map(key => key.replace('node-role.kubernetes.io/', '') || 'master')
    },

    /* 编辑按钮 */
    handleEdit(value) {
      this.$emit('edit', value)
    },

    /* YAML按钮 */
    handleYAML(value) {
      this.$emit('yaml', value)
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
