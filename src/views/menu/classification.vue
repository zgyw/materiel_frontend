<template>
  <div class="groups">
    <div class="content-main">
      <div class="left-con inner">
        <div class="btn-box">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-plus"
            @click="showDialog('add',1)"
          >新增分组</el-button>
          <el-button
            type="warning"
            size="mini"
            v-show="selectedFno=='group'"
            icon="el-icon-edit"
            @click="showDialog('edit')"
            :disabled="!isGroupSelect"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            v-show="selectedFno=='group'"
            @click="showDialog('delete')"
            icon="el-icon-delete"
            :disabled="!isGroupSelect"
          >删除</el-button>
        </div>

        <div class="tree-box">
          <el-tree
            :data="groupList"
            ref="treeBox"
            node-key="id"
            :props="{label:'name',isLeaf:'leaf',children:'childrenClassify'}"
            :show-checkbox="isCheck"
            :check-on-click-node="true"
            :highlight-current="true"
            @node-click="nodeClick"
          >
            <div class="tree_item" slot-scope="{node}">
              <i :class="{'el-icon-folder-opened': node.level==1}"></i>
              <span :title="node.label" class="has_ellipsis">{{ node.label }}</span>
            </div>
          </el-tree>
        </div>
      </div>

      <div class="right-con inner">
        <div class="title-box" v-show="selectedFno=='group'">
          <div class="btn-box fr" v-show="!isEdit">
            <el-button
              type="warning"
              size="mini"
              class="confirm"
              icon="el-icon-edit"
              :disabled="!selectGroup.id"
              @click="changeEdit(true)"
            >编辑</el-button>
          </div>
          <div class="btn-box fr" v-show="isEdit">
            <el-button size="mini" type="primary" @click="saveVariate">保存</el-button>
            <el-button size="mini" @click="changeEdit(false)">取消</el-button>
          </div>
        </div>
        <div class="var-list" ref="conBox" v-show="selectedFno=='group'">
          <el-table stripe v-show="!isEdit" :data="varList" border :max-height="conHeight">
            <el-table-column prop="classifyId" label="分类编号"></el-table-column>
            <el-table-column prop="classifyName" label="分类名称"></el-table-column>
            <el-table-column prop="classifyDesc" label="分类描述" width></el-table-column>
          </el-table>
          <el-form
            :style="{'max-height':conHeight+'px','overflow-y':'auto'}"
            ref="variateForm"
            v-show="isEdit"
            label-width=".5rem"
          >
            <el-form-item v-for="(item,index) in varList" :key="item.id" style="margin-top:1rem">
              <el-select
                filterable
                :disabled="!isEdit"
                v-model="item.gatewayId"
                style="width:20%"
                placeholder="分类编号"
              >
                <el-option
                  v-for="gateway in gatewayOptions"
                  :key="gateway.gatewayId+''+item.id"
                  :label="gateway.name"
                  :value="gateway.gatewayId"
                ></el-option>
              </el-select>
              <el-select
                v-model="item.equipmentId"
                style="width:20%;margin-left:5px;"
                placeholder="分类名称"
                :disabled="!isEdit"
                @change="getAllVarByEquip(item,variatesList)"
                filterable
              >
                <el-option
                  v-for="equip in equips"
                  :key="equip.equipmentId+''+item.id"
                  :label="equip.name"
                  :value="equip.equipmentId"
                ></el-option>
              </el-select>
              <el-input
                :disabled="!isEdit"
                style="width:20%;margin-left:5px;"
                v-model="item.name"
                placeholder="分类描述"
              ></el-input>
              <el-button
                v-show="isEdit"
                size="mini"
                style="margin-left:10px;"
                type="danger"
                icon="el-icon-delete"
                @click="deleteVariate(index,item.id)"
              >删除</el-button>
            </el-form-item>
            <el-form-item label>
              <el-button
                v-show="isEdit"
                size="mini"
                type="success"
                style
                icon="el-icon-plus"
                @click="addVariate"
              >添加</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="addVisible" width="500px">
      <el-form ref="groupForm" :model="groupObj" label-width="120px">
        <el-form-item
          prop="name"
          label="分组名称："
          :rules="[{ required: true, message: '请输入分组名称', trigger: 'blur' }]"
        >
          <el-input style="width:80%;" v-model.trim="groupObj.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="handleGroup">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="confirmVisible" width="370px">
      <div class="tips-con">
        确认删除&nbsp;
        <mark>{{selectGroup.name}}&nbsp;</mark>吗？
      </div>
      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="handleGroup">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      selectedFno: "group",
      conHeight: 0,
      groupList: [{name: '电容', children: null}, {name: '电阻', children: null}, {name: 'mcu', children: null}, {name: '二极管', children: null}],
      varList: [{classifyId: '8', classifyName: '贴片电容', classifyDesc: '有好几种封装，例如：0402, 0603'},
                {classifyId: '1', classifyName: '钽电容', classifyDesc: '有好几种封装，例如：0402, 0603'},
                {classifyId: '4', classifyName: '陶瓷电容', classifyDesc: '有好几种封装，例如：0402, 0603'},
                {classifyId: '6', classifyName: '电解电容', classifyDesc: '有好几种封装，例如：0402, 0603'},
                {classifyId: '2', classifyName: '可调电容', classifyDesc: '有好几种封装，例如：0402, 0603'},
                {classifyId: '5', classifyName: '安规电容', classifyDesc: '有好几种封装，例如：0402, 0603'},
                {classifyId: '9', classifyName: '超级电容', classifyDesc: '有好几种封装，例如：0402, 0603'},
      ],
      addVisible: false,
      confirmVisible: false,
      isCheck: false,
      isEdit: false,
      selectGroup: {},
      isGroupSelect: false,
      gatewayOptions: [],
      dialogTitle: "新建分组",
      equips: [],
      handleType: "",
      groupObj: {
        name: "",
      },
      delIds: [],
      // 添加变量表达验证
      variateRules: {
        name: [{ required: true, message: "请输入变量名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入变量描述", trigger: "blur" }],
        gatewayId: [{ required: true, message: "请选择网关", trigger: "blur" }],
        equipmentId: [
          { required: true, message: "请选择设备", trigger: "change" },
        ],
      },
      // 选中的变量
      selectedVariate: {},
      // 存储请求到的变量
      variatesList: {},
      // 父级分组id
      parentId: 0,
    };
  },
  computed: {
    watchSiteChange() {
      return 1;
    },
  },
  watch: {
    watchSiteChange() {
      this.selectGroup = {};
      this.getGroup();
    },
  },
  created() {
    if (this.watchSiteChange) {
      this.getGroup();
    }
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
    // 获取设备下所有变量
    getAllVarByEquip(equip, variatesList) {
    },
    nodeClick(group) {
      this.isEdit = false;
    //   this.getDetail(group);
    //   console.log(group.name);
    //   console.log(group.$treeNodeId);
      console.log(group);
      this.selectGroup.id = group.$treeNodeId;
      this.selectGroup.name = group.name;
      group.show = !group.show;
      this.selectedFno = "group";
      this.isGroupSelect = true;
    },
    // 获取变量详情
    getDetail(group) {
      group.show = !group.show;
      this.selectedFno = "group";
      this.selectGroup = group || {};
      if (!group) {
        this.varList = [];
        return;
      }
      this.$http
        .get("equipment/switchClassify/detail", { params: { id: group.id } })
        .then((res) => {
          if (res.data.code == 0) {
            this.varList = res.data.data;
            if (this.isEdit) {
              this.varList.forEach((element) => {
                this.getAllVarByEquip(element, this.variatesList);
              });
            }
          }
        });
    },
    // 选择变量
    selectCode(index) {
      this.varList[index].name = this.varList[index].children.find((el) => {
        return el.code == this.varList[index].code;
      }).name;
    },
    // 改变编辑状态
    changeEdit(situ) {
      this.isEdit = situ;
      this.getDetail(this.selectGroup);
    },
    // 保存变量
    saveVariate() {
    },
    // 显示dialog
    showDialog(type, option) {
      this.handleType = type;
      if (type == "add") {
        this.dialogTitle = "新建分组";
        this.addVisible = true;
        this.groupObj.id = "";
        this.groupObj.name = "";
        if (option == 1) {
          this.parentId = 0;
        } else if (option == 2) {
          this.parentId = this.selectGroup.id;
        }
      } else if (type == "edit") {
        this.dialogTitle = "编辑分组";
        this.addVisible = true;
        this.groupObj.id = this.selectGroup.id;
        this.groupObj.name = this.selectGroup.name;
      } else if (type == "delete") {
        this.confirmVisible = true;
      }
      this.$nextTick(() => {
        // this.$refs.groupForm.clearValidate();
      });
    },
    closeDialog() {
      this.addVisible = false;
      this.confirmVisible = false;
      this.handleType = "";
    },
    // 获取分组
    getGroup(flag) {
    },
    // 操作分组
    handleGroup() {
      if (this.handleType == "add") {
        this.addGroup();
      } else if (this.handleType == "edit") {
        this.updateGroup();
      } else if (this.handleType == "delete") {
        this.deleteGroup();
      }
    },
    // 添加分组
    addGroup() {
        this.$refs.groupForm.validate((valid) => {
        if (valid) {
            var newClassify = {name: '目录名', children: null};
            newClassify.name = this.groupObj.name;
            this.$set(this.groupList, this.groupList.length, newClassify);
        }
        this.closeDialog();
      });
    },
    // 修改分组
    updateGroup() {
        if (this.groupObj.id > 0 && this.groupObj.id <= this.groupList.length) {
            this.groupList[this.groupObj.id - 1].name = this.groupObj.name;
            this.selectGroup.id = this.groupObj.id;
            this.selectGroup.name = this.groupObj.name;
        }
        this.closeDialog();
    },
    // 删除分组
    deleteGroup() {
        // console.log("删除操作");
        // console.log(this.selectGroup);
        // console.log(this.groupList);
      if (this.selectGroup.id > 0 && this.selectGroup.id <= this.groupList.length) {
            this.groupList.splice(this.selectGroup.id - 1, 1);
        }
        this.closeDialog();
        // console.log(this.groupList);
    },
    // 添加变量填写框
    addVariate() {
      this.varList.push({
        name: "",
        classifyId: this.selectGroup.id,
        gatewayId: "",
        equipmentId: "",
        site: this.watchSiteChange,
      });
    },
    // 记录删除变量
    deleteVariate(index, id) {
        console.log("delete index = " + index + " id = " + id);
    },
  },
};
</script>

<style lang="less" scoped>

@table-bgc: rgba(67, 92, 112); //表格背景色
@board-title: #54657D;
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
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);

    .left-con {
      box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
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
        .el-button--mini {
          padding-left: 5px !important;
          padding-right: 5px !important;
        }
      }
    }
  }
}
.el-tree /deep/ .el-tree-node__content {
  height: 2rem;
}
// .el-tree /deep/ .is-current > .el-tree-node__content {
//   background: #5b708b !important;
// }

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

.has_ellipsis{
  display:block;
  width:100%;
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-left:5px;
}

</style>

