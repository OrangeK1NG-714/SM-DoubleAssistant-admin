<template>
    <div class="apple-page">
        <el-card>
            <el-page-header content="已选上学生列表" icon="" title="志愿管理" />
            <div style="display: flex;">
                <div style="margin: 20px 20px 0 20px;">
                    <span style="margin-right: 10px;">学生学号</span>
                    <el-input style="width: auto" v-model="searchForm.studentId" placeholder="请输入学号" clearable />
                </div>
                <div style="margin: 20px 20px 0 20px;">
                    <span style="margin-right: 10px;">教师姓名</span>
                    <el-select v-model="searchForm.teacherId" placeholder="请选择老师" style="width: auto" clearable
                        filterable>
                        <el-option v-for="item in teacherList" :key="item._id" :label="item.name"
                            :value="item.teacherId" />
                    </el-select>
                </div>
                <div style="margin: 20px 20px 0 20px;">
                    <span style="margin-right: 10px;">活动名称</span>
                    <el-select v-model="searchForm.activityId" placeholder="请选择活动" style="width: auto" clearable
                        filterable :disabled="isSearchDisabled">
                        <el-option v-for="item in activityList" :key="item._id" :label="item.name" :value="item._id" />
                    </el-select>
                </div>
                <div style="margin: 20px 20px 0 20px;width: auto;">
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button type="default" @click="handleReset">重置</el-button>
                    <el-button type="success" @click="handleExport">导出选中</el-button>
                </div>
            </div>

            <el-table :data="paginatedData" v-loading="tableLoading" style="width: 100%" @select="handleSelect" @select-all="handleSelectAll"
                :row-key="row => row._id" ref="tableRef">
                <el-table-column type="selection" width="55" />

                <el-table-column prop="activityName" label="活动名称" width="auto" />
                <el-table-column prop="studentId" label="学生学号" width="auto" />
                <el-table-column prop="data.name" label="学生姓名" width="auto" />
                <el-table-column prop="data.grade" label="学生年级" width="auto" />
                <el-table-column prop="teacherId" label="教师工号" width="auto" />
                <el-table-column label="操作" width="auto">
                    <template #default="scope">
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
import { usePagination } from '@/composables/usePagination';
import { useTableSelection } from '@/composables/useTableSelection';
import { useLoading } from '@/composables/useLoading';
import { ElMessage } from 'element-plus'
import axios from "axios";
import * as XLSX from 'xlsx';
import { useRoute } from "vue-router";

const route = useRoute()
const isSearchDisabled = ref(false); // 添加禁用状态

const tableRef = ref();
const tableData = ref([]);
const { currentPage, pageSize, paginatedData, handlePageChange, handleSizeChange } = usePagination(tableData);
const { selectedItems: selectedUsers, handleSelect, handleSelectAll, clearSelection } = useTableSelection(tableRef, paginatedData, currentPage, pageSize);

const searchForm = reactive({
    studentId: "",
    teacherId: "",
    activityId: ""
});

const activityList = ref([]);
const teacherList = ref([]);

onMounted(async () => {
    if (route.query.activityId) {
        searchForm.activityId = route.query.activityId;
        isSearchDisabled.value = true;
        handleSearch();
    } else {
        await loadTableData();
        await getTeacherList();
    }
});

const enrichWithActivityName = (data, activities) => {
    data.forEach(item => {
        activities.forEach(activity => {
            if (item.activityId === activity._id) {
                item.activityName = activity.name;
            }
        });
    });
};

const { run: loadTableData, loading: tableLoading } = useLoading(async () => {
    const res = await axios.get("/api/admin/getFinalList");
    tableData.value = res.data.data;
    const res1 = await axios.get("/api/admin/getActivityList");
    activityList.value = res1.data.data;
    enrichWithActivityName(tableData.value, res1.data.data);
});

const getTeacherList = async () => {
    const res = await axios.get("/api/teacher/detail");
    teacherList.value = res.data.data;
}

const handleDelete = async (data) => {
    try {
        const res = await axios.delete("/api/teacher/cancelSelect", {
            params: {
                studentId: data.studentId,
                teacherId: data.teacherId,
                activityId: data.activityId,
            },
        });
        ElMessage.success("删除成功");
        loadTableData();
    } catch { /* global interceptor handles error toast */ }
};

//表单事件
//搜索事件
const handleSearch = async () => {
    const res = await axios.get("/api/admin/getFinalList", {
        params: searchForm,
    });
    tableData.value = res.data.data;
    const res1 = await axios.get("/api/admin/getActivityList");
    activityList.value = res1.data.data;
    enrichWithActivityName(tableData.value, res1.data.data);
};

//重置事件
const handleReset = () => {
    if (isSearchDisabled.value) {
        searchForm.studentId = "";
        searchForm.teacherId = "";
    }
    else {
        searchForm.studentId = "";
        searchForm.teacherId = "";
        searchForm.activityId = "";
    }

    handleSearch();
};

// 导出选中数据
const handleExport = async () => {
    if (selectedUsers.value.length === 0) {
        ElMessage.warning('请选择要导出的数据');
        return;
    }

    const res = await axios.get("/api/admin/getTeacherListInActivity", {
        params: {
            activityId: selectedUsers.value[0].activityId,
        }
    });

    const userList = await axios.get("/api/admin/getStudentListInActivity", {
        params: {
            activityId: selectedUsers.value[0].activityId,
        }
    })

    // 记录已选中的学生ID
    const selectedStudentIds = new Set(selectedUsers.value.map(item => item.studentId));

    // 找出落选的学生
    const unselectedStudents = userList.data.data.filter(student => !selectedStudentIds.has(student.studentId));

    // 准备导出数据 - 按照你提供的Excel格式
    const exportData = []
    
    // 添加表头
    exportData.push(['导师', '学生', '学号', '专业', '导师电话']);
    
    // 处理每个导师的学生
    const mergeRanges = []; // 存储合并单元格的范围
    let currentRow = 1; // 从表头后的第一行开始
    
    // 按teacherId分组处理
    const teachersWithStudents = {};
    
    // 首先构建导师-学生的映射关系
    res.data.data.forEach(teacher => {
        const students = selectedUsers.value.filter(item => item.teacherId === teacher.teacherId);
        if (students.length > 0) {
            teachersWithStudents[teacher.teacherId] = {
                teacher,
                students
            };
        } else {
            // 没有学生的导师也需要显示
            teachersWithStudents[teacher.teacherId] = {
                teacher,
                students: []
            };
        }
    });
    
    // 处理每个导师的数据
    for (const teacherId in teachersWithStudents) {
        const { teacher, students } = teachersWithStudents[teacherId];
        const teacherName = teacher.name;
        const teacherPhone = teacher.phone || '';
        
        if (students.length === 0) {
            // 如果没有学生，添加一行空数据
            exportData.push([teacherName, '', '', '', teacherPhone]);
            currentRow++;
        } else {
            // 有学生的情况，需要考虑合并单元格
            exportData.push([teacherName, '', '', '', '']); // 第一行保留导师名称，电话留空
            
            // 为每个学生添加一行
            students.forEach((student, index) => {
                if (index === 0) {
                    // 第一个学生的行，复用上面的行
                    exportData[currentRow][1] = student.data?.name || '';
                    exportData[currentRow][2] = student.studentId;
                    exportData[currentRow][3] = student.data?.classNum || '';
                    exportData[currentRow][4] = teacherPhone; // 第一行显示导师电话
                } else {
                    // 后续学生的行，导师名称为空
                    exportData.push(['', student.data?.name || '', student.studentId, student.data?.classNum || '', '']);
                }
            });
            
            // 如果有多个学生，需要合并导师名称单元格
            if (students.length > 1) {
                mergeRanges.push({
                    s: { r: currentRow, c: 0 }, // 起始行、列
                    e: { r: currentRow + students.length - 1, c: 0 } // 结束行、列
                });
            }
            
            currentRow += students.length;
        }
    }

    // 添加落选的学生
    if (unselectedStudents.length > 0) {
        exportData.push(['未分配导师', '', '', '', '']);
        mergeRanges.push({
            s: { r: currentRow, c: 0 }, // 起始行、列
            e: { r: currentRow + unselectedStudents.length, c: 0 } // 结束行、列
        });
        
        unselectedStudents.forEach(student => {
            exportData.push(['', student.data?.name || '', student.studentId, student.data?.major || '', '']);
        });
    }

    // 创建工作簿和工作表
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(exportData);

    // 设置合并单元格
    ws['!merges'] = mergeRanges;

    // 设置列宽（可选，根据内容调整）
    const colWidths = [
        { wch: 15 }, // 导师列
        { wch: 15 }, // 学生列
        { wch: 15 }, // 学号列
        { wch: 25 }, // 专业列
        { wch: 15 }  // 导师电话列
    ];
    ws['!cols'] = colWidths;

    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, '导师制分配表');

    // 导出Excel文件
    XLSX.writeFile(wb, `${new Date().getFullYear()}级导师制分配表.xlsx`);

    ElMessage.success('导出成功');
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