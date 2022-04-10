import {Book, BookManifest} from "./CalibreSourceTypes";

export default interface CalibreSource {

	allBooks(): Promise<Book[]|null>;

	book(id: number): Promise<Book|null>;

	libraryInfo(): Promise<string[]|null>;

	search(query: string): Promise<Book[]>;

	manifest(id: number, format: string): Promise<BookManifest|null>;

	setHostname(hostname: string) : void;

	setLibrary(library: string) : void;

}
