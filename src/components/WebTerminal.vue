<template>
  <div id="terminal" />
</template>

<script>
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { AttachAddon } from 'xterm-addon-attach'
import 'xterm/css/xterm.css'

export default {
  name: 'WebTerminal',
  props: {
    shell: {
      type: String,
      default: 'sh'
    },
    container: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      ws: null,
      terminal: null,
      fitAddon: null,
      fontSize: 16,
      heartCheck: {
        timeout: 5000,
        timer: null,
        start: () => {},
        stop: () => {}
      }
    }
  },
  computed: {
    // 计算最终要使用的容器名称
    targetContainer() {
      return this.container !== null ? this.container : this.$route.query.ContainerName
    }
  },
  mounted() {
    // 发起 WS 请求
    const { cluster, PodName, Namespace } = this.$route.query
    const kubernetesUUID = localStorage.getItem(cluster)
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const host = window.location.hostname
    const port = window.location.port
    const wsUrl = `${protocol}://${host}${port ? `:${port}` : ''}/api/v1/kubernetes/pod/terminal?uuid=${kubernetesUUID}&podName=${PodName}&namespace=${Namespace}&containerName=${this.targetContainer}&shell=${this.shell}`
    this.ws = new WebSocket(wsUrl)

    this.ws.onopen = () => {
      console.log(Date(), 'onopen')
      this.heartCheck.start()
    }
    this.ws.onclose = () => {
      console.log(Date(), 'onclose')
      this.heartCheck.stop()
    }
    this.ws.onerror = () => {
      console.log(Date(), 'onerror')
    }

    // 心跳检查
    this.heartCheck.start = () => {
      this.heartCheck.timer = setInterval(() => {
        if (this.ws && this.ws.readyState === 1) {
          this.ws.send('ping')
        }
      }, this.heartCheck.timeout)
    }
    this.heartCheck.stop = () => {
      clearInterval(this.heartCheck.timer)
    }

    // 初始化 terminal
    const webTerminal = document.getElementById('terminal')
    this.terminal = new Terminal({
      fontSize: this.fontSize,
      cursorBlink: true
    })
    this.fitAddon = new FitAddon()
    this.terminal.loadAddon(this.fitAddon)
    this.terminal.open(webTerminal)

    try {
      this.fitAddon.fit()
      if (this.ws && this.ws.readyState === 1) {
        this.ws.send(`resize:${this.terminal.rows}:${this.terminal.cols}`)
      } else {
        this.ws.onopen = () => {
          this.ws.send(`resize:${this.terminal.rows}:${this.terminal.cols}`)
        }
      }
    } catch (e) {
      console.error(e)
    }

    // 加载 attach 插件
    this.terminal.loadAddon(new AttachAddon(this.ws))

    // 滚轮事件，调整字体大小
    webTerminal.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        e.preventDefault()
        if (e.deltaY < 0) {
          this.terminal.options.fontSize = ++this.fontSize
        } else {
          this.terminal.options.fontSize = --this.fontSize
        }
        try { this.fitAddon.fit() } catch (e) { /* ignore */ }
        if (this.ws && this.ws.readyState === 1) {
          this.ws.send(`resize:${this.terminal.rows}:${this.terminal.cols}`)
        }
      }
    })

    // 窗口大小调整
    window.addEventListener('resize', () => {
      webTerminal.style.height = document.documentElement.clientHeight + 'px'
      try { this.fitAddon.fit() } catch (e) { /* ignore */ }
      if (this.ws && this.ws.readyState === 1) {
        this.ws.send(`resize:${this.terminal.rows}:${this.terminal.cols}`)
      }
    })
  },
  beforeDestroy() {
    if (this.ws) {
      this.ws.close()
    }
    if (this.terminal) {
      this.terminal.dispose()
    }
  }
}
</script>

<style>
#terminal {
  position: absolute;
  top: 40px; right: 0; bottom: 0; left: 0;
}
</style>
