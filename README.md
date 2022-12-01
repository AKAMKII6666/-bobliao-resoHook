# -bobliao-resoHook

使用本组件以后请全程使用 rem 布局

```javascript
import { useReso } from "@bobliao/reso-hook";
/**
 * 分辨率适配参数
 */
const resoCondition = {
	queryList: [
		{
			mediaQuery: {
				screenState: EscreenState.HORIZONTAL,
				config: {
					//页面字体基准是14像素
					fontSize: 14,
					//设计稿宽度/高度
					designWidth: 1900,
					designHeight: 1300,
					//横屏回调函数
					hCallBack: function () {
						screenState.current = "h";
					},
					//竖屏回调函数
					vCallBack: function () {
						screenState.current = "h";
					},
					//缩放限制参数
					//用于限制页面的缩放大小
					scaleLimit: {
						enable: true,
						maxWidth: 1900,
						minWidth: 950,
						maxHeight: 99999999,
						minHeight: 99,
					},
					//调整模式
					//auto:自动选择高度还是宽度来调整
					//width:只通过宽度调整
					//height:只通过高度调整
					mode: EresoMode.WIDTH,
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
					//横屏回调函数
					hCallBack: function () {
						screenState.current = "v";
					},
					//竖屏回调函数
					vCallBack: function () {
						screenState.current = "v";
					},
					//调整模式
					//auto:自动选择高度还是宽度来调整
					//width:只通过宽度调整
					//height:只通过高度调整
					mode: EresoMode.AUTO,
				},
			},
		},
	],
};

/**
 * 适配分辨率
 */
const reso = useReso(resoCondition);
```
