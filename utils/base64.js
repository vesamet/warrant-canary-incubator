import { encode as base64encode, decode as base64decode } from 'js-base64'

export function encode(value) {
	return base64encode(value)
}

export function decode(value) {
	return base64decode(value)
}
export function decodeToUint8Array(value) {
	return new Uint8Array(base64decode(value).split(","))
}