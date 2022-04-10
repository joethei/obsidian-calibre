export interface Book {
	id: number;
	title: string;
	authors: string[];
	tags: string[];
	cover: string;
	description?: string;
	publisher: string;
	series?: string;
	published: Date;
	last_modified: Date;
	languages: string[];
	rating: number;
	formats: string[];
	highlights: Highlight[];
	identifiers: Identifiers;
	chapters: Chapter[];
	custom: CustomMetadata[];
}

export interface CustomMetadata {
	name: string;
	label: string;
	datatype: string;
	description: string;
	value: string;
}

export interface BookManifest {

}

export interface Identifiers {
	[key: string]: string;
}


export interface Highlight {
	text: string;
	timestamp: Date;
	type: "color" | "";
	which: string;
	location: string[];

}

export interface Chapter {
	id: number;
	title: string;
	children: Chapter[];
}
