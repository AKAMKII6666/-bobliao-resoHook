# -bobliao-resoHook

# rem 布局自适应组件

用于 rem 布局时，进行分辨率适配的组件<br>
此组件会依据设计稿的尺寸（宽高），对比当前浏览器的尺寸（宽高）计算出合适的字体大小<br>
用于将当前页面的 rem 布局缩（大/小）到与设计稿比例一致。从而适配各种不同尺寸屏幕<br>
或适配移动端手机端的 web 界面。<br>

`它计算字体大小的时机为：1.useReso的时候。2.resize的时候。`

使用本组件以后请全程使用 rem 布局<br>

```javascript
import {
  EresoMode,
  EscreenState,
  IconfigMutiple,
  Iconfig,
  Ireso,
  useReso,
} from '@bobliao/reso-hook';
/**
 * 分辨率适配参数
 */
const resoCondition: IconfigMutiple = {
  queryList: [
    {
      mediaQuery: {
        screenState: EscreenState.HORIZONTAL,
        config: {
          //页面字体基准是14像素
          fontSize: 14,
          //设计稿宽度/高度
          designWidth: 1920,
          designHeight: 1280,
          //缩放限制参数
          //用于限制页面的缩放大小
          scaleLimit: {
            enable: true,
            //最大宽度
            maxWidth: 1900,
            //最小宽度
            minWidth: 950,
            //最大高度
            maxHeight: 99999999,
            //最小高度
            minHeight: 99,
          },
          //调整模式
          //auto:自动选择高度还是宽度来调整
          //width:只通过宽度调整
          //height:只通过高度调整
          mode: EresoMode.WIDTH,
          //resize防抖，为0关闭，默认500，单位毫秒
          debounceTime:0,
        },
      },
    },
    {
      mediaQuery: {
        screenState: EscreenState.VERTICAL,
        config: {
          //页面字体基准是14像素
          fontSize: 14,
          //设计稿宽度/高度
          designWidth: 750,
          designHeight: 500,
          //调整模式
          //auto:自动选择高度还是宽度来调整
          //width:只通过宽度调整
          //height:只通过高度调整
          mode: EresoMode.AUTO,
          //resize防抖，为0关闭，默认500，单位毫秒
          debounceTime:0,
        },
      },
    },
  ],
};

/**
 * 适配分辨率
 */
const reso:Ireso = useReso(resoCondition);

/**
 * 获得当前屏幕状态，是竖屏还是横屏
 */
if(reso.screenState === EscreenState.VERTICAL){
    //竖屏状态
    console.log(reso.screenState)// = "v"
}

if(reso.screenState === EscreenState.HORIZONTAL){
    //横屏状态
    console.log(reso.screenState)// = "h"
}

//可以这样用,用来在一个组件年内分离横屏和竖屏的界面:
return (
    {
        (function(){
            if(reso.screenState === EscreenState.HORIZONTAL){
                return <div>这是横屏(pc)的界面</div>
            }else{
                return <div>这是竖屏(移动端)的界面</div>
            }
        })()
    }
)


//如果您用的是razzle 那么就面临请求的页面从服务器上下来，第一时间适配分辨率的问题
//否则可能造成页面抖动，这个时候在页面上加入resoHook中导出的Helmet就好了：
return (
    {
        <>
            {reso.data.helTags}
            <div>....</div>
        </>
    }
)

//如果您用的是nextjs,并且希望在html到达客户端的第一时间适配分辨率(防止抖动)，您可以在head中加入以下代码:
return (
    {
        <>
            <Head>
                <meta name="viewport" content={"width=" + reso.width} />
				<script
					id="_a_d_p_"
					dangerouslySetInnerHTML={{
						__html: reso.data.scriptStr,
					}}
				></script>
            </Head>
        </>
    }
)

/**
 * reso.data.helTags
 * 它会在服务器端渲染的时候就将分辨率适配代码插入进头部
 * 当网页第一时间到达用户浏览器的时候就会适配
 * 避免页面在适配时抖动的问题。
 */

/**
 * 同时还提供了：
 * reso.data.elemsnts
 * 这个是第一次适配脚本，去除了Helmet标签的代码
 *
 * reso.data.scriptStr
 * 这个是第一次适配脚本，纯脚本，去除了<script></script>包裹的版本
 */


/**
 * 除此之外，还提供了:
 * reso.mobileAdp
 * 这是纯js版本的adp组件，可以接受接口为Iconfig的参数
 * 可以把这个用在vue框架里。但是缺少mediaQuery功能
*/



//如果您的应用是纯移动端应用，那么resoHook也接受这样的参数:
const resoCondition: Iconfig = {
    //页面字体基准是14像素
    fontSize: 14,
    //设计稿宽度/高度
    designWidth: 750,
    designHeight: 500,
    //调整模式
    //auto:自动选择高度还是宽度来调整
    //width:只通过宽度调整
    //height:只通过高度调整
    mode: EresoMode.AUTO,
    //resize防抖，为0关闭，默认500，单位毫秒
    debounceTime:0,
};

/**
 * 适配分辨率
 */
const reso:Ireso = useReso(resoCondition);

```

参数的接口设计:

```javascript
 * 用于分辨率适配器的参数
 * 多参数适配
 */
export interface IconfigMutiple {
  /**
   * 查询条件
   */
  queryList: Array<Imq>;
}

export interface Imq {
  /**
   * 查询当前窗体的宽度例如
   * '(min-width: 1824px)'
   * '(max-width: 1224px)'
   * 符合条件的就使用config来进行适配
   */
  mediaQuery: {
    /**
     * 查询条件
     */
    screenState: EscreenState;
    /**
     * 范围控制
     */
    scope?: queryItem;
    /**
     * 适配参数
     */
    config: Iconfig;
  };
}

/**
 * 屏幕比例适配
 */
export interface queryItem {
  /**
   * 开始宽度
   */
  startWidth: number;
  /**
   * 结束宽度
   * -1表示无限大
   */
  endWidth: number;
  /**
   * 开始高度
   */
  startHeight: number;
  /**
   * 结束高度
   * -1表示无限大
   */
  endHeight: number;
}



/**
 * 用于分辨率适配器的参数
 */
export interface Iconfig {
  /**
   * 页面字体基准
   */
  fontSize: number;
  /**
   * 设计稿的宽度
   */
  designWidth: number;
  /**
   * 设计稿的高度
   */
  designHeight: number;
  /**
   * 缩放限制参数
   * 用于限制页面的缩放大小
   */
  scaleLimit?: {
    /**
     * 是否打开缩放限制
     */
    enable: boolean,
    /**
     * 最大的宽度限制
     */
    maxWidth?: number,
    /**
     * 最小的宽度限制
     */
    minWidth?: number,
    /**
     * 最大的高度
     */
    maxHeight?: number,
    /**
     * 最小的高度
     */
    minHeight?: number,
  };
  /**
   * 横屏回调函数
   */
  hCallBack?: Function;
  /**
   * 竖屏回调函数
   */
  vCallBack?: Function;
  /**
   * 调整模式
   */
  mode?: EresoMode;
  /**
   * 防抖时间
   */
  debounceTime?: number;
}
```

---

producted by bobliao
