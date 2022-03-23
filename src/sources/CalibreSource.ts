import {Book, BookManifest, Books, Highlight, LibraryInfo} from "../interfaces";

export default interface CalibreSource {

	allBooks(): Promise<Books|null>;

	book(id: number): Promise<Book|null>;

	libraryInfo(): Promise<LibraryInfo|null>;

	search(query: string): Promise<Book[]>;

	manifest(id: number, format: string): Promise<BookManifest|null>;

	annotations(book: Book): Promise<Highlight[]>;

	setHostname(hostname: string) : void;

	setLibrary(library: string) : void;

}
