<template>
  <div class="groups">
    <div class="content-main">
      <div class="left-con inner">
        <div class="btn-box">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-plus"
            @click="showDialog('add')"
            >新增大类</el-button
          >
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="showDialog('edit')"
            :disabled="!isGroupSelect"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="showDialog('delete')"
            icon="el-icon-delete"
            :disabled="!isGroupSelect"
            >删除</el-button
          >
        </div>

        <div class="tree-box">
          <el-tree
            :data="groupList"
            ref="treeBox"
            node-key="id"
            :props="{
              label: 'name',
            }"
            :default-expanded-keys="checkDefault"
            :check-on-click-node="true"
            :highlight-current="true"
            @node-click="nodeClick"
          >
            <div class="tree_item" slot-scope="{ node }">
              <i :class="{ 'el-icon-folder-opened': node.level == 1 }"></i>
              <span :title="node.label" class="has_ellipsis">{{
                node.label
              }}</span>
            </div>
          </el-tree>
        </div>
      </div>

      <div class="right-con inner">
        <div class="title-box">
          <div class="btn-box fr">
            <el-button
              type="success"
              size="mini"
              class="confirm"
              icon="el-icon-plus"
              :disabled="!selectGroup.id"
              @click="openDialog('add')"
              >添加子类</el-button
            >
          </div>
        </div>
        <div class="var-list" ref="conBox">
          <el-table
            :header-cell-style="{ 'background-color': '#e3e3e3' }"
            stripe
            :data="classifyList"
            border
            size="mini"
            :max-height="conHeight"
          >
            <el-table-column
              type="index"
              label="子类编号"
              width="100"
            ></el-table-column>
            <el-table-column prop="name" label="子类名称"></el-table-column>
            <el-table-column
              prop="remarks"
              label="子类描述"
              width
            ></el-table-column>
            <el-table-column label="操作" width="200">
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
                    type="warning"
                    @click="openDialog('edit', scope.row)"
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
                    @click="openDialog('delete', scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="addVisible" width="500px">
      <el-form
        ref="groupForm"
        :model="groupObj"
        label-width="120px"
        class="group-form"
      >
        <el-form-item
          prop="name"
          label="大类名称"
          :rules="[
            { required: true, message: '请输入大类名称', trigger: 'blur' },
          ]"
        >
          <el-input style="width: 80%" v-model.trim="groupObj.name"></el-input>
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
          >{{ selectGroup.name }} &nbsp;</span
        >吗？
      </div>
      <div slot="footer">
        <el-button type="primary" @click="handleGroup">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="addClassVisible"
      width="500px"
    >
      <el-form
        ref="classForm"
        :model="classForm"
        label-width="120px"
        class="group-form"
      >
        <el-form-item
          prop="name"
          label="子类名称"
          :rules="[
            { required: true, message: '请输入子类名称', trigger: 'blur' },
          ]"
        >
          <el-input style="width: 80%" v-model.trim="classForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="remarks" label="子类描述">
          <el-input
            type="textarea"
            style="width: 80%"
            v-model.trim="classForm.remarks"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="handleClassify">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </div>
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
          >确定删除子类
          <span style="color: DarkOrange; font-size: 18px"
            >{{ classifyName }} </span
          >吗？</span
        >
      </div>
      <div style="text-align: right">
        <el-button type="primary" @click="handleClassify">确 定</el-button>
        <el-button @click="isDialogDeleMateriel = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      conHeight: 0,
      checkDefault: [], //默认选中数组
      groupList: [], //大类集合
      classifyList: [], //子类集合
      addVisible: false,
      addClassVisible: false,
      confirmVisible: false,
      isDialogDeleMateriel: false,
      classifyName: "",
      isEdit: false,
      selectGroup: {},
      isGroupSelect: false,
      gatewayOptions: [],
      dialogTitle: "",
      equips: [],
      handleType: "",
      //大类表单
      groupObj: {
        id: "",
        name: "",
      },
      //子类表单
      classForm: {
        id: "",
        name: "",
        remarks: "",
      },
      type: "",
      groupId: "", //大类id
      // 选中的变量
      selectedVariate: {},
      // 存储请求到的变量
      variatesList: {},
      // 父级大类id
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
  created() {
    this.getGroup();
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
      this.selectGroup.id = group.id;
      this.selectGroup.name = group.name;
      this.isGroupSelect = true;
      this.groupId = group.id;
      this.getClassifyList();
    },
    // 改变编辑状态
    changeEdit(situ) {
      this.isEdit = situ;
      this.getDetail(this.selectGroup);
    },
    // 显示dialog
    showDialog(type) {
      this.handleType = type;
      if (type == "add") {
        this.dialogTitle = "新增大类";
        this.addVisible = true;
        this.groupObj.id = "";
        this.groupObj.name = "";
      } else if (type == "edit") {
        this.dialogTitle = "编辑大类";
        this.addVisible = true;
        this.groupObj.id = this.selectGroup.id;
        this.groupObj.name = this.selectGroup.name;
      } else if (type == "delete") {
        this.confirmVisible = true;
      }
      this.$nextTick(() => {
        this.$refs.groupForm.clearValidate();
      });
    },
    openDialog(type, row) {
      this.type = type;
      if (type == "add") {
        this.dialogTitle = "新增子类";
        this.addClassVisible = true;
        this.classForm.name = "";
        this.classForm.remarks = "";
      } else if (type == "edit") {
        this.dialogTitle = "修改子类";
        this.addClassVisible = true;
        this.classForm.id = row.id;
        this.classForm.name = row.name;
        this.classForm.remarks = row.remarks;
      } else if (type == "delete") {
        this.classForm.id = row.id;
        this.classifyName = row.name;
        this.isDialogDeleMateriel = true;
      }
    },
    // 操作子类
    handleClassify() {
      if (this.type == "add") {
        this.addClassify();
      } else if (this.type == "edit") {
        this.updateClassify();
      } else if (this.type == "delete") {
        this.deleteClassify();
      }
    },
    addClassify() {
      this.$refs.classForm.validate((valid) => {
        if (valid) {
          let data = {
            name: this.classForm.name,
            remarks: this.classForm.remarks,
            groupId: this.groupId,
          };
          this.$post("/classify/add", data)
            .then((res) => {
              if (res.code == 0) {
                this.$notify({
                  title: "成功",
                  message: "子类新增成功",
                  type: "success",
                });
                this.classForm.name = "";
                this.classForm.remarks = "";
                this.getClassifyList();
              } else {
                this.$notify.error(res.msg);
              }
            })
            .catch((err) => {
              this.$notify.error("子类新增失败");
            });
          this.closeDialog();
        }
      });
    },
    updateClassify() {
      this.$refs.classForm.validate((valid) => {
        if (valid) {
          let data = {
            id: this.classForm.id,
            name: this.classForm.name,
            remarks: this.classForm.remarks,
            groupId: this.groupId,
          };
          this.$post("/classify/modify", data)
            .then((res) => {
              if (res.code == 0) {
                this.$notify({
                  title: "成功",
                  message: "子类修改成功",
                  type: "success",
                });
                this.classForm.id = "";
                this.classForm.name = "";
                this.classForm.remarks = "";
                this.getClassifyList();
              } else {
                this.$notify.error(res.msg);
              }
            })
            .catch((err) => {
              this.$notify.error("子类修改失败");
            });
          this.closeDialog();
        }
      });
    },
    deleteClassify() {
      let param = {
        id: this.classForm.id,
      };
      this.$get("/classify/delete", param).then((res) => {
        if (res.code == 0) {
          this.$notify({
            title: "成功",
            message: "子类删除成功",
            type: "success",
          });
          this.getClassifyList();
        } else {
          this.$message.error(res.msg);
        }
      });
      this.classForm.id = "";
      this.classForm.name = "";
      this.classForm.remarks = "";
      this.classifyName = "";
      this.closeDialog();
    },
    closeDialog() {
      this.addVisible = false;
      this.confirmVisible = false;
      this.handleType = "";
      this.addClassVisible = false;
      this.isDialogDeleMateriel = false;
      this.type = "";
    },
    // 获取大类
    getGroup(flag) {
      this.$get("/group/findAll", {}).then((res) => {
        if (res.code == 0) {
          this.groupList = res.data;
          if (res.data.length > 0) {
            this.checkDefault.push(res.data[0].id);
            this.groupId = res.data[0].id;
          }
        }
      });
    },
    getClassifyList() {
      if (!this.groupId) {
        return;
      }
      let param = {
        id: this.groupId,
      };
      this.$get("/group/getClassify", param).then((res) => {
        if (res.code == 0) {
          this.classifyList = res.data;
        }
      });
    },
    // 操作大类
    handleGroup() {
      if (this.handleType == "add") {
        this.addGroup();
      } else if (this.handleType == "edit") {
        this.updateGroup();
      } else if (this.handleType == "delete") {
        this.deleteGroup();
      }
    },
    // 添加大类
    addGroup() {
      this.$refs.groupForm.validate((valid) => {
        if (valid) {
          let param = {
            name: this.groupObj.name,
          };
          this.$post("/group/add", param)
            .then((res) => {
              if (res.code == 0) {
                this.$notify({
                  title: "成功",
                  message: "大类新增成功",
                  type: "success",
                });
                this.groupObj.name = "";
                this.getGroup();
              } else {
                this.$notify.error(res.msg);
              }
            })
            .catch((err) => {
              this.$notify.error("新增大类失败");
            });
        }
        this.closeDialog();
      });
    },
    // 修改大类
    updateGroup() {
      if (!this.groupId) {
        return;
      }
      let param = {
        id: this.groupObj.id,
        name: this.groupObj.name,
      };
      this.$post("/group/modify", param)
        .then((res) => {
          if (res.code == 0) {
            this.$notify({
              title: "成功",
              message: "大类修改成功",
              type: "success",
            });
            this.groupObj.id = "";
            this.groupObj.name = "";
            this.getGroup();
            this.closeDialog();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.$notify.error("修改大类失败");
        });
    },
    // 删除大类
    deleteGroup() {
      if (!this.groupId) {
        return;
      }
      let param = {
        id: this.groupId,
      };
      this.$get("/group/delete", param)
        .then((res) => {
          if (res.code == 0) {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
            });
            this.groupObj.id = "";
            this.groupObj.name = "";
            this.getGroup();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.$notify.error("删除大类失败");
        });
      this.closeDialog();
    },

  },
};
</script>

<style lang="less" scoped>
@table-bgc: rgba(67, 92, 112); //表格背景色
@board-title: #54657d;
@table-border: #8fc7ba;

.groups {
  height: 95%;
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
        // border-bottom: 1px solid @table-border;
        line-height: 2rem;
      }
      .var-list {
        position: absolute;
        top: 3rem;
        left: 0;
        right: 0;
        bottom: 0.5rem;
        padding: 10px;
        .el-button--mini {
          // padding-left: 5px !important;
          // padding-right: 5px !important;
        }
      }
    }
  }
}
.el-tree /deep/ .el-tree-node__content {
  height: 2rem;
}

.tree_item {
  display: flex;
  width: 80%;
  align-items: center;
}
.el-input.is-disabled /deep/ .el-input__inner {
  background-color: #4e657a !important;
  border: none !important;
}

.var_info /deep/ .el-form-item__content {
  margin: 5px 5px;
}

.has_ellipsis {
  text-align: left;
  display: block;
  width: 100%;
  // overflow: hidden;
  white-space: nowrap;
  // text-overflow: ellipsis;
  padding-left: 5px;
}

.confirm {
  float: right;
}

.group-form /deep/ .el-form-item__content {
  text-align: left;
}
</style>

