<!-- @Author: LT -->
<!-- @Date: 2023-11-15 11:26:55 -->
<!-- @Description:  -->
<!-- @LastEditTime: 2023-11-15 11:26:55 -->
<template>
  <div class="app-container">
     <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
        
        <el-form-item label="反馈人姓名" prop="feedbackName">
           <el-input
              v-model="queryParams.feedbackName"
              placeholder="请输入反馈人姓名"
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
        <!-- <el-col :span="1.5">
           <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['system:publisher:add']"
           >新增</el-button>
        </el-col> -->
        <!-- <el-col :span="1.5">
           <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:publisher:edit']"
           >修改</el-button>
        </el-col> -->
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
      
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
     </el-row>
     <el-table v-loading="loading" :data="feedbackList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="expand">
         <template #default="props">
            <p class="feedback_title">{{props.row.feedbackTitle}}</p>
            {{ props.row.feedbackContent }}
         </template>
       </el-table-column>
        <el-table-column label="反馈ID" align="center" prop="feedbackId" />
        <el-table-column label="标题" align="center" prop="feedbackTitle" />
        
    
        <el-table-column label="反馈人姓名" align="center" prop="feedbackName" />
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
              <!-- <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:post:edit']">修改</el-button> -->
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

     
     <el-dialog title="建议" v-model="feedbackOpen" width="500px" append-to-body>
      <el-form ref="postRef" :model="form" :rules="rules" label-width="0">
      <el-form-item label="" prop="feedbackTitle">
              <el-input v-model="form.feedbackTitle" placeholder="请输入标题" />
           </el-form-item>
           <p class="advice"></p>
           <el-form-item label="" prop="feedbackContent">
              <el-input v-model="form.feedbackContent" autosize type="textarea" placeholder="请输入建议信息" />
           </el-form-item>
           </el-form>
           <template #footer>
           <div class="dialog-footer">
              <el-button type="primary" @click="adviceSubmitForm">确 定</el-button>
              <el-button @click="adviceCancel">取 消</el-button>
           </div>
        </template>
</el-dialog>
     <el-button class="feedback_btn" type="success" @Click="feedbackClick">反馈</el-button>
  </div>
</template>

<script setup name="Post">
import { listFeedback ,delFeedback,addFeedback} from "../../../../api/textbook/system/feedback";
const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict("sys_normal_disable");

const feedbackList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const feedbackOpen = ref(false);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
 form: {},
 queryParams: {
   pageNum: 1,
   pageSize: 10,
   publisherName: undefined,
   publisherISBN: undefined,
 },
 rules: {
  feedbackTitle: [{ required: true, message: "标题不能为空", trigger: "blur" }],
  feedbackContent: [{ required: true, message: "内容不能为空", trigger: "blur" }],
 // publisherISBN: [{ required: true, message: "出版社编码不能为空", trigger: "blur" }],
 }
});
const feedbackClick = () =>{
feedbackOpen.value = true;
}
const { queryParams, form, rules } = toRefs(data);
const adviceSubmitForm = ()=>{
   proxy.$refs["postRef"].validate(valid => {
   if (valid) {
     if (form.value.feedbackId == undefined) {
      addFeedback(form.value).then(response => {
         proxy.$modal.msgSuccess("新增成功");
         feedbackOpen.value = false
         reset()
         getList();
       });
     }
   }
 });
}
const adviceCancel =()=>{
   feedbackOpen.value = false
   reset();
}
/** 查询出版社列表 */
function getList() {
 loading.value = true;
 listFeedback(queryParams.value).then(response => {
   feedbackList.value = response.rows;
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
  feedbackId: undefined,
  feedbackContent : undefined,
  feedbackTitle : undefined,
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
 ids.value = selection.map(item => item.feedbackId);
 single.value = selection.length != 1;
 multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
 reset();
 open.value = true;
 title.value = "添加出版社";
}
/** 修改按钮操作 */
function handleUpdate(row) {
 reset();
 const feedbackIds = row.feedbackId || ids.value;
 getPublisher(publisherId).then(response => {
   form.value = response.data;
   open.value = true;
   title.value = "修改出版社";
 });
}
/** 提交按钮 */
function submitForm() {
 proxy.$refs["postRef"].validate(valid => {
   if (valid) {
     if (form.value.publisherId != undefined) {
      updatePublisher(form.value).then(response => {
         proxy.$modal.msgSuccess("修改成功");
         open.value = false;
         getList();
       });
     } else {
      add(form.value).then(response => {
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
 const feedbackIds = row.feedbackId || ids.value;
 proxy.$modal.confirm('是否确认删除反馈id为"' + feedbackIds + '"的数据项？').then(function() {
   return delFeedback(feedbackIds);
 }).then(() => {
   getList();
   proxy.$modal.msgSuccess("删除成功");
 }).catch(() => {});
}


getList();
</script>
<style lang="scss" scoped>
.feedback_btn{
   display: flex;
   margin-top: 100px;
   margin-left: auto;
}
.advice{
   font-weight: 700;
}
.feedback_title{
   color: rgb(61, 32, 32);
   font-weight: 600;
   font-size: 20px;
   margin: 10px 0;
}
</style>
