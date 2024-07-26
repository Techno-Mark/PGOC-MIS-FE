'use strict'

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API: process.env.API
  },

  // TODO: below line is added to resolve twice event dispatch in the calendar reducer
  reactStrictMode: false
}

module.exports = nextConfig
