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

---

producted by bobliao
