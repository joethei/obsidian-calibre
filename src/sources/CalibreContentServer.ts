import {htmlToMarkdown, requestUrl} from "obsidian";
import {Annotations, Book, BookManifest, Books, BookSearchResults, Highlight, LibraryInfo} from "../interfaces";
import CalibreSource from "./CalibreSource";

export default class CalibreContentServer implements CalibreSource {
	hostname: string;
	library: string;

	constructor(hostname: string, library: string) {
		this.hostname = hostname;
		this.library = library;
	}

	setHostname(hostname: string) {
		this.hostname = hostname;
	}

	setLibrary(library: string) {
		this.library = library;
	}

	async annotations(book: Book): Promise<Highlight[]> {
		const highlights: Highlight[] = [];
		for (const format of book.formats) {
			const raw = await requestUrl({url: this.hostname + "/book-get-annotations/" + this.library + "/" + book.application_id + "-" + format});
			if (raw.status !== 200) {
				return undefined;
			}
			const annotations = raw.json as Annotations;
			for (const annotationsKey in annotations) {
				const annotation = annotations[annotationsKey];
				highlights.push(...annotation.annotations_map.highlight);
			}

		}

		return highlights;
	}

	async book(id: number): Promise<Book|null> {
		const raw = await requestUrl({url: this.hostname + "/ajax/book/" + id });
		if (raw.status !== 200) {
			return null;
		}
		return this.convertBook(raw.json as Book);
	}

	async libraryInfo(): Promise<LibraryInfo|null> {
		const raw = await requestUrl({url: this.hostname + "/ajax/library-info"});
		if (raw.status !== 200) {
			return null;
		}
		return raw.json as LibraryInfo;
	}

	async search(query: string): Promise<Book[]> {
		const raw = await requestUrl({url: this.hostname + "/ajax/search/" + this.library + "?query=" + query});
		if (raw.status !== 200) {
			return [];
		}
		const result: Book[] = [];
		for (const bookId of (raw.json as BookSearchResults).book_ids) {
			const book = await this.book(bookId);
			result.push(book);
		}
		return result;
	}

	async manifest(id: number, format: string): Promise<BookManifest|null> {
		const raw = await requestUrl({url: this.hostname + "/book-manifest/" + id + "/" + format});
		if (raw.status !== 200) {
			return null;
		}
		return raw.json as BookManifest;
	}

	async allBooks(): Promise<Books|null> {
		const raw = await requestUrl({url: this.hostname + "/ajax/books"});
		if (raw.status !== 200) {
			return null;
		}
		const result = raw.json as Books;
		for (const resultKey in result) {
			result[resultKey] = this.convertBook(result[resultKey]);
		}
		return result;
	}

	convertBook(book: Book) : Book {
		book.cover_raw = book.cover;
		book.cover = this.hostname + book.cover;
		book.thumbnail = this.hostname + book.thumbnail;
		if(book.comments) {
			book.comments = htmlToMarkdown(book.comments);
		}
		return book;
	}

}

