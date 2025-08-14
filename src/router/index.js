import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/node',
    name: 'Cluster',
    meta: { title: '集群', icon: 'menu-cluster' },
    children: [
      {
        path: 'node',
        name: 'Node',
        component: () => import('@/views/cluster/node/index'),
        meta: { title: 'Nodes', icon: 'sub-menu-node' }
      },
      {
        path: 'namespace',
        name: 'Namespace',
        component: () => import('@/views/cluster/namespace/index'),
        meta: { title: 'Namespaces', icon: 'sub-menu-namespace' }
      }
    ]
  },

  {
    path: '/controller',
    component: Layout,
    redirect: '/controller/node',
    name: 'Controller',
    meta: { title: '工作负载', icon: 'menu-controller' },
    children: [
      {
        path: 'pod',
        name: 'Pod',
        component: () => import('@/views/controller/pod/index'),
        meta: { title: 'Pods', icon: 'sub-menu-pod' }
      },
      {
        path: 'deployment',
        name: 'Deployment',
        component: () => import('@/views/controller/deployment/index'),
        meta: { title: 'Deployments', icon: 'sub-menu-deployment' }
      },
      {
        path: 'daemonset',
        name: 'Daemonset',
        component: () => import('@/views/controller/daemonset/index'),
        meta: { title: 'Daemonsets', icon: 'sub-menu-daemonset' }
      },
      {
        path: 'statefulset',
        name: 'Statefulset',
        component: () => import('@/views/controller/statefulset/index'),
        meta: { title: 'Statefulsets', icon: 'sub-menu-statefulset' }
      },
      {
        path: 'job',
        name: 'Job',
        component: () => import('@/views/controller/job/index'),
        meta: { title: 'Jobs', icon: 'sub-menu-job' }
      },
      {
        path: 'cronjob',
        name: 'Cronjob',
        component: () => import('@/views/controller/cronjob/index'),
        meta: { title: 'Cronjobs', icon: 'sub-menu-cronjob' }
      }
    ]
  },

  {
    path: '/network',
    component: Layout,
    redirect: '/network/service',
    name: 'Network',
    meta: { title: '服务发现', icon: 'menu-network' },
    children: [
      {
        path: 'service',
        name: 'Service',
        component: () => import('@/views/network/service/index'),
        meta: { title: 'Services', icon: 'sub-menu-service' }
      },
      {
        path: 'endpoint',
        name: 'Endpoint',
        component: () => import('@/views/network/endpoint/index'),
        meta: { title: 'Endpoints', icon: 'sub-menu-endpoint' }
      },
      {
        path: 'ingress',
        name: 'Ingress',
        component: () => import('@/views/network/ingress/index'),
        meta: { title: 'Ingresses', icon: 'sub-menu-ingress' }
      }
    ]
  },

  {
    path: '/config',
    component: Layout,
    redirect: '/config/configmap',
    name: 'Config',
    meta: { title: '配置', icon: 'menu-config' },
    children: [
      {
        path: 'configmap',
        name: 'Configmap',
        component: () => import('@/views/config/configmap/index'),
        meta: { title: 'Config Maps', icon: 'sub-menu-configmap' }
      },
      {
        path: 'secret',
        name: 'Secret',
        component: () => import('@/views/config/secret/index'),
        meta: { title: 'Secrets', icon: 'sub-menu-secret' }
      }
    ]
  },

  {
    path: '/storage',
    component: Layout,
    redirect: '/storage/node',
    name: 'Storage',
    meta: { title: '存储', icon: 'menu-storage' },
    children: [
      {
        path: 'pv',
        name: 'PV',
        component: () => import('@/views/storage/pv/index'),
        meta: { title: 'PVs', icon: 'sub-menu-pv' }
      },
      {
        path: 'pvc',
        name: 'PVC',
        component: () => import('@/views/storage/pvc/index'),
        meta: { title: 'PVCs', icon: 'sub-menu-pvc' }
      },
      {
        path: 'sc',
        name: 'SC',
        component: () => import('@/views/storage/sc/index'),
        meta: { title: 'SCs', icon: 'sub-menu-sc' }
      }
    ]
  }
]

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  base: '/kubernetes/cluster/',
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
