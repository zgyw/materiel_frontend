<template>
  <div class="header">
    <!-- 是否展开侧边栏 -->
    <div class="header-title" @click="foldOrOpen">
      <a
        class="el-icon-s-fold"
        v-if="foldAside"
        :title="language.foldAside"
        style="color: #f5a623"
      />
      <a
        class="el-icon-s-unfold"
        v-else
        :title="language.unFoldAside"
        style="color: #f5a623"
      />
    </div>

    <!-- 设置、文档、用户设置等 -->
    <div class="header-menu">
      <el-menu mode="horizontal" class="header-menu-submenu">
        <!-- 用户设置 -->
        <el-submenu :title="language.userSetUp" index="3">
          <template slot="title">
            <span class="header-span">{{ userName }}</span>
          </template>
          <el-menu-item
            index="3-1"
            @click="logout"
            style="background: #3B77E3; color: white"
          >
            <i class="el-icon-close" style="color: white"></i
            >{{ language.logOut }}
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <el-avatar
			  size="small" 
        icon="el-icon-user-solid"
			  style="float: right; margin-top: 12px; color:lightgreen;"
      ></el-avatar>
    </div>
    <!-- 设置框 -->
    <Setup v-if="setUpVisible" ref="setUp"></Setup>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Setup from "@/views/home/Setup.vue";
import { delCookie } from "@/util/cookie.js";

export default {
  name: "Header",
  data() {
    return {
      // 是否展开侧边栏
      foldAside: true,
      // 默认用户名
      // userName: 'admin',
      // 是否展开设置框
      setUpVisible: false,
    };
  },
  components: {
    // 引入设置框组件
    Setup,
  },
  computed: {
    // ...mapState('user', {userName: 'userName'}),
    ...mapState("user", ["userName"]),
    // 定义国际化显示
    language() {
      return {
        foldAside: this.$t("header.foldAside"),
        unFoldAside: this.$t("header.unFoldAside"),
        setUp: this.$t("header.setUp"),
        help: this.$t("header.help"),
        blogAddress: this.$t("header.blogAddress"),
        codeAddress: this.$t("header.codeAddress"),
        userSetUp: this.$t("header.userSetUp"),
        updatePassword: this.$t("header.updatePassword"),
        logOut: this.$t("header.logOut"),
      };
    },
  },
  methods: {
    // 展开、折叠侧边栏
    foldOrOpen() {
      this.foldAside = !this.foldAside;
      // this.$emit 用于触发父组件的方法，并传递参数值
      this.$emit("foldOrOpenAside", this.foldAside);
    },
    // 退出登录，回到登录界面
    logout() {
      this.$post("/user/logout", {}).then((res) => {
        if (res.code == 0) {
          delCookie("uuid");
          this.$router.push("/");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style lang="less" >
.header {
  padding: 0 10px;
  display: flex;
  height: 50px;
  line-height: 50px;
  /* background: #2c3e50; */
  background-color: #3B77E3;
}

.header-title {
  height: 50px;
  width: 50px;
  float: left;
  font-size: 40px;
  cursor: pointer;
}

.header-menu {
  height: 50px;
  width: 100%;
  flex: 1;
  line-height: 50px;
  font-size: 30px;
}

.header-menu-submenu {
  float: right;
  // background: #2c3e50;
   background-color: #3B77E3 !important;
}

.header-menu-submenu:hover {
  // background: #2c3e50;
   background-color: #3B77E3 !important;
}

.header-submenu-a {
  text-decoration: none;
  color: #4cc4b8;
  font-weight: bold;
  font-size: 16px;
}

.header-submenu-a:hover {
  // background-color: #2c3e50;
   background-color: #3B77E3 !important;
}

.el-menu--horizontal > .el-menu-item,
.el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 50px !important;
  line-height: 50px !important;
  background-color: #3B77E3 !important;
}

.el-menu--collapse .el-menu .el-submenu,
.el-menu--popup {
  min-width: auto !important;
  // background: #2c3e50 !important;
   background-color: #3B77E3 !important;
}

.header-span img {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin: 5px 10px 10px 10px;
  color: whitesmoke !important;
}

.header-span {
  font-size: 16px;
  color: whitesmoke !important;
}

.el-menu-item:hover{
  background-color: #3B77E3 !important;
}
</style>
