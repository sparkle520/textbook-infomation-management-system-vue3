<!-- @Author: LT -->
<!-- @Date: 2023-11-15 11:26:29 -->
<!-- @Description:  -->
<!-- @LastEditTime: 2023-11-15 11:26:29 -->
<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
         <el-form-item label="教材作者" prop="textbookAuthor">
            <el-input v-model="queryParams.textbookAuthor" placeholder="请输入教材作者" clearable style="width: 200px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="教材名称" prop="textbookTitle">
            <el-input v-model="queryParams.textbookTitle" placeholder="请输入教材名称" clearable style="width: 200px"
               @keyup.enter="handleQuery" />
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

      

      <el-table v-loading="loading" :data="textbookList" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="教材ID" align="center" prop="textbookId" />
         <el-table-column label="教材名称" align="center" prop="textbookTitle" />
         <el-table-column label="教材作者" align="center" prop="textbookAuthor" />
         <el-table-column label="教材ISBN" align="center" prop="textbookISBN" />
         <el-table-column label="出版社名称" align="center" prop="publisherName" />
         <el-table-column label="教材价格" align="center" prop="textbookPrice" />
         <el-table-column label="创建时间" align="center" prop="textbookCreateTime" />
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
               <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                  v-hasPermi="['textbook:review:query']">审查</el-button>
            </template>
         </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
         @pagination="getList" />

      <el-dialog :title="title" v-model="open" width="800px" append-to-body>
         <el-form :inline="true" ref="postRef" :model="form" :rules="rules" label-width="130px">
            <el-form-item label="课程名称"    prop="courseName">
               <el-input v-model="form.courseName" />
            </el-form-item>
            <el-form-item label="课程性质" prop="courseProperty">
               <el-select v-model="form.courseProperty" clearable filterable placeholder="请选择课程性质" class="product-input" allow-create>
                  <el-option v-for="(item, index) in course_prop" :key="index" :label="item.label" :value="item.courseProperty" />
               </el-select>
            </el-form-item>
            <el-form-item label="教材名称"    prop="textbookTitle" class="d">
               <el-input v-model="form.textbookTitle" disabled />
            </el-form-item>
            <el-form-item label="教材作者" prop="textbookAuthor" class="d">
               <el-input v-model="form.textbookAuthor" disabled />
            </el-form-item>
            <el-form-item label="出版社" prop="publisherName" class="d">
               <el-input v-model="form.publisherName" disabled />
            </el-form-item>
            <el-form-item label="教材ISBN编码" prop="textbookISBN" class="d">
               <el-input v-model="form.textbookISBN" disabled />
            </el-form-item>
            
            <el-form-item label="适用对象" prop="useObject">
               <el-input v-model="form.useObject" style="width: 500px;" placeholder="请输入适用对象" />
            </el-form-item>
            
            <el-form-item label="选用理由" prop="selectReason"  label-width="10px" style="margin-left: 120px;">
               <el-input v-model="form.selectReason" style="width: 500px;" :disabled="!$auth.hasRoleOr(['teacher','admin'])" :autosize="{ minRows: 6, maxRows: 10 }"
    type="textarea" placeholder="请输入选用理由" />
            </el-form-item>
            <el-form-item label="课程负责人签字" prop="signaturePrincipal"  style="margin-left: 100px; width: 250px;" class="d">
               <el-input v-model="form.signaturePrincipal" disabled />
            </el-form-item>
            <el-form-item label="日期" prop="principalDate" class="d" style="width: 222px;">
               <el-input v-model="form.principalDate" disabled />
            </el-form-item>
            <el-form-item label="审定意见" prop="selectReason" label-width="10px" style="margin-left: 120px;">
               <el-input v-model="form.selectReason" :disabled="!$auth.hasRoleOr(['leader','admin'])" style="width: 500px;"  :autosize="{ minRows: 6, maxRows: 10 }"
    type="textarea" placeholder="请输入选用理由" />
            </el-form-item>
            <el-form-item label="部门负责人签字" prop="signatureLeader" style="margin-left: 100px; width: 250px;" class="d">
               <el-input v-model="form.signatureLeader"  disabled />
            </el-form-item>
            <el-form-item label="日期" prop="leaderDate" class="d" style="width: 222px;">
               <el-input class="transparent_input"  v-model="form.leaderDate" disabled />
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
import { listTextbookInfo, addTextbook, getTextbook, updateTextbook, delTextbook,getPublisherIdAndPublisherName ,getReviewVoByTextbookId} from "../../../../api/textbook/system/textbook.js";
const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict("sys_normal_disable");
const publisherList = ref();
const textbookList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const course_prop = [
   {courseProperty:'考试'},
   {courseProperty:'考查'},
]
const data = reactive({
   form: {},
   queryParams: {
      pageNum: 1,
      pageSize: 10,
      textbookTitle: undefined,
      textbookAuthor: undefined,
      publisherName: undefined,
      textbookPrice: undefined,
   },
   rules: {
      //textbookTitle: [{ required: true, message: "教材名称不能为空", trigger: "blur" }],
      //textbookAuthor: [{ required: true, message: "教材作者不能为空", trigger: "blur" }],
   }
});

const { queryParams, form, rules } = toRefs(data);

function getList() {
   loading.value = true;
   listTextbookInfo(queryParams.value).then(response => {
      textbookList.value = response.rows;
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
      courseName: undefined,
      courseProperty: undefined,
      textbookTitle: undefined,
      textbookAuthor:undefined,
      publisherName:undefined,
      textbookISBN:undefined,
      useObject:undefined,
      selectReason:undefined,
      signaturePrincipal:undefined,
      principalDate:undefined,
      selectReason:undefined,
      signatureLeader:undefined,
      leaderDate:undefined,
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
   ids.value = selection.map(item => item.textbookId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
}

/** 修改按钮操作 */
function handleUpdate(row) {
   reset();
 
   const textbookId = row.textbookId || ids.value;
   getReviewVoByTextbookId(textbookId).then(response => {
      form.value = response.data;
      console.log(form.value);
      open.value = true;
      title.value = "教材审查";
   });
}
/** 提交按钮 */
function submitForm() {
   proxy.$refs["postRef"].validate(valid => {
      if (valid) {
         if (form.value.textbookId != undefined) {
            updateTextbook(form.value).then(response => {
               proxy.$modal.msgSuccess("修改成功");
               open.value = false;
               getList();
            });
         } else {
            console.log(form.value);
            addTextbook(form.value).then(response => {
               proxy.$modal.msgSuccess("新增成功");
               open.value = false;
               getList();
            });
         }
      }
   });
}


getList();
</script>
<style lang="scss" scoped>
::v-deep .d{
.is-disabled{
   border: none;
}
}
</style>
  