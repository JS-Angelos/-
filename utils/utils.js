import jsencrypt from "./jsencrypt.js";
import CryptoJS from "crypto-js"

(function() {

	// 公钥
	const publicKey =
		'-----BEGIN PUBLIC KEY-----MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAvynf8gpD6lD1+mTp2OTrTNOLRF/q9a9cRYyWBeoXSjmcFQUIC+a0pwSUvv2Gb2DgrX8wIuve7GkRsbGYvddXkUcWimJbFO20+/anBvkxyXHKeFwQpPow9hO0dvC2/9tXFqTBkmVdttYzqd07Y05IVCxG6O85LzZMEeb13w4osBflZCaxcSN6qLCURpf+3cnf9PeawhlJPGYu+5d1Pct1pl5hjYdYu9dEphmlsYb2Md6G0dk6ZgBe0x4hJgRhFJwozEAwQVl4BCQ9f902ZcxW7JO/gbibbQ2Mdz8VwBn2A8tSrRjuxwgS9C9jq0nnVN2kvPFY+ibH3wWJzGhM3KGAiZcO/n7IB3s6CKdjCyt4DRZHL3SHdZQ6WRYeNtdWuL0F8nlFCFAgHIv3vwD9oxCLRj/8WH4PNJxqTcmBApWl5QxGAButn9tAeM5DOaNd6dmgkqI3IBR/DLE7U2L7dK/C2ic5EkqopGTv5RhzQ4h1Aml/8O4Uqbls3NujjQA23xFaomPwBK52VFvLnemzZVaEOG2b1JzkYculhGHz19EAzT860ZfLkHGrw8xOeKCWvpyshLFe5PGynnwT/NfitRLsCCQ6pLmTvg9Q6l0rLL3W5G55D/va4DImUPY9gDLstim69on363sXTsFqz3jknGsXORbJnwIIGN54q97zPnXO6ysCAwEAAQ==-----END PUBLIC KEY-----'
	// AES conf
	const AES_conf = {
		key: "ziyunzhiyuanzhe7",
		iv: "1758512329502017",
	}

	// rsa加密
	const RsaEncryption = function RsaEncryption(data, pKey) {
		let key = publicKey
		if(pKey) key = pKey
		let JSE = new jsencrypt()
		JSE.setPublicKey(key)
		if(typeof data !== "string") data = JSON.stringify(data)
		return JSE.encrypt(data)
	}

	// AES解密
	const AESDecode = function AESDecode(data) {
		let key = CryptoJS.enc.Utf8.parse(AES_conf.key);
		let iv = CryptoJS.enc.Utf8.parse(AES_conf.iv)
		data = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(data));
		let decrypt = CryptoJS.AES.decrypt(data, key, {
			iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		return decrypt.toString(CryptoJS.enc.Utf8);
	}

	/* 
	 * 函数防抖 debounce
	 *  @params
	 *      func: 需要执行的函数【必需】
	 *      wait: 频繁操作的设定时间【默认300ms】
	 *      immediate: 设置边界【默认false: 结束边界触发，true: 开始边界触发】
	 */
	const debounce = function debounce(func, wait, immediate) {
		if (typeof func !== "function") throw new TypeError('func must be an function')
		if (typeof wait === "boolean") immediate = wait
		if (typeof wait !== "number") wait = 300
		if (typeof immediate !== "boolean") immediate = false
		let timer;
		return function proxy(...params) {
			let runNow = !timer && immediate,
				self = this
			if (timer) {
				clearTimeout(timer)
				timer = null
			}
			timer = setTimeout(() => {
				if (timer) {
					clearTimeout(timer)
					timer = null
				}
				//结束边界触发
				if (!immediate) func.call(self, ...params)
			}, wait)

			//开始边界触发
			if (runNow) func.call(self, ...params)
		}
	}

	/* 
	 * 函数节流 throttle
	 *  @params
	 *      func: 需要执行的函数【必需】
	 *      wait: 设定的触发频率【默认300ms】
	 */
	const throttle = function throttle(func, wait) {
		if (typeof func !== "function") throw new TypeError('func must be an function')
		if (typeof wait !== "number") wait = 300
		let timer,
			previous = 0
		return function proxy(...params) {
			let now = +new Date(),
				remaining = wait - (now - previous),
				self = this,
				result
			if (remaining <= 0) {
				// 间隔时间已经超过 wait（包括第一次触发），无需等待，立即执行
				if (timer) {
					clearTimeout(timer)
					timer = null
				}
				result = func.call(self, ...params)
				previous = now
			} else if (!timer) {
				timer = setTimeout(() => {
					if (timer) {
						clearTimeout(timer)
						timer = null
					}
					result = func.call(self, ...params)
					previous = +new Date()
				}, remaining)
			}
			return result
		}
	}

	// 利用闭包保护作用，把自己写的方法写在私有上下文中，防止变量全局污染
	let utils = {
		debounce,
		throttle,
		RsaEncryption,
		AESDecode
	}

	// 暴露API [支持: 浏览器直接导入、webpack环境编译、node环境执行]
	if (typeof window !== "undefined") {
		window.utils = window.$ = utils;
	}
	if (typeof module === "object" && typeof module.exports === "object") {
		module.exports = utils;
	}
})()
