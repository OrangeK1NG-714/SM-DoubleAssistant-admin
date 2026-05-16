<template>
  <div class="login-page">
    <vue-particles id="tsparticles" :particlesLoaded="particlesLoaded" :options="options" />

    <div class="login-panel">
      <div class="panel-header">
        <p class="badge">Management Console</p>
        <h2>数媒双选助手后台</h2>
        <span>欢迎回来，请使用账号登录</span>
      </div>

      <el-form
        :model="loginForm"
        status-icon
        :rules="loginRules"
        ref="loginFormRef"
        label-position="top"
        class="login-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit-btn" :loading="loginLoading" @click="doLogin()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import axios from "axios";
import { useStore } from "vuex";
import { useDebounce } from "@/composables/useDebounce";

const store = useStore();

const loginForm = reactive({
  username: "",
  password: "",
});

const loginFormRef = ref();

const loginRules = reactive({
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
  ],
});

const router = useRouter();
const particlesLoaded = () => {};

const { run: doLogin, loading: loginLoading } = useDebounce(async () => {
  await loginFormRef.value.validate();
  const res = await axios.post("/api/user/login", loginForm);
  if (res.data.code === 200) {
    localStorage.setItem("token", res.data.data.accessToken);
    store.commit("changeUserInfo", res.data.data);
    store.commit("changeGetterRouter", false);
    router.push("/index");
  } else {
    ElMessage.error(res.data.message || "用户名和密码不匹配");
  }
});

const options = {
  background: {
    color: {
      value: "#f2f6ff",
    },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "grab",
      },
    },
    modes: {
      push: {
        quantity: 2,
      },
      grab: {
        distance: 160,
      },
    },
  },
  particles: {
    color: {
      value: "#8aa4c8",
    },
    links: {
      color: "#bfd2ef",
      distance: 140,
      enable: true,
      opacity: 0.55,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: "bounce",
      random: false,
      speed: 1.6,
      straight: false,
    },
    number: {
      density: {
        enable: true,
      },
      value: 55,
    },
    opacity: {
      value: 0.75,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  detectRetina: true,
};
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: grid;
  place-items: center;
}

#tsparticles {
  position: absolute;
  inset: 0;
}

.login-panel {
  width: 460px;
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(22px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 24px 48px rgba(24, 39, 74, 0.14);
  padding: 30px 30px 22px;
}

.panel-header {
  margin-bottom: 18px;

  .badge {
    width: fit-content;
    border-radius: 999px;
    background: rgba(0, 113, 227, 0.1);
    color: #006fdf;
    font-size: 12px;
    padding: 4px 10px;
    margin-bottom: 8px;
  }

  h2 {
    font-size: 26px;
    line-height: 1.2;
    color: #141a24;
    margin-bottom: 4px;
  }

  span {
    color: #6d7483;
    font-size: 13px;
  }
}

.login-form {
  margin-top: 10px;
}

.submit-btn {
  width: 100%;
  height: 44px;
}
</style>
