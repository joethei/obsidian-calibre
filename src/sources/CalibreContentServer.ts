import {
	CcsAnnotations,
	CcsBook,
	CcsBookManifest,
	CcsBooks,
	CcsBookSearchResults,
	CcsHighlight,
	CcsLibraryInfo
} from "./CalibreContentServerTypes";
import CalibreSource from "./CalibreSource";
import {htmlToMarkdown, requestUrl} from "obsidian";
import {Book, BookManifest, CustomMetadata, Highlight} from "./CalibreSourceTypes";

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

	async book(id: number): Promise<Book|null> {
		const raw = await requestUrl({url: this.hostname + "/ajax/book/" + id });
		if (raw.status !== 200) {
			return null;
		}
		const rawBook = raw.json as CcsBook;
		return this.convertBook(rawBook);
	}

	async libraryInfo(): Promise<string[]|null> {
		const raw = await requestUrl({url: this.hostname + "/ajax/library-info"});
		if (raw.status !== 200) {
			return null;
		}
		const info = raw.json as CcsLibraryInfo;
		return Object.keys(info.library_map);
	}

	async search(query: string): Promise<Book[]> {
		const raw = await requestUrl({url: this.hostname + "/ajax/search/" + this.library + "?query=" + query});
		if (raw.status !== 200) {
			return [];
		}
		const result: Book[] = [];
		for (const bookId of (raw.json as CcsBookSearchResults).book_ids) {
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
		return raw.json as CcsBookManifest;
	}

	async allBooks(): Promise<Book[]|null> {
		const raw = await requestUrl({url: this.hostname + "/ajax/books"});
		if (raw.status !== 200) {
			return null;
		}
		const tmp = raw.json as CcsBooks;
		const result: Book[] = [];
		for (const resultKey in tmp) {
			const book = await this.convertBook(tmp[resultKey]);
			if(book) {
				result.push(book);
			}
		}
		return result;
	}

	async convertBook(rawBook: CcsBook) : Promise<Book> {
		const customMetadata: CustomMetadata[] = [];
		for (let userMetadataKey in rawBook.user_metadata) {
			const element = rawBook.user_metadata[userMetadataKey];
			customMetadata.push({
				datatype: element.datatype,
				description: element.display.description,
				label: element.label,
				name: element.name,
				value: element['#value#']
			});
		}

		return {
			authors: rawBook.authors,
			chapters: undefined,
			cover: this.hostname + rawBook.cover,
			description: rawBook.comments ? htmlToMarkdown(rawBook.comments) : "",
			formats: rawBook.formats,
			highlights: await this.convertAnnotations(rawBook),
			id: rawBook.application_id,
			identifiers: rawBook.identifiers,
			languages: rawBook.languages,
			last_modified: rawBook.last_modified,
			published: rawBook.pubdate,
			publisher: rawBook.publisher,
			rating: rawBook.rating,
			series: rawBook.series,
			tags: rawBook.tags,
			title: rawBook.title,
			custom: customMetadata
		};
	}

	async convertAnnotations(rawBook: CcsBook) : Promise<Highlight[]> {
		const result: Highlight[] = [];
		const annotations = await this.annotations(rawBook);


		return [];
	}

	async annotations(book: CcsBook): Promise<CcsHighlight[]> {
		const highlights: CcsHighlight[] = [];
		for (const format of book.formats) {
			const raw = await requestUrl({url: this.hostname + "/book-get-annotations/" + this.library + "/" + book.application_id + "-" + format});
			if (raw.status !== 200) {
				return undefined;
			}

			const annotations = Object.entries(raw.json as CcsAnnotations);
			for (const annotationKey in annotations) {
				const annotation = annotations[annotationKey];
				if(annotation[1].annotations_map.highlight) {
					highlights.push(...annotation[1].annotations_map.highlight);
				}
			}
		}

		return highlights;
	}

}

