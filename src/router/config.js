const routes = [
    {
        path: "/index",
        component: () => import('../views/home/Home.vue'),
    },
    {
        path: "/center",
        component: () => import('../views/center/Center.vue'),
    },
    {
        path: "/user-manage/addUser",
        component: () => import('../views/user-manage/addUser.vue'),
    },
    {
        path: "/user-manage/userList",
        component: () => import('../views/user-manage/userList.vue'),
    },
    {
        path: "/activity/activityList",
        component: () => import('@/views/activity/activityList.vue'),
    },
    {
        path: "/activity/addActivity",
        component: () => import('@/views/activity/addActivity.vue'),
    },
    {
        path: "/volunteer/selectVolunteerList",
        component: () => import('@/views/volunteer/selectVolunteerList.vue'),
    },
    {
        path: "/volunteer/finalVolunteerList",
        component: () => import('@/views/volunteer/finalVolunteerList.vue'),
    },
    {
        path: "/volunteer/volunteerAdd",
        component: () => import('@/views/volunteer/volunteerAdd.vue'),
    },
    {
        path: "/",
        redirect: '/index'
    },
    {
        path: "/:pathMatch(.*)*",
        name: "Notfound",
        component: () => import('@/views/notfound/NotFound.vue'),
    }
]

export default routes
