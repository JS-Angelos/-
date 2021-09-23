<template>
	<view class="content">
		<swiper class="slideshow" :circular="true" :autoplay="true" :interval="3000" :duration="1000"
			:disable-touch="true">
			<swiper-item v-for="item in carousel" :key="item">
				<view class="item-swiper">
					<image class="item-image" :src="url + item" mode="aspectFill" lazy-load></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="shell-logo">
			<image class="logo" src="/static/img/logo.png" mode="aspectFill" lazy-load></image>
			<view class="text">
				<text class="title">{{title}}</text>
				<text class="en-title">{{enTitle}}</text>
			</view>
		</view>
		<view class="introduce section">
			<text class="h1">协会简介：</text>
			<text class="introduce-content">{{introduce}}</text>
		</view>
		<view class="information section">
			<text class="h1">联系我们：</text>
			<view class="contact">
				<view class="">
					<view class="pub">
						<text class="iconfont icon-qq" style="color: #249be0;"></text>：
						<text class="pub-text" :user-select="true">{{QQ}}</text>
					</view>
					<view class="pub">
						<text class="iconfont icon-wechat" style="color: #1ed76d;"></text>：
						<text class="pub-text">{{wechat}}</text>
					</view>
					<view class="pub">
						<text class="iconfont icon-microblog" style="color: #f0261f;"></text>：
						<text class="pub-text" style="color: #3870a9;" :user-select="true">{{weibo}}</text>
					</view>
					<view class="pub">
						<text class="iconfont icon-send-sms-full" style="color: #249be0;"></text>：
						<text class="pub-text" style="color: #5fa207;" :user-select="true">{{email}}</text>
					</view>
					<!-- <view class="pub">
						<text class="iconfont icon-douyin" style="color: #050305;"></text>：
						<text class="pub-text"></text>
					</view> -->
				</view>
			</view>
		</view>
		<!-- ifAllowClick && -->
		<view class="shell-btn">
			<button class="btn" v-if="!ifLogin" open-type="getUserInfo" @getuserinfo="joinUsFn">快来加入我们吧~</button>
			<view class="beHome" v-else>
				<text>欢迎回家</text>
				<text class="iconfont icon-huanying"></text>
			</view>
		</view>
		<view class="shade-showWindow" v-if="win">
			<view class="showWindow">
				<text class="text">输入梓云ID进行绑定</text>
				<input :class="['inp',{foc},{err:err == 0},{err1:err == 1}]" type="number" v-model="id" maxlength="18" @focus="focusFn" @blur="blurFn" />
				<text class="errtxt">{{errMsg}}</text>
				<view class="w-btn">
					<button class="button" @click="win = false">取消</button>
					<button type="default" @click="bindFn" class="button on">绑定</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: this.$domain,
				title: '梓云志愿者协会',
				enTitle: 'ZiYun Volunteers Association',
				QQ: "1693256432",
				wechat: "qq1693256432",
				weibo: "@梓云志愿者",
				email: "1693256432@qq.com",
				introduce: "这是很长一段简介",
				carousel: [],
				officialAccount: false,
				ifLogin: false,
				ifAllowClick: true,
				idCard: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
				win: false,
				id: null,
				foc: false,
				err: -1,
				errMsg: ""
			}
		},
		components:{},
		onPullDownRefresh() {
			uni.stopPullDownRefresh() // 结束刷新
		},
		onLoad(){
		    // 监听事件
		    uni.$on('home',(ifLogin)=>{
		        this.ifLogin = ifLogin
		    })
		},
		onUnload() {  
		    // 移除监听事件  
			uni.$off('home');  
		},
		created(){
			this.init()
		},
		methods: {
			closeOfficialAccount() {
				this.officialAccount = true
			},
			connectSuccess(e) {
				if (e.detail.status !== 0) this.officialAccount = true
			},
			joinUsFn(e) {
				if (!this.ifAllowClick) return
				let that = this
				that.ifAllowClick = false
				let userInfo = e.detail.userInfo
				userInfo.date = Date.now() / 1000
				uni.setStorage({
					key: "userInfo",
					data: JSON.stringify(userInfo)
				})
				uni.showLoading({
					title: "正在登录……",
					mask: true,
					success(){
						uni.login({
							provider: "weixin",
							success(e) {
								let code = e.code
								uni.request({
									url: that.$URL + '/login',
									method: "POST",
									data: {
										code: that.$utils.RsaEncryption(code)
									},
									success(res) {
										if (res.statusCode !== 200) {
											uni.showModal({
												title: "提示",
												content: "登录失败，接口错误。",
												showCancel: false
											})
										} else {
											if (res.data.code == 0) {
												let data = res.data
												uni.setStorage({
													key: "token",
													data: that.$utils.AESDecode(data.data.token),
													fail() {
														console.error("token 存储失败")
													}
												})
												uni.showToast({
													title: "登录成功",
													icon: "success"
												})
												that.ifLogin = true
												that.$exa.ifVerifyToken = true
												that.$exa.ifVer = data.ifVer
												that.$exa.ifVol = data.ifVol
												uni.$emit('my', {
													ifVer: data.ifVer,
													ifVol: data.ifVol
												})
												if (!data.ifVer){
													uni.showModal({
														title: "提示",
														content: "请绑定梓云账号",
														confirmText: "绑定",
														success(res){
															if (res.confirm) that.win = true
														}
													})
												}
											} else if (res.data.code == 4) {
												uni.showModal({
													title: "提示",
													content: res.data.msg,
													showCancel: false
												})
											} else {
												uni.showModal({
													title: "提示",
													content: "登录失败，参数错误。",
													showCancel: false
												})
											}
										}
										uni.hideLoading()
										that.ifAllowClick = true
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
				// uni.getUserInfo({
				// 	lang: "zh_CN",
				// 	success(e) {
				// 		},
				// 	fail(e) {
				// 		that.ifAllowClick = true
				// 	}
				// })
			},
			init() {
				let that = this
				let token
				try {
					token = uni.getStorageSync('token');
				} catch (e) {
					console.error(e)
				}
				uni.request({
					url: that.$URL + "/info/home",
					method: "GET",
					success(res){
						if(res.statusCode !== 200){
							return uni.showModal({
								title: "提示",
								content: "抱歉，服务器崩溃了o(╥﹏╥)o",
								showCancel: false,
							})
						}else{
							if(res.data.code !== 0) {
								return uni.showModal({
									title: "提示",
									content: "抱歉，服务器出错了o(╥﹏╥)o",
									showCancel: false,
								})
							}
							let data = res.data.data
							that.title = data.name
							that.enTitle = data.enName
							that.QQ = data.QQ
							that.wechat = data.wechat
							that.weibo = data.weibo
							that.email = data.email
							that.introduce = data.introduce
							that.carousel = data.carousel
						}
					}
				})
				if (token && !this.$exa.ifVerifyToken) this.$verifyToken.call(this,token).then(d => d.code || (this.ifLogin = true))
			},
			focusFn(){
				this.err = -1
				this.foc = true
			},
			blurFn(){
				this.foc = false
				if (!this.id) return this.err = 0
				if (!this.idCard.test(this.id)) return this.err = 1
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
				let that = this
				if (this.err != -1) return
				uni.request({
					url: that.$URL + "/login/bindIdCord",
					method: "POST",
					data: {
						encryption: that.$utils.RsaEncryption(JSON.stringify({
							token,
							idCard: that.id
						}))
					},
					success(res){
						if(res.statusCode != 200) return that.errMsg = "绑定失败，请检查网络！"
						if(res.data.code == -2) return that.errMsg = "您还未注册梓云ID，请联系管理员进行注册。"
						if(res.data.code != 0) return that.errMsg = res.data.msg
						uni.showToast({
							title: "绑定成功",
							icon: "success"
						})
						that.$exa.ifVer = true
						that.$exa.ifVol = res.data.ifVol
						uni.$emit('my', {
							ifVer: true,
							ifVol: res.data.ifVol
						})
						that.win = false
						setTimeout(()=>{
							uni.switchTab({
								url: "/pages/my/my"
							})
						},2000)
					}
				})
			},
		}
	}
</script>

<style lang="less">
	.content {
		.slideshow {
			width: 100%;

			.item-swiper {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;

				.item-image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.shell-logo {
			width: 100%;
			padding: 20rpx 0;
			display: flex;
			justify-content: center;

			.logo {
				width: 181rpx;
				height: 180rpx;
			}

			.text {
				padding-left: 20rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				text-align: center;

				.title {
					font-size: 60rpx;
					font-weight: bolder;
					color: #192b5e;
				}

				.en-title {
					font-size: 30rpx;
					color: #999999;
				}
			}
		}

		.section {
			width: 95%;
			margin: 30rpx auto;
			padding: 50rpx 40rpx;
			box-shadow: 0px 0px 8px 5px #f2f2f2;
			border-radius: 30px;
			background-color: #fff;
			box-sizing: border-box;

			.h1 {
				display: block;
				font-size: 40rpx;
				font-weight: 600;
				color: #000;
			}

			.introduce-content {
				display: block;
				padding: 18rpx 30rpx 10px;
				font-size: 30rpx;
				font-weight: 500;
				color: #000;
				background-color: #fff;
			}

			.contact {
				padding: 30rpx 0 15rpx;
				display: flex;
				flex-direction: column;
				align-items: center;

				.pub {
					display: flex;
					align-items: center;

					&+.pub {
						margin-top: 40rpx;
					}

					.iconfont {
						color: #1b2c5e;
						font-size: 55rpx;
					}

					.pub-text {
						font-size: 32rpx;
						font-weight: bold;
					}
				}
			}
		}

		.shell-btn{
			padding: 10px 0 30px;
			.btn {
				margin: 0 auto;
				border: 1px solid #182c5f;
				border-radius: 30px;
				width: 400rpx;
				height: 80rpx;
				background-color: #fff;
				text-align: center;
				line-height: 80rpx;
				transition: all .3s;
			
				&:active {
					color: #fff;
					background-color: #182c5f;
				}
			}
			.beHome {
				margin: 0 auto;
				border: 1px solid #fcfcfc;
				border-radius: 30px;
				width: 400rpx;
				height: 80rpx;
				color: #ff7f00;
				background-color: #f8f8f8;
				text-align: center;
				line-height: 80rpx;
				font-weight: bolder;
				display: flex;
				align-items: center;
				justify-content: center;
			
				.iconfont {
					margin-left: 10px;
					font-size: 18px;
				}
			}
		}

		.official {
			position: relative;
			margin: 60rpx auto 30rpx;
			width: 90%;
			height: 84px;
			box-shadow: 3px 3px 6px 3px #f2f2f2;

			.close {
				position: absolute;
				top: 15rpx;
				right: 15rpx;
				border-radius: 50%;
				font-size: 30rpx;
				font-weight: bolder;
				color: #7f7f7f;
				transition: all .3s;

				&:active {
					color: #f0261f;
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
	}
</style>
