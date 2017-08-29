<template>
    <div class="wrapper sms-check coupon-user" flex="dir:top">
        <div class="common-title" flex-box="0">指定用户</div>
        <div class="coupon-content" flex-box="1" flex="dir:top">
            <ul class="operateObj">
                <li flex>
                    <label>批次号：</label>
                    <div>
                        <div class="list-handle" flex>
                            <b-form-select v-model="batchSelected" :options="batchOptions"></b-form-select>
                            <b-button class="btns" @click="batchAdd">添加</b-button>
                        </div>
                        <ul class="view-list">
                            <li v-for="batch in batchArr">
                                {{ batch }}
                                <a>删除</a>
                            </li>
                        </ul>
                    </div>
                </li>
                <li flex>
                    <label>添加用户：</label>
                    <div>
                        <div flex="main:left" class="list-tabs">
                            <div><input id="single" type="radio" name="add" checked @click="addTypeChange(1)"><label for="single">逐个添加</label></div>
                            <div><input id="batch" type="radio" name="add" @click="addTypeChange(2)"><label for="batch">批量添加</label></div>
                        </div>
                        <div v-if="addType == 1">
                            <div flex class="list-handle">
                                <label>输入用户名：</label>
                                <b-form-input v-model="username" maxlength="50"></b-form-input>
                                <b-button class="btns" @click="usernameAdd">添加</b-button>
                            </div>
                            <ul class="view-list">
                                <li v-for="username in usernameArr">
                                    {{ username }}
                                    <a>删除</a>
                                </li>
                            </ul>
                        </div>
                        <div v-if="addType == 2" flex>
                            <label>导入用户：</label>
                            <b-form-input></b-form-input>
                            <b-button class="btns">确定</b-button>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="submitBtn">
                <b-button class="btns">提交审核</b-button>
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
        name: 'coupon-user',
        data(){
            return {
                batchOptions: [
                    {
                        value: 'lq20170809213',
                        text: 'lq20170809213-注册送20元红包'
                    },{
                        value: 'lq20170809214',
                        text: 'lq20170809214-注册送1%加wfew息券'
                    },{
                        value: 'lq20170809215',
                        text: 'lq20170809215-注册送1%fs加息券'
                    },{
                        value: 'lq20170809216',
                        text: 'lq20170809216-efw%加息券'
                    },{
                        value: 'lq20170809217',
                        text: 'lq201708w息券'
                    },
                ],
                batchSelected: 'lq20170809213',
                popShow: false,
                addType: 1,
                batchArr: [],
                username: '',
                usernameArr: [],
            }
        },
        created(){},
        components: { datepicker },
        computed: {
        },
        methods: {
            //添加类型修改
            addTypeChange(type) {
                this.addType = type;
            },
            //批次号添加
            batchAdd() {
                let batchSelected = this.batchSelected;
                let batchOptions = this.batchOptions;
                let batchOptions_len = batchOptions.length;
                let batchArr = this.batchArr;
                for (let i = 0; i < batchOptions_len; i++) {
                    if (batchSelected == batchOptions[i].value) {
                        if (batchArr.indexOf((batchOptions[i].text)) >= 0) {
                            Toast('不能重复添加同一批次号');
                            return;
                        }
                        batchArr.push(batchOptions[i].text);
                    }
                }
                this.batchArr = batchArr;
            },
            //批次号添加
            usernameAdd() {
                let username = this.username;
                let usernameArr = this.usernameArr;
                if (usernameArr.indexOf(username) >= 0) {
                    Toast('不能重复添加同一用户名');
                    return;
                }
                usernameArr.push(username);
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
        },
        mounted(){},
        destroyed(){

        }
    }
</script>
