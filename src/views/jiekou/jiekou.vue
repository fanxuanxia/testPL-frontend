<template>
    <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
        <a-form-item label="接口名称：" v-bind="validateInfos.name" :required="true">
            <a-input v-model:value="modelRef.name" />
        </a-form-item>
        <a-form-item label="请求：" v-bind="validateInfos.baseurl" :required="true">
            <a-input-group compact>
                <a-select v-model:value="modelRef.method" style="width: 100px">
                    <a-select-option value="GET">GET</a-select-option>
                    <a-select-option value="POST">POST</a-select-option>
                    <a-select-option value="PUT">PUT</a-select-option>
                    <a-select-option value="DELETE">DELETE</a-select-option>
                </a-select>
                <a-auto-complete v-model:value="modelRef.domain" style="width:150px" placeholder="域名" />
                <a-auto-complete v-model:value="modelRef.url" style="width:340px" placeholder="路径" />
            </a-input-group>
        </a-form-item>
        <a-form-item label="接口描述：">
            <a-textarea v-model:value="modelRef.desc" :auto-size="{ minRows: 2, maxRows: 5 }"></a-textarea>
        </a-form-item>
        <a-form-item label="请求参数：">
            <br />
            <a-tabs class="tab" v-model:activeKey="modelRef.activeKey" size="default" style="height: 250px">
                <a-tab-pane key="1" tab="request header">
                    <a-form ref="formRef" name="dynamic_form_nest_item" :model="dynamicValidateForm" @finish="onFinish">
                        <a-space v-for="(header, index) in dynamicValidateForm.headers" :key="header.id"
                            style="display: flex; margin-bottom: 8px" align="baseline">
                            <a-form-item :name="['headers', index, 'first']" :rules="{
                                required: true,
                                message: '请输入key',
                            }">
                                <a-input v-model:value="header.first" placeholder="key" />
                            </a-form-item>
                            <a-form-item :name="['headers', index, 'last']" :rules="{
                                required: true,
                                message: '请输入value',
                            }">
                                <a-input v-model:value="header.last" placeholder="value" />
                            </a-form-item>
                            <MinusCircleOutlined @click="removeHeader(header)" />
                        </a-space>
                        <a-form-item>
                            <a-button type="dashed" block @click="addHeader">
                                <PlusOutlined />
                                add Request Headers
                            </a-button>
                        </a-form-item>
                        <!-- <a-form-item>
                            <a-button type="primary" html-type="submit">Submit</a-button>
                        </a-form-item> -->
                    </a-form>
                </a-tab-pane>
                <!-- <a-tab-pane key="2" tab="query">Content of Tab Pane 1</a-tab-pane> -->
                <a-tab-pane key="3" tab="request body" force-render>
                    <vue-json-editor v-model="jsonData" :showBtns="false" :mode="'code'" lang="zh" :expandedOnStart="true"
                        @json-change="onJsonChange" @json-save="onJsonSave" style="height: inherit;">
                    </vue-json-editor>
                </a-tab-pane>

                <a-tab-pane key="4" tab="前置操作" force-render>Content of Tab Pane 2</a-tab-pane>
                <a-tab-pane key="5" tab="响应头" force-render>Content of Tab Pane 3</a-tab-pane>
                <a-tab-pane key="6" tab="响应体" force-render>Content of Tab Pane 3</a-tab-pane>
                <a-tab-pane key="7" tab="后置操作" force-render>Content of Tab Pane 3</a-tab-pane>
            </a-tabs>
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="onSubmit">发起调用</a-button>
            <a-button type="primary" @click="onSaveApi" style="margin-left: 10px">保存接口</a-button>
            <a-button type="primary" style="margin-left: 10px" @click="resetFields">重置</a-button>

        </a-form-item>
    </a-form>
</template>

<script setup>
import { defineComponent, reactive, toRaw, ref } from 'vue';
import { Form, message } from 'ant-design-vue';
import { MinusCircleOutlined } from "@ant-design/icons-vue";
import { $debugApi, $saveApiInfo } from '@/api/case/debugApi';
const useForm = Form.useForm;
import vueJsonEditor from 'vue-json-editor';

let jsonData = {};

const modelRef = reactive({
    name: '',
    method: 'GET',
    domain: undefined,
    url: undefined,
    desc: undefined,
    activeKey: '1',
});


const rulesRef = reactive({
    name: [
        {
            required: false,
            message: '请输入接口名称',
            trigger: 'blur',
        },
    ],
    domain: [
        {
            required: true,
            message: '请输入域名',
        },
    ],
    url: [
        {
            required: true,
            message: '请输入接口路径',
        },
    ],
});
const {
    resetFields,
    validate,
    validateInfos,
} = useForm(modelRef, rulesRef, {
    onValidate: (...args) => console.log(...args),
});

const onJsonChange = (value) => {
    // console.log("onJsonChange");
    // console.log("change---jsonData :" + JSON.stringify(jsonData));
    // console.log("change---value :" + JSON.stringify(value));
    onJsonSave(value)
};
const onJsonSave = (value) => {
    // console.log("onJsonSave");
    jsonData = value;
    console.log("save----jsonData :" + JSON.stringify(jsonData));
    console.log("save----value :" + JSON.stringify(value));
};
//submit all params
const onSubmit = async () => {
    let headers = dynamicValidateForm.headers;

    validate().then(() => {
        console.log(toRaw(modelRef));
    }).catch(err => {
        console.log('error', err);
    });

    const convertMap = new Map();
    for (let i = 0; i < headers.length; i++) {
        const { first, last } = headers[i];
        console.log("first:" + first);
        console.log("last:" + last);
        convertMap.set(first, last);
    }
    let headersObject = {};
    for (const [key, value] of convertMap) {
        headersObject[key] = value;
    }

    let params = {
        domain: modelRef.domain,
        path: modelRef.url,
        method: modelRef.method,
        timeout: "5000",
        headers: headersObject,
        requestBody: JSON.stringify(jsonData)
    };

    let response = await $debugApi(params);
    console.log("调用接口完成，响应：" + JSON.stringify(response))


}

const onSaveApi = async () => {
    console.log("开始保存接口信息")
    validate().then(() => {
        console.log(toRaw(modelRef));
    }).catch(err => {
        console.log('error', err);
    });
    const convertMap = new Map();
    for (let i = 0; i < dynamicValidateForm.headers.length; i++) {
        const { first, last } = dynamicValidateForm.headers[i];
        console.log("first:" + first);
        console.log("last:" + last);
        convertMap.set(first, last);
    }
    let headersObject = {};
    for (const [key, value] of convertMap) {
        headersObject[key] = value;
    }

    let params = {
        name: modelRef.name,
        domain: modelRef.domain,
        url: modelRef.url,
        method: modelRef.method,
        timeout: "5000",
        headers: JSON.stringify(headersObject),
        requestBody: JSON.stringify(jsonData)
    };

    let response = await $saveApiInfo(params);
    console.log("调用接口完成，响应：" + JSON.stringify(response))
    if (response.success === true && response.data.result !== -1) {
        message.success("接口保存成功")
        setTimeout(() => {
            message.destroy();
        }, 2000);
    } else {
        message.error("删除失败")
    }
}


// add组件的一些参数
const formRef = ref();
const dynamicValidateForm = reactive({
    headers: [],
});
const removeHeader = item => {
    let index = dynamicValidateForm.headers.indexOf(item);
    if (index !== -1) {
        dynamicValidateForm.headers.splice(index, 1);
    }
};
const addHeader = () => {
    dynamicValidateForm.headers.push({
        first: '',
        last: '',
        id: Date.now(),
    });
};
const onFinish = values => {
    console.log('Received values of form:', values);
    console.log('dynamicValidateForm.headers:', dynamicValidateForm.headers);
};
</script>

<style>
.head {
    padding-bottom: 5px;
}
</style>