<template>
  <div>
    <el-container style="height: 700px; border: 1px solid #eee">
      <el-header style="font-size: 40px; background-color: rgb(238, 241, 246); display: flex; align-items: center;">
        <div style="flex: 1;"></div> <!-- 左侧占位 -->
        <div style="display: flex; justify-content: center;">
          <span v-if="adminInfo" style="margin: 0 20px;">账号: {{ adminInfo.account }}</span>
          <span v-if="adminInfo" style="margin: 0 20px;">姓名: {{ adminInfo.name }}</span>
        </div>
        <div style="flex: 1; display: flex; justify-content: flex-end;">
          <el-button type="info" @click="showUpdatePasswordDialog">修改密码</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside width="230px" style="border:1px solid #eee">
          <el-menu>

            <el-menu-item-group>
              <el-menu-item @click="reloadUsers">员工管理</el-menu-item>
              <el-menu-item @click="departmentsmannage">部门管理</el-menu-item>
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
              <el-button type="" @click="showAddUserDialog">添加</el-button>
            </el-form-item>
          </el-form>

          <el-table :data="tableData" border="">
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <!-- 性别 添加一个判断数字然后转化为字符串的计算属性 -->
            <el-table-column :label="'性别'" :formatter="formatGender"></el-table-column>

            <el-table-column prop="departmentName" label="部门"></el-table-column>
            <el-table-column prop="entryTime" label="入职时间" :formatter="formatDate"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" :formatter="formatDate"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" :formatter="formatDate"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" @click="showUpdateUserDialog(scope.row)" size="mini"
                  icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" @click="deleteUser(scope.row.id)" size="mini"
                  icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>


      </el-container>
    </el-container>

    <!-- Add User Dialog -->
    <el-dialog title="添加用户" :visible.sync="addUserDialogVisible" width="30%">
      <el-form :model="newUser">
        <el-form-item label="账号">
          <el-input v-model="newUser.account" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="newUser.password" type="password" show-password style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="newUser.name" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="newUser.gender" placeholder="性别">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="newUser.departmentId" placeholder="部门">
            <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addUser">确定</el-button>
      </div>
    </el-dialog>

    <!-- Edit User Dialog -->
    <el-dialog title="编辑用户" :visible.sync="editUserDialogVisible" width="30%">
      <el-form :model="editUser">
        <el-form-item label="姓名">
          <el-input v-model="editUser.name" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="editUser.gender" placeholder="性别">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="editUser.departmentId" placeholder="部门">
            <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateUser">确定</el-button>
      </div>
    </el-dialog>

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

  </div>
</template>
<script>
// import { Result } from 'element-ui';
import Cookies from 'js-cookie'
import qs from 'qs';

export default {
  name: 'AdminPage',
  data() {
    return {
      tableData: [],
      searchForm: {
        id: null,
        name: "",
        gender: null,
        departmentId: null

      },

      newUser: {
        name: "",
        gender: null,
        departmentId: null
      },
      editUser: {
        id: null,
        name: "",
        gender: null,
        departmentId: null
      },
      departments: [],
      addUserDialogVisible: false,
      editUserDialogVisible: false,
      updatePasswordDialogVisible: false,
      adminInfo: null,
      passwordForm: {
        newPassword: '',
        oldPassword: '',
        confirmPassword: ''
      }
    };
  },
  created() {
    // 在组件创建时从 Cookie 中获取管理员信息
    this.adminInfo = this.getAdminInfoFromCookie();
    this.getAdminInfo();
  },
  methods: {
    getAdminInfoFromCookie() {
      const adminInfoString = Cookies.get('admin');
      if (adminInfoString) {
        const adminInfo = JSON.parse(adminInfoString);
        return {
          account: adminInfo.account,
        };
      }
      return null;
    },
    getAdminInfo() {
      const adminAccount = this.adminInfo.account;

      this.$axios.get('/getAdminInfo', { params: { adminAccount } })
        .then(response => {
          console.log("Admin account sent successfully:", response.data.data);
          this.adminInfo.name = response.data.data;
          console.log(this.adminInfo.name);
        })
        .catch(error => {
          console.error('Error sending admin account:', error);
        })
    },
    updatePassword() {
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword || this.passwordForm.newPassword == "") {
        this.$message.error("两次输入的密码不一致");
        return;
      }

      const adminAccount = this.adminInfo.account;
      const formData = {
        account: adminAccount,
        oldPassword: this.passwordForm.oldPassword,
        newPassword: this.passwordForm.newPassword
      };

      this.$axios
        .post("/verifyOldPassword", formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          console.log("response.data: "+response.data);
          if (response.data.data === true) {
            
            return this.$axios.post("/updatePassword", formData, {
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
    departmentsmannage() {
      this.$router.replace({ path: '/department' })

        .catch(error => {
          console.error("Error reloading department list:", error);
          this.$message.error("加载部门列表失败，请稍后重试");
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

    showAddUserDialog() {
      this.newUser = { account: "", password: "", name: "", gender: "", departmentId: "" };
      this.addUserDialogVisible = true;
    },
    showUpdateUserDialog(user) {
      this.editUser = { ...user };
      if (this.editUser.gender === 1) {
        this.editUser.gender = "男";
      } else if (this.editUser.gender === 2) {
        this.editUser.gender = "女";
      }
      this.editUserDialogVisible = true;
    },
    showUpdatePasswordDialog() {
      this.passwordForm.oldPassword = '';
      this.passwordForm.newPassword = '';
      this.passwordForm.confirmPassword = '';
      this.updatePasswordDialogVisible = true;
    },
    addUser() {
      const Time = new Date(+new Date() + 8 * 3600 * 1000);
      const formData = {
        account: this.newUser.account || null,
        password: this.newUser.password || null,
        name: this.newUser.name || null,
        gender: this.newUser.gender || null,
        departmentId: this.newUser.departmentId || null,
        entryTime: new Date(Time).toISOString(),  // 假设为当前时间
        createTime: new Date(Time).toISOString(),
        updateTime: new Date(Time).toISOString()
      };
      this.$axios
        .post("/adduser", formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(() => {
          this.$message.success("用户添加成功");
          this.addUserDialogVisible = false;
          this.reloadUsers();
        })
        .catch((error) => {
          console.error("Error adding user:", error);
          this.$message.error("添加用户失败，请稍后重试");
        });
    },
    updateUser() {
      const Time = new Date(+new Date() + 8 * 3600 * 1000);
      let genderValue = null;
      if (this.editUser.gender == "男" || this.editUser.gender == 1) {
        genderValue = 1;
      } else if (this.editUser.gender == "女" || this.editUser.gender == 2) {
        genderValue = 2;
      }
      const formData = {
        id: this.editUser.id,
        name: this.editUser.name || null,
        gender: genderValue || null,
        departmentId: this.editUser.departmentId || null,
        updateTime: new Date(Time).toISOString()
        
      };
      this.$axios.put("/update", formData)
        .then(() => {
          this.$message.success("更新用户成功");
          this.editUserDialogVisible = false;
          this.reloadUsers();
        })
        .catch((error) => {
          console.error("Error updating user:", error);
          this.$message.error("更新用户失败，请稍后重试");
        });
    },

    deleteUser(id) {
      if (!id) {
        console.error("No ID provided for deletion.");
        return;
      }
      this.$axios.delete(`/${id}`)
        .then(() => {
          this.$message.success("删除成功");
          this.reloadUsers(); // 删除后重新加载用户列表
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          this.$message.error("删除失败，请稍后重试");
        });
    },

    formatDate(row, column) {
      const date = row[column.property];
      if (!date) return "";
      return new Date(date).toLocaleString("zh-CN", { hour12: false });
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
    this.fetchDepartments(); // 获取部门列表数据


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
