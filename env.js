async function GetEnv(callback) {
	let result = new UAParser().getResult();

	let data = {
		es_version: isES6() ? "ES6" : "ES5",
		monitor: {
			capacity: {
				width: window.screen.availWidth,
				height: window.screen.availHeight,
			},
			current: {
				width: window.innerWidth,
				height: window.innerHeight,
			},
		},
		connection: {
			network: navigator.connection.effectiveType,
			round_trip_time: navigator.connection.rtt,
		},
		gpu: { ...GetGPUCapacity() },
		memory: { ...GetMemPerformance() },
		camera: await GetMedia({ video: true }),
		language : navigator.language.slice(0,2),
		_3dEnabled: false,
		_arEnabled: false,
		...result,
	};

	data._3dEnabled =
		data.gpu.gl_renderer.includes("WebGL") && isES6() ? true : false;
	data._arEnabled =
		data._3dEnabled && data.device.mobile && data.camera ? true : false;

	if (callback) callback(data);
	return data;
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
		total_heap : `${_data.totalJSHeapSize / _data.jsHeapSizeLimit * 100}%`,
		used_heap : `${_data.usedJSHeapSize / _data.jsHeapSizeLimit * 100}%`,
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