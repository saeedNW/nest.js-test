/**
 * Extend the 'ProcessEnv' interface in the NodeJS namespace to create
 * globally accessible types for environment variables.
 *
 * Adding types here provides type suggestions when accessing variables
 * through 'process.env'.
 */

namespace NodeJS {
	interface ProcessEnv {
		/** Application configuration */
		SERVER_LINK: string;
		PORT: number;
		NODE_ENV: string;

		/** Database configuration */
		DB_PORT: number;
		DB_NAME: string;
		DB_USERNAME: string;
		DB_PASSWORD: string;
		DB_HOST: string;

		/** Secrets */
		ACCESS_TOKEN_SECRET: string;
	}
}
