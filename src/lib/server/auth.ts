import { lucia } from 'lucia';
import type { Session } from 'lucia';
import { mongoose } from "@lucia-auth/adapter-mongoose";
import * as models from "./db";
import { sveltekit } from "lucia/middleware";
import { dev } from "$app/environment";
import { error, type Handle } from "@sveltejs/kit";
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

export function layout(): LayoutServerLoad {
    return async (request) => {
        const { locals } = request
        const lucia = await locals.auth.validate();
        if(!lucia) {
            return {
                pathname: request.url.pathname
            }
        }
        return {
            user: await lucia.user,
            session: lucia.session?.sessionId,
            pathname: request.url.pathname
        }
    }
}

export default auth;
export {
    auth,
    type Auth
}