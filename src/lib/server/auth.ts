import { lucia } from 'lucia';
import type { Session } from 'lucia';
import { mongoose } from "@lucia-auth/adapter-mongoose";
import * as models from "./db";
import { sveltekit } from "lucia/middleware";
import { dev } from "$app/environment";
import { error, type Handle, type RequestEvent } from "@sveltejs/kit";
import type { LayoutServerLoad } from '../../routes/$types';


const auth = lucia({
    adapter: mongoose(models),
    middleware: sveltekit(),
    env: dev?"DEV":"PROD",

    experimental: {
        debugMode: true
    }
})

type Auth = typeof auth;

export function hooks(): Handle {
    return async ({ event, resolve }) => {
        event.locals.auth = auth.handleRequest(event)
        if(event.route.id?.startsWith("/(api)")) {
            const isAuth = await event.locals.auth.validateBearerToken();
            if(isAuth) {
                event.locals.API.user = auth.getSession(isAuth.sessionId)
            } else {
                throw error(401, "Authorization header required to make this request.")
            }
        }
        return resolve(event);
    }
}

// export function layout(): LayoutServerLoad {
//     return async (request) => {
//         const { locals } = request
//         const lucia = await locals.auth.basic.validateUser()
//         return {
//             user: await lucia.user,
//             session: lucia.session?.sessionId,
//             pathname: request.url.pathname
//         }
//     }
// }

// function handleHeaders(event: RequestEvent, header: string): HeaderAuthRequest {
//     let validatePromise: Promise<Session | null> | null = null
//     return {
//         validate() {
//             if(!validatePromise) {
//                 validatePromise = new Promise(async (resolve) => {
//                     const sessionId = event.request.headers.get(header)?.replace("Bearer ", "");
//                     if((!sessionId) || sessionId.length === 0) {
//                         return resolve(null)
//                     }
//                     try {
//                         const session = await auth.validateSession(sessionId)
//                         return resolve(session)
//                     } catch {
//                         return resolve(null)
//                     }
//                 })
//             }
//             return validatePromise
//         }
//     }
// }

type HeaderAuthRequest = {
    validate(): Promise<Session | null>
}

export default auth;
export {
    auth,
    type Auth,
    type HeaderAuthRequest
}