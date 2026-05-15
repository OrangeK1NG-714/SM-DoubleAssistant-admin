<template>
    <div class="apple-page">
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

            <el-table :data="paginatedData" v-loading="tableLoading" style="width: 100%"
                :row-key="row => row._id" ref="tableRef">

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
                        <el-popconfirm :title="scope.row.isChose ? '确定取消选中？' : '确定标记为选中？'"
                            confirm-button-text="确定" cancel-button-text="取消"
                            @confirm="handleToggleChose(scope.row)">
                            <template #reference>
                                <el-button size="small" :type="scope.row.isChose ? 'warning' : 'success'">
                                    {{ scope.row.isChose ? '取消选中' : '标记选中' }}
                                </el-button>
                            </template>
                        </el-popconfirm>
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
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { dayjs, ElMessage } from 'element-plus'
import axios from "axios";
import { usePagination } from '@/composables/usePagination';
import { useLoading } from '@/composables/useLoading';

const tableRef = ref();
const tableData = ref([]);
const activityList = ref([]);

const { currentPage, pageSize, paginatedData, handlePageChange, handleSizeChange } = usePagination(tableData);

const searchForm = reactive({
    studentId: "",
    activityId: ""
});

onMounted(() => loadTableData());

const enrichWithActivityName = (data, activities) => {
    data.forEach(item => {
        activities.forEach(activity => {
            if (item.activityId === activity._id) {
                item.activityName = activity.name;
            }
        });
    });
};

const sortByTimeAndOrder = (data) => {
    data.sort((a, b) => {
        if (a.createTime < b.createTime) return -1;
        if (a.createTime > b.createTime) return 1;
        return a.order - b.order;
    });
};

const { run: loadTableData, loading: tableLoading } = useLoading(async () => {
    const res = await axios.get("/api/admin/getSelectedList");
    sortByTimeAndOrder(res.data);
    tableData.value = res.data.map(item => ({
        ...item,
        createTime: dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
    }));

    const res1 = await axios.get("/api/admin/getActivityList");
    activityList.value = res1.data;
    enrichWithActivityName(tableData.value, res1.data);
});

const handleToggleChose = async (row) => {
    try {
        const res = await axios.put("/api/student/updateTeacher", {
            studentId: row.studentId,
            teacherId: row.teacherId,
            activityId: row.activityId,
        });
        ElMessage.success(row.isChose ? '已取消选中' : '已标记选中');
        loadTableData();
    } catch { /* global interceptor handles error toast */ }
};

const handleDelete = async (data) => {
    try {
        const res = await axios.delete("/api/admin/deleteSelected", {
            data: { _id: data._id }
        });
        if (res.data.code === 200) {
            ElMessage.success('删除成功');
        } else {
            ElMessage.error('删除失败');
        }
        loadTableData();
    } catch { /* global interceptor handles error toast */ }
};

const handleSearch = async () => {
    const res = await axios.get("/api/admin/getSelectedList", {
        params: searchForm,
    });
    sortByTimeAndOrder(res.data);
    tableData.value = res.data.map(item => ({
        ...item,
        createTime: dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
    }));
    const res1 = await axios.get("/api/admin/getActivityList");
    activityList.value = res1.data;
    enrichWithActivityName(tableData.value, res1.data);
};

const handleReset = () => {
    searchForm.studentId = "";
    searchForm.activityId = "";
    loadTableData();
};
</script>

<style lang="scss" scoped>
:deep(.el-table) {
    margin-top: 18px;
}

.pagination-wrapper {
    margin-top: 16px;
    justify-content: flex-end;
}
</style>
