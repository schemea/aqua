export class SharedRef {
    refCount: number = 0;

    ref(): void {
        this.refCount++;
    }

    unref(): void {
        this.refCount--;
        if (!this.refCount) {
            this.release();
        }
    }

    release(): void { }
}
