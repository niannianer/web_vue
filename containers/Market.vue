<template>
    <div class="market wrapper">
        <div class="common-title">体验金管理</div>
        <div class="market-wrap">
            <div class="market-handle table-handle" flex="main:justify">
                <dl class="table-input" flex>
                    <dt>体验金名称：</dt>
                    <dd><b-form-input type="text" size="sm" v-model="experienceName" placeholder="请输入体验金名称"></b-form-input></dd>
                    <dt>状态：</dt>
                    <dd><b-form-select v-model="etStatus" :options="options" size="sm"></b-form-select></b-form-input></dd>
                </dl>
                <div class="table-btn" flex>
                    <b-btn class="btns" @click.native="search">查询</b-btn>
                    <b-btn class="btns" @click.native="addMarket(0)">添加</b-btn>
                </div>
            </div>
            <div class="market-table">
                <b-table :items="items" :fields="fields"  bordered>
                    <template slot="experienceAmount" scope="item">{{ item.value | currencyFormat}}</template>
                    <template slot="annualInterestRate" scope="item">{{ item.value | translatePateInt}}</template>
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
    </div>
</template>

<script>
    import $api from '../tools/api';
    import Confirm from '../components/Confirm';
    export default {
        name: 'market',
        data(){
            return {
                etStatus:'',
                pageNo:1,
                pageSize:20,
                count:0,
                perPage:20,
                experienceName:'',
                options: [
                    {
                        text: '全部',
                        value: ''
                    },
                    {
                        text: '待激活',
                        value: 0
                    },{
                        text: '已激活',
                        value: 1
                    },{
                        text: '已停用',
                        value: 2
                    }
                ],
                fields: {
                    etUuid: { label: '体验金编号' },
                    experienceName:{label:'体验金名称'},
                    experienceAmount: { label: '金额(元)' },
                    annualInterestRate: { label: '年化收益率' },
                    rateDays: { label: '计息天数' },
                    issueNode: { label: '发放节点' },
                    conditionProductPeriod: { label: '领取条件' },
                    etStatus: { label: '状态' },
                    createTime: { label: '创建时间' },
                    operation: { label: '操作' },
                },
                items:[]
            }
        },
        created(){
            this.getTable();
        },
        computed: {},
        methods: {
            getTable(){
                $api.get('/market/getMarketTemplateList',{
                    etStatus:this.etStatus,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    experienceName:this.experienceName
                }).then(msg=>{
                    if(msg.code == 200){
                        this.items = msg.data.newsList;
                        this.count = msg.data.count;
                    }
                });
            },
            pageChange(){
                this.$nextTick(()=>{
                    this.getTable();
                });
            },
            search(){
                this.pageNo = 1;
                this.getTable();
            },
            //激活&停用
            updateMarket(etUuid,etStatus){
                let content = '请确认是否激活体验金“注册体验金”？';
                let okText = '确认激活';
                if(etStatus == 2){
                    //停用
                    content = '请确认是否停用体验金“注册体验金”？';
                    okText = '确认停用';
                }
                Confirm({
                    content:content,
                    okText:okText,
                    callback:(result)=>{
                        if(result){
                            $api.post('/market/updateMarketTemplate',{
                                etUuid:etUuid,
                                etStatus:etStatus
                            }).then(msg=>{
                                if(msg.code == 200){
                                    this.getTable();
                                }
                            });
                        }
                    }
                })
            },
            //添加&修改
            addMarket(etUuid){
                console.log(etUuid)
                let url = 'market-add.html';
                if(etUuid){
                    url = url+'?etUuid='+etUuid;
                }
                location.href = url;
            }
        },
        destroyed(){

        }
    }
</script>
