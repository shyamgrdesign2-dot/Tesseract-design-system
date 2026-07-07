#!/bin/sh
# Co-host entrypoint.
#
# Start the Streamable-HTTP MCP in the BACKGROUND, then hand off to the base
# nginx-unprivileged image's own entrypoint (which does its non-root setup and
# execs nginx) as PID 1. nginx therefore always runs — a Node crash only affects
# /mcp, never the static Storybook or the container's health.
node /app/mcp/dist/http-server.mjs &
exec /docker-entrypoint.sh nginx -g 'daemon off;'
