/*!
 * mobileAdp.js
 * (c) 2015-2021 bobliao
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
const _mobileAdp = function(_options, _mOptions) {
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
      minHeight: 600,
    },
    //横屏回调函数
    hCallBack: function() {},
    //竖屏回调函数
    vCallBack: function() {},
    //调整模式
    //auto:自动选择高度还是宽度来调整
    //width:只通过宽度调整
    //height:只通过高度调整
    mode: 'auto',
    //防抖时间
    debounceTime: 500,
  };

  //拷贝函数
  var extend = function(target, source) {
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

  _options = extend(this.defaultOptions, _options);

  //rem相对字体大小起始大小
  //单位像素
  this.fontSize = _options.fontSize;
  //设计稿宽度
  this.designWidth = _options.designWidth;
  //设计稿高度
  this.designHeight = _options.designHeight;

  //横屏回调函数
  this.hCallBack = _options.hCallBack;

  //竖屏回调函数
  this.vCallBack = _options.vCallBack;

  //大小限制选项
  this.scaleLimit = _options.scaleLimit;

  //防抖时间
  this.debounceTime = _options.debounceTime;

  ///调整模式
  //auto:自动选择高度还是宽度来调整
  //width:只通过宽度调整
  //height:只通过高度调整,
  this.mode = _options.mode;

  //指示当前是横屏还是竖屏
  this.state = '';

  //初始化
  this.init = function(_callback) {
    //先适配viewPort
    this.adaptVP({ uWidth: this.designWidth });
    //然后再适配rem
    this.adpRem();

    if (typeof _callback !== 'undefined') {
      _callback();
    }
  };

  //重新调整
  this.rebind = function(_options, _callBack) {
    _options = extend(this.defaultOptions, _options);
    //rem相对字体大小起始大小
    //单位像素
    this.fontSize = _options.fontSize;
    //设计稿宽度
    this.designWidth = _options.designWidth;
    //设计稿高度
    this.designHeight = _options.designHeight;

    //横屏回调函数
    this.hCallBack = _options.hCallBack;

    //竖屏回调函数
    this.vCallBack = _options.vCallBack;

    //大小限制选项
    this.scaleLimit = _options.scaleLimit;

    ///调整模式
    //auto:自动选择高度还是宽度来调整
    //width:只通过宽度调整
    //height:只通过高度调整,
    this.mode = _options.mode;

    //指示当前是横屏还是竖屏
    this.state = '';
    this.init(function() {
      if (typeof _callback !== 'undefined') {
        _callBack();
      }
    });
  };

  /**
   * 重新初始化
   */
  this.reInit = function() {
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
    if (isCondition) {
      _item.mediaQuery.config;
    }
    var clientWidth = window.document.documentElement.clientWidth;
    var windowHeight = window.document.documentElement.clientHeight;
    if (findedResoList.length !== 0) {
      if (findedResoList.length === 1) {
        self.rebind(findedResoList[0].mediaQuery.config);
      } else {
        var last = null;
        for (var i = 0; i < findedResoList.length; i++) {
          var citem = findedResoList[i];
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
        self.rebind(last.mediaQuery.config);
      }
    }
  };

  //适配rem算法
  //这个算法还保留在以前的代码里
  //这个的话最早可以追溯到2016年
  this.adpRem = function() {
    //适配rem的算法
    (function(doc, win) {
      var docEl = doc.documentElement,
        resizeEvt =
          'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
          //document.body.style.display = "none";
          var clientWidth = docEl.clientWidth;
          var windowHeight = docEl.clientHeight;
          //document.body.style.display = "";

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

          if (clientWidth > windowHeight) {
            if (
              typeof _mOptions !== 'undefined' &&
              _mOptions.hasOwnProperty('queryList')
            ) {
              if (self.state !== 'h' && self.state !== '') {
                self.state = 'h';
                self.reInit();
                return;
              }
            }

            self.state = 'h';
            self.hCallBack(self);
          } else {
            if (
              typeof _mOptions !== 'undefined' &&
              _mOptions.hasOwnProperty('queryList')
            ) {
              if (self.state !== 'v' && self.state !== '') {
                self.state = 'v';
                self.reInit();
                return;
              }
            }
            self.state = 'v';
            self.vCallBack(self);
          }

          var compTarget = null;
          if (!clientWidth) return;
          //原始比例
          var orgPre = self.designWidth / self.designHeight;
          var currPre = clientWidth / windowHeight;
          var res = 0;

          var adWidth = function() {
            //console.log('用宽度调整字体')
            compTarget = clientWidth;
            //计算设计字体大小和实际字体大小的比例关系
            res = self.fontSize * (compTarget / self.designWidth);
          };

          var adHeight = function() {
            //console.log('用高度调整字体')
            compTarget = windowHeight;
            //计算设计字体大小和实际字体大小的比例关系
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
          document.documentElement.style.fontSize = res.toFixed(1) + 'px';
        };

      let resizeF = function() {
        self.debounceSetFontSize(recalc);
      };
      /*
            window.onload = recalc;
            */
      if (!doc.addEventListener) return;
      win.addEventListener(resizeEvt, resizeF, false);
      doc.addEventListener('DOMContentLoaded', resizeF, false);
      self.distory = function() {
        clearTimeout(self.debounceTimeOut);
        win.removeEventListener(resizeEvt, resizeF);
        doc.removeEventListener('DOMContentLoaded', resizeF);
      };
      resizeF();
    })(document, window);
  };

  this.debounceTimeOut = null;

  /**
   * 设置字体大小的时候进行防抖处理
   *  */
  this.debounceSetFontSize = function(_recalc) {
    if (this.debounceTimeOut !== null) {
      clearTimeout(this.debounceTimeOut);
    }
    if (this.debounceTime <= 0) {
      _recalc();
    } else {
      if (this.debounceTimeOut === null) {
        _recalc();
      }
      this.debounceTimeOut = setTimeout(function() {
        _recalc();
        self.debounceTimeOut = null;
      }, this.debounceTime);
    }
  };

  //适配viewPort
  //这是一个相当古老的算法了
  //最早可以追溯到2015年
  //原版算法已经找不到了
  //最后只找到了这个被压缩后的版本
  this.adaptVP = function(d) {
    function e() {
      var e, i;
      return (
        (o.uWidth = d.uWidth ? d.uWidth : 640),
        (o.dWidth = d.dWidth
          ? d.dWidth
          : window.screen.width || window.screen.availWidth),
        (o.ratio = window.devicePixelRatio ? window.devicePixelRatio : 1),
        (o.userAgent = navigator.userAgent),
        (o.bConsole = d.bConsole ? d.bConsole : !1),
        d.mode
          ? void (o.mode = d.mode)
          : ((e = o.userAgent.match(/Android/i)),
            void (
              e &&
              ((o.mode = 'android-2.2'),
              (i = o.userAgent.match(/Android\s(\d+.\d+)/i)),
              i && (i = parseFloat(i[1])),
              2.2 == i || 2.3 == i
                ? (o.mode = 'android-2.2')
                : 4.4 > i
                ? (o.mode = 'android-dpi')
                : i >= 4.4 &&
                  (o.mode =
                    o.dWidth > o.uWidth ? 'android-dpi' : 'android-scale'))
            ))
      );
    }
    function i() {
      var e,
        i,
        t,
        a,
        n = '',
        r = !1;
      if (o.userAgent.indexOf('Pixel') !== -1) {
        o.mode = 'apple';
      }
      switch (o.mode) {
        case 'apple':
          n =
            'width=' + self.designWidth + ', user-scalable=no, user-scalable=0';
          break;
        case 'android-2.2':
          d.dWidth ||
            (o.dWidth =
              2 == o.ratio
                ? 720
                : 1.5 == o.ratio
                ? 480
                : 1 == o.ratio
                ? 320
                : 0.75 == o.ratio
                ? 240
                : 480),
            (e = window.screen.width || window.screen.availWidth),
            320 == e ? (o.dWidth = o.ratio * e) : 640 > e && (o.dWidth = e),
            (o.mode = 'android-dpi'),
            (r = !0);
        case 'android-dpi':
          (i = ((160 * o.uWidth) / o.dWidth) * o.ratio),
            (n =
              'target-densitydpi=' +
              i +
              ', width=' +
              o.uWidth +
              ', user-scalable=no'),
            r && (o.mode = 'android-2.2');
          break;
        case 'android-scale':
          //n = "width=" + o.uWidth + ", user-scalable=no";
          i = ((160 * o.uWidth) / o.dWidth) * o.ratio;
          n =
            'target-densitydpi=' +
            i +
            ', width=' +
            o.uWidth +
            ', user-scalable=no';
      }
      t =
        document.querySelector("meta[name='viewport']") ||
        document.createElement('meta');
      t.name = 'viewport';
      t.content = n;
      a = document.getElementsByTagName('head');
      if (a.length > 0) {
        a[0].appendChild(t);
      }
    }
    function t() {
      var d = '';
      for (key in o) {
        d += key + ': ' + o[key] + '; ';
      }
      //alert(d);
    }
    if (d) {
      var o = {
        uWidth: 0,
        dWidth: 0,
        ratio: 1,
        mode: 'apple',
        userAgent: null,
        bConsole: !1,
      };
      e(), i(), o.bConsole && t();
    }
  };
};

export { _mobileAdp };
