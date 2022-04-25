import CalibreContentServer from "../src/sources/CalibreContentServer";

const books = [{
	authors: ["Orwell, George"],
	cover: "http://localhost:8080/get/cover/449/eBooks",
	description: "Der Zukunftsroman 1984 beschreibt einen totalitären Staat",
	formats: {
		"epub": "http://localhost:8080/#book_id=2&fmt=epub&library_id=eBooks&mode=read_book"
	},
	main_format: "epub",
	highlights: [],
	id: 2,
	identifiers: {
		ddc: "820|B",
		isbn: "9783548234106"
	},
	languages: ["deu"],
	published: "1994-12-15T18:48:22+00:00",
	last_modified: "2022-02-14T16:33:51+00:00",
	publisher: "Ullstein",
	rating: 4,
	series: "Orwell",
	tags: ["Zukunft", "paper", "Polizeistaat"],
	title: "1984 : Roman",
	custom: [
		{
			datatype: "enumeration",
			description: "",
			label: "read",
			name: "Gelesen",
			value: undefined
		},
		{
			datatype: "enumeration",
			description: "Type",
			label: "type",
			name: "Type",
			value: "PaperBook"
		}
	]
}, {
	authors: ["Orwell, George"],
	cover: "http://localhost:8080/get/cover/449/eBooks",
	description: "Der Zukunftsroman 1984 beschreibt einen totalitären Staat",
	formats: {
		"epub": "http://localhost:8080/#book_id=449&fmt=epub&library_id=eBooks&mode=read_book"
	},
	highlights: [{
		location: [
			"2",
			"2.2"
		],
		text: "Wissenschaft ist die Suche nach Wahrheit.",
		timestamp: "2021-12-26T07:10:04.407Z",
		type: "highlight",
		which: "yellow"
	}],
	id: 449,
	identifiers: {
		ddc: "820|B",
		isbn: "9783548234106"
	},
	languages: ["deu"],
	published: "1994-12-15T18:48:22+00:00",
	last_modified: "2022-02-14T16:33:51+00:00",
	publisher: "Ullstein",
	rating: 4,
	main_format: "epub",
	series: "Orwell",
	tags: ["Zukunft", "paper", "Polizeistaat"],
	title: "1984 : Roman",
	custom: [
		{
			datatype: "enumeration",
			description: "",
			label: "read",
			name: "Gelesen",
			value: undefined
		},
		{
			datatype: "enumeration",
			description: "Type",
			label: "type",
			name: "Type",
			value: "PaperBook"
		}
	]
}];

let server: CalibreContentServer;
beforeEach(() => {
	server = new CalibreContentServer("http://localhost:8080", "eBooks");
});

describe('Library Info', () => {
	test('returns valid information if server is reachable', async () => {
		expect(await server.libraryInfo()).toEqual(["eBooks"]);
	});

	test('returns null if server is not reachable', async () => {
		server.setHostname("http://localhost:8081");
		expect(await server.libraryInfo()).toBeNull();
	});

})

describe('All Books', () => {
	test('returns correct value', async () => {
		expect(expect.arrayContaining(await server.allBooks())).toEqual(expect.arrayContaining(books));
	});

	test('return null when server is unreachable', async () => {
		server.setHostname("http://localhost:8081");
		expect(await server.allBooks()).toBeNull();
	});
});

describe('single book', () => {
	test('correct value if exists', async () => {
		expect(await server.book(449)).toEqual(books[1]);
	});
	test('null when book does not exist', async () => {
		expect(await server.book(1)).toBeNull();
	});
});

describe('Annotations', () => {
	test('null when annotations endpoint ', async () => {
		const book = await server.book(2);
		expect(book.highlights).toEqual([]);
	});
});
