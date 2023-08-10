import Vue from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('../views/login/login.vue'),
    },
    {
        path: '/testPL',
        name: 'testPL',
        component: () => import('../views/layout.vue'),
        //定义嵌套路由
        children: [
            {
                path: '/testPL/jiekou',
                name: 'jiekou',
                component: () => import('../views/jiekou/jiekou.vue'),
            },
            {
                path: '/testPL/qita',
                name: 'qita',
                component: () => import('../views/jiekou/qita.vue'),
            },
            {
                path: '/testPL/caseList',
                name: 'caseList',
                component: () => import('../views/case/caseList.vue'),
            },
            {
                path: '/testPL/caseList/executeHistory',
                name: 'executeHistory',
                component: () => import('../views/case/executeHistory.vue'),
            },
            {
                path: '/testPL/addCase',
                name: 'addCase',
                component: () => import('../views/case/addCase.vue'),
            },
            {
                path: '/testPL/testPlan',
                name: 'testPlan',
                component: () => import('../views/case/testPlan.vue'),
            },
        ]
    }
]


const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    // history: createWebHashHistory(),
    routes
})

export default router