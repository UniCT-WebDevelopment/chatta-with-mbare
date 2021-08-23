import http from "http";

import io from "socket.io";
import express from "express";
import { ExpressPeerServer as peerServer } from "peer";

import { Dictionary } from "./utils";
import { SessionManager } from "./sessions";
import { createAction, payload } from "./actions";

import { api_route, resources_route } from "./routes"



export function main ( args: string[], env: Dictionary<string> ): void {
    
    const app = express();
    const server = http.createServer( app );
    const ioapp = new io.Server( server, { path: '/api/ws' });
    const peer = peerServer( server, { path: '/api/peer'})
    app.use('/api', api_route );
    //app.use('/api/peer', )

    app.use( resources_route );
    

    const sessionManager = new SessionManager( ioapp );


    const listen = {
        port: +env.HTTP_PORT || 8080,
        hostname: env.HTTP_HOSTNAME ?? 'localhost'
    };

    server.listen( listen.port, listen.hostname, () => {
        console.info(`Listening on ${listen.hostname}:${listen.port}`);
    });


}