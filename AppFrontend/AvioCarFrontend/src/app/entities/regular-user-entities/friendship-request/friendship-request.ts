import { stringify } from 'querystring';

export class FriendshipRequest {
    username: string;
    firstname: string;
    lastname: string;

    constructor(username: string, firstname: string, lastname: string){
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
    }
}
