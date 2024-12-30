import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
//导入登录页面组件
import userLogin from '@/views/login.vue'
import admin from '@/views/AdminPage.vue'
import user from  '@/views/UserView.vue'
import DepartmentView from '@/views/DepartmentView.vue'
import UserDepartmentView from '@/views/UserDepartmentView'
Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    //添加登录页面路由
    {
      path:'/',
      name: 'userLogin',
      component: userLogin
    },
    {
      path:'/admin',
      name:'AdminPage',
      component:admin
      
    },
    {
      path:'/user',
      name:'UserView',
      component:user
    },
    {
      path:'/department',
      name:'DepartmentView',
      component:DepartmentView
    },
    {
      path:'/userDepartment',
      name:'UserDepartmentView',
      component:UserDepartmentView
    }
  ]
})

