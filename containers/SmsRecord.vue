<template>
    <div class="sms sms-record wrapper" flex="dir:top">
        <div class="common-title" flex-box="0">短信发送记录</div>
        <div class="sms-wrap" flex-box="1" flex="dir:top">
            <div class="table-handle" flex-box="0">
                <div class="table-input" flex="main:justify">
                    <dl flex>
                        <dt>用户名：</dt>
                        <dd><b-form-input type="text" size="sm" v-model="phoneNumber" placeholder="请输入用户名"></b-form-input></dd>
                    </dl>
                    <dl flex>
                        <dt>模板编号：</dt>
                        <dd><b-form-input type="text" size="sm" v-model="smsTemplateNo" placeholder="请输入模板编号"></b-form-input></dd>
                    </dl>
                    <dl flex>
                        <dt>请求编号：</dt>
                        <dd><b-form-input type="text" size="sm" v-model="requestNo" placeholder="请输入请求编号"></b-form-input></dd>
                    </dl>
                    <dl flex>
                        <dt>状态：</dt>
                        <dd><b-form-select v-model="smsStatus" :options="smsStatusOptions" size="sm"></b-form-select></dd>
                    </dl>
                    <dl flex>
                        <dt>类别：</dt>
                        <dd><b-form-select v-model="smsType" :options="smsTypeOptions" size="sm"></b-form-select></dd>
                    </dl>
                </div>
                <div class="table-input" flex="main:justify">
                    <dl flex>
                        <dt class="date-text">发送时间：</dt>
                        <dd flex>
                            <div class="input-date"><datepicker language="ch" v-model="beginDate" ></datepicker></div>
                            <div class="date-text">到</div>
                            <div class="input-date"><datepicker language="ch" v-model="endDate"></datepicker></div>
                        </dd>
                    </dl>
                    <div flex class="handle-btn">

                        <b-btn class="btns" @click.native="search">查询</b-btn>
                        <b-btn class="btns" @click.native="empty">清空</b-btn>
                        <b-btn class="btns" @click.native="someSend">批量重发</b-btn>
                    </div>
                </div>
                
            </div>
            <div class="sms-table" flex-box="1">
                <table class="table b-table table-bordered">
                    <thead>
                        <tr>
                            <th v-for="(item,index) in fields" :key="index">
                                <div v-if="index=='checkBox'"><input type="checkBox" @click="checkAll" :checked="checkedAll"></div>
                                <div v-else>{{item.label}}</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in items" :key="index">
                            <td><div><input v-if="item.smsStatus == 3" type="checkBox" :checked="item.checked " @click="everChecked(index)"></div></td>
                            <td>{{item.mobile}}</td>
                            <td>{{item.userName}}</td>
                            <td>{{item.requestNo}}</td>
                            <td>{{item.smsTemplateNo}}</td>
                            <td>
                                <template v-if="item.smsType == 1">产品上线通知</template>
                                <template v-if="item.smsType == 2">优惠提醒</template>
                                <template v-if="item.smsType == 3">客户激活</template>
                                <template v-if="item.smsType == 4">邀请回归</template>
                                <template v-if="item.smsType == 5">回访通知</template>
                            </td>
                            <td class="ellipsis">
                                <div :title="item.smsContent">{{item.smsContent | ellipsisFormat}}</div>
                            </td>
                            <td class="ellipsis">
                                <div :title="item.smsDescription">{{item.smsDescription | ellipsisFormat}}</div>
                            </td>
                            <td>{{item.sendTime | timeFormat}}</td>
                            <td>
                                <template v-if="item.smsStatus == 0">全部</template>
                                <template v-if="item.smsStatus == 1">发送中</template>
                                <template v-if="item.smsStatus == 2">已发送</template>
                                <template v-if="item.smsStatus == 3">发送失败</template>
                            </td>
                            <td>{{item.sendStatusMess}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="justify-content-center paging pages" flex-box="0" flex="main:center">
                <div flex>
                    <div>
                        <b-pagination prev-text="上一页" next-text="下一页" hide-goto-end-buttons size="md" :total-rows="count" :per-page='pageSize' v-model="pageNo" @click.native="pageChange()"></b-pagination>
                    </div>
                    <div class="total"><span>共{{ Math.ceil(count / pageSize) }}页/</span><span>共{{ count }}条</span></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import $api from '../tools/api';
    import ConfirmOnly from '../components/ConfirmOnly';
    import Toast from '../components/Toast';
    import datepicker from 'vue-date';
    export default {
        name: 'sms-record',
        data(){
            return {
                phoneNumber:'',
                smsTemplateNo:'',
                requestNo:'',
                smsStatusOptions:[
                    {
                        text: '全部',
                        value: 0
                    },{
                        text: '发送中',
                        value: 1
                    },{
                        text: '已发送',
                        value: 2
                    },
                    {
                        text: '发送失败',
                        value: 3
                    }
                ],
                smsStatus:0,
                smsTypeOptions:[
                    {
                        text: '全部',
                        value: null
                    },
                    {
                        text: '产品上线通知',
                        value: 1
                    },{
                        text: '优惠提醒',
                        value: 2
                    },{
                        text: '客户激活',
                        value: 3
                    },{
                        text: '邀请回归',
                        value: 4
                    },{
                        text: '回访通知',
                        value: 5
                    }
                ],
                smsType:null,
                beginDate:'',
                endDate:'',
                fields: {
                    checkBox:{label:'<input type="checkBox" checked="checked" @click="checkBox">'},
                    mobile: { label: '用户名' },
                    userName: { label: '用户姓名' },
                    requestNo: { label: '请求编号' },
                    smsTemplateNo: { label: '短信模板编号' },
                    smsType: { label: '短信类别' },
                    smsContent: { label: '短信内容' },
                    smsDescription: { label: '短信备注' },
                    sendTime: { label: '发送时间' },
                    smsStatus: { label: '状态' },
                    sendStatusMess: { label: '备注' },
                },
                items:[],
                submitItem:{},
                pageSize:20,
                count:0,
                pageNo:1,
                checkedAll:false

            }
        },
        created(){
            this.getList();
        },
        components: { datepicker },
        computed: {
        },
        methods: {
            search(){
                this.pageNo = 1;
                this.getList();
            },
            empty(){
                this.phoneNumber = '';
                this.smsTemplateNo = '';
                this.requestNo = '';
                this.smsStatus = 0;
                this.smsType = '';
                this.beginDate = '';
                this.endDate = '';
            },
            pageChange(){
                this.getList();
            },
            checkAll(){
                this.checkedAll = !this.checkedAll;
                if(this.checkedAll){
                    this.items.forEach((val,index)=>{
                        if(val.smsStatus == 3){
                            val.checked = 1;
                        }
                    });
                    return false;
                }
                this.items.forEach((val,index)=>{
                    val.checked = 0;
                })
            },
            someSend(){
                let messageCount = 0;
                this.submitItem = {};
                this.items.forEach(({mobile,requestNo,checked},index)=>{
                    if(checked){
                        if(!this.submitItem[requestNo]){
                            this.submitItem[requestNo] = [];
                        }
                        this.submitItem[requestNo].push(mobile);
                        messageCount++;
                    }
                });
                if(messageCount<1){
                    for(let val of this.items){
                        if(val.smsStatus == 3){
                            Toast('请先选择重发记录！');
                            return false;
                        }
                    }
                    Toast('当前没有发送失败记录！');
                    return false;
                }
                ConfirmOnly({
                    title:'短信批量发送',
                    content:`请求发送条数：${messageCount}条`,
                    callback:()=>{
                        for(let index in this.submitItem){
                            this.submitItem[index] = this.submitItem[index].join(',');
                        }
                        $api.post('/message/repeatSendSms',{
                            sendInfo:this.submitItem
                        }).then(res=>{
                            if(res.code == 200){
                                this.pageNo = 1;
                                this.getList();
                                this.empty();
                            }
                        });
                    }
                });
            },
            everChecked(index){
                this.items[index].checked = !this.items[index].checked;
                for (let value of this.items) {
                    if(!value.checked){
                        this.checkedAll = false;
                        return false;
                    }
                }
                this.checkedAll = true;
            },
            getList(){
                let {requestBy,phoneNumber,smsTemplateNo,smsStatus,smsType,requestNo,beginDate,endDate,pageSize,pageNo} = this;
                $api.get('/message/lstSmsSendLog',{requestBy,phoneNumber,smsTemplateNo,smsStatus,smsType,requestNo,beginDate,endDate,pageSize,pageNo})
                    .then(res=>{
                    if(res.code == 200){
                        this.items = res.data.items;
                        this.count = res.data.totalCount;
                    }
                });
                this.checkedAll = false;
            }
        },
        mounted(){},
        destroyed(){

        }
    }
</script>
