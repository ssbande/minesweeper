import { IData, IEndpointTypes } from './contracts'
import Constants from './constants'

export const resolveUri = (template: string) => (data: IData) => {
	const urlData: IData = { apiUrl: Constants.base, ...data }
	return template.replace(/{\w+}/g, x => urlData[x.slice(1, -1)] || x)
}
export const createActionTypes = (type: string): IEndpointTypes => ({
	REQUEST: `${type}_REQUEST`,
	SUCCESS: `${type}_SUCCESS`,
	ERROR: `${type}_ERROR`,
	BASE: `${type}_BASE`,
})
