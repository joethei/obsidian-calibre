import CalibreContentServer from "../src/sources/CalibreContentServer";

describe('Calibre Content Server', () => {
	let server: CalibreContentServer;
	beforeEach(() => {
		server = new CalibreContentServer("http://localhost:8080", "eBooks");
	});

	test('Library Info', async () => {
		expect(await server.libraryInfo()).toEqual({
			"default_library": "eBooks",
			"library_map": {
				"eBooks": "eBooks"
			}
		});
		server.setHostname("http://localhost:8081");
		expect(await server.libraryInfo()).toBeNull();
	});

	test('All Books', async() => {
		const json = require('../__mocks__/books.json');
		expect(await server.allBooks()).toEqual(json);
		server.setHostname("http://localhost:8081");
		expect(await server.allBooks()).toBeNull();
	});
});
