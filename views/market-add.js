/**
 * Created by Yan on 2017/8/9.
 */
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import MarketAdd from '../containers/MarketAdd';
import 'flex.css/dist/flex.css';
import '../less/base.less';
import '../less/market-add.less';
new Vue({
    el: '#app',
    render: h => h(MarketAdd)
});
