// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			auth: import("lucia").AuthRequest
			API: {
				user: any
			}
		}
		interface PrivateEnv {
			DATABASE_URL: string,
			GITHUB_SECRET: string,
			GITHUB_ID: string,
			ABLY_SECRET: string,
			URL: "localhost:8081" | "vichat.vercel.app",
			MONGOOSE_PASSWORD: string,
			MONGOOSE_URL: string,
			TOKEN_ENCRYPT: string,
			VERCEL: number
		}
	}
}


/// <reference types="lucia-auth" />
declare global {
	namespace Lucia {
		type Auth = import("$lib/server/auth").Auth;
		type DatabaseUserAttributes = {};
		type DatabaseSessionAttributes = {};
	}
}

export {};
