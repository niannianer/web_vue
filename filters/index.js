/**
 * Created by DELL on 2017/6/6.
 */
export let textToHtml =(input)=>{
    if (!input) {
        return '';
    }
    return input.replace(/\n/g,'<br>');
};
export let timeFormat = (input) => {
    if ((input == null) || (input == undefined)) {
        return '';
    }
    let newDate = new Date();
    newDate.setTime(input);
    let y = newDate.getFullYear();
    let m = newDate.getMonth()+1;
    let d = newDate.getDate();
    let h = newDate.getHours();
    let f = newDate.getMinutes();
    let s = newDate.getSeconds();
    let setTime = (t)=>{
        if(t<10){
            return '0' + t;
        }
        return t ;
    }
    let ouputs = (y+'-'+setTime(m)+'-'+setTime(d)+' '+setTime(h)+':'+setTime(f)+':'+setTime(s));
    return ouputs;
};
export let translatePateInt = (input) => {
    if (!input) {
        return '0%';
    }
    let inp = Number(input);
    let out = (inp*100).toFixed(0)
    return out+'%'
};
export let translatePate = (input) => {
    if ((input == null) || (input == undefined)) {
        return '--';
    }
    let inp = Number(input);
    function accMul(arg1,arg2){
        let m=0,s1=arg1.toString(),s2=arg2.toString();
        if(s1.split(".")[1]){
            m+=s1.split(".")[1].length
        }
        if(s2.split(".")[1]){
            m+=s2.split(".")[1].length
        }
        return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
    }
    let out = parseInt(accMul(inp,10000))/100;
    let xsd= out.toString().split(".");
    if(xsd.length==1){
        out = out.toString()+".00";
    }
    if(xsd.length>1){
        if(xsd[1].length<2){
            out = out.toString()+"0";
        }
    }
    return out+'%'
};
let add0 =(input)=>{
    if(!input){
        return '00';
    }
    input =input +'00';
    return input.substring(0,2);
};
export let currencyFormat = (input) => {
    if ((input == null) || (input == undefined)) {
        return '--';
    }
    let ouputs = input.toString();
    ouputs = ouputs.split('.');
    return ouputs[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,') + '.' + add0(ouputs[1]);
};
export let ellipsisFormat = (input) => {
    if ((input == null) || (input == undefined)) {
        return '';
    }
    let ouputs = input.toString();
    if(ouputs.length>8){
        ouputs = ouputs.substring(0,8)+"...";
    }
    return ouputs;
};

