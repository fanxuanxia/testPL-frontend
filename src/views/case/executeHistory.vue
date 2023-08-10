<template>
    <!-- <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading" @change="handleTableChange"> -->
    <a-table :columns="columns" :data-source="data">
        <template #bodyCell="{ column, text }">
            <template v-if="column.dataIndex === 'name'">{{ text.first }} {{ text.last }}</template>
        </template>
    </a-table>
</template>
<script setup>
import { computed, ref, defineComponent, onMounted, onUnmounted } from 'vue';
import { $executeHistory } from '@/api/case/caseListAPI';
import { useRoute } from 'vue-router';
const route = useRoute();

const data = ref(null);
const columns = [{
    title: '执行时间',
    dataIndex: 'executeTime',
    sorter: true,
    width: '20%',
},
{
    title: '执行人',
    dataIndex: 'executor',
    width: '20%',
}, {
    title: '请求头',
    dataIndex: 'requestHeaders',
    // filters: [{
    //     text: 'Male',
    //     value: 'male',
    // }, {
    //     text: 'Female',
    //     value: 'female',
    // }],
    width: '20%',
}, {
    title: '入参',
    dataIndex: 'requestBody',
},
{
    title: '响应',
    key: 'responseCode',
},
{
    title: '执行结果',
    dataIndex: 'executeResult',
}];
const param = route.query;

const fetchData = async () => {
    try {
        console.log('获取到的参数:', JSON.stringify(param));
        const response = await $executeHistory(param); // 调用封装的方法
        if (response.success) {
            data.value = response.data.executionHistoryRecord;
        } else {
            console.log("response: " + response)
            console.log("data:" + data)
        }
    } catch (error) {
        console.error(error);
    }
};
let timer = null;


// onMounted(fetchData);
onMounted(() => {
    fetchData;
    console.log("onMounted");
    timer = setInterval(async () => {
        console.log("调用1次");
        await fetchData();
    }, 60000)
});

onUnmounted(() => {
    clearInterval(timer)
    // clearTimeout(timer)
});

</script>