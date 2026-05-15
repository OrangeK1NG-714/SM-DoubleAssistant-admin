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
        requireAdmin: true,
        component: () => import('../views/user-manage/addUser.vue'),
    },
    {
        path: "/user-manage/userList",
        requireAdmin: true,
        component: () => import('../views/user-manage/userList.vue'),
    },
    {
        path: "/activity/activityList",
        requireAdmin: true,
        component: () => import('@/views/activity/activityList.vue'),
    },
    {
        path: "/activity/addActivity",
        requireAdmin: true,
        component: () => import('@/views/activity/addActivity.vue'),
    },
    {
        path: "/volunteer/selectVolunteerList",
        requireAdmin: true,
        component: () => import('@/views/volunteer/selectVolunteerList.vue'),
    },
    {
        path: "/volunteer/finalVolunteerList",
        requireAdmin: true,
        component: () => import('@/views/volunteer/finalVolunteerList.vue'),
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
