<template>
	<view class="warp">
		<view class="title">个人信息展示</view>
		<view class="ps-shell">
			<text class="ps">注意事项：</text>
			<text class="ps">保证所有信息安全，不会外泄。</text>
			<text class="ps">此处页面仅在您授权登录后才可进入显示信息，非登录状态不可访问。</text>
			<text class="ps">此处展示数据为您在梓云登记的信息。</text>
			<text class="ps">信息仅用于协会人员管理与参与活动后志愿时长的记录，不做其他用途。</text>
			<text class="ps">为保障您个人隐私，此处默认将不会完全展示您的私密信息。</text>
			<text class="ps">数据在后台保存，及传输过程中均为加密状态。</text>
			<text class="ps">如果信息填写有误，不能自行修改的数据请联系管理员进行修改。</text>
			<text class="ps">可修改数据：个人邮箱、工作单位/就读学校、隶属部门。</text>
		</view>
		<view class="data-shell">
			<view class="data CMod">
				<view class="line">
					<text class="left">姓名</text>
					<text class="right">{{name}}</text>
				</view>
				<view class="line">
					<text class="left">年龄</text>
					<text class="right">{{age}}</text>
				</view>
				<view class="line">
					<text class="left">性别</text>
					<text class="right">{{sex?"男":"女"}}</text>
				</view>
				<view class="line">
					<text class="left">{{idCardTitle}}</text>
					<text class="right">{{idCard}}</text>
				</view>
				<view class="line">
					<text class="left">手机</text>
					<text class="right">{{phone}}</text>
				</view>
				<view class="line">
					<text class="left">政治面貌</text>
					<text class="right">{{["群众","共青团员",'中共党员'][politicalVisage]}}</text>
				</view>
				<view class="line">
					<text class="left">家庭住址</text>
					<text class="right" style="font-size: 14px;">{{address}}</text>
				</view>
			</view>
			<view class="data volunteer">
				<view class="line">
					<text class="left">团体认证</text>
					<text class="right" :style="{color:volunteer?'#3bb36c':'#fe3434'}">{{volunteer?"已认证":"未认证"}}</text>
				</view>
			</view>
			<view class="data modifiable">
				<view class="line">
					<text class="left">邮箱</text>
					<text class="right">{{email}}</text>
				</view>
				<view class="line">
					<text class="left">工作单位/就读学校</text>
					<text class="right">{{work}}</text>
				</view>
				<view class="line">
					<text class="left">隶属部门</text>
					<text class="right">{{department}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: "",
				age: NaN,
				sex: 0,
				idCard: "*************",
				phone: "**********",
				address: "",
				politicalVisage: 0,
				email: "",
				work: "",
				department: "",
				volunteer: false,
				idCardTitle: "志愿者账号"
			}
		},
		created(){
			this.init()
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
						data = JSON.parse(that.$utils.AESDecode(data.data))
						// console.log(data)
						let ph = that.$utils.AESDecode(data.phone),
							id = that.$utils.AESDecode(data.idCard).match(/^(\d{6})(\d{5}|\d{8})(\d{4})$/)
						id[2] = "*".repeat(id[2].length)
						that.name = data.name
						that.age = data.age
						that.sex = data.sex
						that.idCard = id[1] + id[2] + id[3]
						that.phone = `${ph.slice(0,3)}****${ph.slice(7)}`
						that.idCardTitle = "身份证号"
						that.address = data.address
						that.politicalVisage = data.politicalVisage
						that.email = data.email
						that.work = data.work
						that.department = data.department
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.warp{
		height: 800px;
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
					.left{
						color: #646464;
					}
				}
			}
		}
		
	}
</style>
