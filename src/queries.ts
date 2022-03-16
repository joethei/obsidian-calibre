import {requestUrl} from "obsidian";
import {Annotations, Book, BookManifest, Books, BookSearchResults, LibraryInfo} from "./interfaces";

export interface CalibreSource {

	allBooks(): Promise<Books>;

	book(id: number): Promise<Book>;

	libraryInfo(): Promise<LibraryInfo>;

	search(library: string, query: string): Promise<BookSearchResults>;

	manifest(id: number, format: string): Promise<BookManifest>;

	annotations(library: string, id: number, format: string): Promise<Annotations>;

}

export class CalibreContentServer implements CalibreSource {
	hostname: string;

	constructor(hostname: string) {
		this.hostname = hostname;
	}

	async annotations(library: string, id: number, format: string): Promise<Annotations> {
		const raw = await requestUrl({url: this.hostname + "/book-get-annotations/" + library + "/" + id + "-" + format});
		if (raw.status !== 200) {
			return undefined;
		}
		return raw.json as Annotations;
	}

	async book(id: number): Promise<Book> {
		const raw = await requestUrl({url: this.hostname + "/ajax/book/" + id });
		if (raw.status !== 200) {
			return undefined;
		}
		return raw.json as Book;
	}

	async libraryInfo(): Promise<LibraryInfo> {
		const raw = await requestUrl({url: this.hostname + "/ajax/library-info"});
		if (raw.status !== 200) {
			return undefined;
		}
		return raw.json as LibraryInfo;
	}

	async search(library: string, query: string): Promise<BookSearchResults> {
		const raw = await requestUrl({url: this.hostname + "/ajax/search/" + library + "?query=" + query});
		if (raw.status !== 200) {
			return undefined;
		}
		return raw.json as BookSearchResults;
	}

	async manifest(id: number, format: string): Promise<BookManifest> {
		const raw = await requestUrl({url: this.hostname + "/book-manifest/" + id + "/" + format});
		if (raw.status !== 200) {
			return undefined;
		}
		return raw.json as BookManifest;
	}

	async allBooks(): Promise<Books> {
		const raw = await requestUrl({url: this.hostname + "/ajax/books"});
		if (raw.status !== 200) {
			return undefined;
		}
		const result = raw.json as Books;
		for (const resultKey in result) {
			result[resultKey].cover_raw = result[resultKey].cover;
			result[resultKey].cover = this.hostname + result[resultKey].cover;
			result[resultKey].thumbnail = this.hostname + result[resultKey].thumbnail;
		}
		return result;
	}

}

