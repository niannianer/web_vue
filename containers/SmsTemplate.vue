<template>
    <div class="sms-template wrapper">
        <div class="common-title">添加短信模板</div>
        <div class="template-content">
            <ul class="template-item">
                <li flex>
                    <label>短信类型：</label>
                    <div><b-form-select v-model="smsType" :options="smsTypeOptions" size="sm"></b-form-select></b-form-input></div>
                </li>
                <li flex>
                    <label>短信内容：</label>
                    <div>
                        <textarea class="form-control" cols="80" rows="8" maxlength="300" v-model="templateContent"></textarea>
                        <div class="ps" flex="main:justify">
                            <i>注：建议输入不多于65个字，超过将拆分多条短信发送！</i>
                            <p><span>{{String(templateContent).length}}</span>/300</p>
                        </div>
                    </div>
                </li>
                <li flex>
                    <label>短信备注：</label>
                    <div><b-form-input type="text" maxlength="50" v-model="templateDescription"></b-form-input></div>
                </li>
            </ul>
            <div class="tempate-btns">
                <b-btn class="btns" @click="submit(1)">保存</b-btn>
                <b-btn class="btns" @click="submit(0)">取消</b-btn>
            </div>
        </div>
    </div>
</template>

<script>
    import $api from '../tools/api';
    import Toast from '../components/Toast';
    export default {
        name: 'sms-template',
        data(){
            return {
                smsType: '1',
                templateContent: '',
                templateDescription: '',
                smsTypeOptions: [
                    {
                        value: '1',
                        text: '产品上线通知'
                    },{
                        value: '2',
                        text: '优惠提醒'
                    },{
                        value: '3',
                        text: '客户激活'
                    },{
                        value: '4',
                        text: '邀请回归'
                    },{
                        value: '5',
                        text: '回访通知'
                    },
                ],
                submitClick:true
            }
        },
        created(){},
        computed: {},
        methods: {
            //保存
            submit(type) {
                if(type){
                    if(!this.submitClick){
                        return false;
                    }
                    if(this.templateContent.trim().length <= 0) {
                        Toast('短信内容不能为空');
                        return;
                    }
                    if(this.templateDescription.trim().length <= 0) {
                        Toast('短信备注不能为空');
                        return;
                    }
                    this.submitClick = false;
                    $api.post('/smsTemplate',{
                        "smsType":this.smsType,
                        "templateContent":this.templateContent,
                        "templateDescription":this.templateDescription
                    }).then((res)=>{
                        this.submitClick = true;
                        if(res.code == 200){
                            location.href = 'sms-manage.html';
                        }else{
                            Toast(res.message || '发生错误，请重试');
                        }
                    });
                    return ;
                }
                location.href = 'sms-manage.html';
            }
        },
        destroyed(){}
    }
</script>
