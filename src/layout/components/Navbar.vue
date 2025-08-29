<template>
  <div class="navbar">
    <!-- 左边：汉堡按钮 + 面包屑 -->
    <div class="left">
      <hamburger
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      <breadcrumb class="breadcrumb-container" />
    </div>

    <!-- 中间：只居中命名空间选择框 -->
    <div v-if="isShow" class="center">
      <el-select
        v-model="selectedNamespace"
        filterable
        size="small"
        placeholder="名称空间选择"
        class="namespace-select"
      >
        <el-option
          v-for="item in namespaceListComputed"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <!-- 右边：用户信息 -->
    <div class="right">
      <el-dropdown trigger="click" placement="bottom">
        <div class="right-item">
          <img v-if="avatar !== ''" :src="avatar" class="right-item-img">
          <img v-else src="../../assets/avatar/default.jpg" class="right-item-img">
          <div class="user-name">{{ name }}</div>
          <i class="el-icon-caret-bottom" />
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item @click.native="logout">
              <span style="display:block;">注销</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </div>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      selectedNamespace: localStorage.getItem('namespace') || ''
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'name', 'namespaces']),
    isShow() {
      const hiddenRoutes = ['/terminal', '/dashboard', '/dashboard/infra/node', '/dashboard/infra/namespace', '/dashboard/storage/sc', '/dashboard/storage/pv']
      return !hiddenRoutes.includes(this.$route.path)
    },
    namespaceListComputed() {
      const base = [{ label: 'All Namespace', value: '' }]
      const extra = this.namespaces.map(ns => ({
        label: ns.name,
        value: ns.name
      }))
      return base.concat(extra)
    }
  },
  watch: {
    selectedNamespace(val) {
      localStorage.setItem('namespace', val)
      location.reload()
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 20px 0 0px;
}

/* 左边：汉堡按钮 + 面包屑 */
.left {
  display: flex;
  align-items: center;
}
.hamburger-container {
  cursor: pointer;
  line-height: 50px;
  transition: background 0.3s;
  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}
.breadcrumb-container {
  margin-left: 10px;
}

/* 中间居中：只放 namespace 下拉框 */
// .center {
//   flex: 1;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }
.center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  height: 50px;
  display: flex;
  align-items: center;
}
.namespace-select {
  min-width: 200px;
}

/* 右边：用户信息 */
.right {
  display: flex;
  align-items: center;
  height: 50px;
}
.right-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }

  .right-item-img {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .user-name {
    margin: 0 5px;
  }
}
</style>
