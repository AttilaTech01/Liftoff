import mondaySdk from "monday-sdk-js";

declare global {
    let mondayClient: typeof mondaySdk;
}