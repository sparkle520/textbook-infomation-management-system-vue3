<template>
  <div class="app-container">
     <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
        <el-form-item label="出版社ISBN编号" prop="publisherISBN">
           <el-input
              v-model="queryParams.publisherISBN"
              placeholder="请输入出版社ISBN编号"
              clearable
              style="width: 200px"
              @keyup.enter="handleQuery"
           />
        </el-form-item>
        <el-form-item label="出版社名称" prop="publisherName">
           <el-input
              v-model="queryParams.publisherName"
              placeholder="请输入出版社名称"
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

     <el-table v-loading="loading" :data="publisherList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="出版社ID" align="center" prop="publisherId" />
        <el-table-column label="出版社名称" align="center" prop="publisherName" />
        <el-table-column label="出版社联系人姓名" align="center" prop="publisherContactName" />
        <el-table-column label="出版社电话" align="center" prop="publisherPhone" />
        <el-table-column label="出版社ISBN编号" align="center" prop="publisherISBN" />
        <el-table-column label="出版社地址" align="center" prop="publisherAddress" />
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
           <el-form-item label="出版社名称" prop="publisherName">
              <el-input v-model="form.publisherName" placeholder="请输入出版社名称" />
           </el-form-item>
           <el-form-item label="出版社ISBN编号" prop="publisherISBN">
              <el-input v-model="form.publisherISBN" placeholder="请输入出版社ISBN编号" />
           </el-form-item>
           <el-form-item label="出版社联系人姓名" prop="publisherContactName">
              <el-input v-model="form.publisherContactName" placeholder="请输入出版社联系人姓名" />
           </el-form-item>
           <el-form-item label="出版社电话" prop="publisherPhone">
              <el-input v-model="form.publisherPhone" placeholder="请输入出版社电话" />
           </el-form-item>
           <el-form-item label="出版社地址" prop="publisherAddress">
              <el-input v-model="form.publisherAddress" placeholder="请输入出版社地址" />
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
import { listPublisher , addPublisher ,getPublisher ,updatePublisher,delPublisher} from "../../../../api/textbook/system/publisher";
const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict("sys_normal_disable");

const publisherList = ref([]);
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
   publisherName: undefined,
   publisherISBN: undefined,
 },
 rules: {
  publisherName: [{ required: true, message: "出版社名称不能为空", trigger: "blur" }],
 // publisherISBN: [{ required: true, message: "出版社编码不能为空", trigger: "blur" }],
 }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询出版社列表 */
function getList() {
 loading.value = true;
 listPublisher(queryParams.value).then(response => {
  publisherList.value = response.rows;
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
   postId: undefined,
   postCode: undefined,
   postName: undefined,
  
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
 ids.value = selection.map(item => item.publisherId);
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
 const publisherId = row.publisherId || ids.value;
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
      addPublisher(form.value).then(response => {
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
 const publisherIds = row.publisherId || ids.value;
 proxy.$modal.confirm('是否确认删除出版社id为"' + publisherIds + '"的数据项？').then(function() {
   return delPublisher(publisherIds);
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
