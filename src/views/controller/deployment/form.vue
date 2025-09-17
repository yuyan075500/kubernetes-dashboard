<template>
  <el-form ref="form" :model="form" label-position="right" label-width="100px" style="width: 95%" size="small">
    <el-form-item label="副本数：">
      <el-input-number v-model="form.spec.replicas" :min="0" />
    </el-form-item>
    <el-form-item>
      <div>
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button type="primary" size="mini" :loading="loading" @click="handleSubmit">确 定</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'ReplicasForm',
  props: {
    form: {
      type: Object,
      default() {}
    },
    loading: {
      type: Boolean
    }
  },
  methods: {

    /* 提交表单 */
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        this.$emit('submit', this.form)
      })
    },

    /* 关闭表单 */
    cancel() {
      this.$emit('close')
    }
  }
}
</script>
