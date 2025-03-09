import Home from '../views/home/Home.vue'
import Center from '../views/center/Center.vue'
import NotFound from '@/views/notfound/NotFound.vue'
import UserAdd from '../views/user-manage/addUser.vue'
import UserList from '../views/user-manage/userList.vue'

const routes = [
    {
        path: "/index",
        component: Home,
    },
    {
        path: "/center",
        component: Center,
    },
    {
        path: "/user-manage/addUser",
        component: UserAdd,
    },
    {
        path: "/user-manage/userList",
        component: UserList,
    },
    {
        path:"/",
        redirect:'/index'
    },
    {
        path:"/:pathMatch(.*)*",
        name:"Notfound",
        component:NotFound
    }
]

export default routes