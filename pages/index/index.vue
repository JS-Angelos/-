<template>
	<view class="content">
		<swiper class="slideshow" :circular="true" :autoplay="true" :interval="3000" :duration="1000"
			:disable-touch="true">
			<swiper-item v-for="item in carousel" :key="item">
				<view class="item-swiper">
					<image class="item-image" :src="item" mode="aspectFill" lazy-load></image>
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
		<button class="btn" v-if="!ifVer" @click="ifAllowClick && joinUsFn()">快来加入我们吧~</button>
		<view class="beHome" v-if="ifVer">
			<text>欢迎回家</text>
			<text class="iconfont icon-huanying"></text>
		</view>
		<view class="official" v-if="!officialAccount">
			<official-account @load="connectSuccess" @error="connectSuccess"></official-account>
			<text @click="closeOfficialAccount" class="close iconfont icon-close"></text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '梓云志愿者协会',
				enTitle: 'ZiYun Volunteers Association',
				QQ: "1693256432",
				wechat: "qq1693256432",
				weibo: "@梓云志愿者",
				email: "1693256432@qq.com",
				introduce: "这是很长一段简介",
				carousel: [],
				officialAccount: false,
				ifVer: false,
				ifAllowClick: true
			}
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh() // 结束刷新
		},
		onLoad(){
		    // 监听事件
		    uni.$on('home',(option)=>{
		        this.ifVer = option.ifVer
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
				let that = this
				that.ifAllowClick = false
				let info
				try {
					info = uni.getStorageSync('userInfo');
				}catch (e){
					console.error(e)
				}
				if(info){
					info = JSON.parse(info)
					if(info.date && (Date.now() / 1000 - info.date < 3*24*3600) ) {
						that.ifAllowClick = true
						return uni.navigateTo({
							url: "../addUserInfo/addUserInfo"
						})
					}
				}
				uni.getUserProfile({
					desc: "获取头像、昵称、地区及性别",
					lang: "zh_CN",
					success(e) {
						let userInfo = e.userInfo
						userInfo.date = Date.now() / 1000
						uni.setStorage({
							key: "userInfo",
							data: JSON.stringify(userInfo)
						})
						uni.navigateTo({
							url: "../addUserInfo/addUserInfo"
						})
						that.ifAllowClick = true
					},
					fail(e) {
						that.ifAllowClick = true
					}
				})
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
				if (token && !this.$exa.ifVerifyToken) this.$verifyToken.call(this,token).then(d => this.ifVer = this.$exa.ifVer)
			},
			fn() {
				const pubkey =
					"-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCbJ2QYNdiFlzE0mcyq7tcZc5dPvof6696l2cJJM8kOxeXT8EonfvLzfsEGmwjNp3gvAyF14LvqT6w7oH40sFFnX358Eb+HZXx6CZ4LOkaTW0KNS6yodsRv0uwJhFMwREqEVbqd6jcCxTGKDOieendC8x1fsg3Muagyfawc+o+tewIDAQAB-----END PUBLIC KEY-----"
				let upass = this.$utils.RsaEncryption("CWLmx8023", pubkey)
				let uname = this.$utils.RsaEncryption("522123200004233013")
				uni.request({
					url: "https://28248b043t.oicp.vip/home",
					method: "POST",
					data: {
						uname,
						upass
					},
					success(res) {
						console.log(res.data)
					}
				})
			}
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
				padding: 10rpx 20rpx;
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

		.btn {
			margin: 30rpx auto;
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
			margin: 30rpx auto;
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
	}
</style>
