<template>
  <div class="dashboard-container">
    <div class="dashboard-text">UUID: {{ uuid }}</div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      // 集群 UUID
      uuid: localStorage.getItem(this.$route.query.cluster)
    }
  },
  created() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
