<template>
    <div class="wrapper sms-check coupon-check" flex="dir:top">
        <div class="common-title" flex-box="0">指定发放审核</div>
        <div class="coupon-content" flex-box="1" flex="dir:top">
            <div class="table-handle" flex-box="0">
                <div class="table-input" flex>
                    <dl flex>
                        <dt>审核编码：</dt>
                        <dd><b-form-input type="text" size="sm" v-model="checkCode" placeholder="请输入审核编码"></b-form-input></dd>
                    </dl>
                    <dl flex>
                        <dt>批次号：</dt>
                        <dd><b-form-input type="text" size="sm" v-model="batches" placeholder="请输入批次号"></b-form-input></dd>
                    </dl>
                    <dl flex>
                        <dt>状态：</dt>
                        <dd><b-form-select v-model="statusSelected" :options="statusOptions" size="sm"></b-form-select></b-form-input></dd>
                    </dl>
                </div>
                <div class="table-input" flex>
                    <dl flex>
                        <dt class="date-text">创建日期：</dt>
                        <dd flex>
                            <div class="input-date"><datepicker language="ch" v-model="dateStart" ></datepicker></div>
                            <div class="date-text">到</div>
                            <div class="input-date"><datepicker language="ch" v-model="dateEnd"></datepicker></div>
                        </dd>
                    </dl>
                    <div flex class="handle-btn">
                        <b-btn class="btns">查询</b-btn>
                        <b-btn class="btns">导出</b-btn>
                        <b-btn class="btns">添加</b-btn>
                        <b-btn class="btns"  @click="popShowCtrl(2)">批量审核</b-btn>
                    </div>
                </div>

            </div>
            <div class="coupon-table" flex-box="1">
                <table class="table b-table table-bordered">
                    <tr>
                        <th flex="main:center cross:center">
                            <input type="checkbox" v-model="checkboxAll" @click="checkedAll()">
                        </th>
                        <th v-for="item in fields">{{ item.label }}</th>
                    </tr>
                    <tr v-for="item in items">
                        <td flex="main:center cross:center">
                            <input type="checkbox" name="checkboxInput" v-model="item.isChecked" @click="watcher()">
                        </td>
                        <td>{{ item.checkCode }}</td>
                        <td>{{ item.batches }}</td>
                        <td>{{ item.recodeNo }}</td>
                        <td>{{ item.createTime }}</td>
                        <td>{{ item.creater }}</td>
                        <td>{{ item.status }}</td>
                        <td>{{ item.remarks }}</td>
                        <td><b-button class="btns" @click="popShowCtrl(1)">详情</b-button></td>
                    </tr>
                </table>
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
        <!--详情、审核弹框-->
        <div v-if="popShow" class="sms-box shadow-box" flex="main:center cross:center">
            <div class="sms-detail-wrap sms-wrap">
                <h6 v-if="couponPop.popType == 1">指定发放用户详情</h6>
                <h6 v-else>礼券批量发放审核</h6>
                <div class="sms-detail-content">
                    <div v-if="couponPop.popType == 1" class="sms-detail-table" flex="dir:top">
                        <div flex-box="1">
                            <b-table :items="couponPop.items" :fields="couponPop.fields"  bordered>
                            </b-table>
                        </div>
                        <div class="justify-content-center paging pages" flex-box="0" flex="main:center">
                            <div flex>
                                <div>
                                    <b-pagination prev-text="上一页" next-text="下一页" hide-goto-end-buttons size="md" :total-rows="couponPop.count" :per-page='couponPop.perPage' v-model="couponPop.pageNo" @click.native="couponDetailChange()"></b-pagination>
                                </div>
                                <div class="total"><span>共{{ Math.ceil(count / perPage) }}页</span><span>共{{ count }}条</span></div>
                            </div>
                        </div>
                    </div>
                    <ul v-else class="sms-audit">
                        <li><label for="sms-audit-y"><input type="radio" name="audit" id="sms-audit-y" value="1" v-model="couponPop.tab">通过并发送</label></li>
                        <li flex>
                            <label for="sms-audit-n"><input type="radio" name="audit" id="sms-audit-n" value="0" v-model="couponPop.tab">审核作废</label>
                            <div v-if="couponPop.tab == 0">
                                <b-form-input size="sm" v-model="couponPop.auditReason" placeholder="原因"></b-form-input>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="sms-detail-btn" flex="main:center">
                    <b-btn v-if="couponPop.popType == 1" class="btns" @click.stop="popShow = false">关闭</b-btn>
                    <b-btn v-else class="btns" @click.stop="popShow = false">确定</b-btn>
                </div>
                <div class="sms-close" @click.stop="popShow = false"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import $api from '../tools/api';
    import Confirm from '../components/Confirm';
    import Toast from '../components/Toast';
    import datepicker from 'vue-date';
    export default {
        name: 'coupon-check',
        data(){
            return {
                checkCode: '',
                batches: '',
                statusOptions:[
                    {
                        text: '全部',
                        value: ''
                    },
                    {
                        text: '待审核',
                        value: 0
                    },{
                        text: '审核作废',
                        value: 1
                    },{
                        text: '已审核',
                        value: 2
                    }
                ],
                statusSelected:'',
                dateStart:'',
                dateEnd:'',
                fields:[
                    { label: '审核编号' },
                    {label:'礼券批次'},
                    { label: '导入用户记录条数(人)' },
                    { label: '创建时间' },
                    { label: '创建人' },
                    { label: '状态' },
                    { label: '备注' },
                    { label: '操作' },
                ],
                items:[
                    {
                        isChecked: false,
                        checkCode: '123456789',
                        batches: 1655151658,
                        recodeNo: 21834,
                        createTime: 1502680612000,
                        creater: 'lotustone',
                        status: 1,
                        remarks: 'alpdgtg'
                    },{
                        isChecked: false,
                        checkCode: '234567891',
                        batches: 1655151658,
                        recodeNo: 21834,
                        createTime: 1502680612000,
                        creater: 'lotustone',
                        status: 1,
                        remarks: 'alpdgtg'
                    },{
                        isChecked: false,
                        checkCode: '234567891',
                        batches: 1655151658,
                        recodeNo: 21834,
                        createTime: 1502680612000,
                        creater: 'lotustone',
                        status: 1,
                        remarks: 'alpdgtg'
                    },{
                        isChecked: false,
                        checkCode: '234567891',
                        batches: 1655151658,
                        recodeNo: 21834,
                        createTime: 1502680612000,
                        creater: 'lotustone',
                        status: 1,
                        remarks: 'alpdgtg'
                    },{
                        isChecked: false,
                        checkCode: '234567891',
                        batches: 1655151658,
                        recodeNo: 21834,
                        createTime: 1502680612000,
                        creater: 'lotustone',
                        status: 1,
                        remarks: 'alpdgtg'
                    },{
                        isChecked: false,
                        checkCode: '234567891',
                        batches: 1655151658,
                        recodeNo: 21834,
                        createTime: 1502680612000,
                        creater: 'lotustone',
                        status: 1,
                        remarks: 'alpdgtg'
                    },{
                        isChecked: false,
                        checkCode: '234567891',
                        batches: 1655151658,
                        recodeNo: 21834,
                        createTime: 1502680612000,
                        creater: 'lotustone',
                        status: 1,
                        remarks: 'alpdgtg'
                    },
                ],
                checkboxAll: false,
                perPage:10,
                count:30,
                pageNo:1,
                popShow: false,

                //详情、审核
                couponPop:{
                    popType: 1,
                    fields: {
                        userName: { label: '用户名' },
                        realName:{label:'用户姓名'},
                    },
                    items:[],
                    auditReason:'',
                    perPage:10,
                    count:30,
                    pageNo:1,
                    tab:1
                },
            }
        },
        created(){},
        components: { datepicker },
        computed: {},
        methods: {
            checkedAll() {
                if (this.checkboxAll == true) {
                    this.items.forEach(item => {
                        item.isChecked = true;
                    });
                } else {
                    this.items.forEach(item => {
                        item.isChecked = false;
                    });
                }
            },
            watcher() {
                var checkedLength = 0;
                this.items.forEach(item => {
                    if (item.isChecked) {
                        checkedLength ++;
                    }
                });
                checkedLength == (this.items.length) ? (this.checkboxAll = true) : (this.checkboxAll = false);
            },
            //显示弹框
            popShowCtrl(type) {
                this.popShow = true;
                if (type == 1) {
                    this.couponPop.popType = 1;
                } else {
                    this.couponPop.popType = 2;
                }
            },
            //详情分页
            couponDetailChange(){}
        },
        mounted(){},
        destroyed(){

        }
    }
</script>
