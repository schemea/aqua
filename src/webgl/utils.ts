export class CacheManager<T, FN extends Function = (name: string) => T> {
    data = new Map<string, T>();

    constructor(public readonly creator: FN) {}

    get(key: any): T {
        let element = this.data.get(key);
        if (!element) {
            element = this.creator.apply(this, arguments);
            this.data.set(key, element);
        }
        return element;
    }
}
