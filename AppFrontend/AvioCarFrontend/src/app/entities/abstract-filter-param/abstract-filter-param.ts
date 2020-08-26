export abstract class AbstractFilterParam {
    name: string;

    constructor(name: string){
        this.name = name;
    }

    abstract getFilterParamName(): string;
}
