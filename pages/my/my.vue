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
					<button v-if="!ifLogin" class="btn-login" type="default" @click="ifAllowClick && userOnFn()">授权登录</button>
					<text class="name" v-if="ifLogin">{{name}}</text>
				</view>
			</view>
			<view class="plate3">
				<view class="module" @click="ziyunFn">
					<view>
						<text class="i iconfont" :class="ziyun.icon[ziyun.state+1]" :style="{color:ziyun.color[ziyun.state+1]}"></text>
						<text>梓云认证</text>
						<text class="font-right iconfont icon-xiayibu"></text>
					</view>
					<text class="highlight" :style="{color:ziyun.color[ziyun.state+1]}">{{ziyun.msg[ziyun.state+1]}}</text>
				</view>
				<view class="module" @click="groupInfoFn">
					<view>
						<text class="i iconfont" :class="groupInfo.icon[groupInfo.state+1]" :style="{color:groupInfo.color[groupInfo.state+1]}"></text>
						<text>志愿团体</text>
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
				<button class="btn" open-type="share">
					<text class="font-left iconfont icon-fenxiang" style="color: #009f72;font-size: 20px;"></text>
					<text>分享小程序</text>
					<text class="font-right iconfont icon-xiayibu"></text>
				</button>
				<!-- <button class="btn" open-type="groupName" open-gid="">
					<text class="font-left iconfont icon-fenxiang" style="color: #009f72;font-size: 20px;"></text>
					<text>加入群聊（梓云志愿者微信总群）</text>
					<text class="font-right iconfont icon-xiayibu"></text>
				</button> -->
			</view>
			<view class="plate2" style="margin: 30px 0">
				<button class="btn" open-type="feedback">
					<text class="font-left iconfont icon-fankui" style="color: #b16ef1;font-size: 19px;"></text>
					<text>意见反馈</text>
					<text class="font-right iconfont icon-xiayibu"></text>
				</button>
				<button class="btn" open-type="contact">
					<text class="font-left iconfont icon-kefu" style="color: #ff623e;font-size: 20px;"></text>
					<text>联系客服</text>
					<text class="font-right iconfont icon-xiayibu"></text>
				</button>
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
				ifAllowClick: true
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
			userOnFn(){
				let that = this
				that.ifAllowClick = false
				uni.getUserProfile({
					desc: "获取头像、昵称、地区及性别",
					lang: "zh_CN",
					success(e){
						let userInfo = e.userInfo
						uni.login({
							provider: "weixin",
							success(e) {
								uni.request({
									url: that.$URL + '/login',
									method: "POST",
									data:{code: that.$utils.RsaEncryption(e.code)},
									success(res){
										that.ifAllowClick = true
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
											uni.$emit('home', {
												ifVer: data.ifVer
											})
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
									}
								})
							}
						})
					},
					fail(){that.ifAllowClick = true}
				})
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
								uni.$emit('home', {ifVer: false})
							}
						})
					}
				})
			},
			ziyunFn(){
				if (this.ziyun.state == -1) {
					let that = this
					return uni.showModal({
						title: "提示",
						content: "请先登录",
						confirmText: "去登录",
						confirmColor: "#fe3434",
						success(res){
							if(res.confirm) that.userOnFn()
						}
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
				if (this.ziyun.state == 0) {
					uni.showModal({
						title: "提示",
						content: "即将跳转到认证页",
						confirmColor: "#fe3434",
						success(res){
							if(res.confirm) uni.navigateTo({
								url: "../addUserInfo/addUserInfo"
							})
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
						content: "请先登录",
						confirmText: "去登录",
						confirmColor: "#fe3434",
						success(res){
							if(res.confirm) that.userOnFn()
						}
					})
				}
				let token
				let that = this
				try {
					token = uni.getStorageSync('token');
				} catch (e) {
					console.error(e)
				}
				if (this.groupInfo.state == 0) {
					console.log("团体未认证")
				}else {
					console.log("团体信息")
				}
			}
		},
		onShareAppMessage(e){
			return {
				title: "梓云志愿者微信小程序",
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
				.highlight{
					padding-top: 10px;
					font-size: 20px;
					font-weight: bolder;
				}
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
