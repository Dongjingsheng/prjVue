<template>
  <div>
    <el-container style="height: 700px; border: 1px solid #eee">
     
      <el-header style="font-size: 40px; background-color: rgb(238, 241, 246); display: flex; align-items: center;">
        <div style="flex: 1;"></div> <!-- 左侧占位 -->
        <div style="display: flex; justify-content: center;">
          <span v-if="userInfo" style="margin: 0 20px;">账号: {{ userInfo.account }}</span>
          <span v-if="userInfo" style="margin: 0 20px;">姓名: {{ userInfo.name }}</span>
        </div>
        <div style="flex: 1; display: flex; justify-content: flex-end;">
          <el-button type="info" @click="showUpdatePasswordDialog">修改密码</el-button>
        </div>
      </el-header>
  

      <el-container>
        <el-aside width="230px" style="border:1px solid #eee">
          <el-menu>

            <el-menu-item-group>
              <el-menu-item @click="reloadUsers">员工查询</el-menu-item>
              <el-menu-item @click="reloadDepartments">部门查询</el-menu-item>
            </el-menu-item-group>

          </el-menu>
        </el-aside>


        <el-main>
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item label="id">
              <el-input v-model="searchForm.id" placeholder="id"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="searchForm.name" placeholder="姓名"></el-input>
            </el-form-item>

            <el-form-item label="性别">
              <el-select v-model="searchForm.gender" placeholder="性别">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="2"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="部门">
              <el-select v-model="searchForm.departmentId" placeholder="部门">
                <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" icon="el-icon-search"></el-button>
            </el-form-item>
          </el-form>

          <el-table :data="tableData" border="">
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <!-- 性别 添加一个判断数字然后转化为字符串的计算属性 -->
            <el-table-column :label="'性别'" :formatter="formatGender"></el-table-column>

            <el-table-column prop="departmentName" label="部门"></el-table-column>
            <el-table-column prop="entryTime" label="入职时间" :formatter="formatDate"></el-table-column>
          </el-table>

          <!-- 修改密码弹窗 -->
      <el-dialog title="修改密码" :visible.sync="updatePasswordDialogVisible">
        <el-form :model="passwordForm">
          <el-form-item label="旧密码">
            <el-input type="password" v-model="passwordForm.oldPassword"></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input type="password" v-model="passwordForm.newPassword"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码">
            <el-input type="password" v-model="passwordForm.confirmPassword"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updatePasswordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updatePassword">确定</el-button>
        </div>
      </el-dialog>
        </el-main>


      </el-container>
    </el-container>



  </div>
</template>
<script>
// import { Result } from 'element-ui';
import qs from 'qs';
import Cookies from 'js-cookie';
export default {
  data() {
    return {
      tableData: [],
      searchForm: {
        id: "",
        name: "",
        gender: "",
        departmentId: ""

      },

      newUser: {
        name: "",
        gender: "",
        departmentId: ""
      },
      editUser: {
        id: "",
        name: "",
        gender: "",
        departmentId: ""
      },
      departments: [],
      addUserDialogVisible: false,
      editUserDialogVisible: false,
      updatePasswordDialogVisible : false,
      userInfo : null,
      passwordForm: {
        newPassword: '',
        oldPassword: '',
        confirmPassword: ''
      }
    };
  },
  created(){
    this.userInfo = this.getUserInfoFromCookie();
    this.getUserInfo();
    this.fetchDepartments();
  },
  methods: {
    showUpdatePasswordDialog(){
      this.passwordForm.oldPassword = '';
      this.passwordForm.newPassword = '';
      this.passwordForm.confirmPassword = '';
      this.updatePasswordDialogVisible = true;
    },
    getUserInfoFromCookie() {
      const userInfoString = Cookies.get('user');
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        return {
          account: userInfo.account,
        };
      }
      return null;
    },
    getUserInfo() {
      const userAccount = this.userInfo.account;

      this.$axios.get('/getUserInfo', { params: { userAccount } })
        .then(response => {
          console.log("user account sent successfully:", response.data.data);
          this.userInfo.name = response.data.data;
          console.log(this.userInfo.name);
        })
        .catch(error => {
          console.error('Error sending user account:', error);
        })
    },
    updatePassword() {
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword || this.passwordForm.newPassword == '') {
        this.$message.error("两次输入的密码不一致");
        return;
      }

      const userAccount = this.userInfo.account;
      const formData = {
        account: userAccount,
        oldPassword: this.passwordForm.oldPassword,
        newPassword: this.passwordForm.newPassword
      };

      this.$axios
        .post("/verifyOldUserPassword", formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          console.log("response.data: "+response.data);
          if (response.data.data === true) {
            
            return this.$axios.post("/updateUserPassword", formData, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
          } else {
            throw new Error("旧密码验证失败");
          }
        })
        .then(() => {
          this.$message.success("密码修改成功");
          this.updatePasswordDialogVisible = false;
        })
        .catch((error) => {
          console.error("Error updating password:", error);
          this.$message.error("密码修改失败，请稍后重试");
        });
    },
    quitLogin() {
      localStorage.clear()
      window.sessionStorage.clear()
      this.$router.push('/')
    },
    onSubmit() {
      const formData = qs.stringify({     //qs 可以将数据转换为 x-www-*****模式
        id: this.searchForm.id || null,
        name: this.searchForm.name || null,
        gender: this.searchForm.gender || null,
        departmentId: this.searchForm.departmentId || null // 包含department_id字段
      })
      this.$axios
        .post("/search", formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then((result) => {
          this.tableData = result.data.data ? result.data.data : [];
        })
        .catch((error) => {
          console.error("Error fetching user list:", error);
          this.$message.error("获取用户列表失败，请稍后重试");
        });
    },

    reloadUsers() {
      console.log('Clicked reloadUsers')
      this.$axios.get("/userlist")
        .then((result) => {
          this.tableData = result.data.data;
          this.searchForm = [];
        })
        .catch(error => {
          console.error("Error reloading user list:", error);
          this.$message.error("重新加载用户列表失败，请稍后重试");
        });
    },

    fetchDepartments() {
      this.$axios.get("/departments")
        .then((result) => {
          this.departments = result.data.data || [];
        })
        .catch((error) => {
          console.error("Error fetching departments:", error);
          this.$message.error("获取部门列表失败，请稍后重试");
        });
    },


    formatDate(row, column) {
      const date = row[column.property];
      if (!date) return "";
      return new Date(date).toLocaleString("zh-CN", { hour12: false });
    },
    reloadDepartments() {
      this.$router.replace({ path: '/userDepartment' })

        .catch(error => {
          console.error("Error reloading department list:", error);
          this.$message.error("加载部门列表失败，请稍后重试");
        });
    },
  },

  computed: {
    formatGender() {
      return row => {
        if (row.gender == '1') {
          return '男';
        } else if (row.gender == '2') {
          return '女';
        } else {
          return '';
        }
      };
    }
  },
  mounted() {
    this.$axios.get("/userlist").then((result) => {
      this.tableData = result.data.data;
    });
    
  }
}
</script>

<style>
.el-header,
.el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 0px;
}

/* body>.el-container {
  margin-bottom: 40px;
} */

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
