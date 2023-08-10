<template>
    <a-button type="primary" @click="$router.push('/testPL/addCase')">添加用例</a-button>
    <a-table :columns="columns" :data-source="data" :scroll="{ x: 1000, y: 300 }">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'operation'">
                <a @click="onExecute(record)">执行 </a>
                <a @click="onDetailClick(record)">执行记录 </a>
                <br />
                <a @click="onModify(record)">修改 </a>
                <a @click="onDelete(record)">删除 </a>
            </template>
        </template>
    </a-table>
</template>

<script setup>
import { defineComponent, ref, onMounted, } from 'vue';
import { $caseListAPI, $deleteCase, $executeCase } from '@/api/case/caseListAPI';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

const router = useRouter();
const data = ref(null);
const columns = [
    {
        title: '用例编号',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '用例名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '接口',
        dataIndex: 'relativeApi',
        key: 'relativeApi',
    },
    {
        title: '用例描述',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: '用例状态',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Action',
        key: 'operation',
    }
];
const getAllCaseList = async () => {
    try {
        const response = await $caseListAPI(); // 调用封装的方法
        if (response.success) {
            data.value = response.data;
        } else {
            console.log("response: " + response)
            console.log("data:" + data)
        }
    } catch (error) {
        console.error(error);
    }
};
onMounted(getAllCaseList);
const onDetailClick = (record) => {
    console.log("selectchange:record:" + JSON.stringify(record));

    // 获取对应行的 id 字段
    const id = record.id;
    // 使用路由导航到 执行历史 组件并传递 id 参数
    console.log("id = " + id);

    router.push({
        name: "executeHistory", // ⚠️注：这里不能用path路径，只能用name【请对照router.js中的路由规则中的name项】，否则取不到传过去的数据
        query: {
            id: id
        }

    })
    console.log("onDetailClick Finished");
}


const onModify = async (record) => {
    router.push({
        name: "addCase",
    })
}

const onExecute = async (record) => {
    let caseId = record.id;
    let param = {
        "id": caseId
    }
    const response = await $executeCase(param);
    console.log(JSON.stringify(response))
}


const onDelete = async (record) => {
    console.log("执行删除用例")
    let param = { "id": record.id };
    console.log("param：" + JSON.stringify(param))
    const response = await $deleteCase(param);
    console.log("response.Success: " + response.success)
    if (response.success === true) {
        message.success("删除成功")
        setTimeout(() => {
            message.destroy();
        }, 2000);
    }
    getAllCaseList();
}

</script>