
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
	const books = require("./books.json");
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
		return {
			arrayBuffer: undefined,
			headers: undefined,
			json: books,
			status: 200,
			text: ""
		}
	}

	if(request.url === "http://localhost:8080/ajax/book/449") {
		return {
			arrayBuffer: undefined,
			headers: undefined,
			json: books["449"],
			status: 200,
			text: ""
		}
	}

	if(request.url === "http://localhost:8080/ajax/book/2") {
		return {
			arrayBuffer: undefined,
			headers: undefined,
			json: books["2"],
			status: 200,
			text: ""
		}
	}

	if(request.url === "http://localhost:8080/book-get-annotations/eBooks/449-epub") {
		const highlights = require("./highlights.json");
		return {
			arrayBuffer: undefined,
			headers: undefined,
			json: highlights,
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
