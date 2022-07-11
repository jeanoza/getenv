/**
 * Get user's environnement datas
 * @param {function} callback 
 * @returns {{}}
 */
async function GetEnv(callback) {
	let data = {
		es_version: isES6() ? "ES6" : "ES5",
		monitor: { ...GetMonitor()},
		connection: {...GetConnect()},
		gpu: { ...GetGPUCapacity() },
		memory: { ...GetMemPerformance() },
		camera: await GetMedia({ video: true }),
		language : navigator.language.slice(0,2),
		_3dEnabled: undefined,
		_arEnabled: undefined,
		...new UAParser().getResult()
	};

	data._3dEnabled = data.gpu.gl_renderer.includes("WebGL") && isES6() ? true : false;
	data._arEnabled = GetArCapacity(data._3dEnabled, data.device.model, data.camera)

	document.addEventListener('devicechange', e => {
		console.log(e);

	})

	if (callback) callback(data);
	return data;
}

/**
 * Getter user connection infos
 * @returns {{network:string, rtt:number}}
 */

function GetConnect () {
	return {
		network: navigator.connection.effectiveType,
		round_trip_time: navigator.connection.rtt,
	}
}

/**
 * Getter user display infos
 * @returns {{capacity:{}, current:{}}}
 */
function GetMonitor ()
{
	return {
		capacity: {
			width: window.screen.availWidth,
			height: window.screen.availHeight,
		},
		current: {
			width: window.innerWidth,
			height: window.innerHeight,
		},
	}
}

//marche pas : /SM-S90*_/ *is number _is alpha_majuscule/number
//s22	SM-S901B, SM-S901B/DS, SM-S901U, SM-S901U1, SM-S901W, SM-S901N, SM-S9010, SM-S901E, SM-S901E/DS
// ultra SM-S908B, SM-S908B/DS, SM-S908U, SM-S908U1, SM-S908W, SM-S908N, SM-S9080, SM-S908E, SM-S908E/DS
// s22+ SM-S906B, SM-S906B/DS, SM-S906U, SM-S906U1, SM-S906W, SM-S906N, SM-S9060, SM-S906E, SM-S906E/DS

//marche : ... /SM-G99/....
//s21fe SM-G990B, SM-G990B/DS, SM-G990U, SM-G990U1, SM-G990W, SM-G990E
//s21 SM-G991B, SM-G991B/DS, SM-G991U, SM-G991U1, SM-G991W, SM-G991N, SM-G9910, SM-G991Q
//s21 ultra SM-G998B, SM-G998B/DS, SM-G998U, SM-G998U1, SM-G998W, SM-G998N, SM-G9980
//s21 	SM-G998B, SM-G998B/DS, SM-G998U, SM-G998U1, SM-G998W, SM-G998N, SM-G9980
//s21 + 5g SM-G996B, SM-G996B/DS, SM-G996U, SM-G996U1, SM-G996W, SM-G996N, SM-G9960
//s21 no 5g 	SM-G990F, SM-G990F/DS

//regex test code
// const s22s = [
// 	"SM-S901B", "SM-S901B/DS", "SM-S901U", "SM-S901U1", "SM-S901W", "SM-S901N",
// 	"SM-S9010", "SM-S901E", "SM-S901E/DS",
// 	"SM-S908B", "SM-S908B/DS", "SM-S908U", "SM-S908U1",
// 	"SM-S908W", "SM-S908N", "SM-S9080", "SM-S908E", "SM-S908/DS",
// 	"SM-S906B", "SM-S906B/DS", "SM-S906U", "SM-S906U1", "SM-S906W", 
// 	"SM-S906N", "SM-S9060", "SM-S906E", "SM-S906E/DS"
// ]
// const s21s = [
// 	"SM-G990B", "SM-G990B/DS", "SM-G990U" , "SM-G990U1" , "SM-G990W", "SM-G990E"
// ]
// //test
// s22s.forEach(el => {
// 	console.log("s22s", /^SM-S90[0-9][A-Z, 0-9, \/]/.test(el), el) 
// })
// s21s.forEach(el => {
// 	console.log("s21s", /^SM-S90[0-9][A-Z, 0-9, \/]/.test(el), el) 
// })

/**
 * 
 * @param {boolean} _3dEnabled 
 * @param {string | undefined} mobile 
 * @param {boolean} camera 
 * @return {boolean} 
 */
function GetArCapacity(_3dEnabled, mobile, camera ) {
	if (_3dEnabled && camera && !/^SM-S90[0-9][A-Z, 0-9, \/]/.test(mobile)) return true;
	return false;
}


async function GetMedia(constraints) {
	let stream = null;
	try {
		stream = await navigator.mediaDevices.getUserMedia(constraints);
		if (stream) return true;
	} catch (err) {
		console.log(err);
		return false;
	}
}
/**
 * get performance datas from window.performance
 * @returns {{}} data object
 */
function GetMemPerformance() {
	let _data = {};
	let performance =
		window.performance ||
		window.mozPerformance ||
		window.msPerformance ||
		window.webkitPerformance ||
		{};

	for (let i in performance) {
		let current = performance[i];

		if (typeof current === "object") {
			if (current?.constructor.name === "Object") {
				for (let key in current) {
					let val = current[key];
					_data[key] = val;
				}
			}
		}
	}
	let data = {
		limit_heap_byte : _data.jsHeapSizeLimit,
		total_heap_percent : _data.totalJSHeapSize / _data.jsHeapSizeLimit * 100,
		used_heap_percent : _data.usedJSHeapSize / _data.jsHeapSizeLimit * 100,
	}
	return data;
}

/**
 * verify if current browser support ES6
 * @returns {boolean}
 */
function isES6() {
	"use strict";

	try {
		eval("var foo = (x)=>x+1");
	} catch (e) {
		return false;
	}
	return true;
}

/**
 * Get Graphic capacity by using canvas object and webgl
 * @returns {{}} data object
 */
function GetGPUCapacity() {
	let canvas = document.createElement("canvas");
	document.body.appendChild(canvas);

	let gl = canvas.getContext("experimental-webgl");

	let data = {
		gl_renderer: gl.getParameter(gl.RENDERER),
		gl_vendor: gl.getParameter(gl.VENDOR),
		renderer: getUnmaskedInfo(gl).renderer,
		vendor: getUnmaskedInfo(gl).vendor,
	};

	function getUnmaskedInfo(gl) {
		let unMaskedInfo = {
			renderer: "",
			vendor: "",
		};

		let dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
		if (dbgRenderInfo != null) {
			unMaskedInfo.renderer = gl.getParameter(
				dbgRenderInfo.UNMASKED_RENDERER_WEBGL
			);
			unMaskedInfo.vendor = gl.getParameter(
				dbgRenderInfo.UNMASKED_VENDOR_WEBGL
			);
		}
		return unMaskedInfo;
	}
	return data;
}