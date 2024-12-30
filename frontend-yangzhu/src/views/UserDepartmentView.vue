<template>
    <div>
        <el-container style="height: 700px; border: 1px solid #eee">

            <el-header
                style="font-size: 40px; background-color: rgb(238, 241, 246); display: flex; justify-content: center;align-items: center;">
                <div style="display: flex; justify-content: center;">
                    <span v-if="userInfo" style="margin: 0 20px;">账号: {{ userInfo.account }}</span>
                    <span v-if="userInfo" style="margin: 0 20px;">姓名: {{ userInfo.name }}</span>
                </div>
            </el-header>

            <el-container>
                <el-aside width="230px" style="border:1px solid #eee">
                    <el-menu>

                        <el-menu-item-group>
                            <el-menu-item @click="userPage">员工查询</el-menu-item>
                            <el-menu-item @click="reloadDepartments">部门查询</el-menu-item>
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
                        </el-form-item>
                    </el-form>


                    <el-table :data="tableData" border="">
                        <el-table-column prop="id" label="ID"></el-table-column>
                        <el-table-column prop="name" label="部门名称"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间" :formatter="formatDate"></el-table-column>
                        <el-table-column prop="updateTime" label="更新时间" :formatter="formatDate"></el-table-column>
                    </el-table>
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
            },
            userInfo: null,
        };
    },
    created() {
        // 在组件创建时从 Cookie 中获取管理员信息
        this.userInfo = this.getUserInfoFromCookie();
        this.getUserInfo();
    },
    methods: {

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
                    console.log("User account sent successfully:", response.data.data);
                    this.userInfo.name = response.data.data;
                    console.log(this.userInfo.name);
                })
                .catch(error => {
                    console.error('Error sending user account:', error);
                })
        },
        userPage() {
            this.$router.replace({ path: '/user' });
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