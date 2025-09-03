<template>
  <div style="padding: 4px;">
    <div class="toolbar">
      <el-form ref="form" :model="form" label-position="right" label-width="100px" size="small">
        <el-row>
          <el-col :span="4">
            <el-form-item label="命令行：">
              <el-radio-group v-model="form.shell" size="small" @change="handleChange">
                <el-radio-button label="sh" />
                <el-radio-button label="bash" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="容器：">
              <el-select v-model="form.container" style="width: 300px;" @change="handleChange">
                <el-option v-for="item in form.containers" :key="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Pod：">
              <span style="font-size: 18px;">{{ form.pod }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <web-terminal
      v-if="isShow"
      :shell="form.shell"
      :container="form.container"
    />
  </div>
</template>

<script>
import WebTerminal from '../../components/WebTerminal.vue'

export default {
  name: 'TerminalPage',
  components: {
    WebTerminal
  },
  data() {
    return {
      isShow: true,
      form: {
        shell: 'sh',
        container: this.$route.query.ContainerName,
        containers: null,
        pod: null
      }
    }
  },
  mounted() {
    const { PodName, Namespace } = this.$route.query
    this.form.containers = JSON.parse(this.$route.query.Containers)
    this.form.pod = Namespace + '/' + PodName
  },
  methods: {
    handleChange() {
      // 重新加载终端
      this.isShow = false
      this.$nextTick(() => {
        this.isShow = true
      })
    }
  }
}
</script>

<style>
.toolbar {
  width: 100%;
}
</style>
