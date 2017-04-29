#!/usr/bin/env python

from http.server import HTTPServer, CGIHTTPRequestHandler


def run(port=5001):
    print('starting server...')

    server_address = ('127.0.0.1', port)
    httpd = HTTPServer(server_address, CGIHTTPRequestHandler)
    print('running server...')
    httpd.serve_forever()


run()
