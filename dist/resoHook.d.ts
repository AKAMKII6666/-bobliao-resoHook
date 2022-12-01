import { Iconfig, Ireso, IconfigMutiple } from './iReso';
import { _mobileAdp } from './mobileAdp';
export declare type config = Iconfig | IconfigMutiple;
declare const useReso: (config?: config) => Ireso;
export { useReso as default, _mobileAdp };
