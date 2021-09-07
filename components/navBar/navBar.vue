<template>
	<view class="top-nav-bar">
		<view :style="{height: statusBarHeight + 'px'}" :class="{'opa': opa}"></view>
		<view class="nav-box" :class="{'opa': opa}">
			<image class="return" src="../../static/return.png" v-show="left"></image>
			<view class="text-area" :class="{'text-left':left}">
				<slot>梓云志愿者</slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			left: {
				type: Boolean,
				default: false
			},
			opa: {
				type: Number,
				default: 0
			}
		},
		name: "navBar",
		data() {
			return {
				statusBarHeight: 0,
			};
		},
		created() {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
		}
	}
</script>

<style lang="less">
	.top-nav-bar {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;

		.nav-box {
			width: 100%;
			height: 45px;
			padding: 5px 10px;
			background-color: rgba(0,0,0,.3);
			display: flex;
			align-items: center;
			// justify-content: space-between;
			box-sizing: border-box;

			.return {
				width: 20px;
				height: 25px;
			}

			.text-area {
				margin: 0 auto;
				color: #fff;

				&.text-left {
					margin-left: 10px;
				}
			}
		}
		.opa{
			background-color: #1c2c60;
		}
	}
</style>
