import { IApiOptions } from './contracts'

class AppUtils {
	private static instance: AppUtils
	public static getInstance() {
		if (!AppUtils.instance) {
			AppUtils.instance = new AppUtils()
		}

		return AppUtils.instance
	}

	public async checkFetchErrors<T>(response: Response): Promise<T> {
		if (!response.ok) {
			const res = await response.json()
			throw res
		}

		const result = (await response.json()) as T
		return result
	}

	public executeFetch<T>(url: string, options?: IApiOptions): Promise<T> {
		const apiHeader = {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		}
		return new Promise((resolve, reject) => {
			fetch(
				url,
				options ? { headers: apiHeader, ...options } : { headers: apiHeader }
			)
				.then(res => this.checkFetchErrors<T>(res))
				.then(res => resolve(res as T))
				.catch(e => reject(e))
		})
	}
}

const instance = AppUtils.getInstance()
export default instance
