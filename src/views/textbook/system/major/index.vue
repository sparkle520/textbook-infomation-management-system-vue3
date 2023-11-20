<!-- @Author: LT -->
<!-- @Date: 2023-11-15 11:26:55 -->
<!-- @Description:  -->
<!-- @LastEditTime: 2023-11-15 11:26:55 -->
<template>
  <div class="app-container">
     <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
        <el-form-item label="专业id" prop="majorId">
           <el-input
              v-model="queryParams.majorId"
              placeholder="请输入专业id"
              clearable
              style="width: 200px"
              @keyup.enter="handleQuery"
           />
        </el-form-item>
        <el-form-item label="专业名称" prop="majorName">
           <el-input
              v-model="queryParams.majorName"
              placeholder="请输入专业名称"
              clearable
              style="width: 200px"
              @keyup.enter="handleQuery"
           />
        </el-form-item>
        <!-- <el-form-item label="状态" prop="status">
           <el-select v-model="queryParams.status" placeholder="岗位状态" clearable style="width: 200px">
              <el-option
                 v-for="dict in sys_normal_disable"
                 :key="dict.value"
                 :label="dict.label"
                 :value="dict.value"
              />
           </el-select>
        </el-form-item> -->
        <el-form-item>
           <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
           <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
     </el-form>

     <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
           <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['system:publisher:add']"
           >新增</el-button>
        </el-col>
        <el-col :span="1.5">
           <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:publisher:edit']"
           >修改</el-button>
        </el-col>
        <el-col :span="1.5">
           <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:publisher:remove']"
           >删除</el-button>
        </el-col>
        <el-col :span="1.5">
           <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['system:publisher:export']"
           >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
     </el-row>

     <el-table v-loading="loading" :data="MajorList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="专业Id" align="center" prop="majorId" />
        <el-table-column label="专业名称" align="center" prop="majorName" />
        <!-- <el-table-column label="状态" align="center" prop="publisherISBN">
           <template #default="scope">
              <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
           </template>
        </el-table-column> -->
        <!-- <el-table-column label="创建时间" align="center" prop="createTime" width="180">
           <template #default="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
           </template>
        </el-table-column> -->
        <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
           <template #default="scope">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:post:edit']">修改</el-button>
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:post:remove']">删除</el-button>
           </template>
        </el-table-column>
     </el-table>

     <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
     />

     <!-- 添加或修改岗位对话框 -->
     <el-dialog :title="title" v-model="open" width="500px" append-to-body>
        <el-form ref="postRef" :model="form" :rules="rules" label-width="130px">
           <el-form-item label="专业名称" prop="majorName">
              <el-input v-model="form.majorName" placeholder="请输入专业名称" />
           </el-form-item>
        </el-form>
        <template #footer>
           <div class="dialog-footer">
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
           </div>
        </template>
     </el-dialog>
  </div>
</template>

<script setup name="Post">
import { listMajor , addMajor ,getMajor ,updateMajor,delMajor} from "../../../../api/textbook/system/major";
const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict("sys_normal_disable");

const MajorList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
 form: {},
 queryParams: {
   pageNum: 1,
   pageSize: 10,
   majorName: undefined,
 },
 rules: {
  majorName: [{ required: true, message: "专业名称不能为空", trigger: "blur" }],
 //publisherISBN: [{ required: true, message: "出版社编码不能为空", trigger: "blur" }],
 }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询出版社列表 */
function getList() {
 loading.value = true;
 listMajor(queryParams.value).then(response => {
   MajorList.value = response.rows;
   total.value = response.total;
   loading.value = false;
 });
}
/** 取消按钮 */
function cancel() {
 open.value = false;
 reset();
}
/** 表单重置 */
function reset() {
 form.value = {
   majorName: undefined,  
 };
 proxy.resetForm("postRef");
}
/** 搜索按钮操作 */
function handleQuery() {
 queryParams.value.pageNum = 1;
 getList();
}
/** 重置按钮操作 */
function resetQuery() {
 proxy.resetForm("queryRef");
 handleQuery();
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
 ids.value = selection.map(item => item.majorId);
 single.value = selection.length != 1;
 multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
 reset();
 open.value = true;
 title.value = "添加专业";
}
/** 修改按钮操作 */
function handleUpdate(row) {
 reset();
 const majorId = row.majorId || ids.value;
 getMajor(majorId).then(response => {
   form.value = response.data;
   open.value = true;
   title.value = "修改专业";
 });
}
/** 提交按钮 */
function submitForm() {
 proxy.$refs["postRef"].validate(valid => {
   if (valid) {
     if (form.value.majorId != undefined) {
      updateMajor(form.value).then(response => {
         proxy.$modal.msgSuccess("修改成功");
         open.value = false;
         getList();
       });
     } else {
      addMajor(form.value).then(response => {
         proxy.$modal.msgSuccess("新增成功");
         open.value = false;
         getList();
       });
     }
   }
 });
}
/** 删除按钮操作 */
function handleDelete(row) {
 const majorIds = row.majorId || ids.value;
 proxy.$modal.confirm('是否确认删除专业id为"' + majorIds + '"的数据项？').then(function() {
   return delMajor(majorIds);
 }).then(() => {
   getList();
   proxy.$modal.msgSuccess("删除成功");
 }).catch(() => {});
}
/** 导出按钮操作 */
function handleExport() {
 proxy.download("system/post/export", {
   ...queryParams.value
 }, `post_${new Date().getTime()}.xlsx`);
}

getList();
</script>
