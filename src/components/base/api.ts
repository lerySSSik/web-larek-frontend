export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
	readonly baseUrl: string;
	protected options: RequestInit;
  
	constructor(baseUrl: string, options: RequestInit = {}) {
	  this.baseUrl = baseUrl.endsWith('/') 
		? baseUrl.slice(0, -1) 
		: baseUrl;
	  
	  this.options = {
		headers: {
		  'Content-Type': 'application/json',
		  ...(options.headers as object ?? {})
		}
	  };
	}

	protected async handleResponse(response: Response): Promise<object> {
		const contentType = response.headers.get('content-type');
		
		if (!contentType?.includes('application/json')) {
		  const text = await response.text();
			throw new Error(`Server returned HTML (likely 404): ${text.slice(0, 100)}...`);
		}
	  
		if (!response.ok) {
		  const data = await response.json();
			return await Promise.reject(data.error ?? response.statusText);
		}
		
		return response.json();
	  }

	get<T>(uri: string): Promise<T> {
		const cleanUri = uri.startsWith('/') ? uri.slice(1) : uri;
		const url = `${this.baseUrl.replace(/\/$/, '')}/${cleanUri}`;
		
		return fetch(url, {
		  ...this.options,
		  method: 'GET'
		}).then(this.handleResponse as (response: Response) => Promise<T>);
	  }
	post(uri: string, data: object, method: ApiPostMethods = 'POST') {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data)
		}).then(this.handleResponse);
	}
}