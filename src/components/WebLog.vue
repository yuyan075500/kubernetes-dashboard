<template>
  <div class="log-container">
    <!-- 日志显示区域 -->
    <div
      ref="logContent"
      class="log-content"
      @scroll="handleScroll"
    />

    <!-- 自动滚动提示 -->
    <div
      v-if="!autoScroll && hasNewLogs"
      class="scroll-hint"
      @click="scrollToBottom"
    >
      有新日志，点击滚动到底部
    </div>
  </div>
</template>

<script>
export default {
  name: 'WebLog',
  props: {
    // 容器名称（必填）
    container: {
      type: String,
      required: true
    },
    // 显示的日志行数
    line: {
      type: Number,
      default: 200
    },
    // 是否实时追踪日志
    follow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // SSE连接对象
      eventSource: null,
      // 日志缓冲区
      logBuffer: [],
      // 自动滚动到最新日志
      autoScroll: true,
      // 存储不完整的日志行
      partialLine: '',
      // 标记是否有新日志未查看
      hasNewLogs: false
    }
  },
  computed: {
    // 构建日志请求URL
    logUrl() {
      const { cluster, PodName, Namespace } = this.$route.query
      const kubernetesUUID = localStorage.getItem(cluster)
      return `/api/v1/kubernetes/pod/log?` +
        `uuid=${kubernetesUUID}&` +
        `podName=${PodName}&` +
        `namespace=${Namespace}&` +
        `containerName=${this.container}&` +
        `line=${this.line}&` +
        `follow=${this.follow}`
    }
  },
  watch: {
    // 当参数变化时重新加载日志
    logUrl() {
      this.stopLogStream()
      this.startLogStream()
    }
  },
  mounted() {
    this.startLogStream()

    // 监听窗口大小变化，调整日志区域高度
    window.addEventListener('resize', this.adjustLogHeight)
    this.adjustLogHeight()
  },
  beforeDestroy() {
    this.stopLogStream()
    window.removeEventListener('resize', this.adjustLogHeight)
  },
  methods: {
    // 开始日志流
    startLogStream() {
      // 重置状态
      this.clearLogs()
      this.partialLine = ''
      this.hasNewLogs = false

      // 关闭可能存在的旧连接
      this.stopLogStream()

      // 创建新的EventSource连接
      this.eventSource = new EventSource(this.logUrl)

      // 处理收到的消息
      this.eventSource.addEventListener('message', (event) => {
        this.processLogData(event.data)
      })

      // 处理错误和重连
      this.eventSource.onerror = () => {
        if (this.eventSource.readyState === EventSource.CLOSED) {
          // 3秒后尝试重连
          setTimeout(() => {
            this.startLogStream()
          }, 3000)
        }
      }
    },

    // 停止日志流
    stopLogStream() {
      if (this.eventSource) {
        this.eventSource.close()
        this.eventSource = null
      }
    },

    // 处理日志数据，正确处理换行
    processLogData(logData) {
      // 合并上一次可能的不完整行
      const fullData = this.partialLine + logData
      this.partialLine = ''

      // 分割所有换行符（处理不同系统的换行符）
      const lines = fullData.split(/\r?\n/)

      // 如果最后一行不是空字符串，说明是不完整的行，需要保存
      if (lines.length > 0 && lines[lines.length - 1] !== '') {
        this.partialLine = lines.pop()
      }

      // 添加完整的行到日志
      lines.forEach(line => {
        this.addLog(line)
      })
    },

    // 添加日志到显示区域
    addLog(logData) {
      // 保存到日志缓冲区
      this.logBuffer.push(logData)

      // 限制缓冲区大小，防止内存溢出
      if (this.logBuffer.length > 10000) {
        this.logBuffer = this.logBuffer.slice(-5000)
      }

      // 添加到DOM
      const logElement = document.createElement('div')
      logElement.className = 'log-line'
      logElement.textContent = logData
      this.$refs.logContent.appendChild(logElement)

      // 如果用户滚动离开了底部，标记有新日志
      if (!this.autoScroll) {
        this.hasNewLogs = true
      } else if (this.autoScroll) {
        this.scrollToBottom()
      }
    },

    // 清空日志
    clearLogs() {
      this.$refs.logContent.innerHTML = ''
      this.logBuffer = []
    },

    // 滚动到最底部
    scrollToBottom() {
      const logContent = this.$refs.logContent
      logContent.scrollTop = logContent.scrollHeight
      this.hasNewLogs = false
    },

    // 调整日志区域高度以适应窗口
    adjustLogHeight() {
      // 日志区域占满父容器的可用空间
      this.$refs.logContent.style.height = '100%'
    },

    // 处理滚动事件，判断是否需要关闭自动滚动
    handleScroll() {
      const logContent = this.$refs.logContent
      // 当用户滚动离开底部时，关闭自动滚动
      const isAtBottom = logContent.scrollTop + logContent.clientHeight >= logContent.scrollHeight - 10

      if (!isAtBottom && this.autoScroll) {
        this.autoScroll = false
      } else if (isAtBottom && !this.autoScroll) {
        this.autoScroll = true
        this.hasNewLogs = false
      }
    }
  }
}
</script>

<style scoped>
.log-container {
  position: absolute;
  top: 40px; right: 0; bottom: 0; left: 0;
  overflow: hidden;
}

.log-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #1e1e1e; /* 深色背景，适合日志查看 */
  color: #d4d4d4; /* 浅灰色文本，提高可读性 */
  padding: 10px;
  font-family: monospace; /* 等宽字体，适合日志 */
  font-size: 12px;
  line-height: 1.5;
  box-sizing: border-box;
}

.log-line {
  white-space: pre-wrap; /* 保留空白和换行 */
  word-break: break-all; /* 长单词自动换行 */
  margin: 0;
  padding: 0;
  min-height: 1.5em; /* 确保空行也有高度 */
}

/* 交替行背景色，提高可读性 */
.log-line:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.03);
}

/* 新日志提示 */
.scroll-hint {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: #42b983;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: opacity 0.3s;
  z-index: 10;
}

.scroll-hint:hover {
  opacity: 0.9;
}
</style>
