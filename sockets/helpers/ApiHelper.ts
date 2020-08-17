import { IData } from "../utils/contracts"
import constants from "../utils/constants"

export const resolveUri = (template: string) => (data: IData) => {
	const urlData: IData = { apiUrl: constants.apiBase, ...data }
	return template.replace(/{\w+}/g, x => urlData[x.slice(1, -1)] || x)
}