import { logout, getInfo } from '@/api/user'
import { getNamespaceListAll } from '@/api/cluster/namespace'
import { getToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    namespaces: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_NAMESPACES: (state, namespaces) => {
    state.namespaces = namespaces
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // 获取用户信息
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        commit('SET_NAME', data.name)
        commit('SET_AVATAR', data.avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取名称空间
  getNamespace({ commit }) {
    return new Promise((resolve, reject) => {
      getNamespaceListAll().then(response => {
        const result = response.data.items.map(item => {
          return { 'name': item.metadata.name, 'value': item.metadata.uid }
        })
        commit('SET_NAMESPACES', result)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 注销
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

