# ZUST 数媒双选助手 - 后台管理系统

浙江科技大学计算机学院数字媒体技术专业的双选系统后台管理端。

线上地址：https://www.richardq.tech

由 Richard_Q 编写作为小毕设，仅用于学习和交流，不用于任何商业用途。

## 项目简介

本项目是「ZUST 数媒双选助手」的管理端，用于管理师生双选流程。管理员可通过该系统管理用户、创建双选活动、查看志愿填报情况、导出最终分配结果。系统采用前后端分离架构，配合后端服务（端口 7001）和学生/教师端小程序共同构成完整的双选平台。

## 关联项目

```
SM-DoubleAssistant/          # 学生/教师端（小程序/前端）
SM-DoubleAssistant-server/   # 后端服务（端口 7001）
SM-DoubleAssistant-admin/    # 后台管理系统（本项目）
```

## 技术栈

| 分类 | 技术 | 说明 |
|------|------|------|
| 框架 | Vue 3 (v3.2.13) | 全面使用 `<script setup>` 组合式 API |
| 构建工具 | Vite 5 | 开发代理、分包优化 |
| UI 组件库 | Element Plus (v2.9.5) | 配合 unplugin 自动导入 |
| 状态管理 | Vuex 4 | 搭配 vuex-persistedstate 持久化 |
| 路由 | Vue Router 4 | Hash 模式，动态路由注入 |
| HTTP 请求 | Axios (v1.8.1) | 全局拦截器处理认证与错误 |
| 样式 | SCSS | Apple 风格设计系统，毛玻璃效果 |
| 粒子动画 | tsparticles | 登录页背景动画 |
| Excel 处理 | SheetJS (xlsx v0.18.5) | 批量导入用户 & 导出分配表 |

## 项目结构

```
src/
├── main.js                     # 应用入口，注册全局指令 v-admin
├── App.vue                     # 根组件，全局样式与 CSS 变量
├── assets/                     # 静态资源
├── components/
│   ├── mainbox/
│   │   ├── SideMenu.vue        # 侧边栏导航菜单
│   │   └── TopHeader.vue       # 顶部栏（用户信息、下拉菜单）
│   └── upload/
│       └── Upload.vue          # 通用头像上传组件
├── composables/                # 组合式函数（Hooks）
│   ├── useDebounce.js          # 防抖异步操作（防重复提交）
│   ├── useLoading.js           # 异步操作 loading 状态管理
│   ├── usePagination.js        # 客户端分页逻辑
│   ├── useTableSelection.js    # 跨页表格多选状态保持
│   └── useDateRange.js         # 日期范围选择器绑定
├── constants/
│   └── roles.js                # 角色常量（admin/teacher/student）
├── router/
│   ├── index.js                # 路由实例、导航守卫、动态路由注入
│   └── config.js               # 路由配置（懒加载）
├── store/
│   └── index.js                # Vuex Store（用户信息、侧边栏状态）
├── util/
│   ├── axios.config.js         # Axios 拦截器（Token 注入、401 处理）
│   └── upload.js               # multipart/form-data 上传工具
└── views/
    ├── Login.vue               # 登录页（粒子动画背景）
    ├── MainBox.vue             # 主布局（侧边栏 + 顶栏 + 内容区）
    ├── home/
    │   └── Home.vue            # 仪表盘（统计卡片）
    ├── center/
    │   └── Center.vue          # 个人中心
    ├── user-manage/
    │   ├── addUser.vue         # 添加用户（单个/Excel 批量）
    │   └── userList.vue        # 用户列表（CRUD、重置密码、简历管理）
    ├── activity/
    │   ├── addActivity.vue     # 创建双选活动
    │   └── activityList.vue    # 活动列表（用户分配、参数配置）
    ├── volunteer/
    │   ├── selectVolunteerList.vue  # 志愿填报记录
    │   └── finalVolunteerList.vue   # 最终分配结果（支持 Excel 导出）
    └── notfound/
        └── NotFound.vue        # 404 页面
```

## 架构设计

### 路由与权限

采用**动态路由注入**模式：首次导航时，根据用户角色将路由配置动态添加到路由实例中。

权限控制为**双重机制**：
1. **路由层面**：带 `requireAdmin` 标记的路由仅对管理员角色注入，非管理员无法通过 URL 访问
2. **视图层面**：自定义指令 `v-admin` 在 DOM 层移除非管理员不可见的元素（如侧边栏管理菜单项）

导航守卫检查 localStorage 中的 Token，未登录用户自动重定向至登录页。

### 角色体系

| 角色 | 标识 | 管理端权限 |
|------|------|-----------|
| 管理员 | `admin` | 全部功能：用户管理、活动管理、志愿管理 |
| 教师 | `teacher` | 仅首页仪表盘、个人中心 |
| 学生 | `student` | 仅首页仪表盘、个人中心 |

### 状态管理

Vuex Store 维护三个核心状态：

| 状态 | 说明 | 持久化 |
|------|------|--------|
| `userInfo` | 当前用户信息（用户名、角色、头像等） | localStorage |
| `isCollapsed` | 侧边栏折叠状态 | localStorage |
| `isGetterRouter` | 动态路由是否已注入（页面刷新重置以触发重新注入） | 否 |

### 组合式函数（Composables）

项目封装了一组可复用的组合式函数：

- **useDebounce** - 包装异步函数，附带 loading 状态和冷却时间（默认 800ms），防止重复提交
- **useLoading** - 轻量级异步操作 loading 状态封装
- **usePagination** - 客户端分页，接收数据源 ref 和页大小，返回分页数据和控制方法
- **useTableSelection** - 跨分页的表格多选状态保持，按 `_id` 跟踪，切换页码时自动恢复选中状态
- **useDateRange** - 日期范围选择器与表单对象的双向绑定

### API 通信

- 各视图组件内直接调用 Axios，未抽取独立 API 层
- 全局请求拦截器自动附加 `Authorization: Bearer <token>`
- 全局响应拦截器处理：Token 刷新（从响应头）、401 跳转登录、错误消息提示（ElMessage）
- 开发环境通过 Vite Proxy 将 `/api` 和 `/adminapi` 转发至 `http://localhost:7001`

## 功能模块

### 登录

用户名密码认证，登录成功后将 JWT Token 存入 localStorage，用户信息存入 Vuex。登录页使用 tsparticles 粒子动画作为背景。

### 仪表盘

展示系统统计数据：用户总数（按角色细分）、活动总数、志愿填报总数、最终分配总数。包含带时间问候的欢迎卡片。

### 用户管理

- **添加用户**：支持单个创建（含角色选择、教师类型等字段）和 Excel 批量导入（解析学号/工号、姓名、角色列），默认密码 `123456`
- **用户列表**：搜索/筛选、编辑、删除、单个及批量密码重置、教师简历（图片）上传与查看

### 活动管理

- **创建活动**：配置活动时间段、三轮教师志愿选择窗口、学生志愿填报窗口
- **活动列表**：编辑/删除活动、管理活动参与用户（搜索、批量添加/移除、跨页多选）、配置教师最大可选学生数

### 志愿管理

- **志愿填报记录**：查看学生的志愿选择（第一/二/三志愿）、切换录取状态、删除记录
- **最终分配结果**：查看师生最终配对、搜索筛选、手动添加分配、导出 Excel（按教师分组合并单元格，含未分配学生）

## 构建配置

- **路径别名**：`@` -> `src/`
- **开发代理**：`/api`、`/adminapi` -> `http://localhost:7001`
- **分包策略**：`element-plus`、`tsparticles`、`xlsx` 独立分包，减小主包体积
- **生产环境**：关闭 sourcemap
- **SCSS**：使用 `modern-compiler` API

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（需要后端服务运行在 7001 端口）
npm run dev

# 构建生产版本
npm run build
```

## API 接口一览

<details>
<summary>点击展开完整接口列表</summary>

### 认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/user/login` | 用户登录 |

### 用户管理（管理员）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/getUserList` | 获取用户列表 |
| GET | `/api/admin/getUserInfo` | 搜索用户 |
| POST | `/api/admin/register` | 注册用户 |
| DELETE | `/api/admin/deleteUser` | 删除用户 |
| POST | `/api/admin/resetPassword` | 重置单个用户密码 |
| POST | `/api/admin/resetSelectedPassword` | 批量重置密码 |

### 活动管理（管理员）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/getActivityList` | 获取活动列表 |
| POST | `/api/admin/addActivity` | 创建活动 |
| PUT | `/api/admin/updateActivity` | 更新活动 |
| DELETE | `/api/admin/deleteActivity` | 删除活动 |

### 活动用户（管理员）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/getUserListInActivity` | 获取活动用户 |
| POST | `/api/admin/batchAddUserToActivity` | 批量添加用户到活动 |
| DELETE | `/api/admin/deleteUserInActivity` | 移除活动用户 |
| POST | `/api/admin/batchDeleteUserInActivity` | 批量移除活动用户 |
| PUT | `/api/admin/configMaxSelectNum` | 设置教师最大可选数 |
| PUT | `/api/admin/batchConfigMaxSelectNum` | 批量设置最大可选数 |

### 志愿管理（管理员）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/getSelectedList` | 获取志愿列表 |
| DELETE | `/api/admin/deleteSelected` | 删除志愿记录 |
| DELETE | `/api/admin/resetVolunteer` | 重置学生志愿 |
| GET | `/api/admin/getFinalList` | 获取最终分配列表 |
| POST | `/api/admin/addFinal` | 添加最终分配 |
| GET | `/api/admin/getTeacherListInActivity` | 获取活动中的教师 |
| GET | `/api/admin/getStudentListInActivity` | 获取活动中的学生 |

### 教师相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/teacher/detail` | 获取教师详情 |
| POST | `/api/teacher/uploadTeacherResume` | 上传教师简历 |
| GET | `/api/teacher/getTeacherResume` | 获取教师简历 |
| DELETE | `/api/teacher/cancelSelect` | 取消师生选择 |

### 学生相关

| 方法 | 路径 | 说明 |
|------|------|------|
| PUT | `/api/student/updateTeacher` | 切换教师选择状态 |

</details>
