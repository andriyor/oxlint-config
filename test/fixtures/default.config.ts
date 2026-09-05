// The package default (base), spread rather than extended — so `env` and
// `ignorePatterns` apply.
import base from "../../configs/base.js";
import { defineConfig } from "oxlint";

export default defineConfig(base);
