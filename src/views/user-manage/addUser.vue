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
      <el-card>
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

//切换添加模式
const addMode = ref('single');



// 添加xlsx引入
import * as XLSX from 'xlsx';
import axios from "axios";

// 修改beforeUpload方法
const beforeUpload = async (file) => {
  try {
    const users = await parseExcel(file);
    userBatchForm.users = users;
    ElMessage({
      message: `${file.name}上传成功`,
      type: 'success',
    })
    // const res = await axios.post('/adminapi/user/batch', {
    //   users,
    // });
    // ElMessage.success(`成功创建${users.length}个用户`);
    // router.push('/user-manage/userList');
    return false; // 阻止默认上传
  } catch (error) {
    ElMessage.error('文件解析失败');
    return false;
  }
};

// 完善Excel解析方法
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
        password: '123456', // 假设密码字段
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
  role: '', //admin是管理员，teacher是老师，student是学生
  name: '',
});
const userBatchForm = reactive({
  users: [],
});

const userFormRules = reactive({
  username: [{ required: true, message: "请输入名字", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  role: [{ required: true, message: "请选择角色", trigger: "blur" }],
});

const options = [
  {
    label: "管理员",
    value: 'admin',
  },
  {
    label: "老师",
    value: 'teacher',
  },
  {
    label: "学生",
    value: 'student',
  },
];
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

:deep(.el-upload-dragger) {
  border-radius: 16px;
  border-color: rgba(0, 113, 227, 0.25);
  background: rgba(255, 255, 255, 0.75);
}
</style>
