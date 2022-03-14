import {request} from "obsidian";
import {Books, CalibreSettings} from "./interfaces";


export async function getBooks(settings: CalibreSettings) : Promise<Books> {
	const raw = await request({url: settings.server + "/ajax/books"});
	const result = JSON.parse(raw) as Books;
	for (let resultKey in result) {
		result[resultKey].cover = settings.server + result[resultKey].cover;
		result[resultKey].thumbnail = settings.server + result[resultKey].thumbnail;
	}

	return result;
}
