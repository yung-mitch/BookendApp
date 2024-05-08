export class UserParams {
    searchString: string = '';
    pageNumber = 1;
    pageSize = 5;

    constructor(searchString?: string) {
        if (searchString) this.searchString = searchString;
    }
}