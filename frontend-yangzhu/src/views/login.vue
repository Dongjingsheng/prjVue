<template>
  <div class="login-container">
    <el-card class="login-card">
      <h3 class="login-title">登录</h3>
      <el-form :model="loginForm" class="login-form">
        <el-form-item>
          <el-input v-model="loginForm.account" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item class="login-buttons">
          <el-button type="primary" @click="login" class="login-button">员工登录</el-button>
          <el-button @click="adminlogin" class="login-button admin-login-button">管理员登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import { Message } from 'element-ui';

export default {
  name: 'userLogin',
  data() {
    return {
      loginForm: {
        account: '',
        password: ''
      }
    };
  },
  methods: {
    login() {
      console.log('login method called');
      this.$axios
        .post('/login', {
          account: this.loginForm.account,
          password: this.loginForm.password
        })
        .then(successResponse => {
          console.log('response received:', successResponse);
          if (successResponse.data.code == 200) {
            Cookies.set('user', JSON.stringify({
              account: this.loginForm.account,
              password: this.loginForm.password
            }), { expires: 7 });
            Message.success('登录成功');
            this.$router.replace({ path: '/user' });
          } else {
            console.error('登录失败', successResponse.data);
            Message.error('登录未成功');
          }
        })
        .catch(error => {
          console.error('请求失败', error);
          Message.error('请求失败，请稍后重试');
        });
    },
    adminlogin() {
      console.log('admin login method called');
      this.$axios
        .post('/admin', {
          account: this.loginForm.account,
          password: this.loginForm.password
        })
        .then(successResponse => {
          console.log('response received:', successResponse);
          if (successResponse.data.code == 200) {
            Cookies.set('admin', JSON.stringify({
              account: this.loginForm.account,
              password: this.loginForm.password
            }), { expires: 7 });
            Message.success('登录成功');
            this.$router.replace({ path: '/admin' });
          } else {
            console.error('登录失败', successResponse.data);
            Message.error('登录未成功');
          }
        })
        .catch(error => {
          console.error('请求失败', error);
          Message.error('请求失败，请稍后重试');
        });
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* background-image: url('D:\\Vue\\yangzhu-vue\\src\\assets\\logo.png'); */
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.login-card {
  width: 400px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8); /* 半透明白色背景 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.login-buttons {
  display: flex;
  justify-content: space-between;
}

.login-button {
  flex: 1;
  margin: 0 5px;
}

.admin-login-button {
  background-color: purple;
  color: white;
}

.admin-login-button:hover {
  background-color: #800080;
  color: white;
}
</style>
