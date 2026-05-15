<template>
  <div class="apple-page home-page">
    <el-page-header content="首页" icon="" title="数媒双选助手后台管理系统" />

    <el-row :gutter="16" class="stats-row" v-loading="statsLoading">
      <el-col :span="6" v-for="item in statCards" :key="item.label">
        <el-card class="stat-card">
          <div class="stat-number" :style="{ color: item.color }">{{ item.value }}</div>
          <div class="stat-label">{{ item.label }}</div>
          <div v-if="item.sub" class="stat-sub">{{ item.sub }}</div>
        </el-card>
      </el-col>
    </el-row>

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
import { computed, ref, onMounted } from "vue";
import axios from "axios";
import { useLoading } from "@/composables/useLoading";

const store = useStore();

const avatarUrl = computed(() =>
  store.state.userInfo.avatar
    ? import.meta.env.VITE_UPLOAD_BASE + store.state.userInfo.avatar
    : `https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png`
);

const welcomeText = computed(() =>
  new Date().getHours() < 12 ? "祝你今天效率满分。" : "辛苦啦，记得喝杯咖啡。"
);

const stats = ref({ users: 0, admins: 0, teachers: 0, students: 0, activities: 0, selections: 0, finals: 0 });

const { run: loadStats, loading: statsLoading } = useLoading(async () => {
  const [usersRes, activitiesRes, selectionsRes, finalsRes] = await Promise.all([
    axios.get("/api/admin/getUserList"),
    axios.get("/api/admin/getActivityList"),
    axios.get("/api/admin/getSelectedList"),
    axios.get("/api/admin/getFinalList"),
  ]);
  const users = usersRes.data;
  stats.value = {
    users: users.length,
    admins: users.filter(u => u.role === "admin").length,
    teachers: users.filter(u => u.role === "teacher").length,
    students: users.filter(u => u.role === "student").length,
    activities: activitiesRes.data.length,
    selections: selectionsRes.data.length,
    finals: finalsRes.data.length,
  };
});

onMounted(() => loadStats());

const statCards = computed(() => [
  {
    label: "用户总数",
    value: stats.value.users,
    color: "var(--apple-accent)",
    sub: `管理员 ${stats.value.admins} · 老师 ${stats.value.teachers} · 学生 ${stats.value.students}`,
  },
  { label: "活动总数", value: stats.value.activities, color: "#34c759" },
  { label: "志愿选择数", value: stats.value.selections, color: "#ff9500" },
  { label: "最终分配数", value: stats.value.finals, color: "#af52de" },
]);
</script>

<style lang="scss" scoped>
.home-page {
  .stats-row {
    margin-bottom: 16px;
  }

  .stat-card {
    text-align: center;
    padding: 8px 0;
  }

  .stat-number {
    font-size: 36px;
    font-weight: 700;
    line-height: 1.2;
  }

  .stat-label {
    font-size: 14px;
    color: var(--apple-text-secondary);
    margin-top: 4px;
  }

  .stat-sub {
    font-size: 12px;
    color: #9ca3af;
    margin-top: 6px;
  }

  .hero-card {
    margin-top: 0;
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
