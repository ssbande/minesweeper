export interface IData {
	[key: string]: any
}

export interface IApiOptions {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE'
	headers?: IData
	body?: string
}