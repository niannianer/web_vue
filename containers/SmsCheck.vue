<template>
    <div class="sms wrapper sms-check" flex="dir:top">
        <div class="common-title" flex-box="0">短信发送审核</div>
        <div class="sms-wrap" flex-box="1" flex="dir:top">
            <div class="table-handle" flex-box="0">
                <div class="table-input" flex="main:justify">
                    <dl flex>
                        <dt>请求用户名：</dt>
                        <dd><b-form-input type="text" size="sm" v-model="requireUserName" placeholder="请输入请求用户名"></b-form-input></dd>
                    </dl>
                    <dl flex>
                        <dt>用户姓名：</dt>
                        <dd><b-form-input type="text" size="sm" v-model="userName" placeholder="请输入用户姓名"></b-form-input></dd>
                    </dl>
                    <dl flex>
                        <dt>模板编号：</dt>
                        <dd><b-form-input type="text" size="sm" v-model="modelNum" placeholder="请输入模板编号"></b-form-input></dd>
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
                        <dt class="date-text">请求时间：</dt>
                        <dd flex>
                            <div class="input-date"><datepicker language="ch" v-model="dateStart" ></datepicker></div>
                            <div class="date-text">到</div>
                            <div class="input-date"><datepicker language="ch" v-model="dateEnd"></datepicker></div>
                        </dd>
                    </dl>
                    <div flex class="handle-btn">

                        <b-btn class="btns" >查询</b-btn>
                        <b-btn class="btns" >清空</b-btn>
                        <b-btn class="btns" >添加短信请求</b-btn>
                    </div>
                </div>
                
            </div>
            <div class="sms-table" flex-box="1">
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
            <div class="justify-content-center paging pages" flex-box="0" flex="main:center">
                <div flex>
                    <div>
                        <b-pagination prev-text="上一页" next-text="下一页" hide-goto-end-buttons size="md" :total-rows="count" :per-page='perPage' v-model="pageNo" @click.native="pageChange()"></b-pagination>
                    </div>
                    <div class="total"><span>共{{ Math.ceil(count / perPage) }}页</span><span>共{{ count }}条</span></div>
                </div>
            </div>
        </div>
        <div class="sms-box shadow-box" flex="main:center cross:center" v-if="smsSendShow">
            <div class="sms-send-wrap sms-wrap">
                <h6>发送短信请求</h6>
                <ul class="sms-send-content">
                    <li class="sms-content-list" flex>
                        <div class="sms-content-left">添加用户：</div>
                        <div class="sms-content-right">
                            <div class="sms-tabs">
                                <label for="every-add"><input type="radio" id="every-add" name="style" value="0" v-model="sendObj.tab">逐个添加</label>
                                <label for="all-add"><input type="radio" name="style" id="all-add" value="1"  v-model="sendObj.tab" >批量添加</label>
                            </div>
                            <div class="sms-add-list">
                                <div v-show="sendObj.tab==0">
                                    <div flex class="cell-number-add" flex>
                                        <div>输入用户名：</div>
                                        <div class="add-space">
                                            <b-form-input size="sm" maxlength="11" placeholder="请输入手机号" v-model="sendObj.cellNumber"></b-form-input>
                                        </div>
                                        <div style="font-size:0"><b-btn class="btns" @click.native="addNumber">添加</b-btn></div>
                                    </div>
                                    <ul class="cell-number-list clear-both">
                                        <li v-for="(item,index) in sendObj.cellNumberList" >
                                            <span>{{item}}</span><a href="javascript:;" @click="deletNumber(index)">删除</a>
                                        </li>
                                    </ul>
                                </div>
                                <div v-show="sendObj.tab==1">
                                    <div flex class="cell-number-add">
                                        <div>导入用户1：</div>
                                        <div class="upload-excel" flex>
                                            <vue-file-upload 
                                                url='http://10.10.10.72:8888/file/fileUpload'
                                                label=""
                                                ref="vueFileUploader"
                                                v-bind:events = "cbEvents"
                                                v-bind:request-options = "reqopts"
                                                v-on:onAdd = "onAddItem"></vue-file-upload>
                                            <span class="excel-name">{{fileName}}</span>
                                        </div>
                                        <div style="font-size:0"><b-btn class="btns" @click="uploadExcel">确定</b-btn></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="sms-content-list" flex>
                        <div class="sms-content-left">请求发送条数：</div>
                        <div class="sms-content-right">{{messCount}}</div>
                    </li>
                    <li class="sms-content-list" flex>
                        <div class="sms-content-left">短信类别：</div>
                        <div class="sms-content-right"><b-form-select v-model="sendObj.smsType" :options="sendObj.smsTypeOptions" size="sm"></b-form-select></div>
                    </li>
                    <li class="sms-content-list" flex>
                        <div class="sms-content-left">短信内容：</div>
                        <div class="sms-content-right">
                            <div class="sms-tabs">
                                <label for="radio-template"><input type="radio" id="radio-template" name="inner" value="0" v-model="sendObj.innerTab">模板添加</label>
                                <label for="radio-defined"><input type="radio" name="inner" id="radio-defined" value="1"  v-model="sendObj.innerTab" >自定义</label>
                            </div>
                            <div class="sms-inner-s" flex="cross:center">
                                <div class="sms-inner-tabs" flex v-if="sendObj.innerTab == 0">
                                    <div>短信模板编号：</div>
                                    <div><b-form-select v-model="sendObj.smsTemplate" :options="sendObj.smsTemplateOptions" size="sm"></b-form-select></div>
                                </div>
                                <div class="sms-inner-contents" v-else>
                                    <div><textarea class="form-control" v-model="sendObj.smsText" maxlength="300"></textarea></div>
                                    <div class="sms-text-size">{{sendObj.smsText.length}}/300</div>
                                    <p><i>注：建议输入不多于65个字，超过将拆分多条短信发送！</i></p>
                                    <div flex class="sms-comment">
                                        <span>短信备注：</span>
                                        <b-form-input size="sm" maxlength="50" placeholder="备注" v-model="sendObj.cellNumber"></b-form-input>
                                        <span class="lint">限制50个字以内</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>

                </ul>
                <div class="sms-send-btn" flex="main:center">
                    <b-btn class="btns" @click.stop="smsSubmit">提交请求</b-btn>
                </div>
                <div class="sms-close" @click.stop="smsSendShow = false"></div>
            </div>
        </div>
        <div class="sms-box shadow-box" flex="main:center cross:center" v-if="smsDetailShow">
            <div class="sms-detail-wrap sms-wrap">
                <h6>短信发送详情</h6>
                <div class="sms-detail-content">
                    <ul class="sms-list">
                        <li flex>
                            <div>请求编号：</div>
                            <div>11100000</div>
                        </li>
                        <li flex>
                            <div>请求人：</div>
                            <div>rwrewr-张倩</div>
                        </li>
                        <li flex>
                            <div>请求时间：</div>
                            <div>2017.09.09 12:21:35</div>
                        </li>
                        <li flex>
                            <div>请求发送条数：</div>
                            <div>89条</div>
                        </li>
                        <li flex>
                            <div>模板编号：</div>
                            <div>89条</div>
                        </li>
                        <li flex>
                            <div>短信类别：</div>
                            <div>89条</div>
                        </li>
                        <li flex>
                            <div>短信内容：</div>
                            <div>89条</div>
                        </li>
                        <li flex>
                            <div>状态：</div>
                            <div>待审核</div>
                        </li>
                    </ul>
                    <div class="sms-detail-table" flex="dir:top">
                        <div flex-box="1">
                            <b-table :items="smsDetail.items" :fields="smsDetail.fields"  bordered>
                                
                            </b-table>
                        </div>
                        <div class="justify-content-center paging pages" flex-box="0" flex="main:center">
                            <div flex>
                                <div>
                                    <b-pagination prev-text="上一页" next-text="下一页" hide-goto-end-buttons size="md" :total-rows="smsDetail.count" :per-page='smsDetail.perPage' v-model="smsDetail.pageNo" @click.native="smsDetailChange()"></b-pagination>
                                </div>
                                <div class="total"><span>共{{ Math.ceil(count / perPage) }}页</span><span>共{{ count }}条</span></div>
                            </div>
                        </div>
                    </div>
                    <ul class="sms-audit" v-if="smsDetail.operate">
                        <li><label for="sms-audit-y"><input type="radio" name="audit" id="sms-audit-y" value="1" v-model="smsDetail.tab">通过并发送</label></li>
                        <li flex>
                            <label for="sms-audit-n"><input type="radio" name="audit" id="sms-audit-n" value="0" v-model="smsDetail.tab">审核作废</label>
                            <div v-if="smsDetail.tab == 0">
                                <b-form-input size="sm" v-model="smsDetail.auditReason" placeholder="原因"></b-form-input>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="sms-detail-btn" flex="main:center">
                    <b-btn v-if="!smsDetail.operate" class="btns" @click.stop="smsDetailShow = false">关闭</b-btn>
                    <b-btn  v-else class="btns" @click.stop="smsDetailShow = false">确定</b-btn>
                </div>
                <div class="sms-close" @click.stop="smsDetailShow = false"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import $api from '../tools/api';
    import {checkPhone} from '../tools/operation';
    import Confirm from '../components/Confirm';
    import Toast from '../components/Toast';
    import datepicker from 'vue-date';
    import VueFileUpload  from 'vue-file-upload';
    //console.log('66',FileUpload);
    export default {
        name: 'sms-check',
        data(){
            return {
                requireUserName:'',
                userName:'',
                modelNum:'',
                smsSendShow:true,
                smsDetailShow:false,
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
                sendObj:{
                    tab:0,
                    cellNumber:'',
                    cellNumberList:[],
                    innerTab:0,
                    smsText:'',
                    smsTypeOptions:[
                        {
                            value:0,
                            text:'客户回归',
                        },
                        {
                            value:1,
                            text:'list1'
                        },
                        {
                            value:2,
                            text:'list2'
                        }
                    ],
                    smsType:0,
                    smsTemplateOptions:[
                        {
                            value:0,
                            text:'生日快乐',
                        },
                        {
                            value:1,
                            text:'情人节快乐'
                        },
                        {
                            value:2,
                            text:'没了'
                        }
                    ],
                    smsTemplate:0
                },
                smsDetail:{
                    operate:true,
                    fields: {
                        userName: { label: '用户名' },
                        realName:{label:'姓名'},
                    },
                    items:[],
                    auditReason:'',
                    perPage:10,
                    count:30,
                    pageNo:1,
                    tab:1
                },
                maxSize:2097152,
                files:[],
                //文件过滤器，只能上传excel
                filters:[
                    {
                      name:"filter",
                      fn(file){
                          var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                          return '|xlsx|xls|'.indexOf(type) !== -1;
                      }
                    }
                ],
                //回调函数绑定
                cbEvents:{
                    onCompleteUpload:(file,response,status,header)=>{
                      console.log(file);
                      console.log("finish upload;")
                    }
                },
                  //xhr请求附带参数
                reqopts:{
                    formData:{
                      tokens:'tttttttttttttt'
                    },
                    responseType:'json',
                    withCredentials:false
                },
                fileName:''
            }
        },
        created(){},
        components: { datepicker,VueFileUpload},
        computed: {
            messCount:function(){
                if(this.sendObj.tab == 0){
                    return (this.sendObj.cellNumberList.length);
                }
                return '未上传'
            }
        },
        methods: {
            pageChange(){
                console.log(this.pageNo);
            },
            //添加手机号
            addNumber(){
                let cellNumber = String(this.sendObj.cellNumber).replace(/\s+/g, "");
                if(cellNumber.length < 1){
                    Toast('请输入手机号！');
                    return false;
                }
                if(!checkPhone(cellNumber)){
                    Toast('手机格式输入有误！');
                    return false;
                }
                this.sendObj.cellNumberList.push(cellNumber);
            },
            //删除手机号
            deletNumber(index){
                this.sendObj.cellNumberList.splice(index,1);
            },
            //提交请求
            smsSubmit(){

            },
            //详情分页
            smsDetailChange(){

            },
            //
            //添加上传文件
            onAddItem(files){
                this.files = files;
                console.log(files);
                let name = files[files.length-1].name;
                if(!(/\.xl(s[xmb]|t[xm]|am)$/.test(name))){
                    Toast('请选择excel文件上传！');
                    return false;
                }
                if(files[files.length-1].size>this.maxSize){
                    Toast('上传文件不要大于2M！');
                    return false;
                }
                this.fileName = name;
            },
            uploadExcel(){
                if(this.fileName){
                    this.files[this.files.length-1].upload();
                    return true;
                }
                Toast('请先选择上传文件！');
            }
        },
        mounted(){},
        destroyed(){

        }
    }
</script>
