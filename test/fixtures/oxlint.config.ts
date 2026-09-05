// Mimics how a consumer wires the shared config up.
import shared from "../../oxlint.config.js";
import { defineConfig } from "oxlint";

export default defineConfig(shared);
