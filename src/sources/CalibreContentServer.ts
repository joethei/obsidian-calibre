import {
	CcsAnnotations,
	CcsBook,
	CcsBookManifest,
	CcsBooks,
	CcsBookSearchResults, CcsChapter,
	CcsHighlight,
	CcsLibraryInfo
} from "./CalibreContentServerTypes";
import CalibreSource from "./CalibreSource";
import {htmlToMarkdown, requestUrl} from "obsidian";
import {Book, BookManifest, Chapter, CustomMetadata, Format, Highlight} from "./CalibreSourceTypes";
import {poll} from "../functions";

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

	async manifest(book: Book): Promise<BookManifest|null> {
		return poll(async () => {
			const raw = await requestUrl({url: this.hostname + "/book-manifest/" + book.id + "/" + book.formats[0]});
			if(raw.status !== 200) return false;
			if(raw.json.job_status) return false;

			return raw;
		}).then(value => {
			const rawManifest = value.json as CcsBookManifest;
			if(!rawManifest.toc) return null;
			const chapter = this.chapters(rawManifest.toc);

			const manifest: BookManifest = {chapter: chapter};
			return manifest;

		}).catch(value => {
			console.error(value);
			return null;
		});
	}

	private chapters(rawChapter: CcsChapter, level = 0) : Chapter {
		const chapter: Chapter = {
			children: [],
			id: rawChapter.id,
			title: rawChapter.title,
			level: level

		}
		for (const child of rawChapter.children) {
			const chapters = this.chapters(child, level + 1);
			chapter.children.push(chapters);
		}

		return chapter;
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

	async convertBook(rawBook: CcsBook) : Promise<Book|null> {
		const customMetadata: CustomMetadata[] = [];
		if(!rawBook) {
			return null;
		}
		for (const userMetadataKey in rawBook.user_metadata) {
			const element = rawBook.user_metadata[userMetadataKey];
			customMetadata.push({
				datatype: element.datatype,
				description: element.display.description,
				label: element.label,
				name: element.name,
				value: element['#value#']
			});
		}

		const formats = rawBook.main_format;
		for (const key in rawBook.other_formats) {
			formats[key] = rawBook.other_formats[key];
		}

		for (const key in formats) {
			formats[key] = this.hostname + "/#book_id=" + rawBook.application_id + "&fmt=" + key + "&library_id=" + this.library + "&mode=read_book";
		}

		return {
			authors: rawBook.authors,
			cover: this.hostname + rawBook.cover,
			description: rawBook.comments ? htmlToMarkdown(rawBook.comments) : "",
			formats: formats as Format,
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
			custom: customMetadata,
			main_format: rawBook.main_format ? Object.keys(rawBook.main_format)[0] : ""
		};
	}

	async convertAnnotations(rawBook: CcsBook) : Promise<Highlight[]> {
		const result: Highlight[] = [];
		const annotations = await this.annotations(rawBook);
		if(!annotations) {
			return result;
		}
		for (const annotation of annotations) {
			result.push({
				location: annotation.toc_family_titles,
				text: annotation.highlighted_text,
				timestamp: annotation.timestamp,
				type: annotation.type,
				which: annotation.style.which,
				notes: annotation.notes

			});
		}

		return result.reverse();
	}

	private async annotations(book: CcsBook): Promise<CcsHighlight[]> {
		const highlights: CcsHighlight[] = [];
		for (const format of book.formats) {
			const raw = await requestUrl({url: this.hostname + "/book-get-annotations/" + this.library + "/" + book.application_id + "-" + format});
			if (raw.status !== 200) {
				return null;
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

