export interface IScraperProvider<T>{
  setOptions(options: T): void;
  download(): Promise<void>;
}
