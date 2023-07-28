<template>
  <div class="outer">
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <template #header>
        <el-button type="primary" :icon="'ele-Plus'" @click="addTrademark">
          添加
        </el-button>
      </template>
      <!-- card body -->
      <!-- v-loading指令，控制table表格是否处于加载中状态 -->
      <el-table :data="trademarkList" border stripe v-loading="loading">
        <el-table-column type="index" label="序号" align="center" width="80" />
        <el-table-column
          prop="tmName"
          label="品牌名称"
          align="center"
        ></el-table-column>
        <el-table-column prop="logoUrl" label="品牌Logo" align="center">
          <!-- 使用插槽，并接收组件内部传入的值 v-slot:default = #default -->
          <template #default="{ row }">
            <img height="100" :src="row.logoUrl" alt="logo" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- v-slot需要写在template或组件上，如果是default可省略不写 -->
          <template v-slot="{ row }">
            <div>
              <el-button
                type="warning"
                size="small"
                icon="ele-Edit"
                @click="editTrademark(row)"
              >
                修改
              </el-button>
              <el-button type="danger" size="small" icon="ele-Delete">
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
      <el-pagination
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
        v-model:page-size="limit"
        v-model:current-page="page"
        :page-sizes="[3, 5, 7, 9]"
      >
      </el-pagination>
    </el-card>

    <!-- 弹框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="tmInfo.id ? '修改品牌' : '新增品牌'"
      width="50%"
    >
      <!-- 表单 -->
      <el-form label-width="100px" class="demo-ruleForm" :inline="false">
        <el-form-item label="品牌名称">
          <el-input v-model="tmInfo.tmName" />
        </el-form-item>
        <el-form-item label="品牌Logo">
          <!-- 上传图片Upload -->
          <!-- /admin/product/upload -->
          <el-upload
            class="avatar-uploader"
            :action="`${baseUrl}/admin/product/upload`"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><ele-Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="addOrEditTrademark"
            v-if="tmInfo.id"
          >
            修改
          </el-button>
          <el-button type="primary" @click="addOrEditTrademark" v-else>
            新增
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Trademark",
});
</script>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import {
  reqTrademarkInfo,
  reqAddTrademark,
  reqEditTrademark,
} from "@/api/trademark";
import type { trademarkListType, trademarkItemType } from "@/api/trademark";

import { ElMessage } from "element-plus";
import type { UploadProps } from "element-plus";
// TODO:1.品牌列表数据渲染--------------------------------
// 1.初始化数据-当前页
const page = ref(1);
// 2.初始化数据-每页条数
const limit = ref(3);
// 3.初始化数据-品牌列表
const trademarkList = ref<trademarkListType>([]);
// 4.分页列表总条数
const total = ref(0);
// 5.请求加载中状态
const loading = ref(false);
// @func请求品牌列表函数
const getTrademarkList = async () => {
  // 发送请求进入加载
  loading.value = true;
  const result = await reqTrademarkInfo(page.value, limit.value);
  trademarkList.value = result.records;
  total.value = result.total;
  // 结束请求退出加载
  loading.value = false;
};
// 初始化发送请求，请求品牌列表数据
onMounted(() => {
  getTrademarkList();
});
// 监听当前页和每页条数的改变，重新发送请求
watch([page, limit], () => {
  getTrademarkList();
});

// TODO:2.添加按钮的弹框逻辑--------------------------------
// 2.1控制弹框是否显示
const dialogVisible = ref(false);
// 2.2Ajax请求前缀
const baseUrl = import.meta.env.VITE_API_URL;
// 2.3预览图片的路径
const imageUrl = ref("");
// 2.7表单输入数据
const tmInfo = ref<trademarkItemType>({
  tmName: "",
  logoUrl: "",
});
// 2.4上传成功的事件回调函数
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  //response中有一个data属性代表上传好的地址
  // console.log(response, uploadFile);
  tmInfo.value.logoUrl = response.data;
  //当上传完成，给预览的图片添加上本地地址
  // '!' 是TS中的类型断言，表示!前的变量不是undefined
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
};
// 2.5图片上传之前的回调函数，返回true才能上传
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.type === "image/webp") {
    ElMessage.error("暂不支持上传webp格式的图片");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("暂不支持大于2M的图片");
    return false;
  }
  return true;
};
// 2.6点击添加和修改的回调函数
const addOrEditTrademark = async () => {
  if (tmInfo.value.id) {
    try {
      await reqEditTrademark(tmInfo.value);
      ElMessage.success("修改成功");

      // 请求成功关闭弹框
      dialogVisible.value = false;

      // 重新请求数据
      getTrademarkList();
    } catch (error) {
      ElMessage.error("修改失败");
    }
  } else {
    try {
      await reqAddTrademark(tmInfo.value);
      ElMessage.success("新增成功");

      // 请求成功关闭弹框
      dialogVisible.value = false;

      // 重新请求数据
      getTrademarkList();
    } catch (error) {
      ElMessage.error("新增失败");
    }
  }
};
// 2.8 点击添加，清空上一次的数据
const addTrademark = () => {
  dialogVisible.value = true;
  tmInfo.value = {
    tmName: "",
    logoUrl: "",
  };
  imageUrl.value = "";
};
// 2.9 点击修改，获取当前数据,回填数据
const editTrademark = (row: trademarkItemType) => {
  tmInfo.value = { ...row };
  imageUrl.value = row.logoUrl;

  dialogVisible.value = true;
};
</script>

<style scoped>
/* Dialog样式 */
.outer >>> .el-dialog {
  margin-top: 100px;
}
/* Upload样式 */
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
/* Upload样式 */
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
