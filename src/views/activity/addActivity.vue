<template>
    <div class="apple-page">
        <el-page-header content="添加活动" icon="" title="活动管理" />
        <el-form ref="activityFormRef" style="max-width: 600px" :model="activityForm" :rules="activityFormRules"
            label-width="auto" class="demo-ruleForm" status-icon>
            <el-form-item label="活动名称" prop="name">
                <el-input v-model="activityForm.name" />
            </el-form-item>
            <el-form-item label="活动描述" prop="description">
                <el-input v-model="activityForm.description" />
            </el-form-item>
            <el-form-item label="活动开始-结束时间">
                <el-date-picker v-model="activityDate.dateRange.value" type="datetimerange" start-placeholder="开始时间"
                    end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DDTHH:mm:ss"
                    @change="activityDate.handleDateChange" />
            </el-form-item>
            <el-form-item label="教师选择第一志愿开始-结束时间">
                <el-date-picker v-model="firstChooseDate.dateRange.value" type="datetimerange" start-placeholder="开始时间"
                    end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DDTHH:mm:ss"
                    @change="firstChooseDate.handleDateChange" />
            </el-form-item>
            <el-form-item label="教师选择第二志愿开始-结束时间">
                <el-date-picker v-model="secondChooseDate.dateRange.value" type="datetimerange" start-placeholder="开始时间"
                    end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DDTHH:mm:ss"
                    @change="secondChooseDate.handleDateChange" />
            </el-form-item>
            <el-form-item label="教师选择第三志愿开始-结束时间">
                <el-date-picker v-model="thirdChooseDate.dateRange.value" type="datetimerange" start-placeholder="开始时间"
                    end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DDTHH:mm:ss"
                    @change="thirdChooseDate.handleDateChange" />
            </el-form-item>
            <el-form-item label="学生填报志愿开始-结束时间">
                <el-date-picker v-model="stdChooseDate.dateRange.value" type="datetimerange" start-placeholder="开始时间"
                    end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DDTHH:mm:ss"
                    @change="stdChooseDate.handleDateChange" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitOneForm()">添加活动</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from 'element-plus';
import axios from "axios";
import { useDateRange } from '@/composables/useDateRange';

const router = useRouter()
const activityFormRef = ref();
const activityForm = reactive({
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
});

const activityDate = useDateRange(activityForm, 'startDate', 'endDate')
const firstChooseDate = useDateRange(activityForm, 'firstChooseStartDate', 'firstChooseEndDate')
const secondChooseDate = useDateRange(activityForm, 'secondChooseStartDate', 'secondChooseEndDate')
const thirdChooseDate = useDateRange(activityForm, 'thirdChooseStartDate', 'thirdChooseEndDate')
const stdChooseDate = useDateRange(activityForm, 'stdChooseStartDate', 'stdChooseEndDate')

const activityFormRules = reactive({
    name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
    description: [{ required: true, message: "请输入活动描述", trigger: "blur" }],
});

const submitOneForm = () => {
    if (activityForm.startDate === '') return ElMessage.error('请输入活动开始时间');
    if (activityForm.firstChooseEndDate === '') return ElMessage.error('请输入第一志愿时间');
    if (activityForm.secondChooseEndDate === '') return ElMessage.error('请输入第二志愿时间');
    if (activityForm.thirdChooseEndDate === '') return ElMessage.error('请输入第三志愿时间');
    if (activityForm.stdChooseEndDate === '') return ElMessage.error('请输入学生填报志愿时间');

    activityFormRef.value.validate(async (valid) => {
        if (valid) {
            const res = await axios.post("/api/admin/addActivity", activityForm)
            if (res.data.code === 200) {
                ElMessage.success('添加成功');
                router.push("/activity/activityList");
            }
        }
    })
};

</script>
<style lang="scss" scoped>
.demo-ruleForm {
    margin-top: 18px;
    max-width: 760px !important;
}
</style>
