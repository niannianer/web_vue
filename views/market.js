/**
 * Created by DELL on 2017/8/9.
 */
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Market from '../containers/Market';
import 'flex.css/dist/flex.css';
import '../less/base.less';
import '../less/market.less';
new Vue({
    el: '#app',
    render: h => h(Market)
});
