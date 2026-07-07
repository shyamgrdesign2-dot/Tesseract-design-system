#!/bin/sh
# Co-hosted Tesseract MCP starter.
#
# The nginx-unprivileged base image sources the scripts in /docker-entrypoint.d/
# before launching nginx in the foreground. We start the Streamable-HTTP MCP in
# the BACKGROUND here; nginx (the container's main process) then reverse-proxies
# /mcp → 127.0.0.1:$PORT. If Node ever exits, nginx keeps serving the static
# Storybook (a container restart brings the MCP back).
node /app/mcp/dist/http-server.mjs &
