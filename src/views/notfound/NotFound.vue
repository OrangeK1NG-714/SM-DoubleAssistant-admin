<template>
  <div class="apple-page not-found-page">
    <el-empty description="404 走丢了">
      <el-button type="primary" @click="$router.push('/index')">返回首页</el-button>
    </el-empty>
  </div>
</template>

<style lang="scss" scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
</style>
