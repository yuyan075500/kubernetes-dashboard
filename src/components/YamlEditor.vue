<template>
  <el-form ref="form">
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div class="cm-wrapper">
      <codemirror
        ref="cm"
        v-loading="loading"
        :value="value"
        :options="cmOptions"
        @changes="onCmCodeChanges"
      />
      <div class="drawer-footer">
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button type="primary" size="mini" :loading="loading" @click="handleSubmit">提 交</el-button>
      </div>
    </div>
  </el-form>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import yaml from 'js-yaml'

// CodeMirror 核心样式
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/neat.css'

// 语言模式
import 'codemirror/mode/yaml/yaml.js'

// 基础功能
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/selection/active-line.js'

// 折叠
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/indent-fold.js'

// 搜索
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'

import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/indent-fold.js'

export default {
  name: 'YamlEditor',
  components: { codemirror },
  props: {
    value: { type: String, default: '' },
    cmTheme: { type: String, default: 'neat' },
    loading: {
      type: Boolean
    }
  },
  data() {
    return {
      cmOptions: {
        mode: 'yaml',
        theme: this.cmTheme,
        lineNumbers: true,
        lineWrapping: false,
        styleActiveLine: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        foldGutter: true
      },
      editorValue: this.value,
      folded: false,
      errorMessage: ''
    }
  },
  watch: {
    editorValue(newVal) {
      this.errorMessage = ''

      if (newVal && !this.folded) {
        this.$nextTick(() => {
          const cm = this.$refs.cm.codemirror
          if (!cm) return
          this.foldField('managedFields')
          this.folded = true
        })
      }
    }
  },
  methods: {

    /* 关闭按钮 */
    cancel() {
      this.$emit('close')
    },

    /* 提交按钮 */
    handleSubmit() {
      this.errorMessage = ''

      if (!this.editorValue.trim()) {
        this.errorMessage = '内容不能为空'
        return
      }
      try {
        yaml.load(this.editorValue)
      } catch (e) {
        this.errorMessage = `格式错误: ${e.message}`
        if (e.mark && e.mark.line) {
          const cm = this.$refs.cm.codemirror
          if (cm) {
            cm.scrollIntoView({ line: e.mark.line, ch: 0 }, 200)
            cm.setCursor(e.mark.line, e.mark.column || 0)
            cm.focus()
          }
        }
        return
      }

      this.$emit('submit', this.editorValue)
    },

    /* 折叠字段 */
    foldField(fieldName) {
      const cm = this.$refs.cm.codemirror
      if (!cm) return
      const lines = cm.getValue().split('\n')
      lines.forEach((line, i) => {
        if (new RegExp(`\\b${fieldName}:`).test(line)) {
          cm.foldCode({ line: i, ch: 0 })
        }
      })
    },

    onCmCodeChanges(cm) {
      this.editorValue = cm.getValue()
    }
  }
}
</script>

<style lang="scss">
.cm-wrapper {
  height: 450px;
}

.cm-wrapper .vue-codemirror {
  height: 90%;
}

.cm-wrapper .CodeMirror{
  height: 100%;
  border: 1px solid #ddd;
}

.drawer-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  height: 40px;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin: 5px 0;
  padding: 5px;
  background-color: #fef0f0;
  border-radius: 4px;
}
</style>
