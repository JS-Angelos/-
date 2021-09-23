<template>
	<view class="warp">
		<view class="top">
			<image class="img" :src="zyyUserInfo.cardCertPic" mode="aspectFill" lazy-load></image>
			<view class="right">
				<text class="txt">{{zyyUserInfo.volTrueName}}</text>
				<text class="txt light">志愿者编号：{{zyyUserInfo.volNumber}}</text>
			</view>
		</view>
		<view class="data">
			<view class="line">
				<text class="left">项目</text>
				<view class="right">
					<text class="num">{{zyyUserInfo.oppCounts}}</text>
					<text class="iconfont icon-xiayibu"></text>
				</view>
			</view>
			<view class="line">
				<text class="left">团体</text>
				<view class="right">
					<text class="num">{{zyyUserInfo.orgCounts}}</text>
					<text class="iconfont icon-xiayibu"></text>
				</view>
			</view>
			<view class="line">
				<text class="left">时长</text>
				<view class="right">
					<text class="num">{{zyyUserInfo.volHour}}</text>
					<text class="iconfont icon-xiayibu"></text>
				</view>
			</view>
		</view>
		<view class="data">
			<view class="line">
				<text class="left">用户名</text>
				<text class="right">{{zyyUserInfo.loginName}}</text>
			</view>
			<view class="line">
				<text class="left">性别</text>
				<text class="right">{{zyyUserInfo.volGender?'男':'女'}}</text>
			</view>
			<view class="line">
				<text class="left">服务类别</text>
				<text class="right">{{zyyUserInfo.volServiceTag}}</text>
			</view>
			<view class="line">
				<text class="left">注册地址</text>
				<text class="right">{{zyyUserInfo.regAddr}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				zyyUserInfo: {
					volTrueName: "null",
					volNumber: "0".repeat(15),
					cardCertPic: "../../static/img/logo.jpg",
					oppCounts: 0,
					orgCounts: 0,
					volHour: 0,
					loginName: "",
					volGender: 0,
					regAddr: "",
					volServiceTag: ""
				}
			};
		},
		created(){
			if(!this.$zyyUserInfo.volTrueName) this.init()
			else this.zyyUserInfo = this.$zyyUserInfo
		},
		methods:{
			init(){
				let token
				try {
					token = uni.getStorageSync('token');
				} catch (e) {
					console.error(e)
				}
				if (!token) return uni.navigateBack()
				let that = this
				uni.request({
					method: "POST",
					url: that.$URL + "/info/zzyUserInfo",
					data:{
						token: that.$utils.RsaEncryption(token)
					},
					success(res){
						if(res.statusCode !== 200) return uni.showModal({
							title: "提示",
							content: "抱歉，服务器崩溃了o(╥﹏╥)o",
							showCancel: false,
						})
						let data = res.data
						if(data.code !== 0) return uni.showModal({
							title: "提示",
							content: "出错了：" + data.msg,
							showCancel: false,
						})
						that.__proto__.__proto__.$zyyUserInfo = that.zyyUserInfo = JSON.parse(that.$utils.AESDecode(data.data))
						console.log(that.zyyUserInfo)
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.warp{
		padding-top: 13px;
		width: 100%;
		min-height: 100vh;
		background-color: #efeff0;
		box-sizing: border-box;
		.top{
			display: flex;
			align-items: center;
			padding: 10px 20px;
			background-color: #FFFFFF;
			.img{
				width: 80px;
				height: 80px;
				margin-right: 15px;
				border-radius: 10px;
			}
			.right{
				display: flex;
				flex-direction: column;
				.light{
					margin-top: 10px;
					font-size: 12px;
					color: #aaa;
				}
			}
		}
		.data{
			width: 100%;
			background-color: #fff;
			margin-top: 10px;
			&+.data{
				margin-top: 8px;
			}
			.line{
				padding: 15px 20px;
				border-bottom: 1px solid #ebebeb;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.left{
					min-width: 100px;
					color: #646464;
				}
				.right{
					font-size: 12px;
					display: flex;
					align-items: center;
					.num{
						font-size: 14px;
						font-weight: bolder;
					}
					.iconfont{
						margin-right: -10px;
						font-size: 14px;
						color: #999999;
					}
				}
				
			}
		}
	}
</style>
