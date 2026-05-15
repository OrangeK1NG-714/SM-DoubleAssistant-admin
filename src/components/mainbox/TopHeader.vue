<template>
  <el-header class="apple-header">
    <div class="left" @click="handleCollapsed">
      <div class="toggle-btn">
        <el-icon>
          <Menu />
        </el-icon>
      </div>
      <div class="title-wrap">
        <h3>ZUST 数媒双选助手</h3>
        <p>后台管理系统</p>
      </div>
    </div>

    <div class="right">
      <span class="welcome">欢迎 {{ $store.state.userInfo.username }} 回来</span>
      <el-dropdown>
        <span class="avatar-btn">
          <el-icon :size="18">
            <User />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleCenter">个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Menu, User } from "@element-plus/icons-vue";

const store = useStore();
const router = useRouter();

const handleCollapsed = () => {
  store.commit("changeCollapsed");
};

const handleCenter = () => {
  router.push("/center");
};

const handleLogout = () => {
  localStorage.removeItem("token");
  store.commit("clearUserInfo");
  router.push("/login");
};
</script>

<style lang="scss" scoped>
.apple-header {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 22px;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(16px);
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
  padding: 0 18px;
}

.left,
.right {
  display: flex;
  align-items: center;
}

.left {
  gap: 12px;
  cursor: pointer;
}

.toggle-btn {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: rgba(0, 113, 227, 0.1);
  color: #0067d1;
}

.title-wrap h3 {
  font-size: 16px;
  line-height: 20px;
}

.title-wrap p {
  font-size: 12px;
  color: #6b7280;
}

.right {
  gap: 14px;
}

.welcome {
  color: #4b5565;
  font-size: 14px;
}

.avatar-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4ca5ff 0%, #0071e3 100%);
  color: #fff;
}
</style>
