<template>
	<view class="warp">
		<view class="title">个人信息展示</view>
		<view class="ps-shell">
			<text class="ps">注意事项：</text>
			<text class="ps">保证所有信息安全，不会外泄。</text>
			<text class="ps">此处页面仅在您授权登录后才可进入显示信息，非登录状态不可访问。</text>
			<text class="ps">此处展示数据为您在梓云登记的信息。</text>
			<text class="ps">信息仅用于协会人员管理与参与活动后志愿时长的记录，不做其他用途。</text>
			<text class="ps">为保障您个人隐私，此处默认对您的私密信息进行脱敏处理。</text>
			<text class="ps">数据在后台保存，及传输过程中均为加密状态。</text>
			<text class="ps">如果信息填写有误，不能自行修改的数据请联系管理员进行修改。</text>
			<text class="ps">可修改数据：个人邮箱、工作单位/就读学校、隶属部门。</text>
		</view>
		<view class="data-shell">
			<view class="data CMod">
				<view class="line">
					<text class="left">姓名</text>
					<text class="right">{{info.name}}</text>
				</view>
				<view class="line">
					<text class="left">年龄</text>
					<text class="right">{{info.age}}</text>
				</view>
				<view class="line">
					<text class="left">性别</text>
					<text class="right">{{info.sex?"男":"女"}}</text>
				</view>
				<view class="line">
					<text class="left">{{idCardTitle}}</text>
					<text class="right">{{info.idCard}}</text>
				</view>
				<view class="line">
					<text class="left">手机</text>
					<text class="right">{{info.phone}}</text>
				</view>
				<view class="line">
					<text class="left">政治面貌</text>
					<text class="right">{{["群众","共青团员",'中共党员'][info.politicalVisage]}}</text>
				</view>
				<view class="line">
					<text class="left">家庭住址</text>
					<text class="right">{{info.address}}</text>
				</view>
			</view>
			<view class="data volunteer">
				<view class="line">
					<text class="left">团体认证</text>
					<text class="right" :style="{color:info.ifGroup?'#3bb36c':'#fe3434'}">{{info.ifGroup?"已认证":"未认证"}}</text>
				</view>
			</view>
			<view class="data modifiable">
				<view class="line">
					<text class="left">邮箱</text>
					<text class="right">{{info.email || "无"}}</text>
				</view>
				<view class="line">
					<text class="left">技能特长</text>
					<text class="right">{{info.skill || "无"}}</text>
				</view>
				<view class="line">
					<text class="left">单位/学校</text>
					<text class="right">{{info.work || "无"}}</text>
				</view>
				<view class="line">
					<text class="left">隶属部门</text>
					<text class="right">{{info.department || "无"}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info:{
					name: "",
					age: 0,
					sex: 0,
					idCard: "*************",
					phone: "**********",
					address: "无",
					politicalVisage: 0,
					email: "无",
					work: "无",
					department: "无",
					ifGroup: false,
					skill: "无",
				},
				idCardTitle: "志愿者账号"
			}
		},
		created(){
			if(!this.$ziyunUserInfo.name) this.init()
			else {
				this.info = this.$ziyunUserInfo
				this.idCardTitle = "身份证号"
			}
		},
		methods: {
			init(){
				let token
				let that = this
				try {
					token = uni.getStorageSync('token');
				} catch (e) {
					console.error(e)
				}
				if (!token) return uni.navigateBack()
				uni.request({
					url: that.$URL + '/info/userInfo',
					method: "POST",
					data: {token:that.$utils.RsaEncryption(token)},
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
						that.__proto__.__proto__.$ziyunUserInfo = that.info = JSON.parse(that.$utils.AESDecode(data.data))
						that.idCardTitle = "身份证号"
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.warp{
		background-color: #f8f7f9;
		.title{
			padding: 20px 10px 10px;
			font-weight: bold;
			font-size: 30px;
			color: #444444;
			text-align: center;
		}
		.ps-shell {
			border-bottom: 1px solid #DEDEDE;
			padding: 10px 20px;
			display: flex;
			flex-direction: column;
			.ps{
				position: relative;
				padding-left: 8px;
				font-size: 11px;
				line-height: 18px;
				font-weight: 400;
				color: #959595;
				&::before{
					position: absolute;
					content: "*";
					left: 0;
					top: 2px;
				}
			}
		}
		.data-shell{
			width: 100%;
			margin: 0 auto;
			.data{
				width: 100%;
				background-color: #fff;
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
						font-size: 15px;
						min-width: 100px;
						color: #646464;
					}
					.right{
						font-size: 12px;
					}
				}
			}
		}
		
	}
</style>
