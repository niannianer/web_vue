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
                            <li v-for="batch in batchArr" flex>
                                <div>{{ batch }}</div>
                                <a @click="arrRemove(batch,batchArr)">删除</a>
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
                                <div><b-form-input v-model="username" maxlength="11"></b-form-input></div>
                                <div><b-button class="btns" @click="usernameAdd(username)">添加</b-button></div>
                                <!--<div>已添加<b>{{usernameArr.length}}</b>条</div>-->
                            </div>
                            <ul class="view-list username-list">
                                <li v-for="username in usernameArr">
                                    {{ username }}
                                    <a @click="arrRemove(username, usernameArr)">删除</a>
                                </li>
                            </ul>
                            <!--<div>已添加<b>{{usernameArr.length}}</b>条</div>-->
                        </div>
                        <div v-if="addType == 2" flex>
                            <label>导入用户：</label>
                            <div flex class="upload">
                                <div class="upload-excel" flex>
                                    <input type="file" ref="fileInput" class="file" @change="fileChange"/>
                                    <div flex>
                                        <b-button class="btn btns">选择文件</b-button>
                                        <span class="excel-name">{{fileName}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="submitBtn">
                <b-button class="btns" @click="submit">提交审核</b-button>
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
    import ConfirmOnly from '../components/ConfirmOnly';
    import datepicker from 'vue-date';
    import VueFileUpload  from 'vue-file-upload';
    import {checkPhone} from '../tools/operation';
    let file= null;
    export default {
        name: 'coupon-user',
        data(){
            return {
                batchOptions: [],
                batchSelected: '',
                popShow: false,
                addType: 1,
                batchArr: [],
                username: '',
                usernameArr: [],
                usernameNo: 0,

                //文件上传
                maxSize:2097152,
                files:[],
                fileName:''
            }
        },
        created(){
            this.getBatchs();
        },
        components: { datepicker, VueFileUpload },
        computed: {},
        methods: {
            //获取批次号
            getBatchs() {
                $api.get('/coupon/allCouponList',{

                }).then(res=>{
                    if(res.code == 200){
                        let resBatchsList =  res.data;
                        resBatchsList.forEach(item => {
                            this.batchOptions.push({value: item.ccCode, text: item.ccCode + '-' + item.ccName});
                        });
                        this.batchSelected = resBatchsList[0].ccCode;
                    }
                });
            },
            //添加批次号
            batchAdd() {
                let batchSelected = this.batchSelected;
                let batchOptions = this.batchOptions;
                let batchOptions_len = batchOptions.length;
                let batchArr = this.batchArr;
                if (batchArr.length >= 4) {
                    Toast('批次号最多添加20条');
                    return;
                }
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
            //添加用户类型修改
            addTypeChange(type) {
                this.addType = type;
            },
            //添加用户名
            usernameAdd(username) {
                username = username.trim();
                let usernameArr = this.usernameArr;
                if (username == '' || !checkPhone(username)) {
                    Toast('请输入正确定用户名！');
                    return;
                } else {
                    $api.get('/coupon/getUser',{
                        userPhone: username
                    }).then(res=>{
                        if(res.code == 200){
                            usernameArr.push(username);
                        } else {
                            if (res.code == 1001) {
                                ConfirmOnly({
                                    title:'提示',
                                    content:'该用户非平台注册用户！'
                                });
                            }
                        }
                    });
                }
            },
            //删除数组
            arrRemove(removeItem, originArr) {
                let pos = originArr.indexOf(removeItem);
                originArr.splice(pos, 1);
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
            //添加上传文件
            onAddItem(files){
                this.files = files;
                let name = files[files.length-1].name;
                if(!(/\.xl(s[xmb]|t[xm]|am)$/.test(name))){
                    Toast('请选择excel文件上传！');
                    return false;
                }
                if(files[files.length-1].size>this.maxSize){
                    Toast('上传文件不要大于2M！');
                    return false;
                }
            },
            //跳转到列表页
            redirectTo(){
                location.href = 'coupon-check.html';
            },
            //文件更改
            fileChange(event){
                file = event.target.files[0];
                let name = file.name;
                let type = file.type;
                let checkType1 = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                let checkType2 = 'application/vnd.openxmlformats-officedocument.spreadsheetml.template';
                let checkType3 = 'application/vnd.ms-excel';
                this.fileName = file.name;
                if(type == ''){
                    if(!/\.xl(s[xmb]|t[xm]|am)$/.test(name)){
                        Toast('请选择excel文件上传！');
                        this.fileName = '';
                        return false;
                    }
                }else if((type != checkType1) && (type != checkType2) && (type != checkType3) && !(/\.xl(s[xmb]|t[xm]|am)$/.test(type))){
                    Toast('请选择excel文件上传！');
                    this.fileName = '';
                    return false;
                }
                if (Math.round(file.size / 1024 / 1024) > 2) {
                    this.fileName = '';
                    Toast('文件大小不得超过2M');
                    return false;
                }
            },
            //提交审核
            submit() {
                let batchArrStr = this.batchArr.join(',');
                let usernameArrStr = this.usernameArr.join(',');
                if (this.batchArr == '') {
                    Toast('请添加批次号');
                    return;
                }
                if(this.addType == 1 && this.usernameArr == '' || this.addType == 2 && this.fileName == '') {
                    Toast('请添加用户');
                    return;
                }
                let form =new FormData();
                if(this.addType == 2) {
                    form.append('file', file, file.name);
                    usernameArrStr = '';
                }
                form.append('ccCodeList',batchArrStr);
                form.append('userPhoneList',usernameArrStr);
                fetch($api.serverUrl+'/coupon/insertSpecifiedDistribution', {
                    method: 'POST',
                    body: form
                }).then(res=>{
                    if (res.status == 200){
                        return res.json();
                    }
                }).then(res=>{
                    if (res.code == 200){
                        Toast('提交成功！');
                        setTimeout(()=> {
                            this.redirectTo();
                        }, 3000);
                    } else {
                        Toast(res.msg);
                        return;
                    }
                });
            },
        },
        mounted(){},
        destroyed(){}
    }
</script>
