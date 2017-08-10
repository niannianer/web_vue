<template>

    <div class="confirm-warp">
        <div class="confirm-content" v-show="visible">
            <div class="confirm-title">{{title}}</div>
            <div class="confirm-main" flex="cross:center main:center">
                <div>{{content}}</div>
            </div>
            <div flex="" class="btn-box">
                <div flex-box="1" flex="main:center">
                    <button class="confirm-btn-ok" @click.stop="btnAction(1)">{{okText}}</button>
                </div>
                <div flex-box="1" flex="main:center">
                    <button class="confirm-btn-cancel"  @click.stop="btnAction(0)">{{cancelText}}</button>
                </div>
            </div>
        </div>
    </div>


</template>

<script>
    import './confrim.less';
    export default {
        name: 'confrim',
        props: ['title', 'content', 'okText', 'cancelText'],
        data(){
            return {
                visible: false

            }
        },
        methods: {
            btnAction(result){
                this.visible = false;
                this.callback(result)
            }
        }

    }
</script>
