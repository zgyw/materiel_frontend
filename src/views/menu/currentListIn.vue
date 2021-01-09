<template>
  <div class="groups">
    <div class="content-main">
      <div class="left-con inner">
        <div class="btn-box">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-plus"
            @click="showDialog('add', 1)"
            >创建订单</el-button
          >
          <el-button
            type="warning"
            size="mini"
            v-show="selectedFno == 'group'"
            icon="el-icon-edit"
            @click="showDialog('edit')"
            :disabled="!isGroupSelect"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            v-show="selectedFno == 'group'"
            @click="showDialog('delete')"
            icon="el-icon-delete"
            :disabled="!isGroupSelect"
            >删除</el-button
          >
        </div>

        <div class="tree-box">
          <el-tree
            :data="orderList"
            ref="treeBox"
            node-key="id"
            :props="{ label: 'name' }"
            :check-on-click-node="true"
            :default-expanded-keys="checkDefault"
            :highlight-current="true"
            @node-click="nodeClick"
          >
            <div class="tree_item" slot-scope="{ node }">
              <span :title="node.label" class="has_ellipsis">{{
                node.label
              }}</span>
              <el-button
                icon="el-icon-circle-plus"
                class="confirm"
                type="text"
                @click="openDialog('putInWare')"
              ></el-button>
            </div>
          </el-tree>
        </div>
      </div>

      <div class="right-con inner">
        <div class="title-box">
          <el-input
            v-model.trim="content"
            prefix-icon="el-icon-search"
            @change="getMaterielList"
            size="mini"
            style="float: left; width: 200px; margin-left: 10px"
          ></el-input>
          <el-button
            class="save-btn"
            type="primary"
            size="mini"
            icon="el-icon-finished"
            :disabled="materielList.length == 0"
            @click="saveMaterielNum"
            >保存</el-button
          >
        </div>
        <div class="var-list" ref="conBox">
          <el-table
            class="table-style"
            size="mini"
            stripe
            :data="materielList"
           
            :max-height="conHeight"
            :header-cell-style="{ 'background-color': '#e3e3e3' }"
          >
            <el-table-column
              type="index"
              label="序号"
              width="50"
            ></el-table-column>
            <el-table-column property="code" label="物料编码"></el-table-column>
            <el-table-column property="name" label="物料名称"></el-table-column>
            <el-table-column property="potting" label="封装"></el-table-column>
            <el-table-column property="model" label="型号"></el-table-column>
            <el-table-column property="brand" label="品牌"></el-table-column>
            <el-table-column
              property="factoryModel"
              label="厂家型号"
            ></el-table-column>
            <el-table-column property="price" label="单价"></el-table-column>
            <el-table-column
              property="remarks"
              label="描述(规格)"
            ></el-table-column>
            <el-table-column
              property="quantity"
              label="库存数量"
            ></el-table-column>
            <el-table-column label="入库数量">
              <template slot-scope="scope">
                <el-input
                  size="mini"
                  v-model="scope.row.inNum"
                  @change="changeInNum(scope.row)"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="125px">
              <template slot-scope="scope">
                <el-tooltip
                  class="edit-tooltip"
                  effect="dark"
                  offset="-20"
                  content="详情"
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
      </div>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="addVisible" width="500px">
      <el-form ref="orderForm" :model="orderForm" label-width="120px">
        <el-form-item
          prop="name"
          label="订单名称:"
          :rules="[
            { required: true, message: '请输入订单名称', trigger: 'blur' },
          ]"
        >
          <el-input style="width: 80%" v-model.trim="orderForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="remarks" label="订单描述:">
          <el-input
            type="textarea"
            style="width: 80%"
            v-model.trim="orderForm.remarks"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="handleGroup">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="confirmVisible" width="370px">
      <div class="tips-con">
        确认删除&nbsp;
        <span style="color: DarkOrange; font-size: 18px"
          >{{ selectGroup.name }}&nbsp;</span
        >吗？
      </div>
      <div slot="footer">
        <el-button type="primary" @click="handleGroup">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 弹窗 物料详情 -->
    <el-dialog
      :visible.sync="isDialogMaterielDeatil"
      :close-on-click-modal="false"
      width="668px"
      title="编辑物料"
      class="detai-dialog"
    >
      <el-form
        :label-position="labelPosition"
        label-width="90px"
        :model="materielForm"
        ref="materielForm"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="编码:" prop="code">
              <el-input readonly v-model="materielForm.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称:" prop="name">
              <el-input readonly v-model="materielForm.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="封装:" prop="potting">
              <el-input readonly v-model="materielForm.potting"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="厂家型号:" prop="factoryModel">
              <el-input readonly v-model="materielForm.factoryModel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="价格:" prop="price">
              <el-input readonly v-model="materielForm.price"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号:" prop="model">
              <el-input readonly v-model="materielForm.model"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="库存数量:" prop="quantity">
              <el-input readonly v-model="materielForm.quantity"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :rules="[
                {
                  required: true,
                  message: '入库数量不能为空',
                  trigger: 'blur',
                },
              ]"
              label="入库数量:"
              prop="inNum"
            >
              <el-input v-model="materielForm.inNum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="描述:" prop="remarks">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="描述规格"
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

<!-- 订单入库 -->
    <el-dialog
      :visible.sync="putInWareDialog"
      :close-on-click-modal="false"
      width="500px"
      title="订单入库"
    >
      <div style="margin-bottom: 20px">
        <span
          >确定
          <span style="color: DarkOrange; font-size: 18px"
            >{{ selectGroup.name }}</span
          >入库吗？</span
        >
      </div>
      <div style="text-align: right">
        <el-button type="primary" @click="putInWareOrder()">确 定</el-button>
        <el-button @click="putInWareDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      labelPosition: "right",
      content: "",
      selectedFno: "group",
      conHeight: 0,
      orderList: [], //订单集合
      materielList: [], //物料集合
      addVisible: false,
      confirmVisible: false,
      isCheck: false,
      isEdit: false,
      selectGroup: {},
      isGroupSelect: false,
      dialogTitle: "",
      handleType: "",
      orderForm: {
        id: "", //订单id
        name: "", //订单名称
        remarks: "", //订单描述
      },
      checkDefault: [], //默认选中的节点id集合
      orderId: "", //选中的订单id
      inNums: [], //入库数量数组
      isDialogMaterielDeatil: false,
      isDialogDeleMateriel: false,
      putInWareDialog:false,
      //物料表单
      materielForm: {
        inNum: "",
        name: "", //名称
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
      materCode: "",
      materId: "",

      delIds: [],
      // 选中的变量
      selectedVariate: {},
      // 存储请求到的变量
      variatesList: {},
      // 父级分组id
      parentId: 0,
    };
  },
  computed: {},
  watch: {
    checkDefault: function (newVal, oldVal) {
      if (newVal) {
        this.$nextTick(() => {
          document.querySelector(".el-tree-node__content").click();
        });
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.conHeight = this.$refs.conBox.offsetHeight - 20;
    });
    window.addEventListener("resize", () => {
      this.$nextTick(() => {
        this.conHeight = this.$refs.conBox.offsetHeight - 20;
      });
    });
  },
  methods: {
    nodeClick(group) {
      this.orderId = group.id;
      this.selectGroup.id = group.id;
      this.selectGroup.name = group.name;
      this.selectGroup.remarks = group.remarks;
      this.isGroupSelect = true;
      this.getMaterielList();
      this.inNums = [];
    },
    //批量保存数量
    saveMaterielNum() {
      if (this.inNums.length == 0) {
        this.$message.error("入库数量没有改变不需要保存");
        return;
      }
      let data = {
        materielNums: JSON.stringify(this.inNums),
      };
      this.$post("/materielRecords/changeInNum", data)
        .then((res) => {
          console.log(res);
          if (res.code == 0) {
            this.$notify({
              title: "成功",
              message: "修改数量成功",
              type: "success",
            });
            this.inNums = [];
            this.getMaterielList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.$message.error("保存失败");
        });
    },
    // 显示dialog
    showDialog(type, option) {
      this.handleType = type;
      if (type == "add") {
        this.orderForm.id = "";
        this.orderForm.name = "";
        this.orderForm.remarks = "";
        this.dialogTitle = "创建订单";
        this.addVisible = true;
      } else if (type == "edit") {
        this.dialogTitle = "编辑订单";
        this.orderForm.id = this.selectGroup.id;
        this.orderForm.name = this.selectGroup.name;
        this.orderForm.remarks = this.selectGroup.remarks;
        this.addVisible = true;
      } else if (type == "delete") {
        this.confirmVisible = true;
      }
      this.$nextTick(() => {
        this.$refs.orderForm.clearValidate();
      });
    },
    closeDialog() {
      this.addVisible = false;
      this.confirmVisible = false;
      this.handleType = "";
    },
    // 操作分组
    handleGroup() {
      if (this.handleType == "add") {
        this.addOrder();
      } else if (this.handleType == "edit") {
        this.updateOrder();
      } else if (this.handleType == "delete") {
        this.deleteOrder();
      }
    },
    // 创建订单
    addOrder() {
      this.$refs.orderForm.validate((valid) => {
        if (valid) {
          let data = {
            name: this.orderForm.name,
            remarks: this.orderForm.remarks,
            type: 1,
          };
          this.$post("/orderRecords/saveOrder", data)
            .then((res) => {
              if (res.code == 0) {
                this.getOrderList();
                this.orderForm.id = "";
                this.orderForm.name = "";
                this.orderForm.remarks = "";
                this.closeDialog();
                this.$notify({
                  title: "成功",
                  message: "创建订单成功",
                  type: "success",
                });
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {
              this.$message.error("创建订单失败");
            });
        }
      });
    },
    // 修改订单
    updateOrder() {
      this.$refs.orderForm.validate((valid) => {
        if (valid) {
          let data = {
            id: this.orderForm.id,
            name: this.orderForm.name,
            remarks: this.orderForm.remarks,
            type: 1,
          };
          this.$post("/orderRecords/modifyOrder", data)
            .then((res) => {
              if (res.code == 0) {
                this.getOrderList();
                this.orderForm.id = "";
                this.orderForm.name = "";
                this.orderForm.remarks = "";
                this.closeDialog();
                this.$notify({
                  title: "成功",
                  message: "修改订单成功",
                  type: "success",
                });
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {
              this.$message.error("修改订单失败");
            });
        }
      });
    },
    // 删除订单
    deleteOrder() {
      if (!this.orderId) {
        return;
      }
      let param = {
        id: this.orderId,
      };
      this.$get("/orderRecords/delete", param).then((res) => {
        if (res.code == 0) {
          this.$notify({
            title: "成功",
            message: "删除订单成功",
            type: "success",
          });
          this.closeDialog();
          this.getOrderList();
          this.orderForm.id = "";
          this.orderForm.name = "";
          this.orderForm.remarks = "";
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //订单入库
    putInWareOrder(){
       if (!this.orderId) {
        return;
      }
      if (this.materielList.length == 0) {
        this.$message.error("订单下没有要入库的物料!!!");
        return
      }
      let param = {
        orderId: this.orderId,
      };
      this.$post("/orderRecords/putInWare",param).then(res => {
        if (res.code == 0) {
           this.$notify({
            title: "成功",
            message: "订单入库成功",
            type: "success",
          });
          this.putInWareDialog = false;
          this.orderId = ""
          this.getOrderList()
        } else{
          this.$message.error(res.msg);
        }
      }).catch(err => {
        this.$message.error("加入订单失败");
      })
    },
    // 查询订单列表
    getOrderList() {
      let param = {
        type: 1,
      };
      this.$get("/orderRecords/findByType", param).then((res) => {
        if (res.code == 0) {
          this.orderList = res.data;
          if (res.data.length > 0) {
            this.checkDefault.push(res.data[0].id);
          }
        }
      });
    },
    //查询订单明细物料集合
    getMaterielList() {
      if (!this.orderId) {
        return;
      }
      let param = {
        orderId: this.orderId,
        content: this.content,
        page: 0,
        size: 9999999,
      };
      this.$get("/materielRecords/findCurOrder", param).then((res) => {
        console.log(res);
        if (res.code == 0) {
          this.materielList = res.data.materielRecords;
        }
      });
    },
    //获取到入库数量集合
    changeInNum(row) {
      console.log(row);
      let records = {
        id: row.id,
        code: row.code,
        inNum: row.inNum,
      };
      for (let i = 0; i < this.inNums.length; i++) {
        const idd = this.inNums[i].id;
        if (row.id === idd) {
          this.inNums.splice(i, 1);
          break;
        }
      }
      this.inNums.push(records);
      console.log(this.inNums);
    },

    openDialog(type, row) {
      switch (type) {
        case "materielOpen":
          this.isDialogMaterielDeatil = true;
          this.detailMeteriel(row.id);
          break;
        case "deleMateriel":
          this.isDialogDeleMateriel = true;
          this.materCode = row.code;
          this.materId = row.id;
          break;
        case "putInWare":
          this.putInWareDialog = true;
          break;
      }
    },
    // 物料详情
    detailMeteriel(data) {
      let param = {
        id: data,
      };
      this.$get("/materielRecords/detail", param).then((res) => {
        if (res.code == 0) {
          this.materielForm = res.data;
        }
      });
    },
    //修改物料
    modifyMateriel(materielForm) {
      this.$refs[materielForm]
        .validate((valid) => {
          if (valid) {
            if (isNaN(this.materielForm.inNum)) {
              this.$message.error("入库数量只能是数值类型");
              return;
            }
            let data = {
              id: this.materielForm.id,
              remarks: this.materielForm.remarks,
              inNum: this.materielForm.inNum,
              name: this.materielForm.name,
              code: this.materielForm.code,
              potting: this.materielForm.potting,
              quantity: parseInt(this.materielForm.quantity),
              model: this.materielForm.model,
              brand: this.materielForm.brand,
              supplier: this.materielForm.supplier,
              website: this.materielForm.website,
              price: this.materielForm.price,
              remarks: this.materielForm.remarks,
              orderId: this.orderId,
              factoryModel: this.materielForm.factoryModel,
              type: 1,
            };
            this.$post("/materielRecords/modify", data).then((res) => {
              if (res.code == 0) {
                this.$notify({
                  title: "成功",
                  message: "修改成功",
                  type: "success",
                });
                this.getMaterielList();
                this.isDialogMaterielDeatil = false;
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        })
        .catch((err) => {
          this.$message.error("修改失败");
        });
    },
    //删除物料
    delMaterial() {
      let param = { id: this.materId };
      this.$get("/materielRecords/delete", param).then((res) => {
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
        this.materId = "";
        this.getMaterielList();
      });
    },
  },
  created() {
    this.getOrderList();
  },
};
</script>

<style lang="less" scoped>
@table-bgc: rgba(67, 92, 112); //表格背景色
@board-title: #54657d;
@table-border: #8fc7ba;

.groups {
  height: 100%;
  position: relative;
  .content-main {
    position: absolute;
    top: 10px;
    bottom: 0;
    left: 0;
    right: 0;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);

    .left-con {
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      width: 230px;
      height: 100%;

      position: absolute;
      top: 0;
      bottom: 10px;
      left: 0;
      right: 0;
      .btn-box {
        height: 2rem;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        padding: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-button--mini {
          padding-left: 5px !important;
          padding-right: 5px !important;
        }
      }
      .tree-box {
        text-align: left;
        position: absolute;
        left: 0;
        right: 0;
        top: 3rem;
        bottom: 0.5rem;
        overflow-y: auto;
      }
    }
    .right-con {
      height: 100%;
      position: absolute;
      top: 0;
      bottom: 10px;
      left: 240px;
      right: 0;
      .title-box {
        height: 2rem;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        padding: 0.5rem;
        border-bottom: 1px solid @table-border;
        line-height: 2rem;
      }
      .var-list {
        position: absolute;
        top: 3rem;
        left: 0;
        right: 0;
        bottom: 0.5rem;
        padding: 10px;
      }
    }
  }

  /deep/ .el-form-item__content {
    margin: 5px 5px;
    text-align: left;
  }
}
.el-tree /deep/ .el-tree-node__content {
  height: 2rem;
  font-size: 14px;
}

.tree_item {
  display: flex;
  width: 100%;
  align-items: center;
}
.el-input.is-disabled /deep/ .el-input__inner {
  background-color: #4e657a !important;
  border: none !important;
}

.var_info /deep/ .el-form-item__content {
  margin: 5px 5px;
  text-align: left;
}

.has_ellipsis {
  display: block;
  width: 100%;
  //   overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.table-style {
  padding: 1px 0;
}

// .edit-tooltip {
//   float: left;
// }

.save-btn {
  float: right;
}

.detai-dialog /deep/ .el-select {
  display: inherit;
}

.detai-dialog /deep/ .el-dialog__body {
  padding: 30px 30px 20px 0;
}

.confirm {
  padding-right: 15px;
}
</style>

