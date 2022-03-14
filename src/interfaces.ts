export interface CalibreSettings{
	server: string,
	template: string,
	saveLocation: string,
	saveLocationFolder: string,
	askForFilename: boolean,
}

export const DEFAULT_SETTINGS: CalibreSettings = {
	server: "http://localhost:8080",
	template: "# {{title}}\n" +
		"\n" +
		"by:\n" +
		"{{authors}}\n" +
		"\n" +
		"---\n" +
		"{{comments}}\n" +
		"\n" +
		"---\n" +
		"\n" +
		"{{highlights}}",
	saveLocation: "default",
	saveLocationFolder: "",
	askForFilename: true,
};

export enum InfoDumpType {
	PASTE,
	CREATE
}


export interface Books {
	[key: string]: Book,
}

export interface Book {
	title: string,
	authors: string[],
	tags: string[],
	cover: string,
	formats: string[],
	comments?: string,
	thumbnail: string,
}

export const FILE_NAME_REGEX = /["\/<>:|?]/gm;
