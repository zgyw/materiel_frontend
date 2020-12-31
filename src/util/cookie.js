//设置cookie
export function setCookie(name, value, day) {
    var date = new Date();
    date.setDate(date.getDate() + day);
    document.cookie = name + '=' + value + ';expires=' + date;
};
//获取cookie
export function getCookie(name) {
    var reg = RegExp(name + '=([^;]+)');
    var arr = document.cookie.match(reg);
    // console.log(arr)
    if (arr) {
        return arr[1];
    } else {
        return '';
    }
};
//删除cookie
export function delCookie(name) {
    setCookie(name, null, -1);
};