import Home from '../views/home/Home.vue'
import Center from '../views/center/Center.vue'
import NotFound from '@/views/notfound/NotFound.vue'
import UserAdd from '../views/user-manage/addUser.vue'
import UserList from '../views/user-manage/userList.vue'
import NewsAdd from '@/views/news-manage/NewsAdd.vue'
import NewsList from '@/views/news-manage/NewsList.vue'
import NewsEdit from '@/views/news-manage/NewsEdit.vue'
import ProductAdd from '@/views/product-manage/ProductAdd.vue'
import ProductList from '@/views/product-manage/ProductList.vue'
import ProductEdit from '@/views/product-manage/ProductEdit.vue'
import DailyNecessitiesAdd from '@/views/show-dailyNecessities/DailyNecessitiesAdd.vue'
import DailyNecessitiesList from '@/views/show-dailyNecessities/DailyNecessitiesList.vue'
import DailyNecessitiesEdit from '@/views/show-dailyNecessities/DailyNecessitiesEdit.vue'

import ActivityList from '@/views/activity/activityList.vue'


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
        path: "/news-manage/NewsAdd",
        component: NewsAdd,
    },
    {
        path: "/news-manage/NewsList",
        component: NewsList,
    },
    {
        path: "/news-manage/EditNews/:id",
        component: NewsEdit,
    },
    {
        path: "/product-manage/ProductAdd",
        component: ProductAdd,
    },
    {
        path: "/product-manage/ProductList",
        component: ProductList,
    },
    {
        path: "/product-manage/EditProduct/:id",
        component: ProductEdit,
    },
    {
        path: "/show-dailyNecessities/DailyNecessitiesAdd",
        component: DailyNecessitiesAdd,
    },
    {
        path: "/show-dailyNecessities/DailyNecessitiesList",
        component: DailyNecessitiesList,
        requireAdmin: true
    },
    {
        path: "/show-dailyNecessities/EditDailyNecessities/:id",
        component: DailyNecessitiesEdit,
        requireAdmin: true
    },
    {
        path:"/activityList",
        component:ActivityList
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