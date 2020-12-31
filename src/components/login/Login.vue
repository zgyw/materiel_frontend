<template>
  <div class="login-wrap full-div">
    <div class="login-padding full-div">
      <div class="login-user">
        <el-form
          :model="loginForm"
          status-icon
          :rules="rules"
          ref="loginForm"
          label-width="100px"
          label-position="right"
          class="login-loginForm"
        >
          <el-form-item label="用户名" prop="name">
            <el-input v-model="loginForm.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input
              type="password"
              v-model="loginForm.pass"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="login('loginForm')"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        name: "",
        pass: "",
      },
      rules: {},
    };
  },
  methods: {
    login() {
      let obj = {
        name: this.loginForm.name,
        passWord: this.loginForm.pass,
      };
      this.$post("/user/login", obj).then((res) => {
        console.log(res);
      });
    },
  },
};
</script>

<style scoped>
.full-div {
  height: 100%;
}

.login-user {
  width: 30%;
  margin: auto;
  padding: 20%;
}
</style>
