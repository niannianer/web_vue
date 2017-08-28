<template>
    <div class="sms sms-record wrapper" flex="dir:top">
        <div class="common-title" flex-box="0">短信发送审核</div>
        <div class="sms-wrap" flex-box="1" flex="dir:top">
            <div class="table-handle" flex-box="0">
                <div class="table-input" flex="main:justify">
                    <dl flex>
                        <dt>用户名：</dt>
                        <dd><b-form-input type="text" size="sm" v-model="userName" placeholder="请输入用户名"></b-form-input></dd>
                    </dl>
                    <dl flex>
                        <dt>模板编号：</dt>
                        <dd><b-form-input type="text" size="sm" v-model="modelNum" placeholder="请输入模板编号"></b-form-input></dd>
                    </dl>
                    <dl flex>
                        <dt>请求编号：</dt>
                        <dd><b-form-input type="text" size="sm" v-model="requireNum" placeholder="请输入请求编号"></b-form-input></dd>
                    </dl>
                    <dl flex>
                        <dt>状态：</dt>
                        <dd><b-form-select v-model="statusSelected" :options="statusOptions" size="sm"></b-form-select></b-form-input></dd>
                    </dl>
                    <dl flex>
                        <dt>类别：</dt>
                        <dd><b-form-select v-model="typeSelected" :options="typeOptions" size="sm"></b-form-select></b-form-input></dd>
                    </dl>
                </div>
                <div class="table-input" flex="main:justify">
                    <dl flex>
                        <dt class="date-text">发送时间：</dt>
                        <dd flex>
                            <div class="input-date"><datepicker language="ch" v-model="dateStart" ></datepicker></div>
                            <div class="date-text">到</div>
                            <div class="input-date"><datepicker language="ch" v-model="dateEnd"></datepicker></div>
                        </dd>
                    </dl>
                    <div flex class="handle-btn">

                        <b-btn class="btns" >查询</b-btn>
                        <b-btn class="btns" >清空</b-btn>
                        <b-btn class="btns" >批量重发</b-btn>
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
                        <!-- <tr v-for="(item,index) in items">
                            <td>{{item.days}}</td>
                            <td>{{item.registerCount}}</td>
                            <td>{{item.startCount}}</td>
                            <td>{{item.openAccountCount}}</td>
                            <td>{{item.conPercent}}</td>
                            <td>{{item.orderCount}}</td>
                            <td>{{item.sumPaidAmount | currencyFormat}}</td>
                            <td>{{item.expUserQuantity}}</td>
                        </tr> -->
                    </tbody>
                </table>
                <!-- <b-table :items="items" :fields="fields"  bordered>
                    <template slot="experienceAmount" scope="item">{{ item.value | currencyFormat}}</template>
                    <template slot="annualInterestRate" scope="item">{{ item.value | translatePate}}</template>
                    <template slot="issueNode" scope="item">注册</template>
                    <template slot="conditionProductPeriod" scope="item">累计投资{{item.value}}天以上产品超过{{item.item.conditionProductAmount}}元</template>
                    <template slot="etStatus" scope="item">
                        <template v-if="item.value == 0">待激活</template>
                        <template v-if="item.value == 1">已激活</template>
                        <template v-if="item.value == 2">已停用</template>
                    </template>
                    <template slot="createTime" scope="item">{{item.value | timeFormat}}</template>
                    <template slot="operation" scope="item">
                        <div v-if="item.item.etStatus == 0" flex="main:center">
                            <b-btn class="btns" @click.native="addMarket(item.item.etUuid)">修改</b-btn>
                            <b-btn class="btns" @click.native="updateMarket(item.item.etUuid,1)">激活</b-btn>
                        </div>
                        <div v-if="item.item.etStatus == 1">
                            <b-btn class="btns" @click.native="updateMarket(item.item.etUuid,2)">停用</b-btn>
                        </div>
                    </template>
                </b-table> -->
            </div>
            <input type="checkBox">
            <div class="justify-content-center paging pages" flex-box="0" flex="main:center">
                <div flex>
                    <div>
                        <b-pagination prev-text="上一页" next-text="下一页" hide-goto-end-buttons size="md" :total-rows="count" :per-page='perPage' v-model="pageNo" @click.native="pageChange()"></b-pagination>
                    </div>
                    <div class="total"><span>共{{ Math.ceil(count / perPage) }}页</span><span>共{{ count }}条</span></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import $api from '../tools/api';
    import Confirm from '../components/Confirm';
    import datepicker from 'vue-date';
    export default {
        name: 'sms-record',
        data(){
            return {
                userName:'',
                modelNum:'',
                requireNum:'',
                statusOptions:[
                    {
                        text: '全部',
                        value: ''
                    },
                    {
                        text: '发送失败',
                        value: 0
                    },{
                        text: '发送中',
                        value: 1
                    },{
                        text: '已发送',
                        value: 2
                    }
                ],
                statusSelected:'',
                typeOptions:[
                    {
                        text: '全部',
                        value: ''
                    },
                    {
                        text: '产品上线通知',
                        value: 0
                    },{
                        text: '优惠提醒',
                        value: 1
                    },{
                        text: '客户激活',
                        value: 2
                    },{
                        text: '邀请回归',
                        value: 3
                    },{
                        text: '回访通知',
                        value: 4
                    }
                ],
                typeSelected:'',
                dateStart:'',
                dateEnd:'',
                fields: {
                    checkBox:{label:'<input type="checkBox" checked="checked" @click="checkBox">'},
                    etUuid: { label: '请求编号' },
                    experienceName:{label:'请求人'},
                    experienceAmount: { label: '请求时间' },
                    annualInterestRate: { label: '请求短信条数' },
                    rateDays: { label: '模板编号' },
                    issueNode: { label: '短信类别' },
                    smsContent: { label: '短信内容' },
                    etStatus: { label: '短信备注' },
                    createTime: { label: '审核时间' },
                    sendTime: { label: '发送时间' },
                    status: { label: '状态' },
                    remarks: { label: '备注' },
                    operation: { label: '操作' },
                },
                items:[],
                perPage:10,
                count:30,
                pageNo:1,
                checkedAll:false

            }
        },
        created(){
        },
        components: { datepicker },
        computed: {
        },
        methods: {
            pageChange(){
                console.log(this.pageNo);
            },
            checkAll(){
                this.checkedAll = !this.checkedAll;
                if(this.checkedAll){
                    console.log('all');
                }
            },
        },
        mounted(){},
        destroyed(){

        }
    }
</script>
