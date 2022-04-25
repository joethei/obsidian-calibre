import {Book, BookManifest} from "./CalibreSourceTypes";

export default interface CalibreSource {

	allBooks(): Promise<Book[]|null>;

	book(id: number): Promise<Book|null>;

	libraryInfo(): Promise<string[]|null>;

	manifest(book: Book) : Promise<BookManifest|null>;

	search(query: string): Promise<Book[]>;

	setHostname(hostname: string) : void;

	setLibrary(library: string) : void;

}
