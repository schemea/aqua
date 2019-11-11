export class TimeKeeper {
    previous: DOMHighResTimeStamp = 0;
    current: DOMHighResTimeStamp = 0;

    update(time: DOMHighResTimeStamp): void {
        this.previous = this.current;
        this.current = time;
    }

    elapsed(): number { return this.current - this.previous; }
}
