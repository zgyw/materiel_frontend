<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html,body,#app {
  font-family: Microsoft YaHei, "微软雅黑";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  position: absolute;
  overflow-y: hidden;
}

.el-select-dropdown__list {
  margin-bottom: 18px;
}

.el-dialog {
  border-radius: 8px;
}

.el-dialog__header {
  padding: 20px 10px 10px 10px;
  text-align: left;
  background-color: #dfe3e9;
  border-radius: 8px 8px 0 0;
}

.el-dialog__title {
  font-size: 16px;
}

/* // 图片样式 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 135px;
  height: 135px;
  display: block;
}

.avatar-uploader-icon{
  height: 135px;
  width: 135px;
  line-height: 135px;
}

.el-card__body {
  overflow-y: auto;
}

</style>
