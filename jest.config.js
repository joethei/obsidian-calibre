module.exports = {
	preset: "ts-jest",
	transform: {"\\.ts$": ['ts-jest']},
	collectCoverage: true,
	testEnvironment: "jsdom",
	moduleDirectories: ["node_modules", "src", "test"],
	reporters: ["default", "jest-teamcity"]
};
