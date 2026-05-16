<template>
  <div class="apple-page">
    <el-card>
      <el-page-header content="用户列表" icon="" title="用户管理" />
      <div style="display: flex;">
        <div style="margin: 20px 20px 0 20px;">
          <span style="margin-right: 10px;">用户名</span>
          <el-input style="width: 240px" v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </div>
        <div style="margin: 20px 20px 0 20px;">
          <span style="margin-right: 10px;">用户角色</span>
          <el-select v-model="searchForm.role" placeholder="请选择角色" style="width: 240px" clearable>
            <el-option label="管理员" value="admin" />
            <el-option label="老师" value="teacher" />
            <el-option label="学生" value="student" />
          </el-select>
        </div>
        <div style="margin: 20px 20px 0 20px;">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button type="default" @click="handleReset">重置</el-button>
          <el-button type="warning" @click="handleResetAllPassword">一键重置所有选择的用户密码</el-button>
        </div>
      </div>

      <el-table :data="paginatedData" style="width: 100%" @select="handleSelect" @select-all="handleSelectAll"
        :row-key="row => row._id" ref="tableRef">
        <el-table-column type="selection" width="55" />

        <el-table-column prop="username" label="用户名" width="180" />

        <el-table-column label="角色">
          <template #default="scope">
            <el-tag v-if="scope.row.role === 'admin'" type="danger">管理员</el-tag>
            <el-tag v-else-if="scope.row.role === 'teacher'" type="warning">老师</el-tag>
            <el-tag v-else type="success">学生</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-popconfirm title="你确定要删除吗" confirm-button-text="确定" cancel-button-text="取消"
              @confirm="handleDelete(scope.row)">
              <template #reference>
                <el-button size="small" type="danger"> 删除 </el-button>
              </template>
            </el-popconfirm>
            <el-button size="small" @click="handleResetPassword(scope.row)">
              重置密码
            </el-button>
            <el-button v-if="scope.row.role === 'teacher'" size="small" type="primary" @click="handleUpdateIntroduction(scope.row)">
              修改老师简历
            </el-button>
            <el-button v-if="scope.row.role === 'teacher'" size="small" type="primary" @click="handleViewIntroduction(scope.row)">
              查看老师简历
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="tableData.length"
        :page-sizes="[5, 10, 20, 50]" :page-size="pageSize" :current-page="currentPage" @size-change="handleSizeChange"
        @current-change="handlePageChange" class="pagination-wrapper" />
    </el-card>

    <el-dialog v-model="dialogVisible" title="编辑用户" width="500">
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
        <el-form-item label="个人简介" prop="introduction">
          <el-input v-model="userForm.introduction" type="textarea" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="editLoading" @click="handleEditConfirm()">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 老师简历上传对话框 -->
    <el-dialog v-model="introductionDialogVisible" title="修改老师简历" width="600px">
      <div class="introduction-container">
        <el-form ref="introductionFormRef" :model="introductionForm" label-width="auto" class="demo-ruleForm">
          <el-form-item label="当前简历">
              <div v-if="introductionForm.resumePath" class="current-resume">
                <img :src="introductionForm.resumePath" alt="老师简历" style="max-width: 100%; max-height: 300px; object-fit: contain;">
                <div class="file-name">{{ introductionForm.resumeName }}</div>
              </div>
              <div v-else class="no-resume">暂无简历图片</div>
            </el-form-item>
          <el-form-item label="上传新简历">
            <el-upload
              class="upload-demo"
              drag
              :action="''"
              :auto-upload="false"
              :on-change="handleFileChange"
              :before-upload="beforeUpload"
              accept=".jpg,.jpeg,.png,.gif"
              :show-file-list="true"
              :file-list="fileList"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">点击或拖拽文件到此处上传</div>
              <template #tip>
                <div class="el-upload__tip">
                  请上传 JPG、JPEG、PNG、GIF 格式的图片文件，大小不超过 5MB
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="introductionDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="resumeUploadLoading" @click="doResumeUpload()">确认修改</el-button>
        </div>
      </template>
    </el-dialog>

      <!-- 查看老师简历对话框 -->
  <el-dialog
    v-model="viewIntroductionDialogVisible"
    title="查看老师简历"
    width="80%"
    @close="handleViewIntroductionDialogClose"
  >
    <div class="resume-view-container">
      <div v-if="viewIntroductionForm.resumePath" class="resume-image">
        <img :src="viewIntroductionForm.resumePath" alt="老师简历" style="max-width: 100%; max-height: 70vh; object-fit: contain;">
      </div>
      <div v-else class="no-resume">
        暂无简历数据
      </div>
    </div>
  </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import axios from "axios";
import { usePagination } from '@/composables/usePagination';
import { useTableSelection } from '@/composables/useTableSelection';
import { useDebounce } from '@/composables/useDebounce';
import { ROLE_OPTIONS } from '@/constants/roles';

const tableRef = ref();
const tableData = ref([]);

const { currentPage, pageSize, paginatedData, handlePageChange, handleSizeChange } = usePagination(tableData);
const { selectedItems: selectedUsers, handleSelect, handleSelectAll, clearSelection } = useTableSelection(tableRef, paginatedData, currentPage, pageSize);

const searchForm = reactive({
  username: "",
  role: ""
});

const dialogVisible = ref(false);
const userFormRef = ref();
const userForm = reactive({
  username: "",
  password: "",
  role: "student",
  introduction: "",
});

const introductionDialogVisible = ref(false);
const introductionFormRef = ref();
const introductionForm = reactive({
  teacherId: "",
  resumeName: "",
  resumePath: "",
  uploadedFile: null
});
const fileList = ref([]);
const userFormRules = reactive({
  username: [{ required: true, message: "请输入名字", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  role: [{ required: true, message: "请选择权限", trigger: "blur" }],
  introduction: [{ required: true, message: "请输入介绍", trigger: "blur" }],
});
const options = ROLE_OPTIONS;

onMounted(async () => {
  await getTableData();
});

const getTableData = async () => {
  const res = await axios.get("/api/admin/getUserList");
  tableData.value = res.data.data;
  return res.data.data;
};

const handleEdit = (data) => {
  Object.assign(userForm, {
    _id: data._id,
    username: data.username,
    password: "",
    role: data.role,
    introduction: data.introduction || "",
  });
  dialogVisible.value = true;
};

const { run: handleEditConfirm, loading: editLoading } = useDebounce(async () => {
  await userFormRef.value.validate();
  ElMessage.warning("编辑功能暂未开放");
  dialogVisible.value = false;
});

const handleDelete = async (data) => {
  ElMessage.warning("删除功能暂未开放");
};

const handleResetPassword = async (data) => {
  ElMessageBox.confirm('确认重置密码吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await axios.post(`/api/admin/resetPassword`, {
      username: data.username,
      password: "123456",
    });
    if (res.data.code === 200) {
      selectedUsers.value = [];
      ElMessage.success('密码一键重置成功');
    }
    selectedUsers.value = [];
    getTableData();
  }).catch(() => {
  });
};

const handleSearch = async () => {
  const res = await axios.get("/api/admin/getUserInfo", {
    params: searchForm,
  });
  tableData.value = res.data.data;
  selectedUsers.value = []; // 搜索时清空已选
};

const handleReset = () => {
  searchForm.username = "";
  searchForm.role = "";
  selectedUsers.value = []; // 重置时清空已选
  getTableData();
};

const handleResetAllPassword = async () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning('请先选择要重置密码的用户');
    return;
  }

  ElMessageBox.confirm(`确认重置${selectedUsers.value.length}个用户的密码吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const selectedUserName = selectedUsers.value.map(user => user.username);
    const res = await axios.post(`/api/admin/resetSelectedPassword`, {
      selectedUsers: selectedUserName,
      password: "123456",
    });
    if (res.data.code === 200) {
      ElMessage.success(`${selectedUserName.length}个用户密码重置成功`);
      selectedUsers.value = [];
      searchForm.username = "";
      searchForm.role = "";
    }
    getTableData();
  }).catch(() => {
  });
};

const handleUpdateIntroduction = async (data) => {
  // 打开专门的简历上传弹窗
  introductionDialogVisible.value = true;
  
  // 加载老师简历和用户ID
  introductionForm.teacherId = data.username;
  // 重置上传相关字段
  introductionForm.resumeName = "";
  introductionForm.resumePath = "";
  introductionForm.uploadedFile = null;
  fileList.value = [];
};

const handleFileChange = (uploadFile, uploadFiles) => {
  // 清除之前的文件列表，只保留当前文件
  fileList.value = [];
  
  // 创建blob URL用于预览
  const blobUrl = URL.createObjectURL(uploadFile.raw);
  fileList.value.push({
    name: uploadFile.name,
    url: blobUrl
  });
  
  // 保存上传文件信息
  introductionForm.uploadedFile = uploadFile;
  introductionForm.resumeName = uploadFile.name;
  introductionForm.resumePath = blobUrl; // 使用blob URL进行预览
  
  ElMessage.success('文件已选择，可以点击确认修改上传');
};

const beforeUpload = (file) => {
  const isImage = /\.(jpg|jpeg|png|gif)$/.test(file.name.toLowerCase());
  const isLt5M = file.size / 1024 / 1024 < 5;
  
  if (!isImage) {
    ElMessage.error('请上传图片格式的文件');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('文件大小不能超过5MB');
    return false;
  }
  
  return true;
};

const { run: doResumeUpload, loading: resumeUploadLoading } = useDebounce(async () => {
  if (!introductionForm.uploadedFile) {
    ElMessage.warning('请先上传简历图片');
    return;
  }
  const formData = new FormData();
  formData.append('file', introductionForm.uploadedFile.raw);
  formData.append('teacherId', introductionForm.teacherId);
  formData.append('resumeName', introductionForm.resumeName);
  const res = await axios.post('/api/teacher/uploadTeacherResume', formData);
  if (res.data?.code === 200) {
    ElMessage.success('老师简历上传成功');
    introductionDialogVisible.value = false;
    getTableData();
  } else {
    ElMessage.error('上传失败：' + (res.data?.message || '服务器错误'));
  }
});

const viewIntroductionDialogVisible = ref(false);
const viewIntroductionForm = reactive({
  resumePath: '',
  resumeName: ''
});

const handleViewIntroduction = async (data) => {
  try {
    // 获取老师简历信息
    const res = await axios.get("/api/teacher/getTeacherResume", {
      params: {
        teacherId: data.username
      },
      responseType: 'blob' // 设置响应类型为blob
    });
    
    // 检查响应是否为blob数据
    if (res.data && res.data instanceof Blob) {
      // 创建blob URL用于显示图片
      const blobUrl = URL.createObjectURL(res.data);
      
      // 设置表单数据
      viewIntroductionForm.resumePath = blobUrl;
      viewIntroductionForm.resumeName = data.username + '_resume';
      
      // 显示对话框
      viewIntroductionDialogVisible.value = true;
    } else {
      ElMessage.error('获取简历失败：返回数据格式错误');
    }
  } catch (error) {
    ElMessage.error('获取简历失败，请重试');
  }
};

const handleViewIntroductionDialogClose = () => {
  // 释放blob URL以避免内存泄漏
  if (viewIntroductionForm.resumePath && viewIntroductionForm.resumePath.startsWith('blob:')) {
    URL.revokeObjectURL(viewIntroductionForm.resumePath);
    viewIntroductionForm.resumePath = '';
  }
};
</script>

<style lang="scss" scoped>
.introduction-container {
  padding: 20px 0;
}

.current-resume {
  margin: 10px 0 20px 0;
  padding: 10px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 12px;
  text-align: center;
}

.no-resume {
  margin: 10px 0 20px 0;
  padding: 20px;
  text-align: center;
  color: #909399;
  border: 1px dashed rgba(15, 23, 42, 0.18);
  border-radius: 12px;
}

.upload-demo {
  margin-top: 10px;
}

.pagination-wrapper {
  margin-top: 16px;
  justify-content: flex-end;
}

:deep(.el-table) {
  margin-top: 18px;
}

:deep(.el-upload-dragger) {
  border-radius: 14px;
}
</style>