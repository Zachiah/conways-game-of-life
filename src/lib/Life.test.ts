import Life from "./Life";

describe(Life, () => {
    it("should create an instance", () => {
        expect(new Life(0,0)).toBeTruthy();
    });

    it("should create the instance the proper size", () => {
        expect(new Life(5,5).cells).toEqual(new Array(5).fill(new Array(5).fill(false)));
        expect(new Life(0,5).cells).toEqual(new Array(0).fill(new Array(5).fill(false)));
    })

    it("should get the next cells properly", () => {
        let life = new Life(1,1);
        life.cells[0][0] = true;
        life.next();
        expect(life.cells[0][0]).toBeFalsy();

    })
});