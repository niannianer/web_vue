<template>
    <div class="sms sms-manage wrapper" flex="dir:top">
        <div class="common-title" flex-box="0">短信模板管理</div>
        <div class="sms-wrap" flex-box="1" flex="dir:top">
            <div class="table-handle" flex-box="0">
                <div class="table-input" flex="main:justify">
                    <dl flex>
                        <dt>模板编号：</dt>
                        <dd><b-form-input type="text" size="sm" v-model="templateNo" placeholder="请输入模板编号"></b-form-input></dd>
                    </dl>
                    <dl flex>
                        <dt>类别：</dt>
                        <dd><b-form-select v-model="smsType" :options="smsTypeOptions" size="sm"></b-form-select></dd>
                    </dl>
                    <dl flex>
                        <dt class="date-text">添加时间：</dt>
                        <dd flex>
                            <div class="input-date"><datepicker language="ch" v-model="createTimeFrom" ></datepicker></div>
                            <div class="date-text">到</div>
                            <div class="input-date"><datepicker language="ch" :min="createTimeFrom" v-model="createTimeTo"></datepicker></div>
                        </dd>
                    </dl>
                </div>
                <div class="table-input" flex="main:justify">
                    <dl flex>
                        <dt>短息内容：</dt>
                        <dd><b-form-input type="text" size="sm" v-model="templateContent" placeholder="请输入短息内容"></b-form-input></dd>
                    </dl>
                    <div flex class="handle-btn">

                        <b-btn class="btns" @click.native="search">查询</b-btn>
                        <b-btn class="btns" @click.native="empty">清空</b-btn>
                        <b-btn class="btns" @click.native="addTemplate">添加</b-btn>
                    </div>
                </div>
                
            </div>
            <div class="sms-table" flex-box="1">
                <b-table :items="items" :fields="fields"  bordered>
                    <template slot="smsType" scope="item">
                        <template v-if="item.value == 1">产品上线通知</template>
                        <template v-if="item.value == 2">优惠提醒</template>
                        <template v-if="item.value == 3">客户激活</template>
                        <template v-if="item.value == 4">邀请回归</template>
                        <template v-if="item.value == 5">回访通知</template>
                    </template>
                    <template slot="templateContent" scope="item">
                        <div flex="main:center cross:center" :title="item.value"><span>{{item.value | ellipsisFormat}}</span></div>
                    </template>
                    <template slot="templateDescription" scope="item">
                        <div flex="main:center cross:center" :title="item.value"><span>{{item.value | ellipsisFormat}}</span></div>
                    </template>
                    <template slot="createTime" scope="item">{{item.value | timeFormat}}</template>
                    <template slot="deleteFlag" scope="item">
                            <b-btn class="btns" @click.native="detail(item.item)">详情</b-btn>
                            <b-btn class="btns" @click.native="delet(item.item.templateNo)">删除</b-btn>
                    </template>
                </b-table>
            </div>
            <div class="justify-content-center paging pages" flex-box="0" flex="main:center">
                <div flex>
                    <div>
                        <b-pagination prev-text="上一页" next-text="下一页" hide-goto-end-buttons size="md" :total-rows="count" :per-page='perPage' v-model="pageNo" @click.native="pageChange()"></b-pagination>
                    </div>
                    <div class="total"><span>共{{ Math.ceil(count / perPage) }}页</span><span>共{{ count }}条</span></div>
                </div>
            </div>
        </div>
        <div class="sms-tempalte-detail shadow-box"  flex="main:center cross:center" v-if="smsTemplateShow">
            <div class="sms-tempalte-bell">
                <h6>短信模板详情</h6>
                <ul>
                    <li flex>
                        <div>模板编号：</div>
                        <div>{{detailItem.templateNo}}</div>
                    </li>
                    <li flex>
                        <div>短信类别：</div>
                        <div>
                            <template v-if="detailItem.smsType == 1">产品上线通知</template>
                            <template v-if="detailItem.smsType == 2">优惠提醒</template>
                            <template v-if="detailItem.smsType == 3">客户激活</template>
                            <template v-if="detailItem.smsType == 4">邀请回归</template>
                            <template v-if="detailItem.smsType == 5">回访通知</template>
                        </div>
                    </li>
                    <li flex>
                        <div>短信内容：</div>
                        <div>{{detailItem.templateContent}}</div>
                    </li>
                    <li flex>
                        <div>短信备注：</div>
                        <div>{{detailItem.templateDescription}}</div>
                    </li>
                </ul>
                <div flex="main:center"><b-btn class="btns" @click="smsTemplateShow = false">关闭</b-btn></div>
            </div>
        </div>
    </div>
</template>

<script>
    import $api from '../tools/api';
    import Toast from '../components/Toast';
    import Confirm from '../components/Confirm';
    import ConfirmOnly from '../components/ConfirmOnly';
    import datepicker from 'vue-date';
    export default {
        name: 'sms-record',
        data(){
            return {
                templateNo:'',
                templateContent:'',
                smsTypeOptions:[
                    {
                        text: '全部',
                        value: ''
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
                smsType:'',
                createTimeFrom:'',
                createTimeTo:'',
                fields: {
                    templateNo: { label: '模板编号' },
                    smsType:{label:'类别'},
                    templateContent: { label: '内容',tdClass:'ellipsis'},
                    templateDescription: { label: '备注',tdClass:'ellipsis'},
                    createTime: { label: '添加时间' },
                    deleteFlag: { label: '操作' }
                },
                items:[],
                perPage:20,
                count:0,
                pageNo:1,
                smsTemplateShow:false,
                detailItem:null
            }
        },
        created(){
            this.getList();
        },
        components: { datepicker },
        computed: {
        },
        methods: {
            pageChange(){
                this.getList();
            },
            search(){
                this.pageNo = 1;
                this.getList();
            },
            detail(item){
                this.smsTemplateShow = true;
                this.detailItem = item;
            },
            delet(templateNo){
                Confirm({
                    title:'删除短信模板',
                    content:'删除后该短信模板不可恢复，确定删除？',
                    okText:'删除',
                    callback:(type)=>{
                        if(type){
                            $api.post('/smsTemplate/delete/'+templateNo).then((res)=>{
                                if(res.code == 200){
                                    this.pageNo = 1;
                                    this.getList();
                                }
                            });
                        }
                    }
                });
            },
            empty(){
                this.templateNo = '';
                this.templateContent = '';
                this.smsType = '';
                this.createTimeFrom = '';
                this.createTimeTo = '';
                this.pageNo = 1;
            },
            addTemplate(){
                location.href = 'sms-template.html';
            },
            getList(){
                $api.get('/smsTemplate/list',{
                    templateNo:this.templateNo,
                    smsType:this.smsType,
                    createTimeFrom:this.createTimeFrom,
                    createTimeTo:this.createTimeTo,
                    templateContent:this.templateContent,
                    pageSize:this.perPage,
                    pageNo:this.pageNo
                }).then((res)=>{
                    if(res.code == 200){
                        this.count = res.data.totalCount;
                        this.items = res.data.items;
                    }else{
                        Toast(res.msg || '服务器错误');
                    }
                });
            }
        },
        mounted(){},
        destroyed(){

        }
    }
</script>
