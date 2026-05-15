<template>
  <el-container class="main-shell">
    <SideMenu />
    <el-container direction="vertical" class="main-content-shell">
      <TopHeader />
      <el-main>
        <div class="page-wrapper">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import TopHeader from "@/components/mainbox/TopHeader.vue";
import SideMenu from "@/components/mainbox/SideMenu.vue";
</script>

<style lang="scss" scoped>
.main-shell {
  min-height: 100vh;
  padding: 14px;
  gap: 14px;
}

.main-content-shell {
  border-radius: 26px;
  overflow: hidden;
}

.el-main {
  overflow: auto;
  height: calc(100vh - 88px);
  padding: 16px 18px 20px;
}

.page-wrapper {
  min-height: 100%;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
}
</style>
