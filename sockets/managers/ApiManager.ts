import fetch from 'node-fetch';
import { IApiOptions } from '../utils/contracts';

class API {
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
        .then((res: Response) => this.checkFetchErrors<T>(res))
        .then((res: T) => resolve(res))
        .catch((e: any) => reject(e))
    })
  }

}

const api = new API();
export default api;