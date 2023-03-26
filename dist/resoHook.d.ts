/**
 * 本文件为分辨率适配钩子
 * 廖力编写 2022/03/28
 */
import React from 'react';
import { Iconfig, Ireso, IconfigMutiple } from './iReso';
import { _mobileAdp } from './mobileAdp';
export declare type config = Iconfig | IconfigMutiple;
/**
 * 创建一个需要全局使用的context
 **/
declare const resoContext: React.Context<Ireso>;
declare const useReso: (config?: config) => Ireso;
declare let useResoContext: () => Ireso;
export { useReso as default, _mobileAdp, resoContext, useResoContext };
