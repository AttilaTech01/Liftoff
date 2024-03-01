import mondaySdk from "monday-sdk-js";
import { Logger } from '@mondaycom/apps-sdk';

declare global {
    const appName: string;
    const logger: Logger;
    let mondayClient: typeof mondaySdk;
}