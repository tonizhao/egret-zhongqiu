//游戏的下落物体逻辑
var GameIcon = (function (_super) {
    __extends(GameIcon, _super);
    function GameIcon() {
        _super.call(this);
        this.speedSlow = 2000;
        this.speedFast = 1500;
        this.speedFaster = 1000;
        this.speedMagnet = 500;
        //舞台的常量
        this._stage = egret.MainContext.instance.stage;
        this.stageW = this._stage.stageWidth;
        this.stageH = this._stage.stageHeight;
        //记录总分
        this.totalScore = 0;
        //总生命
        this.totalLife = 3;
        //音乐开关
        this.isMusicPlay = 1;
        //当前游戏状态：1：游戏中 2：游戏暂停 3：游戏结束
        this.gameStatus = GameConstants.STATUS_PLAYING;
        this.isChangeTime = 0;
        // this.init();
    }
    var __egretProto__ = GameIcon.prototype;
    __egretProto__.init = function () {
        var stageW = egret.MainContext.instance.stage.stageWidth;
        //背景音乐
        this.backgroundSound = RES.getRes('backgroundSound');
        this.drawMusic();
        //游戏状态切换按钮
        this.drawGameSwitchBtn();
        //划分数
        this.totalScoreText = new egret.TextField();
        this.totalScoreText.x = 55;
        this.totalScoreText.y = 53;
        this.totalScoreText.textColor = 0xEBB719;
        this.totalScoreText.text = "0";
        this.totalScoreText.size = 20;
        this.addChild(this.totalScoreText);
        //小兔子装饰
        var iconRabbit = this.createBitmapByName('iconRabbit');
        iconRabbit.width = 66;
        iconRabbit.height = 79;
        iconRabbit.x = 20;
        iconRabbit.y = this.stageH - 200;
        this.addChild(iconRabbit);
        //生命值的小头
        this.lifeHead1 = this.createBitmapByName('lifeHead');
        this.lifeHead1.width = 40;
        this.lifeHead1.height = 40;
        this.lifeHead1.x = 15;
        this.lifeHead1.y = 0;
        this.addChild(this.lifeHead1);
        this.lifeHead2 = this.createBitmapByName('lifeHead');
        this.lifeHead2.width = 40;
        this.lifeHead2.height = 40;
        this.lifeHead2.x = 60;
        this.lifeHead2.y = 0;
        this.addChild(this.lifeHead2);
        this.lifeHead3 = this.createBitmapByName('lifeHead');
        this.lifeHead3.width = 40;
        this.lifeHead3.height = 40;
        this.lifeHead3.x = 105;
        this.lifeHead3.y = 0;
        this.addChild(this.lifeHead3);
        //地主人物
        this.dzBody = this.createBitmapByName('dzDefault');
        this.dzBody.width = 127;
        this.dzBody.height = 184;
        this.dzBody.x = (this.stageW - this.dzBody.width) / 2;
        this.dzBody.y = this.stageH - 204;
        this.addChild(this.dzBody);
        this._stage.touchEnabled = true;
        //人物滑动
        this._stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (event) {
            this.lastX = event.stageX;
        }, this);
        this._stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, function (event) {
            if (this.gameStatus != GameConstants.STATUS_PLAYING && this.gameStatus != GameConstants.STATUS_BOOMING) {
                return;
            }
            var x = event.stageX;
            var move = x - this.lastX;
            //如果当前状态是爆炸中，就不改变地主图像
            if (this.gameStatus != GameConstants.STATUS_BOOMING) {
                //改变图像
                if (move > 0) {
                    this.dzBody.texture = RES.getRes('dzMoveRight');
                }
                if (move < 0) {
                    this.dzBody.texture = RES.getRes('dzMoveLeft');
                }
            }
            var bodyX = this.dzBody.x + move;
            //设置移动边缘
            if (bodyX <= 0) {
                bodyX = 0;
            }
            else if (bodyX >= stageW - 1 - this.dzBody.width) {
                bodyX = stageW - this.dzBody.width;
            }
            //改变地主的位置
            this.dzBody.x = bodyX;
            this.lastX = x;
        }, this);
        this._stage.addEventListener(egret.TouchEvent.TOUCH_END, function (event) {
            if (this.gameStatus != GameConstants.STATUS_PLAYING) {
                return;
            }
            this.dzBody.texture = RES.getRes('dzDefault');
            this.lastX = event.stageX;
        }, this);
        //开始掉落东西
        this.timer = new egret.Timer(260, 50000);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.drawFallThings, this);
    };
    //开始游戏跟初始化分开
    __egretProto__.startGame = function () {
        //各个数值重置
        this.gtList = [];
        this.iconList = [];
        this.scroeTextList = [];
        this.totalScore = 0;
        this.totalLife = 3;
        //速度重置
        this.speedSlow = 2000;
        this.speedFast = 1500;
        this.totalScoreText.text = "0";
        this.iconGameSwitchBtn.texture = RES.getRes('gameSwitchBtn');
        this.dzBody.texture = RES.getRes('dzDefault');
        this.iconMusic.texture = RES.getRes('iconMusic');
        this.addChild(this.lifeHead1);
        this.addChild(this.lifeHead2);
        this.addChild(this.lifeHead3);
        this.gameStatus = GameConstants.STATUS_PLAYING;
        //把动画全关了
        egret.Tween.removeAllTweens();
        //播放音乐
        this.backgroundSound.play(true);
        this.timer.start();
    };
    //暂停游戏
    __egretProto__.pauseGame = function () {
        this.gameStatus = GameConstants.STATUS_PAUSE;
        for (var idx in this.gtList) {
            this.gtList[idx].setPaused(true);
        }
        //停止计时器
        this.timer.stop();
    };
    //重新开始游戏
    __egretProto__.continueGame = function () {
        this.gameStatus = GameConstants.STATUS_PLAYING;
        for (var idx in this.gtList) {
            this.gtList[idx].setPaused(false);
        }
        //停止计时器
        this.timer.start();
    };
    //游戏结束
    __egretProto__.gameOver = function () {
        var that = this;
        this.gameStatus = GameConstants.STATUS_OVER;
        this.dzBody.texture = RES.getRes('dzDead');
        //把音乐停了
        this.backgroundSound.stop();
        this.clearScoreTextList();
        //开始暂停按钮修改下
        this.iconGameSwitchBtn.texture = RES.getRes('gameSwitchBtnPause');
        for (var idx in this.iconList) {
            try {
                this.iconList[idx].icon.parent.removeChild(this.iconList[idx].icon);
            }
            catch (e) {
            }
        }
        //把动画全关了
        egret.Tween.removeAllTweens();
        //重组计时器
        // this.timer.stop();
        this.timer.reset();
        //吊起h5的弹窗
        document.getElementById('result_container').className = "pop result";
        document.getElementById('text_total_score').innerHTML = "" + this.totalScore;
        document.getElementById('show_total_score').innerHTML = "" + this.totalScore;
        document.getElementById('btn_record_total_score').click();
        //重新开始
        document.getElementById('btn_play_again').addEventListener('click', function () {
            document.getElementById('result_container').className = "pop result hide";
            that.startGame();
        });
    };
    //暂停和恢复游戏按钮
    __egretProto__.drawGameSwitchBtn = function () {
        //音乐
        this.iconGameSwitchBtn = this.createBitmapByName('gameSwitchBtn');
        this.iconGameSwitchBtn.width = 63;
        this.iconGameSwitchBtn.height = 72;
        this.iconGameSwitchBtn.x = this.stageW - this.iconGameSwitchBtn.width - 88;
        this.iconGameSwitchBtn.y = 0;
        this.addChild(this.iconGameSwitchBtn);
        this.iconGameSwitchBtn.touchEnabled = true;
        this.iconGameSwitchBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (this.gameStatus == GameConstants.STATUS_PLAYING) {
                //当前进行中，暂停
                this.iconGameSwitchBtn.texture = RES.getRes('gameSwitchBtnPause');
                this.pauseGame();
            }
            else if (this.gameStatus == GameConstants.STATUS_PAUSE) {
                //当前暂停
                this.iconGameSwitchBtn.texture = RES.getRes('gameSwitchBtn');
                this.continueGame();
            }
            else if (this.gameStatus == GameConstants.STATUS_OVER) {
                this.iconGameSwitchBtn.texture = RES.getRes('gameSwitchBtn');
                this.timer.reset();
                this.startGame();
            }
        }, this);
    };
    //音乐开关按钮
    __egretProto__.drawMusic = function () {
        //音乐
        this.iconMusic = this.createBitmapByName('iconMusic');
        this.iconMusic.width = 63;
        this.iconMusic.height = 72;
        this.iconMusic.x = this.stageW - this.iconMusic.width - 20;
        this.iconMusic.y = 0;
        this.addChild(this.iconMusic);
        this.iconMusic.touchEnabled = true;
        //音乐暂停
        this.iconMusic.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (this.isMusicPlay == 0) {
                this.isMusicPlay = 1;
                this.iconMusic.texture = RES.getRes('iconMusic');
                this.backgroundSound.play(true);
            }
            else {
                this.isMusicPlay = 0;
                this.iconMusic.texture = RES.getRes('iconMusicPause');
                this.backgroundSound.pause();
            }
        }, this);
    };
    //根据随机数随机掉落物品
    __egretProto__.drawFallThings = function () {
        var currentCount = this.timer.currentCount;
        //越往后速度越快
        if (currentCount >= 40 && currentCount < 60) {
            this.speedSlow = 1800;
            this.speedFast = 1400;
        }
        else if (currentCount >= 60 && currentCount < 90) {
            this.speedSlow = 1600;
            this.speedFast = 1200;
        }
        else if (currentCount >= 90 && currentCount < 120) {
            this.speedSlow = 1400;
            this.speedFast = 1000;
        }
        else if (currentCount >= 120 && currentCount < 150) {
            this.speedSlow = 1200;
            this.speedFast = 800;
        }
        else if (currentCount >= 150 && currentCount < 180) {
            this.speedSlow = 1000;
            this.speedFast = 600;
        }
        // if(currentCount <= 50) {
        //生成随机数
        var ram = Math.random();
        if (ram >= 0 && ram <= 0.5) {
            this.drawCake();
        }
        else if (ram > 0.5 && ram <= 0.52) {
            this.drawMagnet();
        }
        else if (ram > 0.52 && ram <= 0.78) {
            this.drawGift();
        }
        else {
            this.drawBoom();
        }
        // }
        // else {
        //     //生成随机数
        //     var ram = Math.random();
        //     if(ram >=0 && ram<=0.45) {
        //         this.drawCake();
        //         var continueTimer = new egret.Timer(250,1);
        //         continueTimer.addEventListener(egret.TimerEvent.TIMER, function() {
        //             this.drawCake();
        //             continueTimer.stop();
        //         }, this);
        //         continueTimer.start();
        //     }
        //     else if(ram > 0.45 && ram <= 0.53) {
        //         this.drawMagnet();
        //     }
        //     else if(ram > 0.53 && ram <= 0.75) {
        //         this.drawGift();
        //         var continueTimer = new egret.Timer(250,1);
        //         continueTimer.addEventListener(egret.TimerEvent.TIMER, function() {
        //             this.drawGift();
        //             continueTimer.stop();
        //         }, this);
        //         continueTimer.start();
        //     }
        //     else {
        //         this.drawBoom();
        //         var continueTimer = new egret.Timer(250,1);
        //         continueTimer.addEventListener(egret.TimerEvent.TIMER, function() {
        //             this.drawBoom();
        //             continueTimer.stop();
        //         }, this);
        //         continueTimer.start();
        //     }
        // }
    };
    //月饼
    __egretProto__.drawCake = function () {
        //月饼
        var iconCake = this.createBitmapByName('iconCake');
        //x轴的位置随机
        var x = this.getRandomX(67);
        iconCake.x = x;
        iconCake.y = 100;
        iconCake.width = 67;
        iconCake.height = 72;
        this.addChild(iconCake);
        var dzBody = this.dzBody;
        var giftTw = egret.Tween.get(iconCake, { onChange: function () {
            //调用状态改变参数，第一个是
            this.fallingChange(iconCake, giftTw, GameConstants.TYPE_CAKE);
        }, onChangeObj: this });
        giftTw.to({ y: this.stageH }, this.speedSlow);
        giftTw.call(this.fallingComplete, iconCake);
        var iconCol = new IconCollect(GameConstants.TYPE_CAKE, iconCake);
        this.iconList.push(iconCol);
        this.gtList.push(giftTw);
    };
    //礼盒
    __egretProto__.drawGift = function () {
        var iconGift = this.createBitmapByName('iconGift');
        //生成随机x轴位置
        var x = this.getRandomX(69);
        iconGift.x = x;
        iconGift.y = 100;
        iconGift.width = 69;
        iconGift.height = 77;
        this.addChild(iconGift);
        var dzBody = this.dzBody;
        var isHit = 0;
        var giftTw = egret.Tween.get(iconGift, { onChange: function () {
            //调用状态改变参数，第一个是
            this.fallingChange(iconGift, giftTw, GameConstants.TYPE_GIFT);
        }, onChangeObj: this });
        giftTw.to({ y: this.stageH }, this.speedSlow);
        giftTw.call(this.fallingComplete, iconGift);
        var iconCol = new IconCollect(GameConstants.TYPE_GIFT, iconGift);
        this.iconList.push(iconCol);
        this.gtList.push(giftTw);
    };
    //炸弹
    __egretProto__.drawBoom = function () {
        var iconBoom = this.createBitmapByName('iconBoom');
        //生成随机x轴位置
        var x = this.getRandomX(75);
        iconBoom.x = x;
        iconBoom.y = 100;
        iconBoom.width = 75;
        iconBoom.height = 68;
        this.addChild(iconBoom);
        var giftTw = egret.Tween.get(iconBoom, { onChange: function () {
            //调用状态改变参数，第一个是
            this.fallingChange(iconBoom, giftTw, GameConstants.TYPE_BOOM);
        }, onChangeObj: this });
        giftTw.to({ y: this.stageH }, this.speedFast);
        giftTw.call(this.fallingComplete, iconBoom);
        var iconCol = new IconCollect(GameConstants.TYPE_BOOM, iconBoom);
        this.iconList.push(iconCol);
        this.gtList.push(giftTw);
    };
    //磁铁
    __egretProto__.drawMagnet = function () {
        var iconMagnet = this.createBitmapByName('iconMagnet');
        //x轴的位置随机
        var x = this.getRandomX(67);
        iconMagnet.x = x;
        iconMagnet.y = 100;
        iconMagnet.width = 67;
        iconMagnet.height = 72;
        this.addChild(iconMagnet);
        var dzBody = this.dzBody;
        var giftTw = egret.Tween.get(iconMagnet, { onChange: function () {
            //调用状态改变参数，第一个是
            this.fallingChange(iconMagnet, giftTw, GameConstants.TYPE_MAGNET);
        }, onChangeObj: this });
        giftTw.to({ y: this.stageH }, this.speedSlow);
        giftTw.call(this.fallingComplete, iconMagnet);
        var iconCol = new IconCollect(GameConstants.TYPE_MAGNET, iconMagnet);
        this.iconList.push(iconCol);
        this.gtList.push(giftTw);
    };
    //下落完成没有要把icon干掉
    __egretProto__.fallingComplete = function () {
        try {
            this.parent.removeChild(this);
        }
        catch (e) {
            console.log(e);
        }
    };
    //掉落物品下落的回调函数
    __egretProto__.fallingChange = function (icon, gt, fallType) {
        if (icon.y > egret.MainContext.instance.stage.stageHeight - 255) {
            var _x = icon.x;
            var _selfEndPointer = _x + icon.width;
            var _testStartPointer = this.dzBody.x + 20;
            var _testEndPointer = this.dzBody.x + 127;
            //判断的标准是两个x轴交叉
            if ((_testStartPointer >= _x && _testStartPointer <= _selfEndPointer) || (_x >= _testStartPointer && _x <= _testEndPointer)) {
                try {
                    icon.parent.removeChild(icon);
                    //通过下落的物品的类型执行不同的操作
                    if (fallType == GameConstants.TYPE_CAKE) {
                        //显示文字动画
                        this.getScoreTextfield(10, _x);
                        //得到的是月饼
                        this.totalScore += 10;
                        this.totalScoreText.text = "" + this.totalScore;
                    }
                    else if (fallType == GameConstants.TYPE_GIFT) {
                        //显示文字动画
                        this.getScoreTextfield(50, _x);
                        //得到的是礼盒
                        this.totalScore += 50;
                        this.totalScoreText.text = "" + this.totalScore;
                    }
                    else if (fallType == GameConstants.TYPE_BOOM) {
                        if (this.gameStatus == GameConstants.STATUS_MAGNETING) {
                            return;
                        }
                        //把状态改成正在爆炸
                        this.gameStatus = GameConstants.STATUS_BOOMING;
                        //碰到炸弹了，改变任务形象
                        this.dzBody.texture = RES.getRes('dzDead');
                        //生命值减1
                        this.totalLife--;
                        if (this.totalLife == 2) {
                            this.removeChild(this.lifeHead3);
                        }
                        else if (this.totalLife == 1) {
                            this.removeChild(this.lifeHead2);
                        }
                        else if (this.totalLife == 0) {
                            this.removeChild(this.lifeHead1);
                            //游戏结束
                            this.gameOver();
                        }
                        //一段时间后把游戏状态改成playing
                        //如果游戏没有结束,500毫秒之后重新开始
                        var changeTimer = new egret.Timer(500, 1);
                        changeTimer.addEventListener(egret.TimerEvent.TIMER, function () {
                            if (this.gameStatus != GameConstants.STATUS_OVER) {
                                this.gameStatus = GameConstants.STATUS_PLAYING;
                                changeTimer.stop();
                            }
                        }, this);
                        changeTimer.start();
                    }
                    else if (fallType == GameConstants.TYPE_MAGNET) {
                        if (this.gameStatus == GameConstants.STATUS_MAGNETING) {
                            return;
                        }
                        //碰到磁铁了
                        this.gameStatus = GameConstants.STATUS_MAGNETING;
                        this.clearScoreTextList();
                        //先把timer停了
                        this.timer.stop();
                        //把所有的tween干掉
                        egret.Tween.removeAllTweens();
                        for (var idx in this.iconList) {
                            //每个元素再设置一个动画到地主身上
                            this.createMagnetGt(this.iconList[idx]);
                        }
                        //500毫秒之后重新开始
                        var continueTimer = new egret.Timer(500, 1);
                        continueTimer.addEventListener(egret.TimerEvent.TIMER, function () {
                            this.continueGame();
                            continueTimer.stop();
                        }, this);
                        continueTimer.start();
                    }
                }
                catch (e) {
                }
            }
        }
    };
    __egretProto__.createMagnetGt = function (iconCol) {
        //地雷就消失
        if (iconCol.iconType != GameConstants.TYPE_BOOM) {
            var giftTw = egret.Tween.get(iconCol.icon, { onChange: function () {
                //调用状态改变参数，第一个是
                this.fallingChange(iconCol.icon, giftTw, iconCol.iconType);
            }, onChangeObj: this });
            giftTw.to({ x: this.dzBody.x, y: this.dzBody.y }, this.speedMagnet);
        }
        else {
            var giftTw = egret.Tween.get(iconCol.icon, { onChange: function () {
                //调用状态改变参数，第一个是
                // this.fallingChange(iconCol.icon, giftTw, iconCol.iconType)
            }, onChangeObj: iconCol.icon });
            giftTw.to({ alpha: 0 }, this.speedMagnet).call(function () {
                try {
                    iconCol.icon.parent.removeChild(iconCol.icon);
                }
                catch (e) {
                }
            }, this);
        }
    };
    //通过资源key值得到图像
    __egretProto__.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    //得到随机的x轴值
    __egretProto__.getRandomX = function (width) {
        var ram = Math.random();
        var x = ram * this.stageW;
        if (x < 0) {
            x = 0;
        }
        if (x > this.stageW - width) {
            x = this.stageW - width;
        }
        return x;
    };
    //生成加分的textfield
    __egretProto__.getScoreTextfield = function (score, x) {
        var scoreTextfield = new egret.TextField();
        scoreTextfield.text = "+" + score;
        if (score > 10) {
            scoreTextfield.size = 28;
            scoreTextfield.textColor = 0xCF4444;
        }
        else {
            scoreTextfield.size = 25;
            scoreTextfield.textColor = 0xEBB719;
        }
        scoreTextfield.bold = true;
        scoreTextfield.x = x;
        scoreTextfield.y = egret.MainContext.instance.stage.stageHeight - 255;
        this.addChild(scoreTextfield);
        this.scroeTextList.push(scoreTextfield);
        //消失的效果
        egret.Tween.get(scoreTextfield).to({ y: egret.MainContext.instance.stage.stageHeight - 275, alpha: 0 }, 1000).call(function () {
            this.removeChild(scoreTextfield);
        }, this);
    };
    __egretProto__.clearScoreTextList = function () {
        for (var idx in this.scroeTextList) {
            try {
                this.scroeTextList[idx].parent.removeChild(this.scroeTextList[idx]);
            }
            catch (e) {
            }
        }
    };
    return GameIcon;
})(egret.Sprite);
GameIcon.prototype.__class__ = "GameIcon";
