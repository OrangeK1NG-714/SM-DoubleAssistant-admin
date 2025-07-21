<template>
    <div>
        <el-card>
            <el-page-header content="" icon="" title="活动列表" />

            <el-table :data="paginatedData" style="width: 100%">
                <el-table-column prop="name" label="活动名称" width="auto" />
                <el-table-column prop="startDate" label="活动开始时间" width="auto" />
                <el-table-column prop="endDate" label="活动结束时间" width="auto" />

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
                :page-sizes="[5, 10, 20, 50]" :page-size="pageSize" :current-page="currentPage"
                @size-change="handleSizeChange" @current-change="handlePageChange" class="pagination-wrapper" />
        </el-card>

        <!-- 编辑弹窗 -->
        <el-dialog title="编辑活动" v-model="dialogVisible" width="50%">
            <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="auto" class="demo-ruleForm"
                status-icon>
                <el-form-item label="活动名称" prop="name">
                    <el-input v-model="editForm.name" />
                </el-form-item>
                <el-form-item label="活动描述" prop="description">
                    <el-input v-model="editForm.description" />
                </el-form-item>
                <el-form-item label="活动开始-结束时间">
                    <el-date-picker v-model="tempDateRange1" type="datetimerange" start-placeholder="开始时间"
                        end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DDTHH:mm:ss"
                        @change="handleDateChange1" />
                </el-form-item>
                <el-form-item label="教师选择第一志愿开始-结束时间">
                    <el-date-picker v-model="tempDateRange2" type="datetimerange" start-placeholder="开始时间"
                        end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DDTHH:mm:ss"
                        @change="handleDateChange2" />
                </el-form-item>
                <el-form-item label="教师选择第二志愿开始-结束时间">
                    <el-date-picker v-model="tempDateRange3" type="datetimerange" start-placeholder="开始时间"
                        end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DDTHH:mm:ss"
                        @change="handleDateChange3" />
                </el-form-item>
                <el-form-item label="教师选择第三志愿开始-结束时间">
                    <el-date-picker v-model="tempDateRange4" type="datetimerange" start-placeholder="开始时间"
                        end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DDTHH:mm:ss"
                        @change="handleDateChange4" />
                </el-form-item>
                <el-form-item label="学生填报志愿开始-结束时间">
                    <el-date-picker v-model="tempDateRange5" type="datetimerange" start-placeholder="开始时间"
                        end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DDTHH:mm:ss"
                        @change="handleDateChange5" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveEdit">确认修改</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import axios from "axios";
import {
    currentPage,
    pageSize,
    handlePageChange,
    handleSizeChange
} from "@/util/page.ts";
import { ElMessage } from 'element-plus';

// 新增临时日期范围变量
const tempDateRange1 = ref([]);
const tempDateRange2 = ref([]);
const tempDateRange3 = ref([]);
const tempDateRange4 = ref([]);
const tempDateRange5 = ref([]);

// 处理日期变化
const handleDateChange1 = (val) => {
    if (val && val.length === 2) {
        editForm.startDate = val[0];
        editForm.endDate = val[1];
    } else {
        editForm.startDate = '';
        editForm.endDate = '';
    }
};
const handleDateChange2 = (val) => {
    if (val && val.length === 2) {
        editForm.firstChooseStartDate = val[0];
        editForm.firstChooseEndDate = val[1];
    } else {
        editForm.firstChooseStartDate = '';
        editForm.firstChooseEndDate = '';
    }
    console.log(editForm.firstChooseStartDate, editForm.firstChooseEndDate);
};
const handleDateChange3 = (val) => {
    if (val && val.length === 2) {
        editForm.secondChooseStartDate = val[0];
        editForm.secondChooseEndDate = val[1];
    } else {
        editForm.secondChooseStartDate = '';
        editForm.secondChooseEndDate = '';
    }
    console.log(editForm.secondChooseStartDate, editForm.secondChooseEndDate);
};
const handleDateChange4 = (val) => {
    if (val && val.length === 2) {
        editForm.thirdChooseStartDate = val[0];
        editForm.thirdChooseEndDate = val[1];
    } else {
        editForm.thirdChooseStartDate = '';
        editForm.thirdChooseEndDate = '';
    }
    console.log(editForm.thirdChooseStartDate, editForm.thirdChooseEndDate);
};
const handleDateChange5 = (val) => {
    if (val && val.length === 2) {
        editForm.stdChooseStartDate = val[0];
        editForm.stdChooseEndDate = val[1];
    } else {
        editForm.stdChooseStartDate = '';
        editForm.stdChooseEndDate = '';
    }
    console.log(editForm.stdChooseStartDate, editForm.stdChooseEndDate);
};



// 计算当前页显示的数据
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return tableData.value.slice(start, end);
});


const tableData = ref([]);

onMounted(async () => {
    await getTableData();
});
const getTableData = async () => {
    const res = await axios.get("/api/admin/getActivityList");

    console.log(res.data);
    res.data.forEach(item => {
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

    })
    tableData.value = res.data;
};


//将ISO日期字符串转换为本地日期字符串
function formatISODateToLocal(isoString) {
    // 1. 创建Date对象
    const date = new Date(isoString);

    // 2. 获取各个时间部分
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // 3. 拼接成目标格式
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const editFormRules = reactive({
    name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
    description: [{ required: true, message: "请输入活动描述", trigger: "blur" }],
});

const dialogVisible = ref(false);
const editFormRef = ref();

const editForm = reactive({
    _id: '',
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    firstChooseStartDate: '',
    firstChooseEndDate: '',
    secondChooseStartDate: '',
    secondChooseEndDate: '',
    thirdChooseStartDate: '',
    thirdChooseEndDate: '',
    stdChooseStartDate: '',
    stdChooseEndDate: ''
})
//编辑活动
const handleEdit = (row) => {
    console.log(row);
    console.log(editForm);
    Object.assign(editForm, row);
    console.log(editForm);
    tempDateRange1.value = [row.startDate, row.endDate];
    tempDateRange2.value = [row.firstChooseStartDate, row.firstChooseEndDate];
    tempDateRange3.value = [row.secondChooseStartDate, row.secondChooseEndDate];
    tempDateRange4.value = [row.thirdChooseStartDate, row.thirdChooseEndDate];
    tempDateRange5.value = [row.stdChooseStartDate, row.stdChooseEndDate];


    dialogVisible.value = true;

}

const saveEdit = () => {
    editFormRef.value.validate(async (valid) => {
        if (valid) {
            console.log(123);
            console.log(editForm);
            
            const res = await axios.put("api/admin/updateActivity", editForm);
            console.log(res);
            
            if (res.data.code === 200) {
                ElMessage.success('修改成功');
                getTableData();
                dialogVisible.value = false;
            }
            else {
                ElMessage.error('修改失败');
            }
        }

    })
}
//删除活动
const handleDelete = async (row) => {
    console.log(row);
    const res = await axios.delete("/api/admin/deleteActivity", {
        data: {
            id: row._id
        }
    })
    if (res.data.code === 200) {
        ElMessage.success('删除成功');
        getTableData();
    }
    else {
        ElMessage.error('删除失败');
    }

}
</script>
<style lang="scss" scoped>
.el-table {
    margin-top: 50px;
}
</style>
