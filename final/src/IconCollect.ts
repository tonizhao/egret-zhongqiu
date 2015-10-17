//保存icon的类型加上icon本身
class IconCollect {
    private _iconType:number;
    private _icon:egret.Bitmap;

    public constructor(iconType:number, icon:egret.Bitmap) {
        this._iconType = iconType;
        this._icon = icon;
    }

    public get iconType():number {
        return this._iconType;
    }

    public get icon():egret.Bitmap {
        return this._icon;
    }
}