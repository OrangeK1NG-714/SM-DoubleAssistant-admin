<template>
    <div>
        <el-card>
            <el-page-header content="选择志愿列表" icon="" title="志愿管理" />
            <div style="display: flex;">
                <div style="margin: 20px 20px 0 20px;">
                    <span style="margin-right: 10px;">学生学号</span>
                    <el-input style="width: 240px" v-model="searchForm.studentId" placeholder="请输入学生学号" clearable />
                </div>
                <div style="margin: 20px 20px 0 20px;">
                    <span style="margin-right: 10px;">活动名称</span>
                    <el-select v-model="searchForm.activityId" placeholder="请选择活动" style="width: 240px" clearable
                        filterable>
                        <el-option v-for="item in activityList" :key="item._id" :label="item.name" :value="item._id" />
                    </el-select>
                </div>
                <div style="margin: 20px 20px 0 20px;">
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button type="default" @click="handleReset">重置</el-button>
                </div>
            </div>

            <el-table :data="paginatedData" style="width: 100%" @select="handleSelect" @select-all="handleSelectAll"
                :row-key="row => row._id" ref="tableRef">
                <!-- <el-table-column type="selection" width="55" /> -->

                <el-table-column prop="studentId" label="学生学号" width="auto" />
                <el-table-column prop="teacherId" label="老师工号" width="auto" />
                <el-table-column prop="order" label="顺序" width="180">
                    <template #default="scope">
                        <el-tag v-if="scope.row.order === 1" type="primary">1</el-tag>
                        <el-tag v-else-if="scope.row.order === 2" type="success">2</el-tag>
                        <el-tag v-else type="warning">3</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="isChose" label="是否被选择" width="auto">
                    <template #default="scope">
                        <el-tag v-if="scope.row.isChose === true" type="danger">是</el-tag>
                        <el-tag v-else type="info">否</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="activityName" label="活动名称" width="auto" />
                <el-table-column prop="createTime" label="创建时间" width="auto" />

                <el-table-column label="操作" width="auto">
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
                :page-sizes="[5, 10, 20, 50]" :page-size="pageSize" :current-page="currentPage"
                @size-change="handleSizeChange" @current-change="handlePageChange" class="pagination-wrapper" />
        </el-card>

        <el-dialog v-model="dialogVisible" title="编辑用户" width="500">
            <el-form ref="userFormRef" style="max-width: 600px" :model="userForm" :rules="userFormRules"
                label-width="auto" class="demo-ruleForm" status-icon>
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
import { ref, reactive, onMounted } from "vue";
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import axios from "axios";
import { usePagination } from '@/composables/usePagination';
import { useTableSelection } from '@/composables/useTableSelection';

const tableRef = ref();
const tableData = ref([]);
const activityList = ref([]);

const { currentPage, pageSize, paginatedData, handlePageChange, handleSizeChange } = usePagination(tableData);
const { selectedItems: selectedUsers, handleSelect, handleSelectAll, clearSelection } = useTableSelection(tableRef, paginatedData, currentPage, pageSize);

const searchForm = reactive({
    studentId: "",
    activityId: ""
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


onMounted(async () => {
    await getTableData();
    // await getActivityName();
});

const getTableData = async () => {
    const res = await axios.get("/api/admin/getSelectedList");

    // 先按createTime排序，再按order排序
    res.data.sort((a, b) => {
        // 先按 createTime 排序（字符串比较即可，因为 ISO 格式可以直接比较）
        if (a.createTime < b.createTime) return -1;
        if (a.createTime > b.createTime) return 1;

        // 如果 createTime 相同，再按 order 排序
        return a.order - b.order;
    });
    // 转换日期格式
    tableData.value = res.data.map(item => ({
        ...item,
        createTime: dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
    }));

    const res1 = await axios.get("/api/admin/getActivityList");
    activityList.value = res1.data;
    tableData.value.map(item => {
        res1.data.map(activity => {
            if (item.activityId === activity._id) {
                item.activityName = activity.name;
            }
        })
    })
};


//编辑回调
const handleEdit = async (data) => {
    const res = await axios.get(`/adminapi/user/list/${data._id}`);
    Object.assign(userForm, res.data.data[0]);
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
    const res = await axios.delete("/api/admin/deleteSelected", {
        data: {
            _id: data._id
        }
    })
    if (res.data.code === 200) {
        ElMessage({
            message: '删除成功',
            type: 'success',
        })
    } else {
        ElMessage({
            message: '删除失败',
            type: 'error',
        })
    }
    getTableData();
};

//表单事件
//搜索事件
const handleSearch = async () => {
    const res = await axios.get("/api/admin/getSelectedList", {
        params: searchForm,
    });
    // 先按createTime排序，再按order排序
    res.data.sort((a, b) => {
        // 先按 createTime 排序（字符串比较即可，因为 ISO 格式可以直接比较）
        if (a.createTime < b.createTime) return -1;
        if (a.createTime > b.createTime) return 1;

        // 如果 createTime 相同，再按 order 排序
        return a.order - b.order;
    });
    // 转换日期格式

    tableData.value = res.data.map(item => ({
        ...item,
        createTime: dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
    }));
    const res1 = await axios.get("/api/admin/getActivityList");
    activityList.value = res1.data;
    tableData.value.map(item => {
        res1.data.map(activity => {
            if (item.activityId === activity._id) {
                item.activityName = activity.name;
            }
        })
    })
    clearSelection();
};

//重置事件
const handleReset = () => {
    searchForm.studentId = "";
    searchForm.activityId = "";
    // selectedUsers.value = []; // 重置时清空已选
    getTableData();
};


</script>

<style lang="scss" scoped>
.el-table {
    margin-top: 50px;
}
</style>