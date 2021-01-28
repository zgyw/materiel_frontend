<template>
  <div>
    <div class="header-line">
      <!-- <el-button type="primary" style="float: right; margin-left: 10px" @click="openDialog">导入</el-button>
      <el-button type="primary" style="float: right; margin-left: 10px" @click="exportModel">导出模板</el-button>
      <p>&nbsp</p> -->
    </div>

    <div class="rule-form">
      <el-form
        :label-position="labelPosition"
        :model="materielForm"
        :rules="materielRules"
        :inline="false"
        ref="materielForm"
        label-width="auto"
        class="demo-ruleForm"
      >
        <div>
          <!-- <el-form-item
            label="所属订单"
            prop="orderId"
            class="inline-input-width"
          >
            <el-select v-model="materielForm.orderId" placeholder="请选择订单">
              <el-option
                v-for="item in orderArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item
            label="分类"
            prop="classifyId"
            class="inline-input-width"
          >
            <el-cascader
              v-model="valueDetail"
              placeholder="请选择分类"
              clearable
              filterable
              :show-all-levels="false"
              :options="classificationOptions"
              :props="{ expandTrigger: 'hover', label: 'name', value: 'id' }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="编码" prop="code" class="inline-input-width">
            <el-input v-model="materielForm.code"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="数量" prop="quantity" class="inline-input-width">
            <el-input v-model="materielForm.quantity"></el-input>
          </el-form-item>
          <el-form-item label="封装" prop="potting" class="inline-input-width">
            <el-input v-model="materielForm.potting"></el-input>
          </el-form-item>
        </div>

        <div>
          <el-form-item label="型号" prop="model" class="inline-input-width">
            <el-input v-model="materielForm.model"></el-input>
          </el-form-item>
          <el-form-item
            label="厂家型号"
            prop="factoryModel"
            class="inline-input-width"
          >
            <el-input v-model="materielForm.factoryModel"></el-input>
          </el-form-item>
        </div>

        <div>
          <el-form-item label="品牌" prop="brand" class="inline-input-width">
            <el-input v-model="materielForm.brand"></el-input>
          </el-form-item>
          <el-form-item
            label="价格"
            prop="price"
            class="inline-input-width"
            style="float: rigt"
          >
            <el-input v-model="materielForm.price"></el-input>
          </el-form-item>
        </div>
        <div style="display: inline-block">
          <div style="float: left">
            <el-form-item
              label="供应商"
              prop="supplier"
              class="inline-input-width"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 10 }"
                v-model="materielForm.supplier"
              ></el-input>
            </el-form-item>
            <div></div>
            <el-form-item
              label="描述(规格)"
              prop="remarks"
              class="inline-input-width"
            >
              <el-input
                type="textarea"
                v-model="materielForm.remarks"
                :autosize="{ minRows: 3, maxRows: 10 }"
              ></el-input>
            </el-form-item>
          </div>

          <div style="float: right">
            <div></div>
            <el-form-item label="图片" prop="photo" class="inline-input-width">
              <el-upload
                class="avatar-uploader"
                action
                :on-change="fileChange"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :auto-upload="false"
              >
                <img
                  v-if="imageUrl"
                  :src="imageUrl"
                  width="120"
                  height="120"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </div>
        </div>
        <div>
          <el-form-item
            label="备注"
            prop="note"
            class="inline-input-width"
            style="width: 920px"
          >
            <el-input
              type="textarea"
              v-model="materielForm.note"
              :autosize="{ minRows: 3, maxRows: 10 }"
            ></el-input>
          </el-form-item>
        </div>

        <div>
          <el-form-item class="inline-input-width">
            <el-button type="primary" @click="submitForm('materielForm')"
              >确定</el-button
            >
            <el-button @click="resetForm('materielForm')">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 上传文件 -->
    <el-dialog
      :visible.sync="isDialogImport"
      :close-on-click-modal="false"
      width="500px"
      title="上传文件"
      class="el-dialog__wrap"
    >
      <el-form :model="importForm" label-width="100px" class="form">
        <el-form-item label="选择文件" prop="file" style="position: relative">
          <el-upload
            action
            class="upload-demo"
            :on-change="fileChangeT"
            :show-file-list="false"
            :auto-upload="false"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          >
            <el-button
              slot="trigger"
              size="small"
              style="background-color: #dfe3e9"
              >选择</el-button
            >
          </el-upload>
          <span style="color: DarkOrange; font-size: 16px">{{
            importForm.file.name
          }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="importNewMaterial">确 定</el-button>
        <el-button @click="isDialogImport = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: "right",
      orderArr: [], //订单数组
      classificationOptions: [], //分类数组
      materielForm: {
        classifyId: "", //分类id
        code: "", //编码
        potting: "", //封装
        factoryModel: "", //厂家型号
        quantity: "", //数量
        model: "", //型号
        brand: "", //品牌
        supplier: "", //供应商
        website: "", //网址
        remarks: "", //备注
        price: "", //单价
        orderId: "", //订单id
        photo: "", //图片地址
      },
      materielRules: {
        code: [{ required: true, message: "编码不能为空", trigger: "blur" }],
        classifyId: [
          { required: true, message: "分类不能为空", trigger: "blur" },
        ],
        quantity: [
          { required: true, message: "数量不能为空", trigger: "blur" },
        ],
        orderId: [
          { required: true, message: "订单不能为空", trigger: "change" },
        ],
      },
      imageUrl: "", // 上传图片
      materielFile: "", //图片文件
      isDialogImport: false, //上传文件弹窗
      importForm: {
        file: "",
      },
      valueDetail: [],
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (isNaN(this.materielForm.quantity)) {
            this.$message.error("数量只能是数值类型");
            return;
          }
          if (this.valueDetail.length == 0) {
            this.$message.error("类别不能为空");
            return;
          }
          let data = {
            code: this.materielForm.code,
            classifyId: this.valueDetail[1],
            potting: this.materielForm.potting,
            quantity: parseInt(this.materielForm.quantity),
            model: this.materielForm.model,
            brand: this.materielForm.brand,
            supplier: this.materielForm.supplier,
            note: this.materielForm.note,
            price: this.materielForm.price,
            remarks: this.materielForm.remarks,
            factoryModel: this.materielForm.factoryModel,
            // orderId: this.materielForm.orderId,
          };
          const formDate = new FormData();
          if (this.materielFile) {
            formDate.append("file", this.materielFile);
          }
          for (let i in data) {
            formDate.append(i, data[i]);
          }
          this.$postForm("/materielLevel/putInWare", formDate).then((res) => {
            if (res.code == 0) {
              this.$notify({
                title: "成功",
                message: "新增物料成功",
                type: "success",
              });
              this.materielForm = {};
              this.materielForm.classifyId = this.classificationOptions[0].id;
              // this.materielForm.orderId = this.orderArr[0].id;
              this.imageUrl = "";
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.materielForm = {};
      this.materielForm.classifyId = this.classificationOptions[0].id;
      // this.materielForm.orderId = this.orderArr[0].id;
      this.imageUrl = "";
    },
    exportModel() {
      this.$getFile("/materielLevel/exportTemplate")
        .then((res) => {
          console.log(res);
          console.log(res.data);
          const link = document.createElement("a");
          const blob = new Blob([res.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
          });
          link.style.display = "none";
          link.href = window.URL.createObjectURL(blob);
          let fileName = window.decodeURI(
            res.headers["content-disposition"].match(/=(.*)$/)[1]
          );
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.$notify({
            title: "成功",
            message: "模板下载成功",
            type: "success",
          });
        })
        .catch((error) => {
          this.$message.error("模板下载失败");
        });
    },
    openDialog() {
      this.importForm.file = "";
      this.isDialogImport = true;
    },
    importNewMaterial() {
      if (!this.importForm.file) {
        this.$message.error("请选择文件之后再进行导入!!!");
        return;
      }
      const formDate = new FormData();
      formDate.append("file", this.importForm.file);
      this.$postForm("/materielLevel/importMateriel", formDate)
        .then((res) => {
          if (res.code == 0) {
            this.$notify({
              title: "成功",
              message: "导入文件成功",
              type: "success",
            });
            this.importForm.file = "";
            this.materielForm.classifyId = this.classificationOptions[0].id;
            // this.materielForm.orderId = this.orderArr[0].id;
            this.isDialogImport = false;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.$message.error("导入文件出错");
        });
    },
    beforeAvatarUpload(file) {
      console.log(file.size);
      const isLt2M = file.size / 1024 / 1024 / 10 < 2;
      if (!isLt2M) {
        this.$message.error("上传物料图片大小不能超过 200kb!");
      }
      return isLt2M;
    },
    fileChange(file) {
      console.log(file);
      this.materielFile = file.raw;
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    fileChangeT(file) {
      this.importForm.file = file.raw;
    },
    //获取所有入库订单
    // getInOrder() {
    //   let param = {
    //     type: 1,
    //   };
    //   this.orderArr = [];
    //   this.$get("/orderRecords/findByType", param).then((res) => {
    //     if (res.code == 0) {
    //       this.orderArr = res.data;
    //       if (res.data.length > 0) {
    //         this.materielForm.orderId = res.data[0].id;
    //       }
    //     }
    //   });
    // },
    // 得到分类集合
    getClassifyList() {
      this.classificationOptions = [];
      this.$get("/classify/findAll").then((res) => {
        if (res.code == 0) {
          for (let i = 0; i < res.data.length; i++) {
            let obj = {};
            obj.id = res.data[i].id;
            obj.name = res.data[i].name;
            obj.children = res.data[i].children;
            this.classificationOptions.push(obj);
          }
          if (res.data.length > 0) {
            this.materielForm.classifyId = res.data[0].id;
            if (res.data[0].children.length > 0) {
              let obj = [];
              obj.push(res.data[0].children[0].groupId);
              obj.push(res.data[0].children[0].id);
              this.valueDetail = obj;
            }
          }
        }
      });
    },
  },
  created() {
    this.getClassifyList();
  },
};
</script>

<style lang="less" scoped>
.header-line {
  padding: 5px;
  // border-bottom: 1px solid #8fc7ba;
  // margin-bottom: 5px;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  padding-top: 60px;
}
.rule-form {
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  // margin-top: 10px;
  padding-top: 10px;

  .inline-input-width {
    display: inline-block;
    width: 460px;
  }

  /deep/ .el-select {
    width: 100%;
  }

  /deep/ .el-cascader {
    width: 100%;
  }

  /deep/ .el-upload--text {
    float: left;
  }
}

.form {
  /deep/ .el-form-item__content {
    text-align: left;
    .upload-demo {
      text-align: left;
      float: left;
      width: 65px;
    }
  }
}
</style>
