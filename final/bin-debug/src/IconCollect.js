//保存icon的类型加上icon本身
var IconCollect = (function () {
    function IconCollect(iconType, icon) {
        this._iconType = iconType;
        this._icon = icon;
    }
    var __egretProto__ = IconCollect.prototype;
    Object.defineProperty(__egretProto__, "iconType", {
        get: function () {
            return this._iconType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(__egretProto__, "icon", {
        get: function () {
            return this._icon;
        },
        enumerable: true,
        configurable: true
    });
    return IconCollect;
})();
IconCollect.prototype.__class__ = "IconCollect";
