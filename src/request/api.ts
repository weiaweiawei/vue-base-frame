import request from "./curl";
import { IuserInfoRes, IuserInfoReq } from "@js/request/apiResonseType";
import { BOTA_API_URL , BOTA_GET_TTS}  from "@utils/constants";

export function getUserinfo(data: IuserInfoReq): Promise<IuserInfoRes> {
  return request({
    url: `${BOTA_API_URL}/ue/userinfo`,
    method: "POST",
    headers: {
      'content-type': "application/x-www-form-urlencoded",
    },
    data,
  });
}


export function login(data: IuserInfoReq): Promise<IuserInfoRes> {
  return request({
    url:   `${BOTA_API_URL}/bota/marketuser/login`,
    method: "POST",
    headers: {
      'content-type': "application/json",
    },
    data,
  });
}