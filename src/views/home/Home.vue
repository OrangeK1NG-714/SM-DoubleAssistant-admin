<template>
  <div class="apple-page home-page">
    <el-page-header content="首页" icon="" title="3D扫描数字化后台管理系统" />

    <el-card class="hero-card">
      <div class="hero-body">
        <el-avatar :size="84" :src="avatarUrl" />
        <div class="hero-text">
          <h3>欢迎 {{ store.state.userInfo.username }} 回来</h3>
          <p>{{ welcomeText }}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();

const avatarUrl = computed(() =>
  store.state.userInfo.avatar
    ? import.meta.env.VITE_UPLOAD_BASE + store.state.userInfo.avatar
    : `https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png`
);

const welcomeText = computed(() =>
  new Date().getHours() < 12 ? "祝你今天效率满分。" : "辛苦啦，记得喝杯咖啡。"
);
</script>

<style lang="scss" scoped>
.home-page {
  .hero-card {
    margin-top: 10px;
  }

  .hero-body {
    display: flex;
    align-items: center;
    gap: 18px;
    min-height: 130px;
  }

  .hero-text h3 {
    font-size: 26px;
    font-weight: 650;
    margin-bottom: 6px;
  }

  .hero-text p {
    color: #6a7384;
  }
}
</style>
