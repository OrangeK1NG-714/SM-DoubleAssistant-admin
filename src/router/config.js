import Home from '../views/home/Home.vue'
import Center from '../views/center/Center.vue'
import NotFound from '@/views/notfound/NotFound.vue'
import UserAdd from '../views/user-manage/addUser.vue'
import UserList from '../views/user-manage/userList.vue'
import ActivityList from '@/views/activity/activityList.vue'
import addActivity from '@/views/activity/addActivity.vue'

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
    // {
    //     path: "/show-dailyNecessities/EditDailyNecessities/:id",
    //     component: DailyNecessitiesEdit,
    //     requireAdmin: true
    // },
    {
        path:"/activity/activityList",
        component:ActivityList
    },
    {
        path:"/activity/addActivity",
        component:addActivity
    },
    {
        path: "/",
        redirect: '/index'
    },
    {
        path: "/:pathMatch(.*)*",
        name: "Notfound",
        component: NotFound
    }
]

export default routes