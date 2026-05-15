<template>
  <div class="apple-page">
    <el-card>
      <el-page-header content="" icon="" title="活动列表" />

      <el-table :data="paginatedData" v-loading="tableLoading" style="width: 100%">
        <el-table-column prop="name" label="活动名称" width="auto" />
        <el-table-column prop="startDate" label="活动开始时间" width="auto" />
        <el-table-column prop="endDate" label="活动结束时间" width="auto" />

        <el-table-column label="操作" width="600px">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-popconfirm
              title="你确定要删除吗"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="handleDelete(scope.row)"
            >
              <template #reference>
                <el-button size="small" type="danger"> 删除 </el-button>
              </template>
            </el-popconfirm>
            <el-button
              size="small"
              type="primary"
              @click="handleViewActivityUsers(scope.row)"
              >查看活动用户</el-button
            >
            <el-button
              size="small"
              type="warning"
              @click="handleAddUserToActivity(scope.row)"
            >
              添加用户至活动
            </el-button>
            <el-button
              size="small"
              type="success"
              @click="handleViewActivityDetails(scope.row._id)"
            >
              查看活动详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        class="pagination-wrapper"
      />
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog title="编辑活动" v-model="dialogVisible" width="50%">
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="auto"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="活动描述" prop="description">
          <el-input v-model="editForm.description" />
        </el-form-item>
        <el-form-item label="活动开始-结束时间">
          <el-date-picker
            v-model="activityDate.dateRange.value"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DDTHH:mm:ss"
            @change="activityDate.handleDateChange"
          />
        </el-form-item>
        <el-form-item label="教师选择第一志愿开始-结束时间">
          <el-date-picker
            v-model="firstChooseDate.dateRange.value"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DDTHH:mm:ss"
            @change="firstChooseDate.handleDateChange"
          />
        </el-form-item>
        <el-form-item label="教师选择第二志愿开始-结束时间">
          <el-date-picker
            v-model="secondChooseDate.dateRange.value"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DDTHH:mm:ss"
            @change="secondChooseDate.handleDateChange"
          />
        </el-form-item>
        <el-form-item label="教师选择第三志愿开始-结束时间">
          <el-date-picker
            v-model="thirdChooseDate.dateRange.value"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DDTHH:mm:ss"
            @change="thirdChooseDate.handleDateChange"
          />
        </el-form-item>
        <el-form-item label="学生填报志愿开始-结束时间">
          <el-date-picker
            v-model="stdChooseDate.dateRange.value"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DDTHH:mm:ss"
            @change="stdChooseDate.handleDateChange"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="saveEditLoading" @click="saveEdit">确认修改</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 添加用户至活动弹窗 -->
    <el-dialog title="添加用户至活动" v-model="dialogVisible2" width="70%">
      <div style="display: flex">
        <div style="margin: 20px 20px -20px 20px">
          <span style="margin-right: 10px">用户名</span>
          <el-input
            style="width: 240px"
            v-model="searchFormInDialog.username"
            placeholder="请输入用户名"
            clearable
          />
        </div>
        <div style="margin: 20px 20px -20px 20px">
          <span style="margin-right: 10px">用户角色</span>
          <el-select
            v-model="searchFormInDialog.role"
            placeholder="请选择角色"
            style="width: 240px"
            clearable
          >
            <el-option label="管理员" value="admin" />
            <el-option label="老师" value="teacher" />
            <el-option label="学生" value="student" />
          </el-select>
        </div>
        <div style="margin: 20px 20px -20px 20px">
          <el-button type="primary" @click="handleSearchInDialog"
            >搜索</el-button
          >
          <el-button type="default" @click="resetSearchInDialog"
            >重置</el-button
          >
        </div>
      </div>
      <el-table
        :data="paginatedUserData"
        @select="handleSelect"
        @select-all="handleSelectAll"
        :row-key="(row) => row._id"
        ref="tableRef"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="role" label="角色">
          <template #default="scope">
            <el-tag v-if="scope.row.role === 'admin'" type="danger"
              >管理员</el-tag
            >
            <el-tag v-else-if="scope.row.role === 'teacher'" type="warning"
              >老师</el-tag
            >
            <el-tag v-else type="success">学生</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="userList.length"
        :page-sizes="[5, 10, 20]"
        :page-size="pageSize2"
        :current-page="currentPage2"
        @size-change="handleSizeChange2"
        @current-change="handlePageChange2"
        class="pagination-wrapper"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取消</el-button>
          <el-button type="primary" :loading="saveAddUserLoading" @click="saveAddUser">确认添加</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看活动用户弹窗 -->
    <el-dialog title="查看活动用户" v-model="dialogVisible3" width="70%">
      <div style="display: flex">
        <div style="margin: 20px 20px -20px 20px">
          <span style="margin-right: 10px">用户名</span>
          <el-input
            style="width: 240px"
            v-model="searchFormInViewDialog.username"
            placeholder="请输入用户名"
            clearable
          />
        </div>
        <div style="margin: 20px 20px -20px 20px">
          <span style="margin-right: 10px">用户角色</span>
          <el-select
            v-model="searchFormInViewDialog.role"
            placeholder="请选择角色"
            style="width: 240px"
            clearable
          >
            <el-option label="管理员" value="admin" />
            <el-option label="老师" value="teacher" />
            <el-option label="学生" value="student" />
          </el-select>
        </div>
        <div style="margin: 20px 20px -20px 20px">
          <el-button type="primary" @click="handleSearchInViewDialog"
            >搜索</el-button
          >
          <el-button type="default" @click="resetSearchInViewDialog"
            >重置</el-button
          >
        </div>
      </div>
      <el-table
        :data="paginatedViewUserData"
        :row-key="(row) => row._id"
        ref="viewTableRef"
      >
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="role" label="角色">
          <template #default="scope">
            <el-tag v-if="scope.row.role === 'admin'" type="danger"
              >管理员</el-tag
            >
            <el-tag v-else-if="scope.row.role === 'teacher'" type="warning"
              >老师</el-tag
            >
            <el-tag v-else type="success">学生</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="maxSelectNum" label="最大选择人数" />
        <el-table-column label="操作" width="auto">
          <template #default="scope">
            <el-popconfirm
              title="你确定要删除吗"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="handleDeleteViewUser(scope.row)"
            >
              <template #reference>
                <el-button size="small" type="danger"> 删除用户 </el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm
              title="你确定要重置吗"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="handleResetVolunteer(scope.row)"
              v-if="scope.row.role !== 'teacher'"
            >
              <template #reference>
                <el-button size="small" type="danger"> 重置志愿 </el-button>
              </template>
            </el-popconfirm>
            <!-- 增加一个form，需要输入老师的最大选择人数 -->
            <el-button
              type="primary"
              @click="handleSetMaxSelect(scope.row)"
              v-if="scope.row.role === 'teacher'"
              >设置最大选择人数</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="viewUserList.length"
        :page-sizes="[5, 10, 20]"
        :page-size="pageSize3"
        :current-page="currentPage3"
        @size-change="handleSizeChange3"
        @current-change="handlePageChange3"
        class="pagination-wrapper"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible3 = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="设置最大选择人数" v-model="dialogVisible4" width="30vw">
      <el-form
        :model="currentEditingRow"
        :inline="true"
        :label-width="100"
        class="demo-form-inline"
      >
        <el-form-item label="最大选择人数">
          <el-input
            v-model="currentEditingRow.maxSelectNum"
            placeholder="请输入最大选择人数"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="updateMaxSelectLoading" @click="handleUpdateMaxSelectNum"
            >更新</el-button
          >
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible4 = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { usePagination } from "@/composables/usePagination";
import { useTableSelection } from "@/composables/useTableSelection";
import { useDateRange } from "@/composables/useDateRange";
import { useDebounce } from "@/composables/useDebounce";
import { useLoading } from "@/composables/useLoading";

const router = useRouter();

const tableRef = ref(); // 添加表格引用
const viewTableRef = ref(); // 查看活动用户表格引用

const tableData = ref([]);
const userList = ref([]);
const viewUserList = ref([]);
const currentActivityId = ref("");

// Pagination composables
const { currentPage, pageSize, paginatedData, handlePageChange, handleSizeChange } = usePagination(tableData);
const { currentPage: currentPage2, pageSize: pageSize2, paginatedData: paginatedUserData, handlePageChange: handlePageChange2, handleSizeChange: handleSizeChange2 } = usePagination(userList);
const { currentPage: currentPage3, pageSize: pageSize3, paginatedData: paginatedViewUserData, handlePageChange: handlePageChange3, handleSizeChange: handleSizeChange3 } = usePagination(viewUserList);

const userForm = ref([]);

// Table selection composable (for user dialog table)
const { selectedItems: selectedUsers, handleSelect, handleSelectAll, clearSelection } = useTableSelection(tableRef, paginatedUserData, currentPage2, pageSize2);

const dialogVisible4 = ref(false);
const currentEditingRow = ref(null);

// 处理设置最大选择人数
const handleSetMaxSelect = (row) => {
  currentEditingRow.value = { ...row }; // 创建副本避免直接修改原数据
  dialogVisible4.value = true;
};

const { run: handleUpdateMaxSelectNum, loading: updateMaxSelectLoading } = useDebounce(async () => {
  await axios.put("/api/admin/configMaxSelectNum", {
    activityId: currentEditingRow.value.activityId,
    teacherId: currentEditingRow.value.teacherId,
    maxSelectNum: currentEditingRow.value.maxSelectNum,
  });
  ElMessage.success("更新成功");
  dialogVisible4.value = false;

  const res = await axios.get("/api/admin/getUserListInActivity", {
    params: { activityId: currentEditingRow.value.activityId },
  });
  res.data.forEach((item) => {
    item.username = item.teacherId || item.studentId;
    item.role = item.teacherId ? "teacher" : item.studentId ? "student" : "admin";
  });
  viewUserList.value = res.data;
});

onMounted(() => loadTableData());

const { run: loadTableData, loading: tableLoading } = useLoading(async () => {
  const res = await axios.get("/api/admin/getActivityList");
  res.data.forEach((item) => {
    item.startDate = formatISODateToLocal(item.startDate);
    item.endDate = formatISODateToLocal(item.endDate);
    item.firstChooseEndDate = formatISODateToLocal(item.firstChooseEndDate);
    item.secondChooseEndDate = formatISODateToLocal(item.secondChooseEndDate);
    item.thirdChooseEndDate = formatISODateToLocal(item.thirdChooseEndDate);
    item.firstChooseStartDate = formatISODateToLocal(item.firstChooseStartDate);
    item.secondChooseStartDate = formatISODateToLocal(item.secondChooseStartDate);
    item.thirdChooseStartDate = formatISODateToLocal(item.thirdChooseStartDate);
    item.stdChooseEndDate = formatISODateToLocal(item.stdChooseEndDate);
    item.stdChooseStartDate = formatISODateToLocal(item.stdChooseStartDate);
  });
  tableData.value = res.data;
});

//将ISO日期字符串转换为本地日期字符串
function formatISODateToLocal(isoString) {
  // 1. 创建Date对象
  const date = new Date(isoString);

  // 2. 获取各个时间部分
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // 3. 拼接成目标格式
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const editFormRules = reactive({
  name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入活动描述", trigger: "blur" }],
});

const dialogVisible = ref(false); //编辑活动弹窗
const dialogVisible2 = ref(false); //添加用户至活动弹窗
const dialogVisible3 = ref(false); //查看活动用户弹窗

const editFormRef = ref();

const editForm = reactive({
  _id: "",
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  firstChooseStartDate: "",
  firstChooseEndDate: "",
  secondChooseStartDate: "",
  secondChooseEndDate: "",
  thirdChooseStartDate: "",
  thirdChooseEndDate: "",
  stdChooseStartDate: "",
  stdChooseEndDate: "",
});

// Date range composables
const activityDate = useDateRange(editForm, "startDate", "endDate");
const firstChooseDate = useDateRange(editForm, "firstChooseStartDate", "firstChooseEndDate");
const secondChooseDate = useDateRange(editForm, "secondChooseStartDate", "secondChooseEndDate");
const thirdChooseDate = useDateRange(editForm, "thirdChooseStartDate", "thirdChooseEndDate");
const stdChooseDate = useDateRange(editForm, "stdChooseStartDate", "stdChooseEndDate");

//编辑活动
const handleEdit = (row) => {
  Object.assign(editForm, row);
  activityDate.dateRange.value = [row.startDate, row.endDate];
  firstChooseDate.dateRange.value = [row.firstChooseStartDate, row.firstChooseEndDate];
  secondChooseDate.dateRange.value = [row.secondChooseStartDate, row.secondChooseEndDate];
  thirdChooseDate.dateRange.value = [row.thirdChooseStartDate, row.thirdChooseEndDate];
  stdChooseDate.dateRange.value = [row.stdChooseStartDate, row.stdChooseEndDate];

  dialogVisible.value = true;
};

const { run: saveEdit, loading: saveEditLoading } = useDebounce(async () => {
  await editFormRef.value.validate();
  const res = await axios.put("/api/admin/updateActivity", editForm);
  if (res.data.code === 200) {
    ElMessage.success("修改成功");
    loadTableData();
    dialogVisible.value = false;
  } else {
    ElMessage.error("修改失败");
  }
});
//删除活动
const handleDelete = async (row) => {
  const res = await axios.delete("/api/admin/deleteActivity", {
    data: {
      id: row._id,
    },
  });
  if (res.data.code === 200) {
    ElMessage.success("删除成功");
    loadTableData();
  } else {
    ElMessage.error("删除失败");
  }
};

//查看活动用户
const handleViewActivityUsers = async (row) => {
  currentActivityId.value = row._id;
  dialogVisible3.value = true;
  try {
    const res = await axios.get("/api/admin/getUserListInActivity", {
      params: {
        activityId: row._id,
      },
    });
    res.data.forEach((item) => {
      item.username = item.teacherId || item.studentId;
      item.role = item.teacherId
        ? "teacher"
        : item.studentId
        ? "student"
        : "admin";
    });

    viewUserList.value = res.data;
  } catch (error) {
    ElMessage.error("获取活动用户失败");
  }
};

//添加用户至活动
const handleAddUserToActivity = async (row) => {
  currentActivityId.value = row._id;
  dialogVisible2.value = true;
  try {
    const res = await axios.get("/api/admin/getUserList");
    const res2 = await axios.get("/api/admin/getUserListInActivity", {
      params: {
        activityId: row._id,
      },
    });
    // 正确的过滤逻辑
    const filteredData = res.data.filter((item) => {
      // 检查item是否存在于res2.data中
      return !res2.data.some((item2) => {
        return (
          item.username === item2.studentId || item.username === item2.teacherId
        );
      });
    });
    userList.value = filteredData;
  } catch (error) {}
};
//查看活动详情
const handleViewActivityDetails = (activityId) => {
  // 跳转到最终志愿列表页面，并携带活动id
  router.push({
    path: "/volunteer/finalVolunteerList",
    query: {
      activityId: activityId,
    },
  });
};

const { run: saveAddUser, loading: saveAddUserLoading } = useDebounce(async () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning("请先选择要添加的用户");
    return;
  }
  const count = selectedUsers.value.length;
  await Promise.all(
    selectedUsers.value.map((item) =>
      axios.post("/api/admin/addTeacherToActivity", {
        activityId: currentActivityId.value,
        teacherId: item.role === "teacher" ? item.username : null,
        studentId: item.role === "student" ? item.username : null,
      })
    ),
  );
  ElMessage.success(`添加成功${count}个用户`);
  dialogVisible2.value = false;
});

//dialog中搜索用户
const searchFormInDialog = reactive({
  username: "",
  role: "",
});
//dialog中搜索用户
const handleSearchInDialog = async () => {
  const res = await axios.get("/api/admin/getUserInfo", {
    params: searchFormInDialog,
  });
  userList.value = res.data;
};
//dialog中重置搜索
const resetSearchInDialog = () => {
  searchFormInDialog.username = "";
  searchFormInDialog.role = "";
  handleSearchInDialog();
};

//查看活动用户弹窗中搜索
const searchFormInViewDialog = reactive({
  username: "",
  role: "",
});

//查看活动用户弹窗中搜索
const handleSearchInViewDialog = async () => {
  const res = await axios.get("/api/admin/getUserListInActivity", {
    params: {
      activityId: currentActivityId.value,
      username: searchFormInViewDialog.username,
      role: searchFormInViewDialog.role,
    },
  });
  res.data.forEach((item) => {
    item.username = item.teacherId || item.studentId;
    item.role = item.teacherId
      ? "teacher"
      : item.studentId
      ? "student"
      : "admin";
  });
  viewUserList.value = res.data;
};

//查看活动用户弹窗中重置搜索
const resetSearchInViewDialog = () => {
  searchFormInViewDialog.username = "";
  searchFormInViewDialog.role = "";
  handleSearchInViewDialog();
};
//查看活动用户弹窗中删除用户
const handleDeleteViewUser = async (row) => {
  const res = await axios.delete("/api/admin/deleteUserInActivity", {
    data: {
      _id: row._id,
    },
  });
  if (res.data.code === 200) {
    ElMessage.success("删除成功");
    handleSearchInViewDialog();
  } else {
    ElMessage.error("删除失败");
  }
};
//重置志愿
const handleResetVolunteer = async (row) => {
  const res = await axios.delete("/api/admin/resetVolunteer", {
    data: {
      activityId: row.activityId,
      studentId: row.studentId,
    },
  });
  if (res.data.code === 200) {
    ElMessage.success("重置成功");
    handleSearchInViewDialog();
  } else {
    ElMessage.error("重置失败");
  }
};
</script>
<style lang="scss" scoped>
.el-table {
  margin-top: 30px;
}

:deep(.el-table) {
  margin-top: 30px;
}

.pagination-wrapper {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>
