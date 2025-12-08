import React, { createContext, useState, useEffect, useContext } from 'react';
import useJquery, { isRunningInServer } from '@bobliao/use-jquery-hook';
import { Helmet } from 'react-helmet';
import codeStringify from 'code-stringify';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/**
 * 设置分辨率适配器的工作模式
 */
var EresoMode;

(function (EresoMode) {
  /**
   * auto:自动选择高度还是宽度来调整
   */
  EresoMode["AUTO"] = "auto";
  /**
   * width:只通过宽度调整
   */

  EresoMode["WIDTH"] = "width";
  /**
   * height:只通过高度调整
   */

  EresoMode["HEIGHT"] = "height";
})(EresoMode || (EresoMode = {}));
/**
 * 屏幕状态
 */


var EscreenState;

(function (EscreenState) {
  /**
   * 横向屏幕
   */
  EscreenState["HORIZONTAL"] = "h";
  /**
   * 竖屏显示
   */

  EscreenState["VERTICAL"] = "v";
})(EscreenState || (EscreenState = {}));

/*!
 * mobileAdp.js
 * (c) 2015-2024 bobliao
 * Released under the MIT License.
 */

/*
 * 移动端界面比例适配器
 * 廖力编写
 * 2021年总汇版本
 * 本适配器可以不依赖任何库直接运行
 * 建议在页面加载进来的第一时间完成适配
 * 免得界面渲染完成后再适配引起页面抖动
 */
var _mobileAdp = function _mobileAdp(_options, _mOptions) {
  var self = this;
  this.defaultOptions = {
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
      minHeight: 600
    },
    //横屏回调函数
    hCallBack: function hCallBack() {},
    //竖屏回调函数
    vCallBack: function vCallBack() {},
    //调整模式
    //auto:自动选择高度还是宽度来调整
    //width:只通过宽度调整
    //height:只通过高度调整
    mode: 'auto',
    //防抖时间
    debounceTime: 500,
    //viewPort配置
    viewPort: {
      //auto | config | off
      //模式，auto为打开viewport配置，但是自动适配
      //config为按照配置指定viewport参数
      //off为关闭
      mode: 'auto',
      width: 'device-width',
      initialScale: '1.0',
      userScalable: 'yes'
    },
    //是否根据浏览器的缩放设置调整大小
    is_relate_with_devicePixelRatio: false
  }; //拷贝函数

  var extend = function extend(target, source) {
    target = target || {};

    for (var prop in source) {
      if (typeof source[prop] === 'object') {
        target[prop] = extend(target[prop], source[prop]);
      } else {
        target[prop] = source[prop];
      }
    }

    return target;
  };

  _options = extend(this.defaultOptions, _options); //rem相对字体大小起始大小
  //单位像素

  this.fontSize = _options.fontSize;
  this.computedFontSize = 0;
  this.orgFontSize_widthOutRatoComput = 0; //设计稿宽度

  this.designWidth = _options.designWidth; //设计稿高度

  this.designHeight = _options.designHeight; //横屏回调函数

  this.hCallBack = _options.hCallBack; //竖屏回调函数

  this.vCallBack = _options.vCallBack; //大小限制选项

  this.scaleLimit = _options.scaleLimit; //防抖时间

  this.debounceTime = _options.debounceTime; ///调整模式
  //auto:自动选择高度还是宽度来调整
  //width:只通过宽度调整
  //height:只通过高度调整,

  this.mode = _options.mode;
  this.is_relate_with_devicePixelRatio = _options.is_relate_with_devicePixelRatio; //指示当前是横屏还是竖屏

  this.state = ''; //当前viewPort配置

  this.viewPortSettings = _options.viewPort; //初始化

  this.init = function (_callback) {
    //先适配viewPort
    this.adaptVP({
      uWidth: this.designWidth
    }); //然后再适配rem

    this.adpRem();

    if (typeof _callback !== 'undefined') {
      _callback();
    }
  }; //重新调整


  this.rebind = function (_options, _callBack) {
    _options = extend(this.defaultOptions, _options); //rem相对字体大小起始大小
    //单位像素

    this.fontSize = _options.fontSize; //设计稿宽度

    this.designWidth = _options.designWidth; //设计稿高度

    this.designHeight = _options.designHeight; //横屏回调函数

    this.hCallBack = _options.hCallBack; //竖屏回调函数

    this.vCallBack = _options.vCallBack; //大小限制选项

    this.scaleLimit = _options.scaleLimit; ///调整模式
    //auto:自动选择高度还是宽度来调整
    //width:只通过宽度调整
    //height:只通过高度调整,

    this.mode = _options.mode; //指示当前是横屏还是竖屏

    this.state = '';
    this.init(function () {
      if (typeof _callback !== 'undefined') {
        _callBack();
      }
    });
  };
  /**
   * 重新初始化
   */


  this.reInit = function () {
    var findedResoList = [];

    for (var i = 0; i < _mOptions.queryList.length; i++) {
      var _item = _mOptions.queryList[i];
      var isCondition = false;

      if (_item.mediaQuery.screenState === self.state) {
        isCondition = true;
      }

      if (isCondition) {
        findedResoList.push(_item);
      }
    }

    var clientWidth = window.document.documentElement.clientWidth;
    var windowHeight = window.document.documentElement.clientHeight;

    var getEnd = function getEnd(_ed) {
      if (_ed === -1) {
        return 9999999999;
      } else {
        return _ed;
      }
    };

    if (typeof window['_a_d_p_d_lockConfig'] !== 'undefined') {
      findedResoList = [window['_a_d_p_d_lockConfig']];
    }

    if (findedResoList.length !== 0) {
      if (findedResoList.length === 1) {
        self.rebind(findedResoList[0].mediaQuery.config);
      } else {
        var last = null;

        for (var i = 0; i < findedResoList.length; i++) {
          var citem = findedResoList[i];

          if (typeof citem.mediaQuery.scope !== 'undefined') {
            if (citem.mediaQuery.scope.startWidth <= clientWidth && getEnd(citem.mediaQuery.scope.endWidth) > clientWidth && citem.mediaQuery.scope.startHeight <= windowHeight && getEnd(citem.mediaQuery.scope.endHeight) > windowHeight) {
              last = citem;
              break;
            }
          } else {
            last = citem;
          }
        }

        self.rebind(last.mediaQuery.config);
      }
    }
  }; //适配rem算法
  //这个算法还保留在以前的代码里
  //这个的话最早可以追溯到2016年


  this.adpRem = function () {
    //适配rem的算法
    (function (doc, win) {
      var docEl = doc.documentElement,
          resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
          recalc = function recalc() {
        //document.body.style.display = "none";
        var clientWidth = docEl.clientWidth;
        var windowHeight = docEl.clientHeight; //document.body.style.display = "";
        //应用大小限制选项

        if (self.scaleLimit.enable === true) {
          if (clientWidth > self.scaleLimit.maxWidth) {
            clientWidth = self.scaleLimit.maxWidth;
          }

          if (clientWidth < self.scaleLimit.minWidth) {
            clientWidth = self.scaleLimit.minWidth;
          }

          if (windowHeight > self.scaleLimit.maxHeight) {
            windowHeight = self.scaleLimit.maxHeight;
          }

          if (windowHeight < self.scaleLimit.minHeight) {
            windowHeight = self.scaleLimit.minHeight;
          }
        }

        if (typeof window['_a_d_p_d_lockConfig'] === 'undefined') {
          if (clientWidth > windowHeight) {
            if (typeof _mOptions !== 'undefined' && _mOptions.hasOwnProperty('queryList')) {
              if (self.state !== 'h' && self.state !== '') {
                self.state = 'h';
                self.reInit();
                return;
              }
            }

            self.state = 'h';
            self.hCallBack(self);
          } else {
            if (typeof _mOptions !== 'undefined' && _mOptions.hasOwnProperty('queryList')) {
              if (self.state !== 'v' && self.state !== '') {
                self.state = 'v';
                self.reInit();
                return;
              }
            }

            self.state = 'v';
            self.vCallBack(self);
          }
        }

        var compTarget = null;
        if (!clientWidth) return; //原始比例

        var orgPre = self.designWidth / self.designHeight;
        var currPre = clientWidth / windowHeight;
        var res = 0;

        var adWidth = function adWidth() {
          //console.log('用宽度调整字体')
          compTarget = clientWidth; //计算设计字体大小和实际字体大小的比例关系

          res = self.fontSize * (compTarget / self.designWidth);
        };

        var adHeight = function adHeight() {
          //console.log('用高度调整字体')
          compTarget = windowHeight; //计算设计字体大小和实际字体大小的比例关系

          res = self.fontSize * (compTarget / self.designHeight);
        };

        if (self.mode === 'auto') {
          if (orgPre < currPre) {
            adHeight();
          } else {
            adWidth();
          }
        } else if (self.mode === 'width') {
          adWidth();
        } else if (self.mode === 'height') {
          adHeight();
        }

        var fSize = Number((res * self.getDevicePixelRatio()).toFixed(1)); //在计算过程中，加入页面缩放的数值

        document.documentElement.style.fontSize = fSize + 'px';
        self.computedFontSize = fSize;
        self.orgFontSize_widthOutRatoComput = Number(res.toFixed(1));
      };

      var resizeF = function resizeF() {
        self.debounceSetFontSize(recalc);
      };
      /*
            window.onload = recalc;
            */


      if (!doc.addEventListener) return;
      win.addEventListener(resizeEvt, resizeF, false);
      doc.addEventListener('DOMContentLoaded', resizeF, false);

      self.distory = function () {
        clearTimeout(self.debounceTimeOut);
        win.removeEventListener(resizeEvt, resizeF);
        doc.removeEventListener('DOMContentLoaded', resizeF);
      };

      resizeF();
    })(document, window);
  };

  this.debounceTimeOut = null;
  /* 
  用于计算当前显示比例和浏览器放大倍率的关联 
  */

  this.getDevicePixelRatio = function () {
    if (this.is_relate_with_devicePixelRatio && typeof window !== 'undefined' && typeof window.devicePixelRatio !== 'undefined') {
      return Number((window.outerWidth / window.innerWidth).toFixed(2));
    }

    return 1;
  };
  /**
   * 设置字体大小的时候进行防抖处理
   *  */


  this.debounceSetFontSize = function (_recalc) {
    if (this.debounceTimeOut !== null) {
      clearTimeout(this.debounceTimeOut);
    }

    if (this.debounceTime <= 0) {
      _recalc();
    } else {
      if (this.debounceTimeOut === null) {
        _recalc();
      }

      this.debounceTimeOut = setTimeout(function () {
        _recalc();

        self.debounceTimeOut = null;
      }, this.debounceTime);
    }
  }; //适配viewPort
  //这是一个相当古老的算法了
  //最早可以追溯到2015年
  //原版算法已经找不到了
  //最后只找到了这个被压缩后的版本


  this.adaptVP = function (d) {
    var vpObj = document.querySelector("meta[name='viewport']"); //关闭viewport适配

    if (this.viewPortSettings.mode === 'off') {
      if (vpObj !== null) {
        vpObj.remove();
      }

      return;
    } //打开viewPort适配但是手动适配


    if (this.viewPortSettings.mode === 'config') {
      var vpContent = 'width=' + this.viewPortSettings.width + ', initial-scale=' + this.viewPortSettings.initialScale + ',user-scalable=' + this.viewPortSettings.userScalable;

      if (vpObj !== null) {
        vpObj.content = vpContent;
      } else {
        t = document.querySelector("meta[name='viewport']") || document.createElement('meta');
        t.name = 'viewport';
        t.content = vpContent;
        a = document.getElementsByTagName('head');

        if (a.length > 0) {
          a[0].appendChild(t);
        }
      }

      return;
    }
    /* 
    if (vpObj !== null) {
      var width = '';
      var arrVp = vpObj.content.split(',');
      for (let i = 0; i < arrVp.length; i++) {
        var item = arrVp[i].split('=');
        if (item[0] === 'width') {
          width = item[1];
          break;
        }
      }
        if (width === d) {
        return;
      }
    } */


    function e() {
      var e, i;
      return o.uWidth = d.uWidth ? d.uWidth : 640, o.dWidth = d.dWidth ? d.dWidth : window.screen.width || window.screen.availWidth, o.ratio = window.devicePixelRatio ? window.devicePixelRatio : 1, o.userAgent = navigator.userAgent, o.bConsole = d.bConsole ? d.bConsole : !1, d.mode ? void (o.mode = d.mode) : (e = o.userAgent.match(/Android/i), void (e && (o.mode = 'android-2.2', i = o.userAgent.match(/Android\s(\d+.\d+)/i), i && (i = parseFloat(i[1])), 2.2 == i || 2.3 == i ? o.mode = 'android-2.2' : 4.4 > i ? o.mode = 'android-dpi' : i >= 4.4 && (o.mode = o.dWidth > o.uWidth ? 'android-dpi' : 'android-scale'))));
    }

    function getContent() {
      var e,
          t,
          a,
          n = '',
          r = !1;

      if (o.userAgent.indexOf('Pixel') !== -1) {
        o.mode = 'apple';
      }

      switch (o.mode) {
        case 'apple':
          n = 'width=' + self.designWidth + ', user-scalable=no, user-scalable=0';
          break;

        case 'android-2.2':
          d.dWidth || (o.dWidth = 2 == o.ratio ? 720 : 1.5 == o.ratio ? 480 : 1 == o.ratio ? 320 : 0.75 == o.ratio ? 240 : 480), e = window.screen.width || window.screen.availWidth, 320 == e ? o.dWidth = o.ratio * e : 640 > e && (o.dWidth = e), o.mode = 'android-dpi', r = !0;

        case 'android-dpi':
          n = ' width=' + o.uWidth + ', user-scalable=no', r && (o.mode = 'android-2.2');
          break;

        case 'android-scale':
          n = 'width=' + o.uWidth + ', user-scalable=no';
      }

      if (vpObj !== null) {
        vpObj.content = n;
      } else {
        t = document.querySelector("meta[name='viewport']") || document.createElement('meta');
        t.name = 'viewport';
        t.content = n;
        a = document.getElementsByTagName('head');

        if (a.length > 0) {
          a[0].appendChild(t);
        }
      }
    }

    function t() {
      var d = '';

      for (key in o) {
        d += key + ': ' + o[key] + '; ';
      } //alert(d);

    }

    if (d) {
      var o = {
        uWidth: 0,
        dWidth: 0,
        ratio: 1,
        mode: 'apple',
        userAgent: null,
        bConsole: !1
      };
      e(), getContent(), o.bConsole && t();
    }
  };
};

var _mobileAdp$1 = function _mobileAdp(e, i) {
  var t = this;
  this.defaultOptions = {
    fontSize: 14,
    designWidth: 1360,
    designHeight: 755,
    scaleLimit: {
      enable: !1,
      maxWidth: 1360,
      minWidth: 800,
      maxHeight: 755,
      minHeight: 600
    },
    hCallBack: function hCallBack() {},
    vCallBack: function vCallBack() {},
    mode: "auto",
    debounceTime: 500,
    viewPort: {
      mode: "auto",
      width: "device-width",
      initialScale: "1.0",
      userScalable: "yes"
    },
    is_relate_with_devicePixelRatio: !1
  };

  var n = function n(e, i) {
    for (var t in e = e || {}, i) {
      "object" == typeof i[t] ? e[t] = n(e[t], i[t]) : e[t] = i[t];
    }

    return e;
  };

  e = n(this.defaultOptions, e), this.fontSize = e.fontSize, this.computedFontSize = 0, this.orgFontSize_widthOutRatoComput = 0, this.designWidth = e.designWidth, this.designHeight = e.designHeight, this.hCallBack = e.hCallBack, this.vCallBack = e.vCallBack, this.scaleLimit = e.scaleLimit, this.debounceTime = e.debounceTime, this.mode = e.mode, this.is_relate_with_devicePixelRatio = e.is_relate_with_devicePixelRatio, this.state = "", this.viewPortSettings = e.viewPort, this.init = function (e) {
    this.adaptVP({
      uWidth: this.designWidth
    }), this.adpRem(), void 0 !== e && e();
  }, this.rebind = function (e, i) {
    e = n(this.defaultOptions, e), this.fontSize = e.fontSize, this.designWidth = e.designWidth, this.designHeight = e.designHeight, this.hCallBack = e.hCallBack, this.vCallBack = e.vCallBack, this.scaleLimit = e.scaleLimit, this.mode = e.mode, this.state = "", this.init(function () {
      "undefined" != typeof _callback && i();
    });
  }, this.reInit = function () {
    for (var e = [], n = 0; n < i.queryList.length; n++) {
      var d = i.queryList[n],
          o = !1;
      d.mediaQuery.screenState === t.state && (o = !0), o && e.push(d);
    }
    var a = window.document.documentElement.clientWidth,
        s = window.document.documentElement.clientHeight;

    var h = function h(e) {
      return -1 === e ? 9999999999 : e;
    };

    if (void 0 !== window._a_d_p_d_lockConfig && (e = [window._a_d_p_d_lockConfig]), 0 !== e.length) if (1 === e.length) t.rebind(e[0].mediaQuery.config);else {
      var l = null;

      for (n = 0; n < e.length; n++) {
        var r = e[n];

        if (void 0 !== r.mediaQuery.scope) {
          if (r.mediaQuery.scope.startWidth <= a && h(r.mediaQuery.scope.endWidth) > a && r.mediaQuery.scope.startHeight <= s && h(r.mediaQuery.scope.endHeight) > s) {
            l = r;
            break;
          }
        } else l = r;
      }

      t.rebind(l.mediaQuery.config);
    }
  }, this.adpRem = function () {
    !function (e, n) {
      var d = e.documentElement,
          o = "orientationchange" in window ? "orientationchange" : "resize",
          a = function a() {
        var e = d.clientWidth,
            n = d.clientHeight;
        if (!0 === t.scaleLimit.enable && (e > t.scaleLimit.maxWidth && (e = t.scaleLimit.maxWidth), e < t.scaleLimit.minWidth && (e = t.scaleLimit.minWidth), n > t.scaleLimit.maxHeight && (n = t.scaleLimit.maxHeight), n < t.scaleLimit.minHeight && (n = t.scaleLimit.minHeight)), void 0 === window._a_d_p_d_lockConfig) if (e > n) {
          if (void 0 !== i && i.hasOwnProperty("queryList") && "h" !== t.state && "" !== t.state) return t.state = "h", void t.reInit();
          t.state = "h", t.hCallBack(t);
        } else {
          if (void 0 !== i && i.hasOwnProperty("queryList") && "v" !== t.state && "" !== t.state) return t.state = "v", void t.reInit();
          t.state = "v", t.vCallBack(t);
        }
        var o = null;

        if (e) {
          var a = t.designWidth / t.designHeight,
              s = e / n,
              h = 0,
              l = function l() {
            o = e, h = t.fontSize * (o / t.designWidth);
          },
              r = function r() {
            o = n, h = t.fontSize * (o / t.designHeight);
          };

          "auto" === t.mode ? a < s ? r() : l() : "width" === t.mode ? l() : "height" === t.mode && r();
          var c = Number((h * t.getDevicePixelRatio()).toFixed(1));
          document.documentElement.style.fontSize = c + "px", t.computedFontSize = c, t.orgFontSize_widthOutRatoComput = Number(h.toFixed(1));
        }
      };

      var s = function s() {
        t.debounceSetFontSize(a);
      };

      e.addEventListener && (n.addEventListener(o, s, !1), e.addEventListener("DOMContentLoaded", s, !1), t.distory = function () {
        clearTimeout(t.debounceTimeOut), n.removeEventListener(o, s), e.removeEventListener("DOMContentLoaded", s);
      }, s());
    }(document, window);
  }, this.debounceTimeOut = null, this.getDevicePixelRatio = function () {
    return this.is_relate_with_devicePixelRatio && "undefined" != typeof window && void 0 !== window.devicePixelRatio ? Number((window.outerWidth / window.innerWidth).toFixed(2)) : 1;
  }, this.debounceSetFontSize = function (e) {
    null !== this.debounceTimeOut && clearTimeout(this.debounceTimeOut), this.debounceTime <= 0 ? e() : (null === this.debounceTimeOut && e(), this.debounceTimeOut = setTimeout(function () {
      e(), t.debounceTimeOut = null;
    }, this.debounceTime));
  }, this.adaptVP = function (e) {
    var i = document.querySelector("meta[name='viewport']");
    if ("off" !== this.viewPortSettings.mode) {
      if ("config" !== this.viewPortSettings.mode) {
        if (e) {
          var n = {
            uWidth: 0,
            dWidth: 0,
            ratio: 1,
            mode: "apple",
            userAgent: null,
            bConsole: !1
          };
          n.uWidth = e.uWidth ? e.uWidth : 640, n.dWidth = e.dWidth ? e.dWidth : window.screen.width || window.screen.availWidth, n.ratio = window.devicePixelRatio ? window.devicePixelRatio : 1, n.userAgent = navigator.userAgent, n.bConsole = !!e.bConsole && e.bConsole, e.mode ? n.mode = e.mode : n.userAgent.match(/Android/i) && (n.mode = "android-2.2", (d = n.userAgent.match(/Android\s(\d+.\d+)/i)) && (d = parseFloat(d[1])), 2.2 == d || 2.3 == d ? n.mode = "android-2.2" : 4.4 > d ? n.mode = "android-dpi" : d >= 4.4 && (n.mode = n.dWidth > n.uWidth ? "android-dpi" : "android-scale")), function () {
            var d,
                o,
                a,
                s = "",
                h = !1;

            switch (-1 !== n.userAgent.indexOf("Pixel") && (n.mode = "apple"), n.mode) {
              case "apple":
                s = "width=" + t.designWidth + ", user-scalable=no, user-scalable=0";
                break;

              case "android-2.2":
                e.dWidth || (n.dWidth = 2 == n.ratio ? 720 : 1.5 == n.ratio ? 480 : 1 == n.ratio ? 320 : .75 == n.ratio ? 240 : 480), 320 == (d = window.screen.width || window.screen.availWidth) ? n.dWidth = n.ratio * d : 640 > d && (n.dWidth = d), n.mode = "android-dpi", h = !0;

              case "android-dpi":
                s = " width=" + n.uWidth + ", user-scalable=no", h && (n.mode = "android-2.2");
                break;

              case "android-scale":
                s = "width=" + n.uWidth + ", user-scalable=no";
            }

            null !== i ? i.content = s : ((o = document.querySelector("meta[name='viewport']") || document.createElement("meta")).name = "viewport", o.content = s, (a = document.getElementsByTagName("head")).length > 0 && a[0].appendChild(o));
          }(), n.bConsole && s();
        }

        var d;
      } else {
        var o = "width=" + this.viewPortSettings.width + ", initial-scale=" + this.viewPortSettings.initialScale + ",user-scalable=" + this.viewPortSettings.userScalable;
        null !== i ? i.content = o : ((s = document.querySelector("meta[name='viewport']") || document.createElement("meta")).name = "viewport", s.content = o, a = document.getElementsByTagName("head"), a.length > 0 && a[0].appendChild(s));
      }
    } else null !== i && i.remove();

    function s() {
      for (key in n) {
        key + ": " + n[key] + "; ";
      }
    }
  };
};

/**
 * 创建一个需要全局使用的context
 **/

var resoContext = /*#__PURE__*/createContext({});
/**
 * 默认配置
 */

var defaultConfig = {
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
    minHeight: 600
  },
  //横屏回调函数
  hCallBack: function hCallBack() {},
  //竖屏回调函数
  vCallBack: function vCallBack() {},
  //调整模式
  mode: EresoMode.AUTO,
  //viewPort配置
  viewPort: {
    //auto | config | off
    mode: 'auto'
  },
  is_relate_with_devicePixelRatio: false
};
/* 服务器渲染版本 */

var resoForServer = function resoForServer(config) {
  if (config === void 0) {
    config = _extends({}, defaultConfig);
  }

  /**
   * 适配
   */
  var makeReso = function makeReso(_config, _testState) {
    var mobileAdp = new _mobileAdp(_config, config);
    var helTags;
    var injectElements;
    var scrStr = '';
    var codeString = codeStringify(_mobileAdp$1);
    scrStr = " window.__m_adp__ = " + codeString + ";var _adp_config = " + JSON.stringify(config) + ";if(_adp_config.hasOwnProperty(\"queryList\")){var clientWidth=window.document.documentElement.clientWidth,windowHeight=window.document.documentElement.clientHeight,testState=\"h\";testState=clientWidth>windowHeight?\"h\":\"v\";for(var i=0;i<_adp_config.queryList.length;i++){var _item=_adp_config.queryList[i],_index=i,isCondition=!1;if(_item.mediaQuery.screenState===testState&&(isCondition=!0),isCondition){_item.mediaQuery.config.debounceTime=0,window._a_d_p_d=new __m_adp__(_item.mediaQuery.config,_adp_config),window._a_d_p_d.init();break}}}else _adp_config.debounceTime=0,window._a_d_p_d=new __m_adp__(_adp_config),window._a_d_p_d.init();";
    injectElements = React.createElement("script", {
      id: "_a_d_p_"
    }, scrStr);
    scrStr = scrStr.replace(/[\r\n]/g, ''); //如果是运行在服务端上面就写入一段原生代码,让分辨率适配在网页加载的第一时间进行适配
    //如果这里不进行适配,那么在网页加载的第一时间,客户端代码还没注入的时候,页面将会抽搐一下,
    //等客户端代码完全运行完成后,页面分辨率才会被适配到适合的样子,加入这段代码后,页面在到达浏览器的第一时间就可以开始适配的分辨率

    helTags = React.createElement(Helmet, null, injectElements);
    return {
      data: {
        helTags: helTags,
        elemsnts: injectElements,
        scriptStr: scrStr
      },
      funcs: mobileAdp,
      screenState: EscreenState.HORIZONTAL,
      width: mobileAdp.designWidth,
      height: mobileAdp.designHeight,
      fontSize: mobileAdp.computedFontSize,
      fontSize_org: mobileAdp.orgFontSize_widthOutRatoComput,
      current_pixRato: 1
    };
  };

  return makeReso(config);
};
/* 客户端渲染版本 */

var useReso = function useReso(config) {
  if (config === void 0) {
    config = _extends({}, defaultConfig);
  }

  var $ = useJquery();

  var _useState = useState(EscreenState.HORIZONTAL),
      screenState = _useState[0],
      setscreenState = _useState[1];
  /**
   * 适配
   */


  var makeReso = function makeReso(_config, _testState) {
    //let context = requireContext("../nativeComs/", false, /mobileAdp.js/);
    //let modul = context("./mobileAdp.js");
    var mobileAdp = new _mobileAdp(_config, config);
    var helTags;
    var injectElements;
    var scrStr = '';

    if (!isRunningInServer) {
      //如果是运行在客户端上面就直接初始化
      if (typeof window['_a_d_p_d'] !== 'undefined') {
        if (typeof window['_a_d_p_d']['distory'] !== 'undefined') {
          window['_a_d_p_d']['distory']();
        }
      }

      mobileAdp.init();
    } else {
      /* let UglifyJS = require('uglify-js'); */
      var codeString = codeStringify(_mobileAdp$1);
      scrStr = " window.__m_adp__ = " + codeString + ";var _adp_config = " + JSON.stringify(config) + ";if(_adp_config.hasOwnProperty(\"queryList\")){var clientWidth=window.document.documentElement.clientWidth,windowHeight=window.document.documentElement.clientHeight,testState=\"h\";testState=clientWidth>windowHeight?\"h\":\"v\";for(var i=0;i<_adp_config.queryList.length;i++){var _item=_adp_config.queryList[i],_index=i,isCondition=!1;if(_item.mediaQuery.screenState===testState&&(isCondition=!0),isCondition){_item.mediaQuery.config.debounceTime=0,window._a_d_p_d=new __m_adp__(_item.mediaQuery.config,_adp_config),window._a_d_p_d.init();break}}}else _adp_config.debounceTime=0,window._a_d_p_d=new __m_adp__(_adp_config),window._a_d_p_d.init();";
      /*       let code = { 'reso.js': scrStr };
      scrStr = UglifyJS.minify(code).code; */

      scrStr = scrStr.replace(/[\r\n]/g, '');
      injectElements = React.createElement("script", {
        id: "_a_d_p_"
      }, scrStr); //如果是运行在服务端上面就写入一段原生代码,让分辨率适配在网页加载的第一时间进行适配
      //如果这里不进行适配,那么在网页加载的第一时间,客户端代码还没注入的时候,页面将会抽搐一下,
      //等客户端代码完全运行完成后,页面分辨率才会被适配到适合的样子,加入这段代码后,页面在到达浏览器的第一时间就可以开始适配的分辨率

      helTags = React.createElement(Helmet, null, injectElements);
    }

    return {
      data: {
        helTags: helTags,
        elemsnts: injectElements,
        scriptStr: scrStr
      },
      funcs: mobileAdp,
      screenState: screenState,
      width: mobileAdp.designWidth,
      height: mobileAdp.designHeight,
      fontSize: mobileAdp.computedFontSize,
      fontSize_org: mobileAdp.orgFontSize_widthOutRatoComput,
      current_pixRato: function () {
        if (isRunningInServer) {
          return 1;
        } else {
          return mobileAdp.getDevicePixelRatio();
        }
      }()
    };
  };

  var clientWidth = 1920;
  var windowHeight = 1080;
  var testState = EscreenState.HORIZONTAL;

  if (clientWidth > windowHeight) {
    testState = EscreenState.HORIZONTAL;
  } else {
    testState = EscreenState.VERTICAL;
  }

  var testStateFunc = function testStateFunc(_isSetState) {
    clientWidth = window.document.documentElement.clientWidth;
    windowHeight = window.document.documentElement.clientHeight;

    if (clientWidth > windowHeight) {
      testState = EscreenState.HORIZONTAL;
    } else {
      testState = EscreenState.VERTICAL;
    }

    if (_isSetState === true && typeof window['_a_d_p_d_lockConfig'] !== 'undefined') {
      setscreenState(window['_a_d_p_d_lockConfig'].mediaQuery.screenState);
    } else if (_isSetState === true) {
      setscreenState(testState);
    }
  };

  if (!isRunningInServer) {
    var st = function st() {
      testStateFunc(true);
    };

    useEffect(function () {
      $(window).resize(st);
      testStateFunc(true);
      return function () {
        $(window).unbind('resize', st);
      };
    }, []);
    testStateFunc(false);
  }

  var getEnd = function getEnd(_ed) {
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
    config = config;

    if (!isRunningInServer) {
      if (typeof window['_a_d_p_d'] !== 'undefined') {
        if (typeof window['_a_d_p_d']['distory'] !== 'undefined') {
          window['_a_d_p_d']['distory']();
        }
      } //如果在内存里找到已经缓存好的屏幕状态配置，就直接使用这个配置，不要重新适配


      if (typeof window['_a_d_p_d_lockConfig'] !== 'undefined') {
        return makeReso(window['_a_d_p_d_lockConfig'].mediaQuery.config);
      }

      var result = null;
      var findedResoList = [];

      for (var i = 0; i < config.queryList.length; i++) {
        var _item = config.queryList[i];
        var isCondition = false;

        if (_item.mediaQuery.screenState === testState) {
          isCondition = true; //是否锁定到该条件

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
          result = makeReso(findedResoList[0].mediaQuery.config);
        } else {
          var last = null;

          for (var i = 0; i < findedResoList.length; i++) {
            var citem = findedResoList[i];

            if (typeof citem.mediaQuery.scope !== 'undefined') {
              if (citem.mediaQuery.scope.startWidth <= clientWidth && getEnd(citem.mediaQuery.scope.endWidth) > clientWidth && citem.mediaQuery.scope.startHeight <= windowHeight && getEnd(citem.mediaQuery.scope.endHeight) > windowHeight) {
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
      return makeReso(config.queryList[0].mediaQuery.config);
    }
  } else {
    return makeReso(config);
  }
};

var useResoContext = function useResoContext() {
  var r = useContext(resoContext);
  return r;
};

/**
 * 屏幕状态
 */

var EscreenState$1;

(function (EscreenState) {
  /**
   * 横向屏幕
   */
  EscreenState["HORIZONTAL"] = "h";
  /**
   * 竖屏显示
   */

  EscreenState["VERTICAL"] = "v";
})(EscreenState$1 || (EscreenState$1 = {}));
/**
 * 设置分辨率适配器的工作模式
 */


var EresoMode$1;

(function (EresoMode) {
  /**
   * auto:自动选择高度还是宽度来调整
   */
  EresoMode["AUTO"] = "auto";
  /**
   * width:只通过宽度调整
   */

  EresoMode["WIDTH"] = "width";
  /**
   * height:只通过高度调整
   */

  EresoMode["HEIGHT"] = "height";
})(EresoMode$1 || (EresoMode$1 = {}));

export { EresoMode$1 as EresoMode, EscreenState$1 as EscreenState, _mobileAdp, resoContext, resoForServer, useReso, useResoContext };
//# sourceMappingURL=reso-hook.esm.js.map
