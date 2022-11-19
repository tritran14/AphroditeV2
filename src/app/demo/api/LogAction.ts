import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('LogAction')
export class LogAction {
    @JsonProperty('username')
    public username: string | null = null;
    @JsonProperty('tme')
    public tme: number = 0;
    @JsonProperty('type')
    public type: string | null = null;
}
