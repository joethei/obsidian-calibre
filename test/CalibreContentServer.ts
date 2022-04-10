import CalibreContentServer from "../src/sources/CalibreContentServer";

describe('Calibre Content Server', () => {
	let server: CalibreContentServer;
	beforeEach(() => {
		server = new CalibreContentServer("http://localhost:8080", "eBooks");
	});

	test('Library Info', async () => {
		expect(await server.libraryInfo()).toEqual(["eBooks"]);
		server.setHostname("http://localhost:8081");
		expect(await server.libraryInfo()).toBeNull();
	});

	test('All Books', async () => {
		expect(await server.allBooks()).toEqual([{
			authors: ["Orwell, George"],
			chapters: undefined,
			cover: "http://localhost:8080/get/cover/449/eBooks",
			description: "Der Zukunftsroman 1984 beschreibt einen totalitären Staat",
			formats: [],
			highlights: [],
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
			series: null,
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
		}]);
		server.setHostname("http://localhost:8081");
		expect(await server.allBooks()).toBeNull();
	});
});
