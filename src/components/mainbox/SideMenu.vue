<template>
  <el-aside width="auto">
    <el-menu
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
      <el-sub-menu index="/user-manage">
        <template #title>
          <el-icon>
            <Menu />
          </el-icon>
          <span>用户管理</span>
        </template>
        <el-menu-item index="/user-manage/addUser">添加用户</el-menu-item>
        <el-menu-item index="/user-manage/userList">用户列表</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>
<script setup>
import { HomeFilled, Avatar, Menu } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
const route = useRoute();
console.log(route.fullPath);
</script>
<style lang="scss" scoped>
.el-aside {
  height: 100vh;
}
</style>
