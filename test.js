function mySetInterval(fun, delay) {
    var obj = {};
    function inner() {
        obj.id = setTimeout(function () {
            fun();
            inner();
        }, delay)
    }
    inner();
    return obj;
}
function myClear(obj) {
    clearTimeout(obj.id);
}
var test = function () {
    console.log(1);
};
var obj = mySetInterval(test,1000)
setTimeout(function () {
    myClear(obj);
},10000);
