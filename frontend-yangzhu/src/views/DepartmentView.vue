<template>
  <div>
    <el-container style="height: 700px; border: 1px solid #eee">
      <el-header style="font-size:40px; background-color: rgb(238, 241, 246)">
        <div style="display: flex; justify-content: center;">
          <span v-if="adminInfo" style="margin: 0 20px;">账号: {{ adminInfo.account }}</span>
          <span v-if="adminInfo" style="margin: 0 20px;">姓名: {{ adminInfo.name }}</span>
        </div>
      </el-header>
      <el-container>
        <el-aside width="230px" style="border:1px solid #eee">
          <el-menu>

            <el-menu-item-group>
              <el-menu-item @click="adminPage">员工管理</el-menu-item>
              <el-menu-item @click="reloadDepartments">部门管理</el-menu-item>
            </el-menu-item-group>

          </el-menu>
        </el-aside>


        <el-main>
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item label="id">
              <el-input v-model="searchForm.id" placeholder="id"></el-input>
            </el-form-item>
            <el-form-item label="部门">
              <el-input v-model="searchForm.name" placeholder="部门名称"></el-input>
            </el-form-item>


            <el-form-item>
              <el-button type="primary" @click="onSubmit" icon="el-icon-search"></el-button>
              <el-button type="" @click="showAddDepartmentDialog">添加</el-button>
            </el-form-item>
          </el-form>

          <el-table :data="tableData" border="">
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="name" label="部门名称"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" :formatter="formatDate"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" :formatter="formatDate"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" @click="showUpdateDepartmentDialog(scope.row)" size="mini"
                  icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" @click="deleteDepartment(scope.row.id)" size="mini"
                  icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>


      </el-container>
    </el-container>

    <!-- Add Department Dialog -->
    <el-dialog title="添加部门" :visible.sync="addDepartmentDialogVisible" width="30%">
      <el-form :model="newDepartment">
        <el-form-item label="部门名称">
          <el-input v-model="newDepartment.name" style="width: 300px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDepartmentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addDepartment">确定</el-button>
      </div>
    </el-dialog>

    <!-- Edit Department Dialog -->
    <el-dialog title="编辑部门" :visible.sync="editDepartmentDialogVisible" width="30%">
      <el-form :model="editDepartment">
        <el-form-item label="姓名">
          <el-input v-model="editDepartment.name" style="width: 300px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDepartmentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateDepartment">确定</el-button>
      </div>
    </el-dialog>

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
      },

      editDepartment: {
        name: "",
      },

      newDepartment: {
        name: "",
      },
      addDepartmentDialogVisible: false,
      editDepartmentDialogVisible: false,
      adminInfo: null,
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
    adminPage() {
      this.$router.replace({ path: '/admin' });
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
      })
      this.$axios
        .post("/searchDepartment", formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then((result) => {
          this.tableData = result.data.data ? result.data.data : [];
        })
        .catch((error) => {
          console.error("Error fetching department list:", error);
          this.$message.error("获取部门列表失败，请稍后重试");
        });
    },

    reloadDepartments() {
      console.log('Clicked reloadDepartments')
      this.$axios.get("/departments")
        .then((result) => {
          this.tableData = result.data.data;
          this.searchForm = [];
        })
        .catch(error => {
          console.error("Error reloading department list:", error);
          this.$message.error("重新加载部门列表失败，请稍后重试");
        });
    },



    showAddDepartmentDialog() {
      this.editDepartment = { name: "" };
      this.addDepartmentDialogVisible = true;
    },
    showUpdateDepartmentDialog(department) {
      this.editDepartment = { ...department };
      this.editDepartmentDialogVisible = true;
    },



    addDepartment() {
      const Time = new Date(+new Date() + 8 * 3600 * 1000);
      const formData = {
        name: this.newDepartment.name,
        createTime: new Date(Time).toISOString(), //假设当前时间
        updateTime: new Date(Time).toISOString()
      };
      this.$axios
        .post("/addDepartment", formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(() => {
          this.$message.success("用户添加成功");
          this.addDepartmentDialogVisible = false;
          this.reloadDepartments();
        })
        .catch((error) => {
          console.error("Error adding department:", error);
          this.$message.error("添加用户失败，请稍后重试");
        });
    },
    updateDepartment() {
      const Time = new Date(+new Date() + 8 * 3600 * 1000);
      const formData = {
        id: this.editDepartment.id,
        name: this.editDepartment.name,
        updateTime: new Date(Time).toISOString()  // Assuming updateTime is set to current date/time
      };
      this.$axios.put("/updateDepartment", formData)
        .then(() => {
          this.$message.success("更新部门成功");
          this.editDepartmentDialogVisible = false;
          this.reloadDepartments();
        })
        .catch((error) => {
          console.error("Error updating department:", error);
          this.$message.error("更新部门失败，请稍后重试");
        });
    },

    deleteDepartment(id) {
      if (!id) {
        console.error("No ID provided for deletion.");
        return;
      }
      this.$axios.delete(`/dept/${id}`)
        .then(() => {
          this.$message.success("删除成功");
          this.reloadDepartments(); // 删除后重新加载部门列表
        })
        .catch((error) => {
          console.error("Error deleting department:", error);
          this.$message.error("删除失败，请稍后重试");
        });
    },

    formatDate(row, column) {
      const date = row[column.property];
      if (!date) return "";
      return new Date(date).toLocaleString("zh-CN", { hour12: false });
    },
  },

  mounted() {
    this.$axios.get("/departments").then((result) => {
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