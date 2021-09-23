<template>
	<view class="my-wrap">
		<view class="status-bar" :style="{height: statusbarH+'px'}"></view>
		<view class="top-bg"></view>
		<view class="my">
			<view class="plate1">
				<view class="portrait">
					<image class="img" :src="imgSrc" mode="aspectFill"></image>
				</view>
				<view class="info">
					<button v-if="!ifLogin" class="btn-login" open-type="getUserInfo" type="default" @getuserinfo="userOnFn">授权登录</button>
					<text class="name" v-if="ifLogin">{{name}}</text>
				</view>
			</view>
			<view class="plate3">
				<view class="module" @click="ziyunFn">
					<view>
						<text class="i iconfont" :class="ziyun.icon[ziyun.state+1]" :style="{color:ziyun.color[ziyun.state+1]}"></text>
						<text class="text">梓云认证</text>
						<text class="font-right iconfont icon-xiayibu"></text>
					</view>
					<text class="highlight" :style="{color:ziyun.color[ziyun.state+1]}">{{ziyun.msg[ziyun.state+1]}}</text>
				</view>
				<view class="module" @click="groupInfoFn">
					<view>
						<text class="i iconfont" :class="groupInfo.icon[groupInfo.state+1]" :style="{color:groupInfo.color[groupInfo.state+1]}"></text>
						<text class="text">志愿团体</text>
						<text class="font-right iconfont icon-xiayibu"></text>
					</view>
					<text class="highlight" :style="{color:groupInfo.color[groupInfo.state+1]}">{{groupInfo.msg[groupInfo.state+1]}}</text>
				</view>
			</view>
			<view class="plate2">
				<button id="pla1" class="btn">
					<text class="font-left iconfont icon-renzheng" style="color: #2680f0;"></text>
					<text>我的认证信息</text>
					<text class="font-right iconfont icon-xiayibu"></text>
				</button>
				<button id="pla2" class="btn">
					<text class="font-left iconfont icon-renwu" style="color: #ffd741;font-size: 22px;"></text>
					<text>我的活动</text>
					<text class="font-right iconfont icon-xiayibu"></text>
				</button>
			</view>
			<view class="plate2" style="margin: 30px 0">
				<button class="btn" open-type="share" :share-mode="['qq','qzone']">
					<text class="font-left iconfont icon-fenxiang" style="color: #009f72;font-size: 20px;"></text>
					<text>分享小程序</text>
					<text class="font-right iconfont icon-xiayibu"></text>
				</button>
				<button class="btn" open-type="feedback">
					<text class="font-left iconfont icon-fankui" style="color: #b16ef1;font-size: 19px;"></text>
					<text>意见反馈</text>
					<text class="font-right iconfont icon-xiayibu"></text>
				</button>
				<button class="btn" open-type="openGroupProfile" group-id="527219731">
					<text class="font-left iconfont icon-qunliao" style="color: #ff623e;font-size: 20px;"></text>
					<text>加入群聊</text>
					<text class="font-right iconfont icon-xiayibu"></text>
				</button>
			</view>
		</view>
		<view class="shade-showWindow" v-if="win">
			<view class="showWindow">
				<text class="text">输入{{winType?'志愿者密钥':'梓云ID'}}进行绑定</text>
				<input v-if="!winType" :class="['inp',{foc},{err:err == 0},{err1:err == 1}]" type="number" v-model="id" maxlength="18" @focus="focusFn" @blur="blurFn" />
				<input v-else :class="['inp',{foc},{err:err == 0}]" type="text" v-model="upass" @focus="focusFn" @blur="blurFn" />
				<text class="errtxt">{{errMsg}}</text>
				<view class="w-btn">
					<button class="button" @click="win = false">取消</button>
					<button type="default" @click="bindFn" class="button on">绑定</button>
				</view>
			</view>
		</view>
		<button class="logout" @click="logoutFn" :disabled="!ifLogin" >退出登录</button>
		<view class="versions">
			<text>梓云志愿者 {{versions}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusbarH: 20,
				versions: "v1.0.0",
				name: "未登录",
				ifLogin: false,
				imgSrc: "../../static/img/notLogin.png",
				groupInfo:{
					state: -1, //-1 未登录，0 未加入，1已加入
					msg: ["未登录","未加入","已加入"],
					color: ["#ff8f1f","#fe3434","#3bb36c"],
					icon: ["icon-tishi","icon-xiaoxi-shibai","icon-xiaoxi-chenggong"]
				},
				ziyun:{
					state: -1, //-1 未登录，0 未认证，1已认证
					msg: ["未登录","未加入","已加入"],
					color: ["#ff8f1f","#fe3434","#3bb36c"],
					icon: ["icon-tishi","icon-xiaoxi-shibai","icon-xiaoxi-chenggong"]
				},
				ifAllowClick: true,
				idCard: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
				win: false,
				winType: 0,
				id: null,
				upass: null,
				foc: false,
				err: -1,
				errMsg: ""
			};
		},
		onLoad(){
		    // 监听事件
		    uni.$on('my',(option)=>{
				let info = null
				try {
					info = uni.getStorageSync('userInfo');
				}catch (e){
					console.error(e)
				}
				if(info) this.userInfoExist(JSON.parse(info))
				this.ziyun.state = option.ifVer ? 1 : 0
				this.groupInfo.state = option.ifVol ? 1 : 0
		    })
		},  
		onUnload() {
		    // 移除监听事件  
			uni.$off('my');
		},
		created(){
			this.statusbarH = wx.getSystemInfoSync().statusBarHeight
			const accountInfo = wx.getAccountInfoSync();
			if(accountInfo.envVersion == "release") this.versions = accountInfo.version
			this.init()
		},
		methods:{
			userInfoExist(info){
				this.name = info.nickName
				this.imgSrc = info.avatarUrl
				this.ifLogin = true
			},
			alterStateFn(){
				this.ziyun.state = this.$exa.ifVer ? 1 : 0
				this.groupInfo.state = this.$exa.ifVol ? 1 : 0
			},
			init(){
				let info,token
				try {
				    token = uni.getStorageSync('token');
					info = uni.getStorageSync('userInfo');
				}catch (e){
					console.error(e)
				}
				if (info){
					let that = this
					info = JSON.parse(info)
					this.userInfoExist(info)
					if(!token){
						return uni.showModal({
							title: "提示",
							content: "登录过期，请重新登录！",
							showCancel: false,
							success(){
								uni.removeStorage({key:'userInfo'});
								that.name = "未登录"
								that.imgSrc = "../../static/img/notLogin.png"
								that.ifLogin = false
							}
						})
					}
					if (token && !this.$exa.ifVerifyToken) return this.$verifyToken.call(this,token).then(d => this.alterStateFn())
					this.alterStateFn()
				}
			},
			userOnFn: async function(e) {
				if (!this.ifAllowClick) return
				let that = this
				that.ifAllowClick = false
				let userInfo = e.detail.userInfo
				userInfo.date = Date.now() / 1000
				uni.setStorage({
					key: "userInfo",
					data: JSON.stringify(userInfo)
				})
				await uni.showLoading({
					title: "正在登录……",
					mask: true,
					success(){
						uni.login({
							provider: "weixin",
							success(e) {
								uni.request({
									url: that.$URL + '/login',
									method: "POST",
									data:{code: that.$utils.RsaEncryption(e.code)},
									success(res){
										that.ifAllowClick = true
										uni.hideLoading()
										if(res.statusCode !== 200){
											return uni.showModal({
												title: "提示",
												content: "抱歉，服务器崩溃了o(╥﹏╥)o",
												showCancel: false,
											})
										}else{
											let data = res.data
											if(data.code !== 0){
												return uni.showModal({
													title: "提示",
													content: data.msg,
													showCancel: false,
												})
											}
											uni.$emit('home', true)
											if(!data.ifVer) that.ziyun.state = 0
											else that.ziyun.state = 1
											if(!data.ifVol) that.groupInfo.state = 0
											else that.groupInfo.state = 1
											that.$exa.ifVer = data.ifVer
											that.$exa.ifVol = data.ifVol
											that.name = userInfo.nickName
											that.imgSrc = userInfo.avatarUrl
											that.ifLogin = true
											userInfo.date = Date.now() / 1000
											uni.setStorage({
												key: "userInfo",
												data: JSON.stringify(userInfo)
											})
											uni.setStorage({
												key: "token",
												data: that.$utils.AESDecode(data.data.token)
											})
										}
									},
									fail() {
										uni.hideLoading()
										that.ifAllowClick = true
										uni.showToast({
											icon: "error",
											title: "抱歉~ 出错了!"
										})
									}
								})
							},
							fail() {
								uni.hideLoading()
								that.ifAllowClick = true
								uni.showToast({
									icon: "error",
									title: "code获取失败"
								})
							}
						})
					}
				})
				// uni.getUserProfile({
				// 	desc: "获取头像、昵称、地区及性别",
				// 	lang: "zh_CN",
				// 	success(e){
				// 		},
				// 	fail(){that.ifAllowClick = true}
				// })
			},
			logoutFn(){
				let that = this
				uni.showModal({
					title: "提示",
					content: "确认退出",
					success(res){
						if(res.confirm) uni.removeStorage({
							key: "userInfo",
							success(){
								uni.removeStorage({key: "token"})
								that.name = "未登录"
								that.ifLogin = false
								that.imgSrc = "../../static/img/notLogin.png"
								that.groupInfo.state = -1
								that.ziyun.state = -1
								that.$exa = {
									ifVerifyToken: false,
									ifVer: false,
									ifVol: false
								}
								uni.showToast({
									icon: "success",
									title: "退出成功"
								})
								uni.$emit('home', false)
							}
						})
					}
				})
			},
			groupFn(token){
				if(!token) return
				let that = this
				uni.request({
					method: "POST",
					url: that.$URL + "/zyy/join",
					data: {
						token: that.$utils.RsaEncryption(token)
					},
					success(res){
						if (res.statusCode != 200) return uni.showToast({
							title: "请检查网络！",
							icon: "error"
						})
						if (res.data.code != 0) return uni.showModal({
							title: "ERROR",
							content: res.data.msg,
							showCancel: false,
						})
						uni.showToast({
							title: "加入成功",
							icon: "success"
						})
						that.groupInfo.state = 1
						that.$exa.ifVol = true
						if (that.$ziyunUserInfo) that.$ziyunUserInfo.ifGroup = true
					},
					fail(e){
						console.error(e)
						uni.showModal({
							title: "ERROR",
							content: "请求发送失败，小程序出错啦~",
							showCancel: false,
						})
					}
				})
			},
			ziyunFn(){
				if (this.ziyun.state == -1) {
					let that = this
					return uni.showModal({
						title: "提示",
						content: "授权登录后才可使用！",
						confirmColor: "#fe3434",
						showCancel: false,
					})
				}
				let token
				let that = this
				try {
					token = uni.getStorageSync('token');
				} catch (e) {
					console.error(e)
				}
				if (!token) return this.ziyun.state = -1
				if (!token) return this.groupInfo.state = -1
				if (this.ziyun.state == 0) {
					uni.showModal({
						title: "提示",
						content: "即将开始认证",
						confirmColor: "#fe3434",
						success(res){
							if (res.confirm) {
								that.winType = 0
								that.win = true
							}
						}
					})
				}else {
					uni.navigateTo({
						url: "../userinfoZiyun/userinfoZiyun"
					})
				}
			},
			groupInfoFn(){
				if (this.groupInfo.state == -1) {
					let that = this
					return uni.showModal({
						title: "提示",
						content: "授权登录后才可使用！",
						confirmColor: "#fe3434",
						showCancel: false,
					})
				}
				let token
				try {
					token = uni.getStorageSync('token');
				} catch (e) {
					console.error(e)
				}
				if (!token) return this.ziyun.state = -1
				if (!token) return this.groupInfo.state = -1
				let that = this
				if (this.groupInfo.state == 0) {
					uni.request({
						method: "POST",
						url: this.$URL + "/verify/ifGroup",
						data: {
							token: that.$utils.RsaEncryption(token)
						},
						success(res){
							if (res.statusCode != 200) return uni.showToast({
								title: "请检查网络！",
								icon: "error"
							})
							if (res.data.code == 1) return uni.showModal({
								title: "提示",
								content: "未进行梓云认证，请先前往认证！"
							})
							if (res.data.code != 0) return uni.showModal({
								title: "ERROR",
								content: res.data.msg,
								showCancel: false,
							})
							if (!res.data.ifVolunteer){
								uni.showModal({
									title: "提示",
									content: "即将开始团体认证",
									confirmColor: "#fe3434",
									success(res){
										if (res.confirm) {
											that.winType = 1
											that.win = true
										}
									}
								})
							}else {
								uni.showModal({
									title: "加入团体",
									content: "点击确定为您自动加入梓云志愿者团体！",
									confirmColor: "#fe3434",
									success(res){
										if (res.confirm) that.groupFn(token)
									}
								})
							}
						},
						fail(e){
							uni.showModal({
								title: "ERROR",
								content: "请求发送失败，小程序出错啦~",
								showCancel: false,
							})
						}
					})
				}else {
					uni.navigateTo({
						url: "../volunteer/volunteer"
					})
				}
			},
			focusFn(){
				this.err = -1
				this.foc = true
			},
			blurFn(){
				this.foc = false
				if (this.winType) {
					if (!this.upass) return this.err = 0
				}else{
					if (!this.id) return this.err = 0
					if (!this.idCard.test(this.id)) return this.err = 1
				}
			},
			bindFn(){
				this.blurFn()
				let token
				try {
					token = uni.getStorageSync('token');
				} catch (e) {
					console.error(e)
				}
				if (!token) return that.errMsg = "token 获取失败"
				if (this.err != -1) return
				let that = this
				if (this.winType){
					uni.request({
						url: that.$URL + "/zzy/user",
						method: "POST",
						data: {
							encryption: that.$utils.RsaEncryption(JSON.stringify({
								token,
								upass: that.upass
							}))
						},
						success(res){
							if(res.statusCode != 200) return that.errMsg = "绑定失败，请检查网络！"
							if(res.data.code == -1) return that.errMsg = "您还未进行梓云认证，无法绑定！"
							if(res.data.code != 0) return that.errMsg = res.data.msg
							uni.showToast({
								title: "账号绑定成功",
								icon: "success"
							})
							let ifGroup = res.data.ifGroup
							if (!ifGroup){
								uni.showModal({
									title: "提示",
									content: "检测到您还未加入梓云志愿者团体，将无法为你录入志愿时长，点击确定为您自动加入！",
									confirmColor: "#fe3434",
									success(res){
										if (res.confirm) that.groupFn(token)
									}
								})
							}
							that.groupInfo.state = ifGroup ? 1 : 0
							that.$exa.ifVer = true
							that.$exa.ifVol = ifGroup
							that.win = false
						},
						fail(e){
							console.error(e)
							uni.showModal({
								title: "ERROR",
								content: "请求发送失败，小程序出错啦~",
								showCancel: false,
							})
						}
					})
				}else uni.request({
					url: that.$URL + "/login/bindIdCord",
					method: "POST",
					data: {
						encryption: that.$utils.RsaEncryption(JSON.stringify({
							token,
							idCard: that.id
						}))
					},
					success(res){
						if(res.statusCode != 200) return that.errMsg = "认证失败，请检查网络！"
						if(res.data.code == -2) return that.errMsg = "您还未注册梓云ID，请联系管理员进行注册。"
						if(res.data.code != 0) return that.errMsg = res.data.msg
						uni.showToast({
							title: "认证成功",
							icon: "success"
						})
						that.ziyun.state = 1
						that.$exa.ifVer = true
						that.$exa.ifVol = res.data.ifVol
						uni.$emit('home', true)
						that.win = false
					},
					fail(e){
						console.error(e)
						uni.showModal({
							title: "ERROR",
							content: "请求发送失败，小程序出错啦~",
							showCancel: false,
						})
					}
				})
			},
		},
		onShareAppMessage(e){
			return {
				title: "梓云志愿者小程序",
				path: "pages/index/index",
				imageUrl: "../../static/img/志愿者.jpg"
			}
		}
	}
</script>

<style lang="less">
	.status-bar{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		background-color: #1c2c60;
		z-index: 999;
	}
	.top-bg{
		width: 100%;
		height: 250px;
		background-color: #1c2c60;
	}
	.my{
		.plate1{
			width: 100%;
			border-radius: 30px 30px 0 0;
			background-color: #fff;
			margin-top: -25px;
			.portrait{
				width: 150px;
				height: 150px;
				box-shadow: 0 1px 3px #F1F1F1;
				overflow: hidden;
				border-radius: 50%;
				margin: 0 auto;
				transform: translateY(-75px);
				background-color: #fff;
				.img{
					width: 100%;
					height: 100%;
				}
			}
			.info{
				display: flex;
				flex-direction: column;
				padding: 0 0 25px;
				margin-top: -60px;
				font-size: 35px;
				font-weight: bolder;
				text-align: center;
			}
			.btn-login{
				border-radius: 20px;
				width: 150px;
				color: #fff;
				outline: none;
				background-color: #07c160;
				transition: background-color .2s;
				&:active{
					background-color: #00a259;
				}
			}
		}
		.plate2{
			margin-top: 20px;
			.btn{
				position: relative;
				display: flex;
				align-items: center;
				width: 90%;
				margin: 10px auto;
				border-radius: 10px;
				padding: 10px 20px;
				background: #fff;
				font-size: 16px;
				box-shadow: 0 0 3px #C8C7CC;
				box-sizing: border-box;
				transition: all .2s;
				color: #555555;
				line-height: 30px;
				&::after{
					border: none;
				}
				&:active{
					background-color: #fcfcfc;
					box-shadow: 0 0 3px #fcfcfc;
				}
				.font-right{
					font-size: 19px;
					position: absolute;
					top: 50%;
					right: 25px;
					transform: translateY(-50%);
				}
				.font-left{
					display: block;
					width: 26px;
					height: 100%;
					margin-right: 8px;
					font-size: 18px;
				}
			}
		}
		.plate3{
			width: 90%;
			margin: -2px auto 0;
			display: flex;
			justify-content: space-around;
			.module{
				border-radius: 10px;
				width: 150px;
				height: 100px;
				display: flex;
				flex-direction: column;
				text-align: center;
				justify-content: center;
				box-shadow: 0 0 3px #C8C7CC;
				.i{
					margin-right: 2px;
				}
				.text{
					font-size: 16px;
					font-weight: bolder;
				}
				.highlight{
					padding-top: 10px;
					font-size: 20px;
					font-weight: bolder;
				}
			}
		}
	}
	
	@keyframes animation {
		0%{transform: scale(.5);}
		100%{transform: scale(1);}
	}
	.shade-showWindow{
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 2;
		.showWindow{
			border-radius: 10px;
			padding: 15px 10px;
			width: 80%;
			text-align: center;
			background-color: #fff;
			animation: animation .3s ease-out forwards;
			.text{
				font-size: 20px;
				font-weight: 600;
				color: #484848;
			}
			.inp{
				width: 80%;
				margin: 15px auto 5px;
				border-radius: 4px;
				border: 1px solid #ccc;
				padding: 5px 15px;
				transition: all .2s;
				text-align: left;
				&.foc {
					border-color: rgba(82, 168, 236, .8);
					box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%), 0 0 8px rgb(82 168 236 / 60%);
				}
				&.err {
					position: relative;
					border-color: #b94a48;
					box-shadow: none;
				
					&::after {
						content: "必填";
						position: absolute;
						right: 10px;
						top: 6px;
						padding-left: 10px;
						background: inherit;
						color: #C00;
						font-size: 12px;
						z-index: 1;
						font-weight: bolder;
					}
				}
				&.err1 {
					position: relative;
					border-color: #b94a48;
					box-shadow: none;
				
					&::after {
						content: "格式错误";
						position: absolute;
						right: 10px;
						top: 6px;
						padding-left: 10px;
						background: inherit;
						color: #C00;
						font-size: 12px;
						z-index: 1;
						font-weight: bolder;
					}
				}
			}
			.w-btn{
				margin-top: 10px;
				display: flex;
				justify-content: space-between;
				.button{
					padding: 5px 20px;
					font-size: 16px;
					line-height: 30px;
					background-color: #fff;
					transition: all .2s;
					border: 1px solid #bebebe;
					&::after{
						border: none;
					}
					&:active{
						color: #ff007f;
						border-color: #ff007f;
					}
					&.on{
						color: #fff;
						border-color: #0793fe;
						background-color: #0793fe;
						&:active{
							background-color: #25abfe;
						}
					}
				}
			}
			.errtxt{
				width: 100%;
				font-size: 11px;
				color: #d90000;
			}
		}
	}
	
	.logout{
		margin: 20px auto;
		width: 220px;
		border-radius: 10px;
		line-height: 45px;
		color: #fff;
		background-color: #dd6572;
		transition: background-color .2s;
		&::after{
			border: none;
		}
		&:active{
			background-color: #c35866;
		}
	}
	.versions{
		text-align: center;
		padding-bottom: 30px;
		font-size: 12px;
		font-weight: 400;
		color: #C0C0C0;
	}
</style>
