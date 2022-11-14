import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('UserInfo')
export class UserInfo {
    @JsonProperty('id')
    public username: string | null = null;
    @JsonProperty('first-name')
    public firstName: string | null = null;
    @JsonProperty('last-name')
    public lastName: string | null = null;
    @JsonProperty('email')
    public email: string | null = null;
    @JsonProperty('groups')
    public roles: Array<string> = [];
}
