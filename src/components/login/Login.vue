<template>
  <div class="login-wrapper">
    <div class="login-content">
      <div class="login-main">
        <h2 class="login-main-title">{{ language.title }}</h2>
        <el-form
          :model="dataForm"
          :rules="dataRule"
          ref="dataForm"
          @keyup.enter.native="dataFormSubmit()"
          status-icon
        >
          <el-form-item prop="userName">
            <el-input
              v-model="dataForm.userName"
              :placeholder="language.userName"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="dataForm.password"
              type="password"
              :placeholder="language.password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login-btn-submit"
              type="primary"
              @click="dataFormSubmit()"
              >{{ language.signIn }}</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { setToken } from "@/http/auth.js";
export default {
  data() {
    return {
      dataForm: {
        userName: "",
        password: "",
        language: "zh",
      },
      dataRule: {},
    };
  },
  computed: {
    // 国际化
    language() {
      return {
        title: this.$t("login.title"),
        userName: this.$t("login.userName"),
        password: this.$t("login.password"),
        language: this.$t("login.language"),
        zh: this.$t("language.zh"),
        en: this.$t("language.en"),
        signIn: this.$t("login.signIn"),
        userNameNotNull: this.$t("login.userNameNotNull"),
        passwordNotNull: this.$t("login.passwordNotNull"),
      };
    },
  },
  methods: {
    ...mapActions("user", ["updateName"]),
    ...mapActions("common", {
      updateLang: "updateLanguage",
      resetState: "resetState",
    }),
    // 提交表单
    dataFormSubmit() {
      let obj = {
        name: this.dataForm.userName,
        passWord: this.dataForm.password,
      };
      this.$post("/user/login", obj).then((res) => {
        if (res.code == 0) {
          this.updateName(res.data.realName);
          this.$router.push("home");
          this.$notify({
            title: "成功",
            message: "登录成功",
            type: "success",
          });
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 修改语言
    updateLanguage() {
      this.$i18n.locale = this.dataForm.language;
      this.updateLang(this.dataForm.language);
      this.dataRule = {
        userName: [
          {
            required: true,
            message: this.language.userNameNotNull,
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: this.language.passwordNotNull,
            trigger: "blur",
          },
        ],
      };
    },
  },
  created() {
    // 进入画面前，移除主页面保存的 state 信息
    localStorage.removeItem("store");
    this.resetState();
    // 登录页面，默认选择当前语言
    this.dataForm.language = this.$i18n.locale;
    this.dataRule = {
      userName: [
        {
          required: true,
          message: this.language.userNameNotNull,
          trigger: "blur",
        },
      ],
      password: [
        {
          required: true,
          message: this.language.passwordNotNull,
          trigger: "blur",
        },
      ],
    };
  },
};
</script>

<style>
.login-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  background-color: rgba(38, 50, 56, 0.6);
  background: url(~@/assets/login_bg.jpg) no-repeat;
  background-size: 100% 100%;
}

.login-content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  height: 350px;
  width: 400px;
  background-color: #112234;
  opacity: 0.8;
}

.login-main {
  color: beige;
  padding: 20px 20px 10px 20px;
}

.el-scrollbar__wrap {
  overflow-x: scroll !important;
}

.login-select {
  left: -120px;
  width: 120px;
}

.login-btn-submit {
  margin-top: 60px;
  font-size: 16px;
  width: 30%;
}
</style>
