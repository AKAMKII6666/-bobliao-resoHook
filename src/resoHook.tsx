/**
 * 本文件为分辨率适配钩子
 * 廖力编写 2022/03/28
 */
import React, { useState, useEffect, createContext, useContext } from 'react';
import { ReactElement } from 'react';
import {
  Iconfig,
  EresoMode,
  Ireso,
  IconfigMutiple,
  Imq,
  EscreenState,
} from './iReso';
import { _mobileAdp } from './mobileAdp';
import { _mobileAdp_str } from './mobileAdp_str';
import useJquery, { isRunningInServer } from '@bobliao/use-jquery-hook';
import { Helmet } from 'react-helmet';

export type config = Iconfig | IconfigMutiple;

/**
 * 创建一个需要全局使用的context
 **/
const resoContext = createContext<Ireso>({} as Ireso);

/**
 * 默认配置
 */
const defaultConfig: config = {
  //页面字体基准是14像素
  fontSize: 14,
  //设计稿宽度/高度
  designWidth: 1360,
  designHeight: 755,
  //缩放限制参数
  //用于限制页面的缩放大小
  scaleLimit: {
    enable: false,
    maxWidth: 1360,
    minWidth: 800,
    maxHeight: 755,
    minHeight: 600,
  },
  //横屏回调函数
  hCallBack: function() {},
  //竖屏回调函数
  vCallBack: function() {},
  //调整模式
  mode: EresoMode.AUTO,
  //viewPort配置
  viewPort: {
    //auto | config | off
    mode: 'auto',
  },
  is_relate_with_devicePixelRatio: false,
};

/* 服务器渲染版本 */
export const resoForServer = function(
  config: config = { ...defaultConfig }
): Ireso {
  /**
   * 适配
   */
  const makeReso = function(_config, _testState) {
    let mobileAdp: any = new _mobileAdp(_config, config);
    let helTags: ReactElement;
    let injectElements: ReactElement;
    let scrStr: string = '';
    var codeString = _mobileAdp_str;

    scrStr =
      codeString +
      `;var _adp_config = ` +
      JSON.stringify(config) +
      `;if(_adp_config.hasOwnProperty("queryList")){var clientWidth=window.document.documentElement.clientWidth,windowHeight=window.document.documentElement.clientHeight,testState="h";testState=clientWidth>windowHeight?"h":"v";for(var i=0;i<_adp_config.queryList.length;i++){var _item=_adp_config.queryList[i],_index=i,isCondition=!1;if(_item.mediaQuery.screenState===testState&&(isCondition=!0),isCondition){_item.mediaQuery.config.debounceTime=0,window._a_d_p_d=new __m_adp__(_item.mediaQuery.config,_adp_config),window._a_d_p_d.init();break}}}else _adp_config.debounceTime=0,window._a_d_p_d=new __m_adp__(_adp_config),window._a_d_p_d.init();`;
    injectElements = <script id="_a_d_p_">{scrStr}</script>;
    scrStr = scrStr.replace(/[\r\n]/g, '');
    //如果是运行在服务端上面就写入一段原生代码,让分辨率适配在网页加载的第一时间进行适配
    //如果这里不进行适配,那么在网页加载的第一时间,客户端代码还没注入的时候,页面将会抽搐一下,
    //等客户端代码完全运行完成后,页面分辨率才会被适配到适合的样子,加入这段代码后,页面在到达浏览器的第一时间就可以开始适配的分辨率
    helTags = <Helmet>{injectElements}</Helmet>;

    return {
      data: {
        helTags: helTags,
        elemsnts: injectElements,
        scriptStr: scrStr,
      },
      funcs: mobileAdp,
      screenState: EscreenState.HORIZONTAL,
      width: mobileAdp.designWidth,
      height: mobileAdp.designHeight,
      fontSize: mobileAdp.computedFontSize,
      fontSize_org: mobileAdp.orgFontSize_widthOutRatoComput,
      current_pixRato: 1,
    };
  };

  return makeReso(config, EscreenState.HORIZONTAL);
};

/* 客户端渲染版本 */
const useReso = function(config: config = { ...defaultConfig }): Ireso {
  const $ = useJquery();
  const [screenState, setscreenState] = useState<EscreenState>(
    EscreenState.HORIZONTAL
  );

  /**
   * 适配
   */
  const makeReso = function(_config, _testState) {
    //let context = requireContext("../nativeComs/", false, /mobileAdp.js/);
    //let modul = context("./mobileAdp.js");
    let mobileAdp: any = new _mobileAdp(_config, config);
    let helTags: ReactElement;
    let injectElements: ReactElement;
    let scrStr: string = '';
    if (!isRunningInServer) {
      //如果是运行在客户端上面就直接初始化
      if (typeof window['_a_d_p_d'] !== 'undefined') {
        if (typeof window['_a_d_p_d']['distory'] !== 'undefined') {
          window['_a_d_p_d']['distory']();
        }
      }
      mobileAdp.init();
    } else {
      var codeString = _mobileAdp_str;

      scrStr =
        codeString +
        `;var _adp_config = ` +
        JSON.stringify(config) +
        `;if(_adp_config.hasOwnProperty("queryList")){var clientWidth=window.document.documentElement.clientWidth,windowHeight=window.document.documentElement.clientHeight,testState="h";testState=clientWidth>windowHeight?"h":"v";for(var i=0;i<_adp_config.queryList.length;i++){var _item=_adp_config.queryList[i],_index=i,isCondition=!1;if(_item.mediaQuery.screenState===testState&&(isCondition=!0),isCondition){_item.mediaQuery.config.debounceTime=0,window._a_d_p_d=new __m_adp__(_item.mediaQuery.config,_adp_config),window._a_d_p_d.init();break}}}else _adp_config.debounceTime=0,window._a_d_p_d=new __m_adp__(_adp_config),window._a_d_p_d.init();`;
      scrStr = scrStr.replace(/[\r\n]/g, '');
      injectElements = <script id="_a_d_p_">{scrStr}</script>;
      //如果是运行在服务端上面就写入一段原生代码,让分辨率适配在网页加载的第一时间进行适配
      //如果这里不进行适配,那么在网页加载的第一时间,客户端代码还没注入的时候,页面将会抽搐一下,
      //等客户端代码完全运行完成后,页面分辨率才会被适配到适合的样子,加入这段代码后,页面在到达浏览器的第一时间就可以开始适配的分辨率
      helTags = <Helmet>{injectElements}</Helmet>;
    }

    return {
      data: { helTags: helTags, elemsnts: injectElements, scriptStr: scrStr },
      funcs: mobileAdp,
      screenState: screenState,
      width: mobileAdp.designWidth,
      height: mobileAdp.designHeight,
      fontSize: mobileAdp.computedFontSize,
      fontSize_org: mobileAdp.orgFontSize_widthOutRatoComput,
      current_pixRato: (function() {
        if (isRunningInServer) {
          return 1;
        } else {
          return mobileAdp.getDevicePixelRatio();
        }
      })(),
    };
  };

  var clientWidth: number = 1920;
  var windowHeight: number = 1080;
  var testState: EscreenState = EscreenState.HORIZONTAL;

  if (clientWidth > windowHeight) {
    testState = EscreenState.HORIZONTAL;
  } else {
    testState = EscreenState.VERTICAL;
  }

  const testStateFunc = function(_isSetState: boolean) {
    clientWidth = window.document.documentElement.clientWidth;
    windowHeight = window.document.documentElement.clientHeight;

    if (clientWidth > windowHeight) {
      testState = EscreenState.HORIZONTAL;
    } else {
      testState = EscreenState.VERTICAL;
    }

    if (
      _isSetState === true &&
      typeof window['_a_d_p_d_lockConfig'] !== 'undefined'
    ) {
      setscreenState(window['_a_d_p_d_lockConfig'].mediaQuery.screenState);
    } else if (_isSetState === true) {
      setscreenState(testState);
    }
  };

  if (!isRunningInServer) {
    const st = function() {
      testStateFunc(true);
    };
    useEffect(function(): ReturnType<React.EffectCallback> {
      $(window).resize(st);
      testStateFunc(true);
      return function(): void {
        $(window).unbind('resize', st);
      };
    }, []);
    testStateFunc(false);
  }

  let getEnd = function(_ed: number): number {
    if (_ed === -1) {
      return 9999999999;
    } else {
      return _ed;
    }
  };

  /**
   * 如果是多条参数适配
   */
  if (config.hasOwnProperty('queryList')) {
    config = config as IconfigMutiple;
    if (!isRunningInServer) {
      if (typeof window['_a_d_p_d'] !== 'undefined') {
        if (typeof window['_a_d_p_d']['distory'] !== 'undefined') {
          window['_a_d_p_d']['distory']();
        }
      }

      //如果在内存里找到已经缓存好的屏幕状态配置，就直接使用这个配置，不要重新适配
      if (typeof window['_a_d_p_d_lockConfig'] !== 'undefined') {
        return makeReso(
          window['_a_d_p_d_lockConfig'].mediaQuery.config,
          window['_a_d_p_d_lockConfig'].mediaQuery.screenState
        );
      }

      var result: any = null;
      var findedResoList: Array<Imq> = [];
      for (var i = 0; i < config.queryList.length; i++) {
        var _item: Imq = config.queryList[i];
        var isCondition: boolean = false;
        if (_item.mediaQuery.screenState === testState) {
          isCondition = true;
          //是否锁定到该条件
          if (_item.mediaQuery.lock === true) {
            window['_a_d_p_d_lockConfig'] = _item;
          }
        }
        if (isCondition) {
          findedResoList.push(_item);
        }
      }
      if (findedResoList.length !== 0) {
        if (findedResoList.length === 1) {
          result = makeReso(findedResoList[0].mediaQuery.config, testState);
        } else {
          var last: Imq = null;
          for (var i = 0; i < findedResoList.length; i++) {
            var citem: Imq = findedResoList[i];
            if (typeof citem.mediaQuery.scope !== 'undefined') {
              if (
                citem.mediaQuery.scope.startWidth <= clientWidth &&
                getEnd(citem.mediaQuery.scope.endWidth) > clientWidth &&
                citem.mediaQuery.scope.startHeight <= windowHeight &&
                getEnd(citem.mediaQuery.scope.endHeight) > windowHeight
              ) {
                last = citem;
                break;
              }
            } else {
              last = citem;
            }
          }
          result = makeReso(last.mediaQuery.config, testState);
        }
      }

      return result;
    } else {
      return makeReso(config.queryList[0].mediaQuery.config, testState);
    }
  } else {
    return makeReso(config, testState);
  }
};

let useResoContext = function(): Ireso {
  var r: Ireso = useContext(resoContext);
  return r;
};

export { useReso as default, _mobileAdp, resoContext, useResoContext };
