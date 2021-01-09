<template>
  <div ref="conBox" style="height: 100%">
    <div class="content-all">
      <div class="content-first">
        <el-select
          v-model="classifyId"
          placeholder="请选择分类"
          clearable
          filterable
          @change="classifyChange"
          style="float: left"
        >
          <el-option
            v-for="item in classificationOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>

        <el-input
          v-model.trim="content"
          suffix-icon="el-icon-search"
          placeholder="请输入编号或型号或封装"
          clearable
          @change="getDateList"
          style="width: auto; float: left; margin-left: 10px"
        ></el-input>

        <div class="button-div">
          <template v-if="!selectMater">
            <el-button
              class="del"
              size="small"
              type="success"
              @click="selectMater = true"
              >批量选择</el-button
            >
          </template>
          <template v-else>
            <el-button type="success" size="small" @click="selectMater = false"
              >取消</el-button
            >
          </template>

          <el-button
            @click="openDialog('order', null)"
            size="small"
            class="confirm"
            type="primary"
            >加入订单</el-button
          >
        </div>
      </div>

      <!-- 表格 -->
      <div class="material-table">
        <el-table
          :data="materielDate"
          :max-height="conHeight"
          border
          @selection-change="handleSelectionChange"
          :header-cell-style="{ 'background-color': '#e3e3e3' }"
        >
          <el-table-column
            v-if="selectMater"
            type="selection"
            width="55"
          ></el-table-column>
          <el-table-column prop="code" label="商品编号"></el-table-column>
          <el-table-column prop="name" label="商品名称(分类)"></el-table-column>
          <el-table-column prop="model" label="型号"></el-table-column>
          <el-table-column prop="potting" label="封装"></el-table-column>
          <el-table-column
            prop="factoryModel"
            label="厂家型号"
          ></el-table-column>
          <el-table-column prop="brand" label="品牌"></el-table-column>
          <el-table-column prop="price" label="单价(元)"></el-table-column>
          <el-table-column prop="quantity" label="库存数量"></el-table-column>
          <el-table-column prop="remarks" label="描述(规格)"></el-table-column>
          <el-table-column label="操作" width="125px">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                offset="-20"
                content="编辑"
                placement="top-start"
              >
                <el-button
                  icon="el-icon-edit"
                  size="mini"
                  class="confirm"
                  type="warning"
                  @click="openDialog('materielOpen', scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                offset="-20"
                content="删除"
                placement="top-start"
              >
                <el-button
                  icon="el-icon-delete"
                  size="mini"
                  class="del"
                  type="danger"
                  @click="openDialog('deleMateriel', scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="block" ref="pageBox" style="margin-top: 20px; float: right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50]"
          :page-size="currPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalMateriel"
        ></el-pagination>
      </div>
    </div>

    <!-- 弹窗 加入订单 -->
    <el-dialog
      :visible.sync="isDialogVisibleAddToCart"
      :close-on-click-modal="false"
      width="500px"
      :title="dialogTitleAddToCart"
      class="el-dialog__wrap"
    >
      <div class="radio-group">
        <el-radio-group v-model="orderType" @change="radioChange">
          <el-radio :label="1">入库订单</el-radio>
          <el-radio :label="2">出库订单</el-radio>
        </el-radio-group>
      </div>
      <div class="select-option">
        <el-select v-model="orderId" placeholder="请选择订单">
          <el-option
            v-for="item in orderArr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddToCart">确 定</el-button>
        <el-button @click="isDialogVisibleAddToCart = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 弹窗 物料详情 -->
    <el-dialog
      :visible.sync="isDialogMaterielDeatil"
      :close-on-click-modal="false"
      width="660px"
      title="编辑物料"
      class="detai-dialog"
    >
      <el-form
        :label-position="labelPosition"
        label-width="80px"
        :model="materielForm"
        :rules="materielRules"
        ref="materielForm"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="编码:" prop="code">
              <el-input readonly v-model="materielForm.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类:" prop="classifyId">
              <el-select
                v-model="materielForm.classifyId"
                placeholder="请选择分类"
              >
                <el-option
                  v-for="item in classificationOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="封装:" prop="potting">
              <el-input v-model="materielForm.potting"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="厂家型号:" prop="factoryModel">
              <el-input v-model="materielForm.factoryModel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="数量:" prop="quantity">
              <el-input v-model="materielForm.quantity"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号:" prop="model">
              <el-input v-model="materielForm.model"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="价格:" prop="price">
              <el-input v-model="materielForm.price"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商:" prop="supplier">
              <el-input v-model="materielForm.supplier"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="品牌:" prop="brand">
          <el-input v-model="materielForm.brand"></el-input>
        </el-form-item>

        <el-form-item label="网址:" prop="website">
          <el-input v-model="materielForm.website"></el-input>
        </el-form-item>

        <el-form-item label="描述:" prop="remarks">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="物料备注"
            v-model="materielForm.remarks"
          ></el-input>
        </el-form-item>
        <div style="text-align: right">
          <el-button type="primary" @click="modifyMateriel('materielForm')"
            >确 定</el-button
          >
          <el-button @click="isDialogMaterielDeatil = false">取 消</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- 删除弹窗 -->
    <el-dialog
      :visible.sync="isDialogDeleMateriel"
      :close-on-click-modal="false"
      width="500px"
      title="删除物料"
    >
      <div style="margin-bottom: 20px">
        <span
          >确定删除物料
          <span style="color: DarkOrange; font-size: 18px"
            >{{ materCode }} </span
          >吗？</span
        >
      </div>
      <div style="text-align: right">
        <el-button type="primary" @click="delMaterial()">确 定</el-button>
        <el-button @click="isDialogDeleMateriel = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    // 数值验证
    var checkNum = (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error("数值不能为空"));
      }
      if (parseFloat(value) != value) {
        callback(new Error("请输入数值"));
      } else {
        callback();
      }
    };
    return {
      dialogTitleAddToCart: "加入订单",
      classificationOptions: [], // 所有的器件类型数据集合
      isDialogVisibleAddToCart: false, // 加入订单对话框显示开关
      isDialogVisibleCreateCart: false, // 创建订单对话框显示开关
      isDialogDeleMateriel: false, //删除弹窗
      conHeight: 0,
      selectMater: false, // 是否处于批量选择物料状态
      classifyId: "", //分类id
      orderType: 1, //订单类型
      orderId: "", //订单id
      orderArr: [], //订单集合
      currentPage: 1,
      currPageSize: 10,
      totalMateriel: 0, //总量
      content: "", //搜索框内容
      //库存数组
      materielDate: [],
      isDialogMaterielDeatil: false, //物料详情弹窗
      labelPosition: "right",
      //物料表单
      materielForm: {
        classifyId: "", //分类id
        id: "", //id
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
      },
      materielIds: [], //物料id数组
      materCode: "", //物料编码
      //表单规则
      materielRules: {
        code: [{ required: true, message: "编码不能为空", trigger: "blur" }],
        classifyId: [
          { required: true, message: "分类不能为空", trigger: "blur" },
        ],
        quantity: [
          { required: true, message: "数量不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    watchSiteChange() {
      return 1;
    },
  },
  watch: {
    watchSiteChange() {},
  },
  mounted() {
    this.$nextTick(() => {
      this.conHeight = this.$refs.conBox.offsetHeight - 55 - 55 - 36;
    });
    window.addEventListener("resize", () => {
      this.$nextTick(() => {
        this.conHeight = this.$refs.conBox.offsetHeight - 120;
      });
    });
  },
  methods: {
    // 得到库存列表
    getDateList() {
      let param = {
        page: this.currentPage - 1,
        size: this.currPageSize,
        classifyId: this.classifyId,
        content: this.content,
      };
      this.$get("/materielLevel/pageList", param).then((res) => {
        if (res.code == 0) {
          this.totalMateriel = res.data.total;
          this.materielDate = res.data.materielLevels;
        }
      });
    },
    // 得到分类集合
    getClassifyList() {
      this.$get("/classify/findAll").then((res) => {
        if (res.code == 0) {
          for (let i = 0; i < res.data.length; i++) {
            let obj = {};
            obj.id = res.data[i].id;
            obj.name = res.data[i].name;
            this.classificationOptions.push(obj);
          }
        } else {
          this.classificationOptions = [];
        }
      });
    },
    // 下拉框改变触发
    classifyChange() {
      this.getDateList();
    },
    //当前页改变时触发
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDateList();
    },
    handleSizeChange(val) {
      this.currPageSize = val;
      this.currentPage = 1;
      this.getDateList();
    },
    // 打开弹窗
    openDialog(type, row) {
      switch (type) {
        case "order":
          this.orderType = 1;
          this.isDialogVisibleAddToCart = true;
          this.getOrderByType();
          break;
        case "materielOpen":
          this.isDialogMaterielDeatil = true;
          this.detailMeteriel(row.id);
          break;
        case "deleMateriel":
          this.isDialogDeleMateriel = true;
          this.materCode = row.code;
          break;
      }
    },
    //加入订单
    submitAddToCart() {
      if (this.materielIds.length == 0) {
        this.$message.error("请先选中至少一个物料才能加入订单!!!");
        return;
      }
      let data = {
        orderId: parseInt(this.orderId),
        materielIds: this.materielIds.join(","),
        type: parseInt(this.orderType),
      };
      this.$post("/materielRecords/putInOrder", data).then((res) => {
        if (res.code == 0) {
          this.$notify({
            title: "成功",
            message: "加入订单成功",
            type: "success",
          });
          this.isDialogVisibleAddToCart = false;
          this.selectMater = false;
          this.getDateList();
          this.materielIds = [];
        } else {
          this.$message.error(res.msg);
          this.selectMater = false;
          this.materielIds = [];
        }
      });
    },
    // 物料详情
    detailMeteriel(data) {
      let param = {
        id: data,
      };
      this.$get("/materielLevel/detail", param).then((res) => {
        if (res.code == 0) {
          this.materielForm = res.data;
        }
      });
    },
    //修改物料
    modifyMateriel(materielForm) {
      this.$refs[materielForm].validate((valid) => {
        if (valid) {
          if (isNaN(this.materielForm.quantity)) {
            this.$message.error("数量只能是数值类型")
            return
          }
          let data = {
            id:this.materielForm.id,
            code:this.materielForm.code,
            classifyId:this.materielForm.classifyId,
            potting:this.materielForm.potting,
            quantity:parseInt(this.materielForm.quantity),
            model:this.materielForm.model,
            brand:this.materielForm.brand,
            supplier:this.materielForm.supplier,
            website:this.materielForm.website,
            price:this.materielForm.price,
            remarks:this.materielForm.remarks,
            factoryModel:this.materielForm.factoryModel
          }
          this.$post("/materielLevel/modify", data).then((res) => {
            if (res.code == 0) {
              this.$notify({
                title: "成功",
                message: "修改成功",
                type: "success",
              });
              this.getDateList();
              this.isDialogMaterielDeatil = false;
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    //根据类型查询出库/入库订单
    getOrderByType() {
      let param = {
        type: this.orderType,
      };
      this.$get("/orderRecords/findByType", param).then((res) => {
        if (res.code == 0) {
          this.orderArr = res.data;
          if (res.data.length > 0) {
            this.orderId = res.data[0].id;
          }
        } else {
          this.orderArr = [];
        }
      });
    },
    //类型改变时
    radioChange() {
      this.getOrderByType();
    },
    //批量选择
    handleSelectionChange(val) {
      this.materielIds = [];
      for (let i = 0; i < val.length; i++) {
        this.materielIds.push(val[i].id);
      }
    },
    //删除物料
    delMaterial() {
      let param = { code: this.materCode };
      this.$get("/materielLevel/delete", param).then((res) => {
        if (res.code == 0) {
          this.$notify({
            title: "成功",
            message: "删除物料成功",
            type: "success",
          });
        } else {
          this.$message.error(res.msg);
        }
        this.isDialogDeleMateriel = false;
        this.materCode = "";
        this.getDateList();
      });
    },
  },
  created() {
    this.getClassifyList();
    this.getDateList();
  },
  beforeDestroy() {},
};
</script>

<style lang="less" scoped>
.content-all {
  height: 100%;
  overflow-y: auto;
  .material-table {
    margin-top: 20px;
  }
  .content-first {
    height: 45px;
  }
  .button-div {
    float: right;
  }
}
.el-dialog__wrap /deep/ .el-dialog__body {
  padding: 20px 0 0 0;
}

.detai-dialog /deep/ .el-select {
  display: inherit;
}

.detai-dialog /deep/ .el-dialog__body {
  padding: 30px 30px 20px 0;
}

.el-dialog__wrap {
  .radio-group {
    margin-bottom: 20px;
  }
  .select-option {
    margin-bottom: 10px;
  }
}
</style>
