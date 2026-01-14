#! /usr/bin/env sh
cd /app
go mod download
go run . -api_url "$OVERPASS_API_URL"
