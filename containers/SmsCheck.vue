<template>
    <div class="sms wrapper sms-check" flex="dir:top">
        <div class="common-title" flex-box="0">短信发送审核</div>
        <div class="sms-wrap" flex-box="1" flex="dir:top">
            <div class="table-handle" flex-box="0">
                <div class="table-input" flex="main:justify">
                    <dl flex>
                        <dt>请求人：</dt>
                        <dd><b-form-input type="text" size="sm" v-model="requestBy" placeholder="请输入请求用户名"></b-form-input></dd>
                    </dl>
                    <dl flex>
                        <dt>模板编号：</dt>
                        <dd><b-form-input type="text" size="sm" v-model="smsTemplateNo" placeholder="请输入模板编号"></b-form-input></dd>
                    </dl>
                    <dl flex>
                        <dt>状态：</dt>
                        <dd><b-form-select v-model="auditStatus" :options="auditStatusOptions" size="sm"></b-form-select></dd>
                    </dl>
                </div>
                <div class="table-input" flex="main:justify">
                    <dl flex>
                        <dt>类别：</dt>
                        <dd><b-form-select v-model="smsType" :options="smsTypeOptions" size="sm"></b-form-select></dd>
                    </dl>

                    <dl flex>
                        <dt class="date-text">请求时间：</dt>
                        <dd flex>
                            <div class="input-date"><datepicker language="ch" v-model="beginDate"></datepicker></div>
                            <div class="date-text">到</div>
                            <div class="input-date"><datepicker language="ch" v-model="endDate" :min="beginDate"></datepicker></div>
                        </dd>
                    </dl>
                    <div flex class="handle-btn">

                        <b-btn class="btns" @click.stop="search">查询</b-btn>
                        <b-btn class="btns" @click.native="empty">清空</b-btn>
                        <b-btn class="btns" @click.native="addSms">添加短信请求</b-btn>
                    </div>
                </div>
                
            </div>
            <div class="sms-table" flex-box="1">
                <b-table :items="items" :fields="fields"  bordered>
                    <template slot="requestTime" scope="item">{{item.value | timeFormat}}</template>
                    <template slot="smsType" scope="item">
                        <template v-if="item.value == 1">产品上线通知</template>
                        <template v-if="item.value == 2">优惠提醒</template>
                        <template v-if="item.value == 3">客户激活</template>
                        <template v-if="item.value == 4">邀请回归</template>
                        <template v-if="item.value == 5">回访通知</template>
                    </template>
                    <template slot="smsContent" scope="item">
                        <div flex="main:center cross:center" :title="item.value"><span>{{item.value | ellipsisFormat}}</span></div>
                    </template>
                    <template slot="smsDescription" scope="item">
                        <div flex="main:center cross:center" :title="item.value"><span>{{item.value | ellipsisFormat}}</span></div>
                    </template>
                    <template slot="auditTime" scope="item">{{item.value | timeFormat}}</template>
                    <template slot="requestStatus" scope="item">
                        <template v-if="item.value == 1">待审核</template>
                        <template v-if="item.value == -1">审核失败</template>
                        <template v-if="item.value == 2">已审核</template>
                    </template>
                    <template slot="operation" scope="item">
                        <b-btn class="btns" @click.native="detail(item.item,0)">详情</b-btn>
                        <b-btn v-if="item.item.requestStatus == 1" class="btns" @click.native="detail(item.item,1)">审核</b-btn>
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
                                        <li v-for="(item,index) in sendObj.userPhoneList" >
                                            <span>{{item}}</span><a href="javascript:;" @click="deletNumber(index)">删除</a>
                                        </li>
                                    </ul>
                                </div>
                                <div v-show="sendObj.tab==1">
                                    <div flex class="cell-number-add">
                                        <div>导入用户：</div>
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
                                    <div><b-form-select v-model="sendObj.smsTemplateNo" :options="sendObj.smsTemplateNoOptions" size="sm"></b-form-select></div>
                                </div>
                                <div class="sms-inner-contents" v-else>
                                    <div><textarea class="form-control" v-model="sendObj.smsContent" maxlength="300"></textarea></div>
                                    <div class="sms-text-size">{{sendObj.smsContent.length}}/300</div>
                                    <p><i>注：建议输入不多于65个字，超过将拆分多条短信发送！</i></p>
                                    <div flex class="sms-comment">
                                        <span>短信备注：</span>
                                        <b-form-input size="sm" maxlength="50" placeholder="备注" v-model="sendObj.smsDescription"></b-form-input>
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
                <h6>{{smsDetail.title}}</h6>
                <div class="sms-detail-content">
                    <ul class="sms-list">
                        <li flex>
                            <div>请求编号：</div>
                            <div>{{smsDetailItems.requestNo}}</div>
                        </li>
                        <li flex>
                            <div>请求人：</div>
                            <div>{{smsDetailItems.requestBy}}</div>
                        </li>
                        <li flex>
                            <div>请求时间：</div>
                            <div>{{smsDetailItems.requestTime}}</div>
                        </li>
                        <li flex>
                            <div>请求发送条数：</div>
                            <div>{{smsDetailItems.requestSmsNum}}条</div>
                        </li>
                        <li flex>
                            <div>模板编号：</div>
                            <div>{{smsDetailItems.smsTemplateNo}}</div>
                        </li>
                        <li flex>
                            <div>短信类别：</div>
                            <div>
                                <template v-if="smsDetailItems.smsType == 1">产品上线通知</template>
                                <template v-if="smsDetailItems.smsType == 2">优惠提醒</template>
                                <template v-if="smsDetailItems.smsType == 3">客户激活</template>
                                <template v-if="smsDetailItems.smsType == 4">邀请回归</template>
                                <template v-if="smsDetailItems.smsType == 5">回访通知</template>
                            </div>
                        </li>
                        <li flex>
                            <div>短信内容：</div>
                            <div>{{smsDetailItems.smsContent}}</div>
                        </li>
                        <li flex>
                            <div>状态：</div>
                            <div>
                                <template v-if="smsDetailItems.requestStatus == 1">待审核</template>
                                <template v-if="smsDetailItems.requestStatus == -1">审核失败</template>
                                <template v-if="smsDetailItems.requestStatus == 2">已审核</template>
                            </div>
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
                                    <b-pagination prev-text="上一页" next-text="下一页" hide-goto-end-buttons size="md" :total-rows="smsDetail.count" :per-page='smsDetail.pageSize' v-model="smsDetail.pageNo" @click.native="smsDetailChange()"></b-pagination>
                                </div>
                                <div class="total"><span>共{{ Math.ceil(smsDetail.count / smsDetail.pageSize) }}页</span><span>共{{ smsDetail.count }}条</span></div>
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
                    <b-btn  v-else class="btns" @click.native="audit">确定</b-btn>
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
                requestBy:'',
                smsTemplateNo:'',
                smsSendShow:false,
                smsDetailShow:false,
                auditStatusOptions:[
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
                auditStatus:0,
                smsTypeOptions:[
                    {
                        text: '全部',
                        value: 0
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
                smsType:0,
                beginDate:'',
                endDate:'',
                fields: {
                    requestNo: { label: '请求编号' },
                    requestBy:{label:'请求人'},
                    requestTime: { label: '请求时间',thStyle:{minWidth:"150px"} },
                    requestSmsNum: { label: '请求短信条数',thStyle:{minWidth:"96px"} },
                    smsTemplateNo: { label: '模板编号',thStyle:{minWidth:"68px"} },
                    smsType: { label: '短信类别',thStyle:{minWidth:"86px"} },
                    smsContent: { label: '短信内容',tdClass:'ellipsis',thStyle:{minWidth:"66px"} },
                    smsDescription: { label: '短信备注',tdClass:'ellipsis',thStyle:{minWidth:"66px"}},
                    auditTime: { label: '审核时间',thStyle:{minWidth:"150px"} },
                    requestStatus: { label: '状态' },
                    requestDescription: { label: '备注' },
                    operation: { label: '操作',thStyle:{width:"120px"} },
                },
                items:[],
                perPage:20,
                count:0,
                pageNo:1,
                sendObj:{
                    tab:0,
                    cellNumber:'',
                    userPhoneList:[],
                    innerTab:0,
                    smsContent:'',
                    smsDescription:'',
                    smsTypeOptions:[
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
                    smsType:1,
                    smsTemplateNoOptions:[
                        {
                            value:'DX20170830112',
                            text:'DX20170830112-生日短信',
                        }
                    ],
                    smsTemplateNo:'DX20170830112'
                },
                smsDetail:{
                    operate:true,
                    title:'短信发送详情',
                    fields: {
                        mobile: { label: '用户名' },
                        userName:{label:'姓名'},
                    },
                    items:[],
                    auditReason:'',
                    pageSize:5,
                    count:0,
                    pageNo:1,
                    tab:1
                },
                smsDetailItems:null,
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
                fileName:'',
                submitClick:true
            }
        },
        created(){
            this.getList();
            
        },
        components: { datepicker,VueFileUpload},
        computed: {
            messCount:function(){
                if(this.sendObj.tab == 0){
                    return (this.sendObj.userPhoneList.length);
                }
                return '未上传'
            }
        },
        methods: {
            //查询
            search(){
                this.pageNo = 1;
                this.getList();
            },
            //清除
            empty(){
                this.requestBy = '';
                this.smsTemplateNo = '';
                this.auditStatus = 0;
                this.smsType = 0;
                this.beginDate = '';
                this.endDate = '';
                console.log(this.smsType);
            },
            addSms(){
                this.smsSendShow = true;
            },
            pageChange(){
                console.log(this.pageNo);
            },
            detail(item,type){
                this.smsDetailItems = item;
                this.getDetailList();
                this.smsDetailShow = true;
                if(type){
                    //审核
                    this.smsDetail.title = '短信发送审核';
                    this.smsDetail.operate = true;
                    return false;
                }
                this.smsDetail.title = '短信发送详情';
                this.smsDetail.operate = false;
            },
            getList(){
                let {requestBy,smsTemplateNo,auditStatus,smsType,beginDate,endDate,pageSize,pageNo} = this;
                $api.get('/message/lstSmsSendRequest',{
                    requestBy,
                    smsTemplateNo,
                    auditStatus,
                    smsType,
                    beginDate,
                    endDate,
                    pageSize,
                    pageNo
                }).then((res)=>{
                    if(res.code == 200){
                        this.count = res.data.totalCount;
                        this.items = res.data.items;
                    }
                });
            },
            getDetailList(){
                let auditId = this.smsDetailItems.id;
                let {pageSize,pageNo} = this.smsDetail;
                $api.get('/message/lstSmsSendRequestDetail',{
                    auditId,
                    pageSize,
                    pageNo
                }).then((res)=>{
                    if(res.code == 200){
                        this.smsDetail.count = res.data.totalCount;
                        this.smsDetail.items = res.data.items;
                    }
                });
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
                this.sendObj.userPhoneList.push(cellNumber);
            },
            //删除手机号
            deletNumber(index){
                this.sendObj.userPhoneList.splice(index,1);
            },
            //提交请求
            smsSubmit(){
                if(!this.submitClick){
                    //避免重复提交
                    return false;
                }
                if(this.messCount < 1){
                    Toast('请先添加手机号！');
                    return false;
                }
                if(this.sendObj.innerTab){
                    //自定义
                    if(this.sendObj.smsContent.trim().length<1){
                        Toast('短信内容不能为空！');
                        return false;
                    }
                    if(this.sendObj.smsDescription.trim().length<1){
                        Toast('短信备注不能为空！');
                        return false;
                    }
                }
                this.submitClick = false;
                console.log(this.sendObj);
                let {userPhoneList,smsType,smsTemplateNo,smsContent,smsDescription} = this.sendObj;
                let userPhoneStr = userPhoneList.join(",");
                $api.post('/message/insertSmsSendRequestByList',{
                    userPhoneList:userPhoneStr,
                    smsType,
                    smsTemplateNo,
                    smsContent,
                    smsDescription
                }).then((res)=>{
                    this.submitClick = true;
                    if(res.code == 200){
                        this.smsSendShow = false;
                        this.sendObj.tab = 0;
                        this.sendObj.cellNumber = '';
                        this.sendObj.userPhoneList = [];
                        this.sendObj.innerTab = 0;
                        this.sendObj.smsContent = '';
                        this.sendObj.smsDescription = '';
                        this.sendObj.smsType = 1;
                        this.empty();
                        this.pageNo = 1;
                        this.getList();
                    }else{
                        Toast(res.message || '服务器错误！');
                    }
                });
            },
            //详情分页
            smsDetailChange(){
                this.getDetailList()
            },
            //确定审核
            audit(){
                if(!this.submitClick){
                    //避免重复提交
                    return false;
                }
                let {smsDetail,smsDetailItems} = this;
                console.log(smsDetail);
                let auditOpinion = smsDetail.auditReason;
                console.log(auditOpinion,smsDetail.tab);
                if(smsDetail.tab == 1){
                    auditOpinion = null;
                }else{
                    console.log(auditOpinion.trim().length)
                    if(auditOpinion.trim().length<1){
                        Toast('请输入审核作废原因！');
                        return false;
                    }
                }
                this.submitClick = false;
                $api.post('/message/smsSendRequestAudit',{
                    requestNo:smsDetailItems.requestNo,
                    isAudited:smsDetail.tab,
                    auditOpinion:auditOpinion
                }).then((res)=>{
                    this.submitClick = true;
                    if(res.code == 200){
                        this.smsDetailShow = false;
                        this.getList();
                    }else{
                        Toast(res.message || '服务器错误！');
                    }
                });
            },
            //添加上传文件
            onAddItem(files){
                this.files = files;
                console.log(files);
                let name = files[files.length-1].name;
                let type = files[files.length-1].type;
                if(!(/\.xl(s[xmb]|t[xm]|am)$/.test(name)) || (/\.xl(s[xmb]|t[xm]|am)$/.test(type))){
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
