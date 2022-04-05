
export interface RequestParam {
	url: string;
	method?: string;
	contentType?: string;
	body?: string;
	headers?: Record<string, string>;
}

export interface RequestUrlResponse {
	status: number;
	headers: Record<string, string>;
	arrayBuffer: ArrayBuffer;
	json: any;
	text: string;
}

export function htmlToMarkdown(html: string): string {
	return html;
}


export async function requestUrl(request: RequestParam): Promise<RequestUrlResponse> {
	if (request.url === "http://localhost:8080/ajax/library-info") {
		return {
			arrayBuffer: undefined,
			headers: undefined,
			json: {"library_map": {"eBooks": "eBooks"}, "default_library": "eBooks"},
			status: 200,
			text: ""
		}
	}

	if(request.url === "http://localhost:8080/ajax/books") {
		const books = require("./books.json");
		return {
			arrayBuffer: undefined,
			headers: undefined,
			json: books,
			status: 200,
			text: ""
		}
	}

	return {
		status: 404,
		json: "not found",
		text: "not found",
		arrayBuffer: undefined,
		headers: undefined
	}
}
