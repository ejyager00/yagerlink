import { defineConfig } from "cf/config";

export default defineConfig({
	worker: {
		name: "yagerlink",
		compatibilityDate: "2026-02-23",
		compatibilityFlags: [
			"nodejs_compat",
		],
		observability: {
			enabled: true,
		},
	},
});
