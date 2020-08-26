import { AbstractFilterParam } from '../abstract-filter-param/abstract-filter-param';

export class StringFilterParam extends AbstractFilterParam {
    value: string;

    constructor(name: string, value: string){
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
