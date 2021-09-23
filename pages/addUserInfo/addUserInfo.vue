<template>
	<view class="add-userinfo">
		<view class="title">
			<text>梓云志愿者协会人员信息登记</text>
		</view>
		<view class="content">
			<view class="ps-shell">
				<text class="ps">注意事项：</text>
				<text class="ps">信息仅用于协会人员管理与参与活动后志愿时长的记录，不做其他用途。</text>
				<text class="ps">保证所有信息安全，不会外泄。</text>
				<text class="ps">数据在后台保存，及传输过程中均为加密状态。</text>
				<text class="ps">如同意授权此小程序记录个人信息，请填写注册表。</text>
				<text class="ps">如不同意授权此小程序记录个人信息，请填联系管理员进行私人记录。</text>
				<text class="ps">必填数据认证后将不可修改，请确认填写正确。</text>
				<text class="ps">管理员 QQ：1693256432，微信：qq1693256432</text>
			</view>
			<view class="form">
				<view class="line" style="padding-top: 5px;">
					<text class="f-l-t">姓名：</text>
					<input id="$1" :class="[{'foc': focus == 1},{'err0': err.$1 == 0},{'err1': err.$1 == 1},'inp']"
						v-model="form.name" type="text" :maxlength="20" placeholder="请输入真实姓名" @focus="focusFn"
						@blur="blurFn" />
				</view>
				<view class="line">
					<view class="age-shell">
						<text class="f-l-t">年龄：</text>
						<input id="$2"
							:class="[{'foc': focus == 2},{'err0': err.$2 == 0},{'err1': err.$2 == 1},'inp','age']"
							type="number" v-model="form.age" :maxlength="2" @focus="focusFn" @blur="blurFn" />
					</view>
					<view class="sex">
						<text class="f-l-t">性别：</text>
						<view class="radio">
							<view class="txt-shell" @click="sexFn">
								<text :class="['txt',{'on': form.sex}]">男</text>
								<text id="girl" :class="['txt',{'on': !form.sex}]">女</text>
							</view>
							<view :class="['sliding',{'girl': !form.sex}]"></view>
						</view>
					</view>
				</view>
				<view class="line">
					<text class="f-l-t">手机：</text>
					<input id="$3"
						:class="[{'foc': focus == 3},{'err0': err.$3 == 0},{'err1': err.$3 == 1},'inp','age']"
						type="number" v-model="form.phone" placeholder="请输入11位手机号码" maxlength="11" :cursor-spacing="22"
						@focus="focusFn" @blur="blurFn" />
				</view>
				<view class="line">
					<text class="f-l-t">志愿中国账号：</text>
					<input id="$4"
						:class="[{'foc': focus == 4},{'err0': err.$4 == 0},{'err1': err.$4 == 1},'inp','age']"
						type="idcard" v-model="form.idCard" placeholder="账号仅用于录入志愿时长" maxlength="18"
						:cursor-spacing="22" @focus="focusFn" @blur="blurFn" />
				</view>
				<view class="line">
					<text class="f-l-t">家庭住址：</text>
					<view class="ip-shell">
						<picker class="picker" mode="region" @change="addressChangeFn" :value="form.regionArr">
							<view class="region">
								<text>{{form.regionArr[0]}}</text>
								-
								<text>{{form.regionArr[1]}}</text>
								-
								<text>{{form.regionArr[2]}}</text>
							</view>
							<text class="iconfont icon-xiangxia1"></text>
						</picker>
						<input id="$5" :class="[{'foc': focus == 5},{'err0': err.$5 == 0},'inp']" v-model="form.address"
							type="text" placeholder="请输入详细地址" :cursor-spacing="22" @focus="focusFn" @blur="blurFn" />
					</view>
				</view>
				<view class="line">
					<text class="f-l-t">政治面貌：</text>
					<radio-group class="radio-shell" @change="changeFn">
						<label class="radio">
							<radio value="0" checked color="rgb(255,127,0)" /><text>群众</text>
						</label>
						<label class="radio">
							<radio value="1" color="rgb(0,87,55)" /><text>团员</text>
						</label>
						<label class="radio">
							<radio value="2" color="rgb(255,0,0)" /><text>党员</text>
						</label>
					</radio-group>
				</view>
				<view class="line">
					<text class="f-l-t">邮箱：</text>
					<input id="$6" :class="[{'foc': focus == 6},{'err1': err.$6 == 1},'inp','age']" type="text"
						v-model="form.email" placeholder="非必填" :cursor-spacing="22" maxlength="30" @focus="focusFn"
						@blur="blurFn" />
				</view>
				<view class="line">
					<text class="f-l-t">单位/学校：</text>
					<input id="$7" :class="[{'foc': focus == 7},'inp']" v-model="form.work" type="text"
						placeholder="二选一 , 非必填" maxlength="30" :cursor-spacing="22" @focus="focusFn" @blur="blurFn" />
				</view>
				<view class="line">
					<text class="f-l-t">隶属部门：</text>
					<input id="$8" :class="[{'foc': focus == 8},'inp']" v-model="form.department" type="text"
						placeholder="非必填" maxlength="10" :cursor-spacing="22" @focus="focusFn" @blur="blurFn" />
				</view>
				<view class="auth_text">
					<text v-if="!ifAuth" class="iconfont icon-square" @click="this.ifAuth = true"></text>
					<text v-else class="iconfont icon-squarecheckfill" @click="this.ifAuth = false" style="color: #1ed76d;"></text>
					<view class="auth">确认授权<text style="color: #dd6572; font-weight: bold;">梓云志愿者</text>小程序收集您的<text style="color: #dd6572; font-weight: bold;">个人信息</text></view>
				</view>
				<button class="btn" :disabled="!ifAuth" :style="{backgroundColor:ifAuth?'#428bca':'#f7f7f7',color:ifAuth?'#FFF':'#989898'}" @click="ifAllowClick && submitFn()">授权提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					name: "",
					age: "18",
					phone: "",
					idCard: "",
					address: "",
					// 前5个顺序不能更改
					regionArr: ["贵州省", "遵义市", "桐梓县"],
					region: "贵州省遵义市桐梓县",
					email: "",
					sex: 1,
					politics: 0,
					work: "",
					department: ""
				},
				focus: 0,
				err: {
					"$1": -1,
					"$2": -1,
					"$3": -1,
					"$4": -1,
					"$5": -1,
					"$6": -1
				},
				Reg: {
					name_cn: /^(?:[\u4e00-\u9fa5·]{2,16})$/,
					name_en: /(^[a-zA-Z]{1}[a-zA-Z\s]{0,20}[a-zA-Z]{1}$)/,
					phone: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/,
					idCard: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
					email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				},
				ifAllowClick: true,
				ifAuth: false
			};
		},
		methods: {
			sexFn(e) {
				let target = e.target
				if (target.id && this.form.sex) this.form.sex = 0
				else if (!this.form.sex && !target.id) this.form.sex = 1
			},
			RegVerifyFn(d, num) {
				if (!d.cursor && num < 6) return this.err['$' + num] = 0
				if (num == 1) {
					if (!this.Reg.name_cn.test(d.value)) !this.Reg.name_en.test(d.value) && (this.err['$' + num] = 1)
				} else if (num == 2) {
					!Number(d.value) && (this.err['$' + num] = 1)
				} else if (num == 3) {
					!this.Reg.phone.test(d.value) && (this.err['$' + num] = 1)
				}  else if (num == 6) {
					if (d.value) !this.Reg.email.test(d.value) && (this.err['$' + num] = 1)
				}
				else if (num == 4) {
					!this.Reg.idCard.test(d.value) && (this.err['$' + num] = 1)
				}
			},
			focusFn(e) {
				let id = e.target.id
				if (!id || (id.indexOf('$') == -1)) return
				let num = /\d{1}/g.exec(id)
				if (!num) return
				num = parseInt(num[0])
				if (this.err['$' + num] !== -1) this.err['$' + num] = -1
				this.focus = num
				if (this.focus == this.$focus - 1) this.$focus = 0
			},
			blurFn(e) {
				let d = e.detail
				let id = e.target.id
				if (!id || (id.indexOf('$') == -1)) return
				this.focus = 0
				//正则判断
				let num = /\d{1}/g.exec(id)
				if (!num) return
				let that = this
				num = parseInt(num[0])
				this.RegVerifyFn(d, num)
			},
			changeFn(e) {
				this.form.politics = parseInt(e.detail.value)
			},
			addressChangeFn(e) {
				let value = e.detail.value
				this.form.regionArr = value
				if (value[0] === value[1]) this.form.region = value[1] + value[2]
				else if (value[1] === "县") this.form.region = value[0] + value[2]
				else this.form.region = value.join('')
			},
			submitFn(e) {
				let that = this
				that.ifAllowClick = false
				const verifyFn = function verifyFn() {
					let from = that.form
					let ifPass = true
					let i = 1
					for (let key in from) {
						if (i > 5) break
						that.RegVerifyFn({
							value: from[key],
							cursor: from[key].length
						}, i)
						i++
					}
					if (from.email) that.RegVerifyFn({
						value: from.email,
						cursor: from.email.length
					}, 6)
					for (let key in that.err) {
						if (that.err[key] !== -1) {
							ifPass = false
							break
						}
					}
					return ifPass
				}

				if (!verifyFn()) return that.ifAllowClick = true
				else uni.showLoading({
					title: "正在提交注册",
					mask: true,
					success() {
						let form = that.form
						let option = {
							name: form.name,
							age: form.age,
							sex: form.sex,
							phone: form.phone,
							// idCard: form.idCard,
							address: form.region + form.address,
							politics: form.politics,
							email: form.email,
							work: form.work,
							department: form.department,
						}

						uni.login({
							provider: "weixin",
							success(e) {
								option.code = e.code
								uni.request({
									url: that.$URL + '/login/certification',
									method: "POST",
									data: {
										encipheredData: that.$utils
											.RsaEncryption(JSON.stringify(
												option))
									},
									success(res) {
										if (res.statusCode !== 200) {
											uni.showModal({
												title: "提示",
												content: "注册失败，接口错误。",
												showCancel: false
											})
										} else {
											if (res.data.code == -1) {
												uni.showModal({
													title: "提示",
													content: res.data.msg + `点击确前往登录`,
													showCancel: false,
													success() {
														uni.switchTab({url: "/pages/my/my"})
													}
												})
											} else if (res.data.code == 0) {
												uni.setStorage({
													key: "token",
													data: that.$utils.AESDecode(res
														.data.data.token),
													fail() {
														console.error("token 存储失败")
													}
												})
												uni.showModal({
													title: "提示",
													content: "认证成功",
													showCancel: false,
													success() {
														uni.navigateBack()
													}
												})
												that.$exa.ifVer = true
												uni.$emit('my', {
													ifVer: true,
													ifVol: false
												})
												uni.$emit('home', {
													ifVer: true
												})
											} else if (res.data.code == 4) {
												uni.showModal({
													title: "提示",
													content: res.data.msg,
													showCancel: false
												})
											} else {
												uni.showModal({
													title: "提示",
													content: "注册失败，参数错误。",
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
						
					},
					fail() {
						uni.showToast({
							icon: "error",
							title: "抱歉~ 出错了!"
						})
					}
				})
			}
			
		}
	}
</script>

<style lang="less">
	.add-userinfo {
		padding: 20px 0;

		.title {
			padding: 10px 0;
			font-size: 20px;
			text-align: center;
			font-weight: 600;
			line-height: 30px;
			color: #333;
		}

		.content {
			font: 400 13px/1.5 "Hiragino Sans GB", "Microsoft Yahei", arial, sans-serif;
			color: #333;

			.ps-shell {
				margin-bottom: 10px;
				border-bottom: 1px dashed #DEDEDE;
				padding: 10px 20px;
				display: flex;
				flex-direction: column;
				.ps{
					font-size: 11px;
					line-height: 22px;
					font-weight: 400;
					color: #959595;
				}
			}

			.form {
				.line {
					width: 100%;
					padding: 20px 25px;
					border-bottom: 1px dashed #DFDFDF;
					font-size: 15px;
					color: #808080;
					line-height: 20px;
					box-sizing: border-box;
					display: flex;
					justify-content: flex-start;
					align-items: center;

					.f-l-t {
						display: block;
						font-size: 15px;
						margin-right: 10px;
						font-weight: 400;
						line-height: 20px;
					}

					.inp {
						flex: 1;
						height: 20px;
						margin-bottom: 2px;
						padding: 5px;
						font-family: inherit;
						font-size: 13px;
						line-height: 20px;
						border-radius: 4px;
						color: #555;
						border: 1px solid #ccc;
						outline: none;
						box-shadow: none;
						transition: border linear .2s, box-shadow linear .2s;

						&.foc {
							border-color: rgba(82, 168, 236, .8);
							box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%), 0 0 8px rgb(82 168 236 / 60%);
						}

						&.err0 {
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

					.sex {
						display: flex;
						align-items: center;
						margin-left: 25px;

						.radio {
							position: relative;
							width: 122px;
							height: 42px;

							.txt-shell {
								width: calc(100% - 2px);
								height: calc(100% - 2px);
								position: absolute;
								top: 0;
								left: 0;
								z-index: 10;
								border: 1px solid #ccc;
								border-radius: 10px;
								display: flex;

								.txt {
									display: inline-block;
									width: 50%;
									height: 100%;
									line-height: 40px;
									text-align: center;
									transition: color .3s;

									&.on {
										color: #fff;
									}
								}
							}

							.sliding {
								position: absolute;
								top: 1px;
								left: 0;
								width: calc(50% - 1px);
								height: calc(100% - 2px);
								margin-left: 0;
								border-radius: 10px;
								background-color: #5aa7f9;
								transition: all .3s;

								&.girl {
									margin-left: calc(50% + 1px);
									background-color: #ff9dc6;
								}
							}
						}
					}

					.age-shell {
						display: flex;
						align-items: center;

						.age {
							padding-left: 20px;
							width: 40px;
						}
					}

					.radio-shell {
						display: flex;
						justify-content: flex-start;

						.radio {
							display: flex;
							align-items: center;

							&+.radio {
								margin-left: 20px;
							}
						}
					}

					.ip-shell {
						flex: 1;

						.picker {
							position: relative;
							border-radius: 4px;
							padding: 7px 5px;
							color: #555;
							border: 1px solid #ccc;
							margin-bottom: 15px;

							.region {
								display: flex;
								justify-content: space-between;
								width: 100%;
								height: 100%;
								padding-right: 40px;
								box-sizing: border-box;
								font-family: inherit;
								font-size: 13px;
								line-height: 20px;
							}

							.iconfont {
								position: absolute;
								right: 15px;
								top: 50%;
								transform: translateY(-50%);
							}
						}
					}
				}

				.auth_text{
					padding: 20px 25px 0;
					display: flex;
					justify-content: center;
					font-size: 12px;
					align-items: center;
					.iconfont{
						margin: 2px 3px 0 0;
						font-size: 13px;
					}
				}

				.btn {
					margin: 30px 15px 20px;
					color: #fff;
					background: #428bca;
					transition: all .2s;

					&:active {
						background-color: #286090;
						box-shadow: inset 0 2px 4px rgb(0 0 0 / 15%), 0 1px 2px rgb(0 0 0 / 5%);
					}
				}
			}
		}
	}
</style>
