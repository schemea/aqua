export class Color {
    channels: [number, number, number, number];

    constructor();
    constructor(red: number, green: number, blue: number, alpha?: number);
    constructor(hex: number, alpha?: number);
    constructor(rgba: number[]);

    constructor(...rgba: number[] | [number[]] | [number]) {
        const channelFromArray = (rgba: number[]) => {
            this.channels = [
                typeof rgba[0] === "number" ? rgba[0] : 0,
                typeof rgba[1] === "number" ? rgba[1] : 0,
                typeof rgba[2] === "number" ? rgba[2] : 0,
                typeof rgba[3] === "number" ? rgba[3] : 1
            ];
        };

        if (typeof rgba[0] != "number") {
            // constructor(number[])
            channelFromArray(rgba[0]);
        } else if (rgba.length < 3) {
            // constructor(hex)

            const hex = rgba[0];

            channelFromArray([
                (hex >> 8 * 0 & 0xff) / 255,
                (hex >> 8 * 1 & 0xff) / 255,
                (hex >> 8 * 2 & 0xff) / 255,
                rgba[1] as number
            ]);
        } else {
            // constructor(r, g, b, a)
            channelFromArray(<number[]>rgba);
        }
    }

    get red() { return this.channels[0]; }

    set red(value: number) { this.channels[0] = value; }

    get blue() { return this.channels[1]; }

    set blue(value: number) { this.channels[1] = value; }

    get green() { return this.channels[2]; }

    set green(value: number) { this.channels[2] = value; }

    get alpha() { return this.channels[3]; }

    set alpha(value: number) { this.channels[3] = value; }
}

export namespace Color {
    export const BLACK = new Color(0, 0, 0);
    export const WHITE = new Color(1, 1, 1);
}
