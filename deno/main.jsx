// Deno
import { listenAndServe } from "./deps.ts";
import { acceptWebSocket } from "./deps.ts";
import handleWs from "./handleWs.ts";

// React
import { React, ReactDOMServer } from "./deps.ts";
import Index from "../public/index.jsx";
import App from "../react/app.jsx";
import Bundle from "./bundle.ts";

// Twind
import Twind from "./twind.ts";

// bundle.jsの有無
const BUNDLE_JS_FILE_URL = "bundle.js";
const bundle = await Bundle(BUNDLE_JS_FILE_URL);

listenAndServe({ port: 8080 }, async (request) => {
    // web
    if(request.method === "GET" && request.url === "/"){
        const meta = {
            title: 'チャット',
            description: '説明',
            type: 'website',
            url: '/',
        }
        request.respond({
            status: 200,
            headers: new Headers({
                "Content-Type": "text/html",
            }),
            body: ReactDOMServer.renderToString(<Index style={Twind} src={BUNDLE_JS_FILE_URL} meta={meta} />),
        });
    }

    else if(request.method === "GET" && request.url === "/favicon.ico"){
        request.respond({
            status: 302,
            headers: new Headers({
                location: "https://deno.land/favicon.ico",
            }),
        });
    }

    else if(request.method === "GET" && request.url === "/bundle.js"){
        request.respond({
            status: 200,
            headers: new Headers({
                "Content-Type": "text/javascript",
            }),
            body: bundle,
        });
    }

    // api
    else if(request.method === "GET" && request.url === "/api"){
        request.respond({
            status: 200,
            headers: new Headers({
                "content-type": "application/json",
            }),
            body: JSON.stringify({
                test: "hoge",
            }),
        })
    }

    // ws
    else if(request.method === "GET" && request.url === "/ws"){
        const { conn, r: bufReader, w: bufWriter, headers } = request;
        acceptWebSocket({
            conn,
            bufReader,
            bufWriter,
            headers,
        }).then(handleWs)
    }

    // 404
    else{
        request.respond({
            status: 404,
            body: "404 | not Found"
        })
    }
});