import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// 请求设置
const Axios = axios.create({
  baseURL: "",
  timeout: 10000, // 10s 超时
});

// Add a request interceptor
Axios.interceptors.request.use(
  (config: any) => {
    return config;
  },
  (err: any) => {
    // 处理请求错误
    return Promise.reject(err.data.error.message);
  }
);

Axios.interceptors.response.use(
  (res: AxiosResponse) => {
    // 处理响应数据
    return res.data;
  },
  (err: any) => {
    // 处理响应错误
    return Promise.reject(err);
  }
);

// 自定义请求函数，接收 headers 参数
const customAxios = ({
  url,
  method,
  data,
  headers,
}: {
  url: string;
  method: "GET" | "POST";
  data?: any;
  headers?: any;
}) => {
  const config: AxiosRequestConfig = {
    url,
    method,
    headers,
    data,
  };

  return Axios(config);
};

export default customAxios;
