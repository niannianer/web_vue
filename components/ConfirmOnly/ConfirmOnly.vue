<template>

    <div class="confirm-warp">
        <div class="confirm-content" v-show="visible">
            <div class="confirm-title">{{title}}</div>
            <div class="confirm-main" flex="cross:center main:center">
                <div>{{content}}</div>
            </div>
            <div flex="" class="btn-box">
                <div flex-box="1" flex="main:center">
                    <button class="confirm-btn-ok" @click.stop="btnAction">{{okText}}</button>
                </div>
            </div>
        </div>
    </div>


</template>

<script>
    import './confrim-only.less';
    export default {
        name: 'confrim-only',
        props: ['title', 'content', 'okText', ],
        data(){
            return {
                visible: false

            }
        },
        methods: {
            btnAction(){
                this.visible = false;
                this.callback()
            }
        }

    }
</script>
