import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('UserLog')
export class UserLog {
    @JsonProperty('username')
    public username: string | null = null;
    @JsonProperty('check_in_time')
    public checkInTime: number = 0;
    @JsonProperty('check_out_time')
    public checkOutTime: number = 0;
}
