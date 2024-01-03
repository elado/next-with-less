import type { NextConfig } from "next";

declare module "next-with-less" {
	function NextWithLess(config: NextConfig): NextConfig;
	export default NextWithLess;
}
