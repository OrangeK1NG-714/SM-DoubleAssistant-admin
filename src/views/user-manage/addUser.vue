<template>
  <div class="apple-page">
    <el-page-header content="添加用户" icon="" title="用户管理" />

    <el-radio-group v-model="addMode" style="margin-bottom: 20px">
      <el-radio-button label="single">单个添加</el-radio-button>
      <el-radio-button label="batch">批量添加</el-radio-button>
    </el-radio-group>


    <!-- 添加单一用户 -->
    <template v-if="addMode === 'single'">
      <el-form ref="userFormRef" style="max-width: 600px" :model="userForm" :rules="userFormRules" label-width="auto"
        class="demo-ruleForm" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" type="password" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="Select" style="width: 100%">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <template v-if="userForm.role === 'teacher'">
          <el-form-item label="教师名字" prop="name">
            <el-input v-model="userForm.name" />
          </el-form-item>
           <el-form-item label="教师类型" prop="teacherType">
          <el-select v-model="userForm.teacherType" placeholder="Select" style="width: 100%">
            <el-option v-for="item in teacherTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        </template>


        <el-form-item>
          <el-button type="primary" :loading="submitOneLoading" @click="doSubmitOne()">添加用户</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 添加多个用户 -->
    <template v-else>
      <div class="batch-guide">
        <el-card class="guide-card">
          <el-alert type="info" :closable="false" show-icon title="Excel格式要求">
            <template #default>
              <p>请上传 .xlsx 或 .xls 文件，表头需包含以下列：</p>
              <ul style="margin: 8px 0; padding-left: 20px;">
                <li><strong>学号/工号</strong> — 用户登录账号</li>
                <li><strong>姓名</strong> — 用户真实姓名</li>
                <li><strong>角色</strong> — 填写 "管理员"、"教师" 或 "学生"</li>
              </ul>
              <p>默认密码为 123456，用户可在登录后修改。</p>
            </template>
          </el-alert>
        </el-card>
        <el-card class="example-card">
          <template #header>
            <span class="example-title">示例表格</span>
          </template>
          <el-table :data="exampleData" border size="small" class="example-table">
            <el-table-column prop="id" label="学号/工号" align="center" />
            <el-table-column prop="name" label="姓名" align="center" />
            <el-table-column prop="role" label="角色" align="center" />
          </el-table>
        </el-card>
      </div>
      <el-form ref="userFormRef" style="max-width: 600px" :model="userBatchForm" label-width="auto"
        class="demo-ruleForm" status-icon>
        <el-upload class="upload-demo" drag :before-upload="beforeUpload" accept=".xlsx, .xls" :show-file-list="false"
          :limit="1" action="/">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            拖文件到这里 或 <em>点击上传</em>
            <h3>(只允许上传一个文件，再次上传将覆盖)</h3>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              只支持.xlsx/.xls文件
            </div>
          </template>
        </el-upload>
        <el-form-item>
          <el-button type="primary" :loading="submitBatchLoading" @click="doSubmitBatch()">添加用户</el-button>
        </el-form-item>
      </el-form>
    </template>

  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import { UploadFilled } from '@element-plus/icons-vue'
import { useRouter } from "vue-router";
import { ElMessage } from 'element-plus';
import { useDebounce } from "@/composables/useDebounce";
import { ROLE_OPTIONS } from "@/constants/roles";

const addMode = ref('single');

const exampleData = [
  { id: '2024001', name: '张三', role: '学生' },
  { id: '2024002', name: '李四', role: '学生' },
  { id: 'T1001', name: '王老师', role: '教师' },
  { id: 'A0001', name: '赵管理', role: '管理员' },
];

import * as XLSX from 'xlsx';
import axios from "axios";

const beforeUpload = async (file) => {
  try {
    const users = await parseExcel(file);
    userBatchForm.users = users;
    ElMessage.success(`${file.name}上传成功`);
    return false;
  } catch (error) {
    ElMessage.error('文件解析失败');
    return false;
  }
};

const parseExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      const users = jsonData.map(row => ({
        username: row['学号/工号'],
        password: '123456',
        role: row['角色'] === '管理员' ? 'admin' :
          row['角色'] === '教师' ? 'teacher' : 'student',
        name: row['姓名'],
      }));

      resolve(users);
    };
    reader.onerror = error => reject(error);
    reader.readAsArrayBuffer(file);
  });
};



const userFormRef = ref();
const userForm = reactive({
  username: "",
  password: "",
  role: '',
  name: '',
  teacherType: '',
});
const userBatchForm = reactive({
  users: [],
});

const userFormRules = reactive({
  username: [{ required: true, message: "请输入名字", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  role: [{ required: true, message: "请选择角色", trigger: "blur" }],
});

const options = ROLE_OPTIONS;
const teacherTypeOptions =[
  {
    label: "专业导师",
    value: '0',
  },
  {
    label: "公共导师",
    value: '1',
  },
  {
    label: "校友导师",
    value: '2',
  },
]
const router = useRouter()

const { run: doSubmitOne, loading: submitOneLoading } = useDebounce(async () => {
  await userFormRef.value.validate();
  await axios.post("/api/admin/register", userForm);
  ElMessage.success("用户添加成功");
  router.push("/user-manage/userList");
});

const { run: doSubmitBatch, loading: submitBatchLoading } = useDebounce(async () => {
  if (userBatchForm.users.length === 0) {
    ElMessage.warning("请先上传Excel文件");
    return;
  }
  const results = await Promise.all(
    userBatchForm.users.map(user => axios.post("/api/admin/register", user).catch(() => null))
  );
  const successCount = results.filter(r => r?.data?.code === 200).length;
  const failCount = userBatchForm.users.length - successCount;
  ElMessage.success(`成功创建${successCount}个用户${failCount > 0 ? `，失败${failCount}个` : ''}`);
});
</script>
<style lang="scss" scoped>
.demo-ruleForm {
  margin-top: 18px;
  max-width: 680px !important;
}

:deep(.el-radio-group) {
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 999px;
  padding: 5px;
}

:deep(.el-radio-button__inner) {
  border: none !important;
  border-radius: 999px !important;
}

.batch-guide {
  display: flex;
  gap: 16px;
  margin-bottom: 4px;
}

.guide-card {
  flex: 1;
  min-width: 0;
}

.example-card {
  flex: 0 0 340px;
}

.example-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--apple-text-secondary);
}

.example-table {
  border-radius: 10px;
  overflow: hidden;
}

:deep(.el-upload-dragger) {
  border-radius: 16px;
  border-color: rgba(0, 113, 227, 0.25);
  background: rgba(255, 255, 255, 0.75);
}
</style>
