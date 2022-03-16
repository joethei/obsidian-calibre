export enum InfoDumpType {
	PASTE,
	CREATE,
	SHOW,
}

export interface Books {
	[key: number]: Book,
}

export interface Book {
	application_id: number;
	title: string;
	authors: string[];
	tags: string[];
	cover: string;
	cover_raw: string;
	comments?: string;
	thumbnail: string;
	publisher: string;
	series: string;
	pubdate: Date;
	last_modified: Date;
	languages: string[];
	rating: number,
	formats: string[];
	user_metadata: UserMetadataWrapper;
	[key: string]: any;
}

export interface BookManifest extends Annotations{
	version: number;
	toc: Chapter;
	metadata: Book;
}

export interface Annotations {
	annotations_map: Highlight[];
}

export interface Highlight {
	highlighted_text: string;
	type: string;
	timestamp: Date;
	spine_index: number;
	spine_name: string;
	start_cfi: string;
	end_cfi: string;
	toc_family_titles: string;
	style: HighlightStyle;
}

export interface HighlightStyle {
	kind: string;
	type: string;
	which: string;
}


export interface Chapter {
	title: string;
	dest: string;
	frag: string;
	children: Chapter[];
	id: number;
}

export interface UserMetadataWrapper {
	[key: string]: UserMetadata;
}

export interface UserMetadata {
	name: string;
	label: string;
	datatype: string;
	display: UserMetadataDisplay;
	[key: string]: any;
}

export interface UserMetadataDisplay {
	description: string;
}

export interface BookSearchResults {
	total_num: number;
	book_ids: number[];
}

export interface LibraryInfo {
	library_map: Library;
	default_library: string;
}

export interface Library {
	[key: string]: string;
}

export const FILE_NAME_REGEX = /["\/<>:|?]/gm;
