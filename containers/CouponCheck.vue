<template>
    <div class="wrapper sms-check coupon-check" flex="dir:top">
        <div class="common-title" flex-box="0">指定发放审核</div>
        <div class="coupon-content" flex-box="1" flex="dir:top">
            <div class="table-handle" flex-box="0">
                <div class="table-input" flex="main:justify">
                    <dl flex>
                        <dt>审核编码：</dt>
                        <dd><b-form-input type="text" size="sm" maxlength="20" v-model="auditId" placeholder="请输入审核编码"></b-form-input></dd>
                    </dl>
                    <dl flex>
                        <dt>批次号：</dt>
                        <dd><b-form-input type="text" size="sm" maxlength="20" v-model="ccCodes" placeholder="请输入批次号"></b-form-input></dd>
                    </dl>
                    <dl flex>
                        <dt class="date-text">创建日期：</dt>
                        <dd flex>
                            <div class="input-date"><datepicker language="ch" v-model="dateStart" ></datepicker></div>
                            <div class="date-text">到</div>
                            <div class="input-date"><datepicker language="ch" v-model="dateEnd" :min="dateStart"></datepicker></div>
                        </dd>
                    </dl>
                </div>
                <div class="table-input"  flex="main:justify">
                    <dl flex>
                        <dt>状态：</dt>
                        <dd><b-form-select v-model="statusSelected" :options="statusOptions" size="sm"></b-form-select></b-form-input></dd>
                    </dl>
                    <div flex class="handle-btn">
                        <b-btn class="btns" @click="search">查询</b-btn>
                        <!--<b-btn class="btns">导出</b-btn>-->
                        <b-btn class="btns" @click.native="addUser">添加</b-btn>
                        <b-btn class="btns"  @click="popShowCtrl(2)">批量审核</b-btn>
                    </div>
                </div>

            </div>
            <div class="coupon-table" flex-box="1">
                <table class="table b-table table-bordered">
                    <tr>
                        <th flex="main:center cross:center">
                            <input type="checkbox" :checked="isCheckedAll" @click="checkedAll()">
                        </th>
                        <th v-for="item in fields">{{ item.label }}</th>
                    </tr>
                    <tr v-for="item in items">
                        <td flex="main:center cross:center">
                            <input v-if="item.auditStatus == 1" type="checkbox" name="checkboxInput" :checked="item.isChecked" @click="watcher(item)">
                        </td>
                        <td>{{ item.auditId }}</td>
                        <td>{{ item.ccCodes }}</td>
                        <td>{{ item.userCount }}</td>
                        <td>{{ item.createTime | timeFormat }}</td>
                        <td>{{ item.creatorUserid }}</td>
                        <td v-if="item.auditStatus == 1">待审核</td>
                        <td v-if="item.auditStatus == 2">已审核</td>
                        <td v-if="item.auditStatus == -1">审核作废</td>
                        <td>{{ item.auditOpinion }}</td>
                        <td><b-button class="btns" @click="popShowCtrl(1,item.auditId)">详情</b-button></td>
                    </tr>
                </table>
            </div>
            <div class="justify-content-center paging pages" flex-box="0" flex="main:center">
                <div flex>
                    <div>
                        <b-pagination prev-text="上一页" next-text="下一页" hide-goto-end-buttons size="md" :total-rows="count" :per-page='perPage' v-model="pageNo" @click.native="pageChange()"></b-pagination>
                    </div>
                    <div class="total"><span>共{{ Math.ceil(count / perPage) }}页</span>/<span>共{{ count }}条</span></div>
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
                                <div class="total"><span>共{{ Math.ceil(couponPop.count / perPage) }}页</span>/<span>共{{ couponPop.count }}条</span></div>
                            </div>
                        </div>
                    </div>
                    <ul v-else class="sms-audit">
                        <li><label for="sms-audit-y"><input type="radio" name="audit" id="sms-audit-y" value="1" v-model="couponPop.tab">通过并发送</label></li>
                        <li flex>
                            <label for="sms-audit-n"><input type="radio" name="audit" id="sms-audit-n" value="0" v-model="couponPop.tab">审核作废</label>
                            <div v-if="couponPop.tab == 0">
                                <b-form-input size="sm" maxlength="50" v-model="couponPop.auditReason" placeholder="原因"></b-form-input>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="sms-detail-btn" flex="main:center">
                    <b-btn v-if="couponPop.popType == 1" class="btns" @click.stop="popShow = false;couponPop.tab = 1;couponPop.pageNo = 1">关闭</b-btn>
                    <b-btn v-else class="btns" @click.stop="postAudits">确定</b-btn>
                </div>
                <div class="sms-close" @click.stop="popShow = false;couponPop.tab = 1;couponPop.pageNo = 1"></div>
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
                auditId: '',
                ccCodes: '',
                statusOptions: [
                    {
                        text: '全部',
                        value: 0
                    },
                    {
                        text: '待审核',
                        value: 1
                    },{
                        text: '审核作废',
                        value: -1
                    },{
                        text: '已审核',
                        value: 2
                    }
                ],
                statusSelected: '',
                dateStart: '',
                dateEnd: '',
                fields: [
                    { label: '审核编号' },
                    {label:'礼券批次'},
                    { label: '导入用户记录条数' },
                    { label: '创建时间' },
                    { label: '创建人' },
                    { label: '状态' },
                    { label: '备注' },
                    { label: '操作' },
                ],
                items: [],
                isCheckedAll: false,
                perPage: 20,
                count: 0,
                pageNo: 1,
                popShow: false,
                ingAuditId: '',
                auditIdStr: '',
                //详情、审核
                couponPop:{
                    popType: 1,
                    fields: {
                        userPhone: { label: '用户名' },
                        userName: {label:'用户姓名'},
                    },
                    items:[],
                    auditReason:'',
                    perPage:10,
                    count:0,
                    pageNo:1,
                    tab:1,
                },
            }
        },
        created(){
            this.getTable();
        },
        components: { datepicker },
        computed: {},
        methods: {
            //获取列表数据
            getTable() {
                $api.get('/coupon/getCouponSpecifiedDistributionList',{
                    pageNo: this.pageNo,
                    pageSize: this.perPage,
                    auditId: this.auditId,
                    ccCode: this.ccCodes,
                    beginDate: this.dateStart,
                    endDate: this.dateEnd,
                    auditStatus: this.statusSelected
                }).then(res=>{
                    if(res.code == 200){
                        this.items = res.data.items;
                        this.count = res.data.totalCount;
                        this.items.forEach(item => {
                            item.isChecked = false;
                        });
                    }
                });
            },
            //获取详情列表数据
            getDetailTable() {
                $api.get('/coupon/getCouponDetailList',{
                    auditId: this.ingAuditId,
                    pageNo: this.couponPop.pageNo,
                    pageSize: this.couponPop.perPage
                }).then(res=>{
                    if(res.code == 200){
                        this.couponPop.items = res.data.items;
                        this.couponPop.count = res.data.totalCount;
                    }
                });
            },
            //分页
            pageChange(){
                this.getTable();
                this.isCheckedAll = false;
            },
            //详情分页
            couponDetailChange(){
                this.getDetailTable();
            },
            //查询
            search() {
                if(this.dateStart == '' && this.dateEnd != '') {
                    Toast('请选择开始时间')
                    return;
                } else if (this.dateStart != '' && this.dateEnd == '') {
                    Toast('请选择结束时间')
                    return;
                }
                this.getTable();
            },
            //全选
            checkedAll() {
                this.isCheckedAll = !this.isCheckedAll;
                if (this.isCheckedAll == true) {
                    this.items.forEach(item => {
                        if (item.auditStatus == 1) {
                            item.isChecked = true;
                        }
                    });
                } else {
                    this.items.forEach(item => {
                        item.isChecked = false;
                    });
                }
            },
            //单选监控
            watcher(item) {
                item.isChecked = !item.isChecked;
                for(let item of this.items) {
                    if (item.auditStatus == 1 && !item.isChecked) {
                        this.isCheckedAll = false;
                        return;
                    }
                }
                this.isCheckedAll = true;
            },
            //显示弹框
            popShowCtrl(type, auditId) {
                if (type == 1) {
                    this.ingAuditId = auditId;
                    this.popShow = true;
                    this.couponPop.popType = 1;
                    this.getDetailTable(auditId);
                } else {
                    this.getAuditIds();
                    if (this.auditIdStr == '') {
                        Toast('您未选择任何条目');
                        return;
                    }
                    this.popShow = true;
                    this.couponPop.popType = 2;
                }
            },
            //跳转到添加用户
            addUser(){
                location.href = 'coupon-add.html';
            },
            //获取选中审核编号
            getAuditIds() {
                for(let item of this.items) {
                    if (item.isChecked) {
                        this.auditIdStr += item.auditId + '|';
                    }
                }
            },
            //上传审核结果
            postAudits() {
                if (this.couponPop.tab == 1) {
                    this.couponPop.auditReason = ''
                } else {
                    if ((this.couponPop.auditReason).trim() == '') {
                        Toast('审核作废原因不能为空');
                        return;
                    }
                }
                this.popShow = false;
                this.couponPop.tab = 1;
                $api.post('/coupon/couponAudit',{
                    auditIdList: this.auditIdStr,
                    isAudited: this.couponPop.tab,
                    auditOpinion: this.couponPop.auditReason
                }).then(res=>{
                    if(res.code == 200){
                        Toast('批量审核成功！');
                        setTimeout(() => {
                            this.getTable();
                            this.isCheckedAll = false;
                        }, 3000);
                    }
                });
            }
        },
        mounted(){
        },
        destroyed(){
        }
    }
</script>
