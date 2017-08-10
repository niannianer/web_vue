<template>
    <div class="market-add wrapper">
        <div class="common-title">添加体验金</div>
        <div class="content market-info">
            <ul class="common-list">
                <li flex v-for="(item, index) in marketInfo" :key="index" :class="item.dom">
                    <template>
                        <div class="info-left">{{ item.name }}：</div>
                        <div class="info-center">
                            <b-form-input type="text"
                                          :placeholder="item.placeholder"
                                          v-model="item.model"
                                          :maxlength="item.maxlength"
                                          @focus="item.error=false"
                                          @blur="item.model.length<1 ? item.model.error=true : ''"
                            ></b-form-input>
                            <span class="suffix">{{ item.suffix }}</span>
                        </div>
                        <div class="info-right" v-show="item.error">
                            <span v-if="item.model.length<1">！{{ item.name }}不能为空</span>
                            <span v-else>！请输入正确的{{ item.name }}</span>
                        </div>
                    </template>
                </li>
                <li flex>
                    <template>
                        <div class="info-left">发放节点：</div>
                        <div class="info-center">
                            <div class="select-area">
                                <b-form-select class="mb-3 form-control custom-select"
                                               v-model="sendNode.selected"
                                               :options="sendNode.options">
                                </b-form-select>
                            </div>
                        </div>
                    </template>
                </li>
                <li flex>
                    <template>
                        <div class="info-left">领取条件：</div>
                        <div class="info-center">
                            累计投资
                            <b-form-input type="text"
                                          class="sm"
                                          v-model="conditionProductPeriod"
                                          maxlength="3"
                                          @focus="conditionError=false"
                            ></b-form-input>
                            天以上产品超过
                            <b-form-input type="text"
                                          class="sm"
                                          v-model="conditionProductAmount"
                                          maxlength="11"
                                          @focus="conditionError=false"
                            ></b-form-input>
                            元
                        </div>
                        <div class="info-right" v-show="conditionError">
                            {{ conditionErrorMsg }}
                        </div>
                    </template>
                </li>
            </ul>
            <div class="submit-btn" flex="main:center" v-if="!disabled">
                <button @click.stop="submit" class="btns" :class="{'btn-disabled':btnDisabled}">提交</button>
            </div>
        </div>
    </div>
</template>

<script>
    import $api from '../tools/api';
    import Toast from '../components/Toast';
    export default {
        name: 'market-add',
        data(){
            return {
                //体验金数据
                marketInfo: [
                    {
                        name: '体验金名称',
                        placeholder: '请输入体验金名称',
                        suffix: '',
                        dom: 'm-dom01',
                        maxlength: 30,
                        error: false,
                        model: ''
                    },{
                        name: '金额',
                        placeholder: '请输入金额',
                        suffix: '元',
                        dom: 'm-dom02',
                        maxlength: 11,
                        error: false,
                        model: ''
                    },{
                        name: '年化收益率',
                        placeholder: '请输入年化收益率',
                        suffix: '%',
                        dom: 'm-dom03',
                        maxlength: 30,
                        error: false,
                        model: ''
                    },{
                        name: '计息天数',
                        placeholder: '请输入计息天数',
                        suffix: '天',
                        dom: 'm-dom04',
                        maxlength: 3,
                        error: false,
                        model: ''
                    }
                ],
                //发放节点
                sendNode: {
                    selected: '0',
                    options: [
                        {
                            value: '0',
                            text: '注册'
                        }
                    ],
                },
                //领取条件
                conditionProductPeriod: '',
                conditionProductAmount: '',
                conditionError: false,
                conditionErrorMsg: '',

                disabled: false,
                btnDisabled: false,
                ajaxUrl: '/market/createMarketTemplate',
            }
        },
        created(){
        },
        computed: {},
        methods: {
            submit(){
                if(this.btnDisabled){
                    return
                }
                let parmData = {};
                //判断是否为空
                if(this.listCheck(this.marketInfo)){
                    return
                }
                if(this.conditionProductPeriod.length<1){
                    this.conditionError = true;
                    this.conditionErrorMsg = '累计投资天数不能为空'
                    return
                }
                if(this.conditionProductAmount.length<1){
                    this.conditionError = true;
                    this.conditionErrorMsg = '累计投资金额不能为空'
                    return
                }
                let [experienceName,experienceAmount,annualInterestRate,rateDays] = this.marketInfo;
                parmData.experienceName = experienceName.model;
                parmData.experienceAmount = experienceAmount.model;
                parmData.annualInterestRate = annualInterestRate.model;
                parmData.rateDays = rateDays.model;
                parmData.conditionProductPeriod = this.conditionProductPeriod;
                parmData.conditionProductAmount = this.conditionProductAmount;
                if(!(this.integerCheck(experienceAmount.model))){
                    experienceAmount.error = true;
                    this.setScrollTop(experienceAmount.dom);
                    return
                }
                if(!(this.decimalCheck(annualInterestRate.model))){
                    annualInterestRate.error = true;
                    this.setScrollTop(annualInterestRate.dom);
                    return
                }
                if(!(this.integerCheck(rateDays.model))){
                    rateDays.error = true;
                    this.setScrollTop(rateDays.dom);
                    return
                }
                if(!(this.integerCheck(this.conditionProductPeriod))){
                    this.conditionError = true;
                    this.conditionErrorMsg = '请输入正确累计投资天数'
                    return
                }
                if(!(this.integerCheck(this.conditionProductAmount))){
                    this.conditionError = true;
                    this.conditionErrorMsg = '请输入正确累计投资金额'
                    return
                }

                console.log(parmData)
                this.btnDisabled = true;//不可重复提交
                //提交上传
                $api.post(this.ajaxUrl,{
                    experienceName: parmData.experienceName,
                    experienceAmount: parmData.experienceAmount,
                    annualInterestRate: parmData.annualInterestRate,
                    rateDays: parmData.rateDays,
                    conditionProductPeriod: parmData.conditionProductPeriod,
                    conditionProductAmount: parmData.conditionProductAmount
                }).then(msg => {
                    if(msg.code == 200){
                        Toast('添加成功')
                    }else{
                        Toast(msg.msg);
                        this.btnDisabled = false;
                    }
                });
            },
            //判断是否为空
            listCheck(arr){
                for(let obj of arr){
                    let model = (''+(obj.model)).replace(/\s+/g, "");
                    if(model.length < 1){
                        this.setScrollTop(obj.dom);
                        obj.error = true;
                        return true;
                    }
                }
            },
            //判断是否为正整数
            integerCheck(num){
                var reg = /^[1-9]\d*$/;
                return reg.test(num);
            },
            //判断是否为正整数
            decimalCheck(num){
                var reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
                return reg.test(num);
            },
            //定位到有错误的输入框
            setScrollTop(dom){
                let top = document.querySelector('.'+dom).offsetTop-100;
                window.scrollTo(0,top)
            },
        },
        destroyed(){

        }
    }
</script>
