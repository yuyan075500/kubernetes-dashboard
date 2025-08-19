<template>
  <el-form ref="form" :model="form" :rules="rules" :validate-on-rule-change="false" label-position="right" label-width="120px" style="width: 95%" size="small">
    <el-form-item label="名称：" prop="name">
      <el-input v-model="form.name" autocomplete="off" clearable />
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
  name: 'NamespaceAddForm',
  props: {
    form: {
      type: Object,
      default() {
        return {
          name: ''
        }
      }
    },
    loading: {
      type: Boolean
    }
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入名称空间名称', trigger: 'change' }
        ]
      }
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
