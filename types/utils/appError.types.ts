export interface AppErrorType {
  message: string | string[] | (() => string | string[]);
  messages: string[] | undefined;
  statusCode: number;
  extraFields: Record<string, unknown>;
  isOperational: boolean;
}
