import { Iconfig, IconfigMutiple } from './iReso';

/**
 * 移动端自适应适配器接口
 * 用于管理分辨率适配、字体大小计算、屏幕方向检测等功能
 */
export interface IMobileAdp {
  /** 基准字体大小 */
  fontSize: number;
  /** 计算后的字体大小 */
  computedFontSize: number;
  /** 未进行比例计算的原始字体大小 */
  orgFontSize_widthOutRatoComput: number;
  /** 设计稿宽度 */
  designWidth: number;
  /** 设计稿高度 */
  designHeight: number;
  /** 横屏回调函数 */
  hCallBack?: () => void;
  /** 竖屏回调函数 */
  vCallBack?: () => void;
  /** 缩放限制配置 */
  scaleLimit?: {
    enable: boolean;
    maxWidth?: number;
    minWidth?: number;
    maxHeight?: number;
    minHeight?: number;
  };
  /** 防抖时间（毫秒） */
  debounceTime?: number;
  /** 适配模式：auto | width | height */
  mode?: string;
  /** 是否关联设备像素比 */
  is_relate_with_devicePixelRatio?: boolean;
  /** 当前屏幕状态：'h' | 'v' */
  state: string;
  /** Viewport 配置 */
  viewPortSettings?: {
    mode?: 'auto' | 'config' | 'off';
    width?: string;
    initialScale?: string;
    userScalable?: 'yes' | 'no';
  };
  /** 防抖定时器 */
  debounceTimeOut: NodeJS.Timeout | null;
  /** 初始化适配器 */
  init(_callback?: () => void): void;
  /** 重新绑定配置 */
  rebind(_options: Iconfig, _callBack?: () => void): void;
  /** 重新初始化 */
  reInit(): void;
  /** 执行 REM 适配 */
  adpRem(): void;
  /** 获取设备像素比 */
  getDevicePixelRatio(): number;
  /** 防抖设置字体大小 */
  debounceSetFontSize(_recalc: () => void): void;
  /** 适配 Viewport */
  adaptVP(d: { uWidth?: number }): void;
  /** 销毁适配器 */
  distory(): void;
}

export declare const _mobileAdp: new (
  _options: Iconfig,
  _mOptions?: Iconfig | IconfigMutiple
) => IMobileAdp;

