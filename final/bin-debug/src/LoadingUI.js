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
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        _super.call(this);
        this.stageW = egret.MainContext.instance.stage.stageWidth;
        this.stageH = egret.MainContext.instance.stage.stageHeight;
        this.createView();
    }
    var __egretProto__ = LoadingUI.prototype;
    __egretProto__.createView = function () {
        //先画loading的背景
        var topMask = new egret.Shape();
        topMask.graphics.beginFill(0x591C20);
        topMask.graphics.drawRect(0, 0, this.stageW, this.stageH);
        topMask.graphics.endFill();
        this.addChild(topMask);
        //再话头部那个小图
        this.loadingHead = this.createBitmapByName('loadingHead');
        this.loadingHead.width = 135;
        this.loadingHead.height = 129;
        this.loadingHead.x = (this.stageW - this.loadingHead.width) / 2;
        this.loadingHead.y = 200;
        this.addChild(this.loadingHead);
        var processBarX = (this.stageW - this.loadingHead.width) / 2 - 30;
        //进度条
        var processBarBack = new egret.Shape();
        processBarBack.graphics.beginFill(0x280709);
        processBarBack.graphics.drawRoundRect(processBarX, 350, 200, 15, 20, 20);
        processBarBack.graphics.endFill();
        this.addChild(processBarBack);
        this.processBar = new egret.Shape();
        this.processBar.graphics.beginFill(0xB3454B);
        this.processBar.graphics.drawRoundRect(processBarX, 350, 10, 15, 20, 20);
        this.processBar.graphics.endFill();
        this.addChild(this.processBar);
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.textColor = 0xB3454B;
        this.textField.y = 380;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
    };
    __egretProto__.setProgress = function (current, total) {
        //显示进度
        var process = Math.ceil(current / total * 100);
        this.textField.text = process + "%";
        if (process > 10) {
            var processBarX = (this.stageW - this.loadingHead.width) / 2 - 30;
            this.processBar.graphics.beginFill(0xB3454B);
            this.processBar.graphics.drawRoundRect(processBarX, 350, 200 * process / 100, 15, 20, 20);
            this.processBar.graphics.endFill();
        }
    };
    __egretProto__.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return LoadingUI;
})(egret.Sprite);
LoadingUI.prototype.__class__ = "LoadingUI";
