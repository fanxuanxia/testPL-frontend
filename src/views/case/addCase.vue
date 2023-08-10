<template>
    <div>
        <a-steps :current="current">
            <a-step v-for="item in steps" :key="item.title" :title="item.title" />
        </a-steps>
        <div class="steps-content">
            <a-form v-if="current === 0" :model="formState" v-bind="layout" name="nest-messages" @finish="onFinish">
                <a-form-item :name="['name']" label="Name" :rules="[{ required: true }]">
                    <a-input v-model:value="formState.name" />
                </a-form-item>
                <a-form-item :name="['description']" label="description">
                    <a-textarea v-model:value="formState.description" />
                </a-form-item>
            </a-form>
            <a-form v-if="current === 1" :model="modelRef" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
                <a-form-item label="请求：" v-bind="validateInfos.url" :required="true">
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
                <a-form-item label="请求参数：">
                    <br />
                    <a-tabs class="tab" v-model:activeKey="modelRef.activeKey" size="default" style="height: 250px">
                        <a-tab-pane key="1" tab="request header">
                            <a-form ref="formRef1" name="dynamic_form_nest_item" :model="modelRef.headers"
                                @finish="onFinish">
                                <a-space v-for="(header, index) in modelRef.headers" :key="modelRef.headers.id"
                                    style="display: flex; margin-bottom: 8px" align="baseline">
                                    <a-form-item :name="['headers', index, 'first']">
                                        <a-input v-model:value="header.first" placeholder="key" />
                                    </a-form-item>
                                    <a-form-item :name="['headers', index, 'last']">
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
                            </a-form>
                        </a-tab-pane>
                        <!-- <a-tab-pane key="2" tab="query">Content of Tab Pane 1</a-tab-pane> -->
                        <a-tab-pane key="3" tab="request body" force-render>
                            <vue-json-editor v-model="modelRef.requestBody" :showBtns="false" :mode="'code'" lang="zh"
                                :expandedOnStart="true" @json-change="onJsonChange" @json-save="onJsonSave">
                            </vue-json-editor>
                        </a-tab-pane>
                        <a-tab-pane key="4" tab="前置操作" force-render>Content of Tab Pane 2</a-tab-pane>
                        <a-tab-pane key="5" tab="响应头" force-render>Content of Tab Pane 3</a-tab-pane>
                        <a-tab-pane key="6" tab="响应体" force-render>Content of Tab Pane 3</a-tab-pane>
                        <a-tab-pane key="7" tab="后置操作" force-render>Content of Tab Pane 3</a-tab-pane>
                    </a-tabs>
                </a-form-item>
            </a-form>
            <!-- step3的 -->
            <a-form v-if="current == 2" ref="formRef2" name="dynamic_form_nest_item" :model="dynamicValidateForm"
                @finish="onFinish">
                <a-space v-for="(assertion, index) in dynamicValidateForm.assertions"
                    :key="dynamicValidateForm.assertions.id"
                    style="display: flex; margin-bottom: 8px; justify-content: center;" direction="vertical">
                    <a-form-item :name="['assertions', index, 'expression']" name="expression" label="JsonPath表达式提取器"
                        :rules="[{ required: true, message: '请输入JsonPath路径' }]">
                        <a-input v-model:value="assertion.expression" />
                    </a-form-item>
                    <a-space direction="horizontal" align="baseline" style="display: flex; margin-left: 8px">
                        <a-form-item :name="['assertions', index, 'assertType']" label="断言规则" :rules="{
                            required: true,
                            message: '请选择断言规则',
                        }">
                            <a-select v-model:value="assertion.assertType" :options="assertEnu"></a-select>
                        </a-form-item>
                        <a-form-item label="期望值" :name="['assertions', index, 'expectedValue']" :rules="{
                            required: true,
                            message: '请输入期望值，为空输入NULL',
                        }">
                            <a-input v-model:value="assertion.expectedValue" />
                        </a-form-item>
                        <MinusCircleOutlined @click="removeAssertion(dynamicValidateForm.assertions[index])" />
                    </a-space>
                </a-space>
                <a-form-item>
                    <a-button type="dashed" block @click="addAssertion" style="width: 200px;">
                        <PlusOutlined />
                        Add assertions
                    </a-button>
                </a-form-item>
            </a-form>
            <!-- </a-form> -->
        </div>
        <div class="steps-action">
            <a-button v-if="current < steps.length - 1" type="primary" @click="next">下一步</a-button>
            <a-button v-if="current == steps.length - 1" type="primary" @click="allDone">
                Done
            </a-button>
            <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">上一步</a-button>
        </div>
    </div>
</template>
<script setup>
import { defineComponent, ref, reactive, watch } from 'vue';
import { Form, message } from 'ant-design-vue';
import vueJsonEditor from 'vue-json-editor';
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { $addCase } from '@/api/case/caseListAPI';
import { useRouter } from 'vue-router';

const router = useRouter();
const useForm = Form.useForm;
const current = ref(0);
const next = () => {
    current.value++;
    console
};
const prev = () => {
    current.value--;
};

const steps = [{
    title: 'First',
    content: 'First-content',
}, {
    title: 'Second',
    content: 'Second-content',
}, {
    title: 'Last',
    content: 'Last-content',
}];


const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 8,
    },
};
const formState = reactive({
    name: '',
    description: '',
});
const onFinish = values => {
    console.log('Success:', values);
};

const modelRef = reactive({
    method: undefined,
    domain: undefined,
    url: undefined,
    headers: [],
    requestBody: {},
    activeKey: '1',
});

const rulesRef = reactive({
    domain: [{
        required: true,
        message: '请输入域名',
    }],
    url: [{
        required: true,
        message: '请输入接口路径',
    }],
});
const {
    resetFields,
    validate,
    validateInfos,
} = useForm(modelRef, rulesRef, {
    onValidate: (...args) => console.log(...args),
});

const removeHeader = item => {
    let index = modelRef.headers.indexOf(item);
    if (index !== -1) {
        modelRef.headers.splice(index, 1);
    }
};
const addHeader = () => {
    modelRef.headers.push({
        first: '',
        last: '',
        id: Date.now(),
    });
};
const onJsonChange = (value) => {
    // console.log("onJsonChange");
    // console.log("change---requestBody :" + JSON.stringify(requestBody));
    // console.log("change---value :" + JSON.stringify(value));
    onJsonSave(value)
};
const onJsonSave = (value) => {
    // console.log("onJsonSave");
    modelRef.requestBody = value;
    console.log("save----requestBody :" + JSON.stringify(requestBody));
    console.log("save----value :" + JSON.stringify(value));
};




// step3的
const assertEnu = [{
    label: 'Equal',
    value: 'Equal',
}, {
    label: 'NotEqual',
    value: 'NotEqual',
}
    , {
    label: 'Contain',
    value: 'Contain',
}
    , {
    label: 'NotContain',
    value: 'NotContain',
}
    , {
    label: 'isNull',
    value: 'isNull',
}
    , {
    label: 'NotNull',
    value: 'NotNull',
}];

const formRef1 = ref();
const formRef2 = ref();
const dynamicValidateForm = reactive({
    assertions: [],
});
const removeAssertion = item => {
    let index = dynamicValidateForm.assertions.indexOf(item);
    if (index !== -1) {
        dynamicValidateForm.assertions.splice(index, 1);
    }
};
const addAssertion = () => {
    dynamicValidateForm.assertions.push({
        expression: '',
        assertType: '',
        expectedValue: '',
        id: Date.now(),
    });
};
// const onFinish = values => {
//   console.log('Received values of form:', values);
//   console.log('dynamicValidateForm:', dynamicValidateForm);
// };
const allDone = async () => {
    //删除一些用不到的字段
    delete modelRef.activeKey;
    dynamicValidateForm.assertions.forEach(obj => {
        delete obj.id;
    });

    // 将原对象中的 headers 数组转换为 Map 对象
    const headersMap = new Map();
    modelRef.headers.forEach(header => {
        headersMap.set(header.first, header.last);
    });

    // 使用解构赋值将原对象中的 headers 属性替换为 Map 对象
    const { method, domain, url, requestBody } = modelRef;
    const updatedModelRef = {
        method,
        domain,
        url,
        headers: JSON.stringify(headersMap),
        requestBody: JSON.stringify(requestBody),
    };

    console.log("value of step1:" + JSON.stringify(formState))
    console.log("value of step2:" + JSON.stringify(updatedModelRef))
    console.log("value of step3:" + JSON.stringify(dynamicValidateForm))
    let params = {
        testCase: formState,
        apiDefinition: updatedModelRef,
        assertRuleLists: dynamicValidateForm.assertions
    }
    console.log("allParams" + JSON.stringify(params))
    let response = await $addCase(params);
    if (response.success === true) {
        message.success("添加成功")
        setTimeout(() => {
            message.destroy();
        }, 2000);
        router.push({
            name: "caseList",
        })
    } else {
        message.error(response.message);
    }
    console.log("response" + JSON.stringify(response))
}


</script>
<style scoped>
.steps-content {
    margin-top: 16px;
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: center;
    padding-top: 80px;
}

.steps-action {
    margin-top: 24px;
}

[data-theme='dark'] .steps-content {
    background-color: #2f2f2f;
    border: 1px dashed #404040;
}
</style>