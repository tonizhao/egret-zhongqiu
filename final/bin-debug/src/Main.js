//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var __egretProto__ = Main.prototype;
    __egretProto__.onAddToStage = function (event) {
        this.stage.scaleMode = egret.StageScaleMode.NO_BORDER;
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
        RES.loadGroup('soundLoading');
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    __egretProto__.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        // RES.loadGroup("preload");
        RES.loadGroup("loading");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    __egretProto__.onResourceLoadComplete = function (event) {
        //loading的图加载完了再加载游戏需要的图
        if (event.groupName == "loading") {
            //设置加载进度界面
            //Config to load process interface
            this.loadingView = new LoadingUI();
            this.stage.addChild(this.loadingView);
            RES.loadGroup("preload");
        }
        else if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            document.getElementById('page_welcome').style.display = 'block';
            document.getElementById('gameDiv').style.display = 'none';
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    __egretProto__.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    __egretProto__.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    __egretProto__.createGameScene = function () {
        this.stage.scaleMode = egret.StageScaleMode.NO_BORDER;
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        //背景画布
        var backgroundPic = this.createBitmapByName('canvasBg');
        backgroundPic.x = 0;
        backgroundPic.y = 0;
        backgroundPic.width = stageW;
        backgroundPic.height = stageH;
        this.addChild(backgroundPic);
        //顶部的地主头像
        var dzTopPic = this.createBitmapByName('dzTop');
        dzTopPic.width = 144;
        dzTopPic.height = 117;
        dzTopPic.y = 10;
        dzTopPic.x = (stageW - dzTopPic.width) / 2;
        this.addChild(dzTopPic);
        //顶部横梁
        var topLight = this.createBitmapByName('topLight');
        topLight.width = stageW;
        topLight.height = 105;
        topLight.x = 0;
        topLight.y = 80;
        this.addChild(topLight);
        //生命值
        var lifeBg = this.createBitmapByName('lifeBg');
        lifeBg.width = 136;
        lifeBg.height = 75;
        lifeBg.x = 10;
        lifeBg.y = 0;
        this.addChild(lifeBg);
        var gameIcon = new GameIcon();
        this.stage.addChild(gameIcon);
        gameIcon.init();
        //用H5的按钮启动游戏
        document.getElementById('btn_start_game').addEventListener('click', function () {
            //由于JS不能启动游戏，这里不能访问到uid，用一个隐藏的按钮来设置localstorage的是否展示过规则
            var uid = document.getElementById('text_uid').innerHTML;
            if (localStorage.getItem('ddz_show_rule_' + uid) == null) {
                //没有展示过规则
                document.getElementById('act_rule_container').className = 'pop rule';
                document.getElementById('btn_set_rule_local').click();
                document.getElementById('btn_start_game_rule').addEventListener('click', function () {
                    //隐藏欢迎页
                    document.getElementById('act_rule_container').className = 'pop rule hide';
                    document.getElementById('page_welcome').style.display = 'none';
                    document.getElementById('gameDiv').style.display = 'block';
                    //启动游戏
                    gameIcon.startGame();
                });
            }
            else {
                //隐藏欢迎页
                document.getElementById('act_rule_container').className = 'pop rule hide';
                document.getElementById('page_welcome').style.display = 'none';
                document.getElementById('gameDiv').style.display = 'block';
                //启动游戏
                gameIcon.startGame();
            }
        });
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    __egretProto__.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    __egretProto__.startAnimation = function (result) {
        var self = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = [];
        for (var i = 0; i < result.length; i++) {
            textflowArr.push(parser.parser(result[i]));
        }
        var textfield = self.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var lineArr = textflowArr[count];
            self.changeDescription(textfield, lineArr);
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, self);
        };
        change();
    };
    /**
     * 切换描述内容
     * Switch to described content
     */
    __egretProto__.changeDescription = function (textfield, textFlow) {
        textfield.textFlow = textFlow;
    };
    return Main;
})(egret.DisplayObjectContainer);
Main.prototype.__class__ = "Main";
