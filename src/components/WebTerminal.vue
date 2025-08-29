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
  mounted() {
    // 发起 WS 请求
    const { cluster, PodName, Namespace, ContainerName } = this.$route.query
    const kubernetesUUID = localStorage.getItem(cluster)
    this.ws = new WebSocket(
      `wss://d-ops.50yc.cn/api/v1/kubernetes/pod/terminal?uuid=${kubernetesUUID}&podName=${PodName}&namespace=${Namespace}&containerName=${ContainerName}`
    )

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
      fontSize: this.fontSize
    })
    this.fitAddon = new FitAddon()
    this.terminal.loadAddon(this.fitAddon)
    this.terminal.open(webTerminal)

    try {
      this.fitAddon.fit()
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
  top: 0; right: 0; bottom: 0; left: 0;
}
</style>
