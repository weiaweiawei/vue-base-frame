// ## 案例，和业务相关的接口类型定义


interface IuserInfoRes <T = any>{
    code: number;
    msg: string;
    data: T;
}

interface IuserInfoReq {
    uid: string;
    phone: string;
    password: string;
}