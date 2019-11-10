export class CacheManager<T, FN extends Function = (name: string) => T> {
    data = new Map<string, T>();

    constructor(public readonly creator: FN) {}

    create(key: string, ...args: any[]) {
        const value = this.creator(...args);
        this.data.set(key, value);
        return value;
    }

    extractKey(...args: any[]) {return args[0];}

    get(...args: any[]): T {
        const key = this.extractKey(...args);
        let element = this.data.get(key);
        if (!element) {
            element = this.create(key, ...args)
        }
        return element;
    }
}
