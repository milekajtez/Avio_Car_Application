import { AbstractFilterParam } from '../abstract-filter-param/abstract-filter-param';

export class NumberFilterParam extends AbstractFilterParam {
    value: number;

    constructor(name: string, value: number){
        super(name);
        this.value = value;
    }

    getFilterParamName(){
        return this.name;
    }

    getFilterParamValue(){
        return this.value;
    }
}
