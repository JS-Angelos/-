<template>
	<view class="activity">
		<view class="search">
			<view class="placeholder" v-if="inputPlaceholderShow">
				<text class="iconfont icon-sousuo"></text>
				<text class="text">输入项目名称</text>
			</view>
			<input @input="onInputFn" @confirm="onConfirm" class="_input" confirm-type="search" type="text"
				:maxlength="120" />
		</view>
		<view class="slideshow">
			<swiper class="slideshow-swiper" indicator-color="#dbd7d4" indicator-active-color="#ff277a" :circular="true"
				:indicator-dots="true" :autoplay="true" :disable-touch="true">
				<swiper-item>
					<view class="item-swiper">
						<image class="item-image" src="/static/img/1.jpg" mode="aspectFill"></image>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="item-swiper">
						<image class="item-image" src="/static/img/2.jpg" mode="aspectFill"></image>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="item-swiper">
						<image class="item-image" src="/static/img/3.jpg" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="a-content">
			<view class="option-shell">
				<view class="a-option" @click="fn">
					<text id="opAll" :class="['all',{'pickOn': pickOn === 'opAll'}]">全部</text>
					<text id="opOne" :class="['one',{'pickOn': pickOn === 'opOne'}]">潮搭</text>
					<text id="opTow" :class="['tow',{'pickOn': pickOn === 'opTow'}]">美护</text>
					<text id="opThree" :class="['three',{'pickOn': pickOn === 'opThree'}]">饰品配件</text>
					<text id="opFour" :class="['four',{'pickOn': pickOn === 'opFour'}]">家居百货</text>
				</view>
				<view class="bgBlock" :style="{left: bgBlockLeft + 'px', width: bgBlockWidth + 'px'}"></view>
			</view>
			<view class="a-card">
				<view class="card-block-shell">
					<view class="card-block">
						<view class="pwd">
							<image class="img" src="../../static/img/4.jpg" mode="aspectFill"></image>
							<view class="info">
								<view class="contentName">
									<text>第一次活动</text>
								</view>
								<view class="date-people">
									<view>
										<text class="iconfont icon-time"></text>
										<text>2021-09-01</text>
									</view>
									<view>
										<text class="iconfont icon-ren"></text>
										<text>50</text>
									</view>
								</view>
								<view class="site">
									<text class="iconfont icon-weizhi"></text>
									<text>贵州省桐梓县娄山关镇河滨南路4669号</text>
								</view>
								<view class="bottom">
									<view class="publisher">
										<view class="logo">
											
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inputPlaceholderShow: true,
				bgBlockLeft: 10,
				bgBlockWidth: 33,
				pickOn: "opAll",
			};
		},
		methods: {
			onInputFn(e) {
				if (e.detail.cursor !== 0 && this.inputPlaceholderShow === true) this.inputPlaceholderShow = false;
				else if (e.detail.cursor === 0) this.inputPlaceholderShow = true;
			},
			onConfirm(e) {
				console.log(e.detail)
				if (!e.detail.value) return
				let value = e.detail.value;
				// ...调接口
			},
			fn(e) {
				let target = e.target
				if (target.id.indexOf('op') === -1) return
				let query = uni.createSelectorQuery().in(this)
				this.pickOn = target.id
				this.bgBlockLeft = target.offsetLeft - 10
				query.select('#' + target.id).boundingClientRect(data => {
					this.bgBlockWidth = data.width + 1
				}).exec()
			}
		}
	}
</script>

<style lang="less">
	.search {
		position: relative;
		padding: 20rpx 10rpx;
		width: 100%;
		height: 120rpx;
		box-sizing: border-box;

		.placeholder {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			display: flex;
			justify-items: center;
			align-items: center;
			color: #808080;

			.text {
				margin-left: 8rpx;
			}
		}

		._input {
			border-radius: 30px;
			width: 100%;
			height: 100%;
			padding: 10rpx 20rpx;
			box-sizing: border-box;
			background-color: #f7f7f7;
		}
	}

	.slideshow {
		width: 100%;
		padding: 0 10rpx;
		display: flex;
		box-sizing: border-box;

		.slideshow-swiper {
			width: 100%;

			.item-swiper {
				width: 100%;
				height: 100%;

				.item-image {
					width: 100%;
					height: 100%;
				}
			}
		}

	}

	.a-content {
		.option-shell {
			margin-top: 25rpx;
			position: relative;
			width: 100%;
			height: 41px;
			background-color: #f5f5f5;

			.a-option {
				position: absolute;
				width: 100%;
				display: flex;
				justify-content: space-between;
				padding: 10px 20px;
				box-sizing: border-box;
				color: #4c4c4c;
				z-index: 10;
				border-radius: 30px;
				transition: color .3s;

				.pickOn {
					font-weight: bolder;
					color: #000;
				}
			}

			.bgBlock {
				position: absolute;
				top: 5.5px;
				height: 30px;
				padding: 0 10px;
				background-color: #ffffff;
				border-radius: 30px;
				transition: all .3s;
			}
		}
	}

	.a-card {
		.card-block-shell {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			padding: 10px 4px;
			width: 100%;
			box-sizing: border-box;

			.card-block {
				padding: 4px;
				width: 50%;
				box-sizing: border-box;

				.pwd {
					padding-bottom: 10px;
					width: 100%;
					background-color: #fff;
					box-shadow: 2px 2px 5px 3px rgba(34, 34, 34, 0.3);

					.img {
						width: 100%;
						height: 200px;
					}

					.info {
						padding: 5px;
						font-size: 14px;
						color: #7c7c7c;

						.contentName {
							font-size: 20px;
							font-weight: bolder;
							color: #000;
						}
						
						.iconfont{
							margin-right: 3px;
							font-size: 14px;
						}

						.date-people {
							display: flex;
							padding-top: 5px;
							justify-content: space-between;
						}

						.site {
							padding-top: 5px;
						}
					}
				}

			}
		}
	}
</style>
