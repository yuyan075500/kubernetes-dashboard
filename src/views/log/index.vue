<template>
  <div style="padding: 4px;">
    <div class="toolbar">
      <el-form ref="form" :model="form" label-position="right" label-width="100px" size="small">
        <el-row>
          <el-col :span="5">
            <el-form-item label="容器：">
              <el-select v-model="form.container" @change="handleChange">
                <el-option v-for="item in form.containers" :key="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="行数：">
              <el-select v-model="form.line" @change="handleChange">
                <el-option v-for="item in form.lines" :key="item.name" :label="item.label" :value="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="实时日志：">
              <el-switch v-model="form.follow" active-color="#13ce66" inactive-color="#ff4949" @change="handleChange" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="Pod：">
              <span style="font-size: 18px;">{{ form.pod }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <web-log
      v-if="isShow"
      :container="form.container"
      :line="form.line"
      :follow="form.follow"
    />
  </div>
</template>

<script>
import WebLog from '../../components/WebLog'

export default {
  name: 'TerminalPage',
  components: {
    WebLog
  },
  data() {
    return {
      isShow: true,
      form: {
        lines: [
          { name: 20, label: '20行' },
          { name: 50, label: '50行' },
          { name: 100, label: '100行' },
          { name: 200, label: '200行' },
          { name: 300, label: '300行' },
          { name: 500, label: '500行' }
        ],
        line: 20,
        follow: true,
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
