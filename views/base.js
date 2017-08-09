/**
 * Created by DELL on 2017/8/9.
 */
import Vue from 'vue';
import Base from '../containers/Base';
import 'flex.css/dist/flex.css';
import '../less/base.less';
new Vue({
    el: '#app',
    render: h => h(Base)
});
