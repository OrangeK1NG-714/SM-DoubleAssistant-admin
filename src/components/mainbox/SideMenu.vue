<template>
  <el-aside width="auto" class="apple-aside">
    <div class="brand" :class="{ collapsed: $store.state.isCollapsed }">
      <div class="brand-dot"></div>
      <span class="brand-text">SM Admin</span>
    </div>

    <el-menu
      class="apple-menu"
      :collapse="$store.state.isCollapsed"
      :router="true"
      :default-active="route.fullPath"
    >
      <el-menu-item index="/index">
        <el-icon>
          <HomeFilled />
        </el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="/center">
        <el-icon>
          <Avatar />
        </el-icon>
        <span>个人中心</span>
      </el-menu-item>
      <el-sub-menu index="/user-manage" v-admin>
        <template #title>
          <el-icon>
            <Menu />
          </el-icon>
          <span>用户管理</span>
        </template>
        <el-menu-item index="/user-manage/addUser">添加用户</el-menu-item>
        <el-menu-item index="/user-manage/userList">用户列表</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="/activity">
        <template #title>
          <el-icon>
            <Menu />
          </el-icon>
          <span>活动管理</span>
        </template>
        <el-menu-item index="/activity/addActivity">添加活动</el-menu-item>
        <el-menu-item index="/activity/activityList">活动列表</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="/volunteer">
        <template #title>
          <el-icon>
            <Menu />
          </el-icon>
          <span>志愿管理</span>
        </template>
        <el-menu-item index="/volunteer/selectVolunteerList">选择志愿列表</el-menu-item>
        <el-menu-item index="/volunteer/finalVolunteerList">最终志愿列表</el-menu-item>
        <el-menu-item index="/volunteer/volunteerAdd">添加志愿</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { HomeFilled, Avatar, Menu } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<style lang="scss" scoped>
.apple-aside {
  height: calc(100vh - 28px);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(244, 247, 255, 0.85) 100%);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  box-shadow: 0 20px 44px rgba(15, 23, 42, 0.1);
  padding: 16px 10px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  padding: 0 12px;
  margin-bottom: 12px;
  font-weight: 700;
  color: #162132;
}

.brand-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #6bc3ff 0%, #0071e3 70%);
  box-shadow: 0 0 14px rgba(0, 113, 227, 0.55);
}

.brand.collapsed {
  justify-content: center;
}

.brand.collapsed .brand-text {
  display: none;
}

.apple-menu {
  border-right: none;
  background: transparent;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  border-radius: 12px;
  margin-bottom: 4px;
  height: 42px;
  color: #4d5668;
}

:deep(.el-menu-item.is-active) {
  background: rgba(0, 113, 227, 0.12);
  color: #0056b3;
  font-weight: 600;
}
</style>
