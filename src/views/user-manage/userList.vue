<template>
  <div>
    <el-card>
      <el-page-header content="用户列表" icon="" title="用户管理" />

      <el-table :data="paginatedData" style="width: 100%" @selection-change="handleSelectionChange"
        :row-key="row => row.id">
        <el-table-column type="selection" width="55" :reserve-selection="true" />

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
          <el-button type="primary" @click="handleEditConfirm()">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import axios from "axios";

const currentPage = ref(1);
const pageSize = ref(10);
// 分页相关函数
const handlePageChange = (val) => {
  currentPage.value = val;
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1; // 重置到第一页
};

// 计算当前页显示的数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});



const dialogVisible = ref(false);
const userFormRef = ref();
let userForm = reactive({
  username: "",
  password: "",
  role: 2, //1是管理员，2是编辑
  introduction: "",
});
const userFormRules = reactive({
  username: [{ required: true, message: "请输入名字", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  role: [{ required: true, message: "请选择权限", trigger: "blur" }],
  introduction: [{ required: true, message: "请输入介绍", trigger: "blur" }],
});
const options = [
  {
    label: "管理员",
    value: 1,
  },
  {
    label: "编辑",
    value: 2,
  },
];

const tableData = ref([]);

onMounted(async () => {
  await getTableData();
});
const getTableData = async () => {
  const res = await axios.get("/api/admin/getUserList");
  console.log(res.data);
  tableData.value = res.data;
};

// 新增选中数据响应式变量
const selectedUsers = ref([]);

// 新增选中事件处理
const handleSelectionChange = (val) => {
  selectedUsers.value = val;
  console.log(selectedUsers.value);

};



//编辑回调
const handleEdit = async (data) => {
  // console.log(data);
  const res = await axios.get(`/adminapi/user/list/${data._id}`);
  //防止直接复制破坏响应性//但现在直接赋值好像可以？！
  Object.assign(userForm, res.data.data[0]);
  console.log(userForm);

  dialogVisible.value = true;
};
//编辑确认回调
const handleEditConfirm = () => {
  userFormRef.value.validate(async (valid) => {
    if (valid) {
      //更新后端
      await axios.put(`/adminapi/user/list/${userForm._id}`, userForm);
      //dialog隐藏
      dialogVisible.value = false;
      //获取table数据
      getTableData();
    }
  });
};
const handleDelete = async (data) => {
  console.log(data);
  await axios.delete(`/adminapi/user/list/${data._id}`);

  getTableData();
};
</script>
<style lang="scss" scoped>
.el-table {
  margin-top: 50px;
}
</style>
