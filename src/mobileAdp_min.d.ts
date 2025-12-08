import { Iconfig, IconfigMutiple } from './iReso';

export interface IMobileAdp {
  fontSize: number;
  computedFontSize: number;
  orgFontSize_widthOutRatoComput: number;
  designWidth: number;
  designHeight: number;
  hCallBack?: Function;
  vCallBack?: Function;
  scaleLimit?: {
    enable: boolean;
    maxWidth?: number;
    minWidth?: number;
    maxHeight?: number;
    minHeight?: number;
  };
  debounceTime?: number;
  mode?: string;
  is_relate_with_devicePixelRatio?: boolean;
  state: string;
  viewPortSettings?: {
    mode?: 'auto' | 'config' | 'off';
    width?: string;
    initialScale?: string;
    userScalable?: 'yes' | 'no';
  };
  debounceTimeOut: NodeJS.Timeout | null;
  init(_callback?: Function): void;
  rebind(_options: Iconfig, _callBack?: Function): void;
  reInit(): void;
  adpRem(): void;
  getDevicePixelRatio(): number;
  debounceSetFontSize(_recalc: Function): void;
  adaptVP(d: { uWidth?: number }): void;
  distory(): void;
}

export declare const _mobileAdp: new (
  _options: Iconfig,
  _mOptions?: Iconfig | IconfigMutiple
) => IMobileAdp;

