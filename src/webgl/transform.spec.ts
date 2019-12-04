import { Transform } from "./transform";
import { Matrix4 } from "./matrix/matrix4";
import { Vector3 } from "./vector";

describe("Transform", () => {
    let transform: Transform;
    let vector: Vector3;

    beforeEach(() => {
        transform = new Transform();
        vector = new Vector3(1, 1, 1);
    });

    test("constructor", () => {
        expect(transform.get()).toEqual(Matrix4.identity());
    });

    test("translate", () => {
        transform.translate(5, 1, 3);
        expect(transform.get()).toEqual(Matrix4.translate(5, 1, 3));
        vector = transform.apply(vector);
        expect(vector).toEqual(new Vector3(6, 2, 4));
    });

    test("scale", () => {
        transform.scale(5, 2, 80);
        vector = transform.apply(vector);
        expect(vector).toEqual(new Vector3(5, 2, 80));
    });

    test("rotate", () => {
        vector.coordinates = [1, 0, 0];
        transform.rotateZ(90 * Math.PI / 180);
        vector = transform.apply(vector);
        expect(vector.round(0)).toEqual(new Vector3(0, 1, 0));
    })
});
