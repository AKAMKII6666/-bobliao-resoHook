/**
 * 本文件为分辨率适配钩子
 * 廖力编写 2022/03/28
 */
import React from 'react';
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
import useJquery, { isRunningInServer } from '@bobliao/use-jquery-hook';
import { Helmet } from 'react-helmet';
//import requireContext from 'require-context.macro';
const codeStringify = require('code-stringify');

export type config = Iconfig | IconfigMutiple;

const useReso = function(
  config: config = {
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
  }
): Ireso {
  const $ = useJquery();
  /**
   * 适配
   */
  const makeReso = function(_config, _testState) {
    //let context = requireContext("../nativeComs/", false, /mobileAdp.js/);
    //let modul = context("./mobileAdp.js");
    let ___mobileAdp = _mobileAdp;
    let mobileAdp: any = new _mobileAdp(_config, config);
    let helTags: ReactElement;
    let injectElements: ReactElement;
    if (!isRunningInServer) {
      //如果是运行在客户端上面就直接初始化
      if (typeof window['_a_d_p_'] !== 'undefined') {
        $('[name=viewport]').remove();
        window['_a_d_p_'].distory();
      }
      mobileAdp.init();
    } else {
      var codeString = codeStringify(___mobileAdp);

      injectElements = (
        <script id="_a_d_p_">
          {`
                            window.__m_adp__ = ` +
            codeString +
            `;

                            var _adp_config = ` +
            JSON.stringify(config) +
            `;
                            
                            if (_adp_config.hasOwnProperty("queryList")) {
                                var clientWidth = window.document.documentElement.clientWidth;
                                var windowHeight = window.document.documentElement.clientHeight;
                                var testState = "h";
                                if (clientWidth > windowHeight) {
                                    testState = "h";
                                } else {
                                    testState = "v";
                                }
                                for (var i = 0; i < _adp_config.queryList.length; i++) {
                                    var _item = _adp_config.queryList[i];
                                    var _index = i;
                                    var isCondition = false;
                                    if (_item.mediaQuery.screenState === testState) {
                                        isCondition = true;
                                    }
                                    if (isCondition) {
                                        window._a_d_p_ = new __m_adp__(_item.mediaQuery.config,_adp_config);
                                        window._a_d_p_.init();
                                        break;
                                    }
                                }
                            }else{
                                window._a_d_p_ = new __m_adp__(_adp_config);
                                window._a_d_p_.init();
                            }
                        `}
        </script>
      );
      //如果是运行在服务端上面就写入一段原生代码,让分辨率适配在网页加载的第一时间进行适配
      //如果这里不进行适配,那么在网页加载的第一时间,客户端代码还没注入的时候,页面将会抽搐一下,
      //等客户端代码完全运行完成后,页面分辨率才会被适配到适合的样子,加入这段代码后,页面在到达浏览器的第一时间就可以开始适配的分辨率
      helTags = <Helmet>{injectElements}</Helmet>;
    }
    return {
      data: { helTags: helTags, elemsnts: injectElements },
      funcs: mobileAdp,
      screenState: _testState,
    };
  };

  const getEnd = function(_ed: number): number {
    if (_ed === -1) {
      return 9999999999;
    } else {
      return _ed;
    }
  };

  var clientWidth: number = window.document.documentElement.clientWidth;
  var windowHeight: number = window.document.documentElement.clientHeight;
  var testState: EscreenState = EscreenState.HORIZONTAL;

  if (clientWidth > windowHeight) {
    testState = EscreenState.HORIZONTAL;
  } else {
    testState = EscreenState.VERTICAL;
  }

  /**
   * 如果是多条参数适配
   */
  if (config.hasOwnProperty('queryList')) {
    config = config as IconfigMutiple;
    if (!isRunningInServer) {
      if (typeof window['_a_d_p_'] !== 'undefined') {
        $('[name=viewport]').remove();
        window['_a_d_p_']['distory']();
      }
      var result: any = null;
      var findedResoList: Array<Imq> = [];
      for (var i = 0; i < config.queryList.length; i++) {
        var _item: Imq = config.queryList[i];
        var isCondition: boolean = false;
        if (_item.mediaQuery.screenState === testState) {
          isCondition = true;
        }
        if (isCondition) {
          findedResoList.push(_item);
        }
      }
      if (findedResoList.length !== 0) {
        if (findedResoList.length === 1) {
          result = makeReso(findedResoList[0].mediaQuery.config);
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
          result = makeReso(last.mediaQuery.config);
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

export { useReso as default, _mobileAdp };
