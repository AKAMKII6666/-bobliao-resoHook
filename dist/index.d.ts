import useReso, { _mobileAdp } from './resoHook';
export type { Ireso, Iconfig, IconfigMutiple, Imq, queryItem } from './iReso';
/**
 * 屏幕状态
 */
export declare enum EscreenState {
    /**
     * 横向屏幕
     */
    HORIZONTAL = "h",
    /**
     * 竖屏显示
     */
    VERTICAL = "v"
}
/**
 * 设置分辨率适配器的工作模式
 */
export declare enum EresoMode {
    /**
     * auto:自动选择高度还是宽度来调整
     */
    AUTO = "auto",
    /**
     * width:只通过宽度调整
     */
    WIDTH = "width",
    /**
     * height:只通过高度调整
     */
    HEIGHT = "height"
}
export { useReso, _mobileAdp };
