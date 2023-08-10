<template>
    <a-layout>
        <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
            <div class="logo">接口测试平台</div>
            <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" mode="inline" theme="dark">
                <a-sub-menu key="sub1">
                    <template #icon>
                        <UngroupOutlined />
                    </template>
                    <template #title>接口调试</template>
                    <a-menu-item key="1" @click="$router.push('/testPL/jiekou')">http接口调试</a-menu-item>
                    <a-menu-item key="2" @click="$router.push('/testPL/qita')">其他接口调试</a-menu-item>
                </a-sub-menu>
                <a-sub-menu key="sub2">
                    <template #icon>
                        <MenuUnfoldOutlined />
                    </template>
                    <template #title>用例管理</template>
                    <a-menu-item key="3" @click="$router.push('/testPL/caseList')">用例列表</a-menu-item>
                    <a-menu-item key="4" @click="$router.push('/testPL/testPlan')">测试计划</a-menu-item>
                </a-sub-menu>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0">
                <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
                <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
            </a-layout-header>
            <a-layout-content :style="{ margin: '20px 12px', padding: '12px', background: '#fff', minHeight: '280px' }">
                <router-view></router-view>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup>
import {
    UngroupOutlined,
    UserOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined
} from '@ant-design/icons-vue';
import { ref } from 'vue';
//左侧菜单选中的key
let selectedKeys = ref(['1'])
//左侧展开的key
let openKeys = ref(['sub1', 'sub2'])
//是否折叠侧边栏
let collapsed = ref(false)
</script>



<style scoped>
.trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

.trigger:hover {
    color: #1890ff;
}

.logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.3);
    margin: 16px;
    color: white;
    text-align: center;
    line-height: 32px;
    font-size: 18px;

    overflow: hidden;

}

.site-layout .site-layout-background {
    background: #fff;
}
</style>