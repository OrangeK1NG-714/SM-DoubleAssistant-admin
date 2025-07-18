<template>
  <el-aside width="auto">
    <el-menu :collapse="$store.state.isCollapsed" :router="true" :default-active="route.fullPath">
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

      <el-menu-item index="/activityList">
        <el-icon>
          <Avatar />
        </el-icon>
        <span>活动列表</span>
      </el-menu-item>


      <el-sub-menu index="/show-dailyNecessities">
        <template #title>
          <el-icon>
            <Menu />
          </el-icon>
          <span>生活用品展示管理</span>
        </template>
        <el-menu-item index="/show-dailyNecessities/DailyNecessitiesAdd">添加生活用品</el-menu-item>
        <el-menu-item index="/show-dailyNecessities/DailyNecessitiesList">生活用品展示</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="/news-manage">
        <template #title>
          <el-icon>
            <Menu />
          </el-icon>
          <span>新闻管理</span>
        </template>
        <el-menu-item index="/news-manage/NewsAdd">创建新闻</el-menu-item>
        <el-menu-item index="/news-manage/NewsList">新闻列表</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="/product-manage">
        <template #title>
          <el-icon>
            <Menu />
          </el-icon>
          <span>产品管理</span>
        </template>
        <el-menu-item index="/product-manage/ProductAdd">添加产品</el-menu-item>
        <el-menu-item index="/product-manage/ProductList">产品列表</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>
<script setup>
import { HomeFilled, Avatar, Menu } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
const route = useRoute();
console.log(route.fullPath);
const store = useStore();
// const vAdmin = {
//   mounted(el) {
//     console.log(el);
//     if (store.state.userInfo.role !== 1) {
//       el.parentNode.removeChild(el);
//     }
//   },
// };
</script>
<style lang="scss" scoped>
.el-aside {
  height: 100vh;
}
</style>
