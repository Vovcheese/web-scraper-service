export interface IScraperProvider{
  setOptions(options: any): void;
  download(): Promise<void>;
}
