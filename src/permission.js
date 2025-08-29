import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 获取Token
  const hasToken = getToken()

  // 确认用户是否登录
  if (hasToken) {
    const hasGetUserInfo = store.getters.name

    if (hasGetUserInfo) {
      next()
    } else {
      try {
        // 获取用户信息
        await store.dispatch('user/getInfo')

        // 获取名称空间
        await store.dispatch('user/getNamespace', localStorage.getItem(to.query.cluster))

        next()
      } catch (error) {
        // 移除token并回到登录dmdm
        await store.dispatch('user/resetToken')
        Message.error(error || 'Has Error')
        window.location.href = `/login?redirect=/kubernetes/cluster${to.fullPath}`
      }
    }
  } else {
    window.location.href = `/login?redirect=/kubernetes/cluster${to.fullPath}`
  }
  NProgress.done()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
