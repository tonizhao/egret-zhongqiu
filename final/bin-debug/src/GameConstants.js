var GameConstants = (function () {
    function GameConstants() {
    }
    var __egretProto__ = GameConstants.prototype;
    GameConstants.TYPE_CAKE = 1; //月饼类型
    GameConstants.TYPE_GIFT = 2; //礼包类型
    GameConstants.TYPE_BOOM = 3; //炸弹类型
    GameConstants.TYPE_MAGNET = 4; //磁铁类型
    //游戏游玩状态
    GameConstants.STATUS_PLAYING = 1; //正在玩
    GameConstants.STATUS_PAUSE = 2; //暂停
    GameConstants.STATUS_OVER = 3; //结束
    GameConstants.STATUS_MAGNETING = 4; //正在吸入磁铁
    GameConstants.STATUS_BOOMING = 5; //正在被雷击
    return GameConstants;
})();
GameConstants.prototype.__class__ = "GameConstants";
