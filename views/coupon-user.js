/**
 * Created by Yan on 2017/8/29.
 */
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import CouponUser from '../containers/CouponUser';
import 'flex.css/dist/flex.css';
import '../less/base.less';
import '../less/sms-check.less';
import '../less/coupon-user.less';
import _ from 'lodash/core';
import * as filters from '../filters';
console.log(filters)
_.forEach(filters, (fun, key) => {
    Vue.filter(key, fun);
});
new Vue({
    el: '#app',
    render: h => h(CouponUser)
});
