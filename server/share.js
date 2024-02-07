const getToken = ()=> {
    return Math.round(Math.random() * 9999999999) + 9999999999;
}

const GLOBAL = { };
GLOBAL.channel = location.href.replace( /\/|:|#|%|\.|\[|\]/g , '');

const log = (...msgArr)=>{
    console.log(...msgArr);
};