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
        <el-upload
          class="upload-demo"
          drag
         
          action=""
          :limit="1"
          accept=".fbx"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          :on-change="handleFileChange"
          :file-list="fileList"  
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            拖动.fbx文件到此处 <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              只支持fbx文件格式，文件大小不能超过50M。
            </div>
          </template>
        </el-upload>
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
import upload from "@/util/upload";
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
});

//每次选择完图片后的回调
const handleChange = (file) => {
  dailyProductForm.cover = URL.createObjectURL(file);
  dailyProductForm.file = file;
};
const router = useRouter();
//更新提交
const submitForm = () => {
  dailyProductFormRef.value.validate(async (valid) => {
    if (valid) {
        console.log("dailyProductForm", dailyProductForm);
    //   await upload("/adminapi/product/add", dailyProductForm);
    //   router.push("/product-manage/ProductList");
    }
  });
};

const fileList = ref([]); // 定义 fileList

// 文件上传前的校验
const beforeUpload = (file) => {
  const isFBX = file.type === "application/octet-stream" && file.name.endsWith(".fbx");
  const isLt50MB = file.size / 1024 / 1024 < 50;

  if (!isFBX) {
    ElMessage.error("只能上传 .fbx 文件！");
    return false;
  }
  if (!isLt50MB) {
    ElMessage.error("文件大小不能超过 50MB！");
    return false;
  }
  return true;
};

// 文件移除的回调
const handleRemove = (file, fileList) => {
  console.log("文件移除：", file, fileList);
  dailyProductForm.modelFile = null; // 清空文件数据
};
// 文件选择后的回调
const handleFileChange = (file) => {
  console.log("已选择文件：", file);
  fileList.value = [file]; // 更新 fileList
  dailyProductForm.modelFile = file.raw; // 将文件存储到表单数据中
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
