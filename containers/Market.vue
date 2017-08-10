<template>
    <div class="market wrapper">
        <div class="common-title">体验金管理</div>
        <div class="market-wrap">
            <div class="market-handle" flex="main:justify">
                <dl class="table-input" flex>
                    <dt>体验金名称：</dt>
                    <dd><b-form-input type="text" size="sm" v-model="inputVal" placeholder="请输入体验金名称"></b-form-input></dd>
                    <dt>状态：</dt>
                    <dd><b-form-select v-model="selectedOption" :options="options" size="sm"></b-form-select></b-form-input></dd>
                </dl>
                <div class="table-btn" flex>
                    <b-btn class="btns" @click.native="query">查询</b-btn>
                    <b-btn class="btns" @click.native="query">添加</b-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'market',
        data(){
            return {
                selectedOption:0,
                options: [
                    {
                        text: '全部',
                        value: 0
                    },{
                        text: '待激活',
                        value: 1
                    },{
                        text: '已激活',
                        value: 2
                    },{
                        text: '已停用',
                        value: 3
                    }
                ],
            }
        },
        created(){
        },
        computed: {},
        methods: {},
        destroyed(){

        }
    }
</script>
