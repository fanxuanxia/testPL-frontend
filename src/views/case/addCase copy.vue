<template>
    <div>
        <a-steps :current="current">
            <a-step v-for="item in steps" :key="item.title" :title="item.title" />
        </a-steps>
        <div class="steps-content">
            <a-form v-if="current === 0" :model="formState" v-bind="layout" name="nest-messages"
                :validate-messages="validateMessages" @finish="onFinish">
                <a-form-item :name="['case', 'name']" label="Name" :rules="[{ required: true }]">
                    <a-input v-model:value="formState.case.name" />
                </a-form-item>
                <a-form-item :name="['case', 'introduction']" label="Introduction">
                    <a-textarea v-model:value="formState.case.introduction" />
                </a-form-item>
            </a-form>
            <a-form v-if="current === 1" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
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
                            <a-form ref="formRef" name="dynamic_form_nest_item" :model="modelRef.headers"
                                @finish="onFinish">
                                <a-space v-for="(header, index) in modelRef.headers" :key="header.id"
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
                            </a-form>
                        </a-tab-pane>
                        <!-- <a-tab-pane key="2" tab="query">Content of Tab Pane 1</a-tab-pane> -->
                        <a-tab-pane key="3" tab="request body" force-render>
                            <vue-json-editor v-model="modelRef.jsonData" :showBtns="false" :mode="'code'" lang="zh"
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
            <a-form v-if="current == 2" ref="formRef" name="dynamic_form_nest_item" :model="dynamicValidateForm"
                @finish="onFinish">
                <a-space v-for="(rule, index) in dynamicValidateForm.rules" :key="rule.id"
                    style="display: flex; margin-bottom: 8px" align="baseline" direction="vertical">
                    <a-form-item name="area" label="JsonPath表达式提取器" :rules="[{ required: true, message: '请输入JsonPath路径' }]"
                        :wrapper-col="{ span: 300 }">
                        <a-input v-model:value="dynamicValidateForm.extractors.expression" />
                    </a-form-item>
                    <a-space direction="horizontal">
                        <a-form-item :name="['extractors', index, 'assertType']" label="断言规则" :rules="{
                            required: true,
                            message: '请选择断言规则',
                        }">
                            <a-select v-model:value="extractor.assertType" style="width: 130px"
                                operations="assertEnu"></a-select>
                        </a-form-item>
                        <a-form-item label="期望值" :name="['extractors', index, 'expectValue']" :rules="{
                            required: true,
                            message: '请输入期望值，为空输入NULL',
                        }">
                            <a-input v-model:value="extractor.expectValue" />
                        </a-form-item>
                        <MinusCircleOutlined @click="removeExtractor(extractor)" />
                    </a-space>
                </a-space>
                <a-form-item>
                    <a-button type="dashed" block @click="addExtractor" style="width: 200px;">
                        <PlusOutlined />
                        Add extractors
                    </a-button>
                </a-form-item>
            </a-form>
            <!-- </a-form> -->
        </div>
        <div class="steps-action">
            <a-button v-if="current < steps.length - 1" type="primary" @click="next">下一步</a-button>
            <a-button v-if="current == steps.length - 1" type="primary" @click="message.success('Processing complete!')">
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
import { MinusCircleOutlined } from "@ant-design/icons-vue";
const useForm = Form.useForm;
const current = ref(2);
const next = () => {
    current.value++;
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
const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};
const formState = reactive({
    case: {
        name: '',
        introduction: '',
    },
});
const onFinish = values => {
    console.log('Success:', values);
};

const modelRef = reactive({
    assertType: 'Equal',
    domain: undefined,
    url: undefined,
    desc: undefined,
    // activeKey: '1',
    headers: [],
    jsonData: undefined,
});

const rulesRef = reactive({
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




// step3的
const assertEnu = [{
    label: 'Equal',
    value: 'Equal',
}, {
    label: 'NotEqual',
    value: 'NotEqual',
}];
const extractors = {
    Equal: ['Tiananmen', 'Great Wall'],
    NotEqual: ['Oriental Pearl', 'The Bund'],
};
const formRef = ref();
const dynamicValidateForm = reactive({
    extractors: [],
});
watch(() => dynamicValidateForm.area, () => {
    dynamicValidateForm.extractors = [];
});
const removeExtractor = item => {
    let index = dynamicValidateForm.extractors.indexOf(item);
    if (index !== -1) {
        dynamicValidateForm.extractors.splice(index, 1);
    }
};
const addExtractor = () => {
    console.log("添加一个表单")
    dynamicValidateForm.extractors.push({
        expression: '',
        assertType: '',
        expectValue: '',
        id: Date.now(),
    });
};
// const onFinish = values => {
//   console.log('Received values of form:', values);
//   console.log('dynamicValidateForm:', dynamicValidateForm);
// };



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