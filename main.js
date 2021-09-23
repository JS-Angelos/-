import Vue from 'vue'
import App from './App'
import utils from "./utils/utils.js"
import './static/font/iconfont.css'

Vue.config.productionTip = false

// 自定义属性&方法 start
Vue.prototype.$ziyunUserInfo = {}
Vue.prototype.$zyyUserInfo = {}
Vue.prototype.$utils = utils
Vue.prototype.$domain = "https://28248b043t.oicp.vip" // 请求地址
// Vue.prototype.$domain = "http://10.0.18.87:8023"
Vue.prototype.$URL = Vue.prototype.$domain + "/api"
Vue.prototype.$exa = {
	ifVerifyToken: false,
	ifVer: false,
	ifVol: false,
}
Vue.prototype.$verifyToken = function(token) {
	let that = this
	return new Promise((resolve,reject) => {
		uni.request({
			url: that.$URL + "/verify/token",
			method: "POST",
			data: {
				token: that.$utils.RsaEncryption(token),
				ver: true
			},
			success(res) {
				if (res.statusCode !== 200) {
					reject(res)
					return uni.showModal({
						title: "提示",
						content: "Error: token API " + res.statusCode,
						showCancel: false,
					})
				}
				let data = res.data
				if (data.code !== 0) {
					uni.removeStorage({
						key: "token"
					})
					return resolve(data)
				}
				that.$exa.ifVerifyToken = true
				that.$exa.ifVer = data.ifVer
				that.$exa.ifVol = data.ifVol
				if (data.msg == "Token update") {
					uni.setStorage({
						key: "token",
						data: that.$utils.AESDecode(data.data.token)
					})
				} else console.log("Token exists")
				resolve(data)
			},
			fail(e){reject(e)}
		})
	})
}
// 自定义属性&方法 end

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
