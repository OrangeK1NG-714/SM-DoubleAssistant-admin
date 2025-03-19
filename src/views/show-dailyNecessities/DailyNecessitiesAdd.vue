<template>
  <div>
    <el-page-header content="添加生活用品" icon="" title="生活用品展示管理" />

    <el-form
      ref="dailyProductFormRef"
      style="max-width: 600px"
      :model="dailyProductForm"
      :rules="dailyProductFormRules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="生活用品名称" prop="title">
        <el-input v-model="dailyProductForm.title" />
      </el-form-item>
      <el-form-item label="生活用品简要描述" prop="introduction">
        <el-input v-model="dailyProductForm.introduction" type="textarea" />
      </el-form-item>
      <el-form-item label="生活用品图片" prop="cover">
        <Upload :avatar="dailyProductForm.cover" @kerwinchange="handleChange" />
      </el-form-item>
      <el-form-item label="生活用品模型文件" prop="modelFile">
        <UploadModel @qlcmodelchange="handleModelChange"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">添加产品</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import Upload from "@/components/upload/Upload.vue";
import UploadModel from "@/components/upload/UploadModel.vue";
import upload from "@/util/upload";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { UploadFilled } from "@element-plus/icons-vue";
const dailyProductFormRef = ref();
const dailyProductForm = reactive({
  title: "",
  introduction: "",
  detail: "",
  cover: "",
  file: null,
  modelFile: null, // 用于存储选择的文件
});
const dailyProductFormRules = reactive({
  title: [{ required: true, message: "请输入生活用品名称", trigger: "blur" }],
  introduction: [
    { required: true, message: "请输入简要描述", trigger: "blur" },
  ],
  cover: [{ required: true, message: "请上传生活用品图片", trigger: "blur" }],
  modelFile: [{ required: true, message: "请上传生活用品FBX模型", trigger: "blur" }],
});

//每次选择完图片后的回调
const handleChange = (file) => {
  dailyProductForm.cover = URL.createObjectURL(file);
  dailyProductForm.file = file;
  console.log("file", file);
  console.log("cover", dailyProductForm.cover);

};
//选择模型文件
const handleModelChange = (modelFile) => {
  dailyProductForm.modelFile = modelFile;
  console.log("选择的模型文件：", dailyProductForm.modelFile)
};
const router = useRouter();
//更新提交
const submitForm = () => {
  dailyProductFormRef.value.validate(async (valid) => {
    if (valid) {
        console.log("dailyProductForm", dailyProductForm);
      await upload("/adminapi/dailyNecessities/add", dailyProductForm);
      router.push("/show-dailyNecessities/DailyNecessitiesList");
    }
  });
};

</script>
<style lang="scss" scoped>
.demo-ruleForm {
  margin-top: 50px;
}

.upload-demo {
  margin-top: 20px;
}
.el-upload__text {
  font-size: 14px;
}
.el-upload__tip {
  color: #666;
  font-size: 12px;
}
</style>
