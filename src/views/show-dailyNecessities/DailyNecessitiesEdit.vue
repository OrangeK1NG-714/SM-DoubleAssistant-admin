<template>
    <div>
      <el-page-header content="生活用品" @back="handleBack()" title="生活用品展示管理" />
  
      <el-form
        ref="dailyProductFormRef"
        style="max-width: 600px"
        :model="dailyProductForm"
        :rules="dailyProductFormRules"
        label-width="auto"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="产品名称" prop="title">
          <el-input v-model="dailyProductForm.title" />
        </el-form-item>
        <el-form-item label="产品简要描述" prop="introduction">
          <el-input v-model="dailyProductForm.introduction" type="textarea" />
        </el-form-item>
        <el-form-item label="产品图片" prop="cover">
          <Upload :avatar="dailyProductForm.cover" @kerwinchange="handleChange" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">更新产品</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  <script setup>
  import { ref, reactive, onMounted } from "vue";
  import Upload from "@/components/upload/Upload.vue";
  import upload from "@/util/upload";
  import { useRouter, useRoute } from "vue-router";
  import axios from "axios";
  
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
  const router = useRouter();
  const route = useRoute();
  //更新提交
  const submitForm = () => {
    dailyProductFormRef.value.validate(async (valid) => {
      if (valid) {
        await upload("/adminapi/dailyNecessities/list", dailyProductForm);
        router.push("/product-manage/ProductList");
      }
    });
  };
  
  const handleBack = () => {
    router.back();
  };
  onMounted(() => {
    getData();
  });
  const getData = async () => {
    const res = await axios.get(`/adminapi/dailyNecessities/list/${route.params.id}`);
    console.log(res.data.data[0]);
  
    Object.assign(productForm, res.data.data[0]);
  };
  </script>
  <style lang="scss" scoped>
  .demo-ruleForm {
    margin-top: 50px;
  }
  </style>
  