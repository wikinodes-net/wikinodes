use hdk::prelude::*;

#[hdk_extern]
pub fn who_am_i(_: ()) -> ExternResult<AgentPubKey> {
    Ok(agent_info()?.agent_latest_pubkey)
}

#[hdk_extern]
pub fn whoami(_: ()) -> ExternResult<AgentInfo> {
    Ok(agent_info()?)
}

// You need to send your input arguments via a serializable struct
#[derive(Clone, Serialize, Deserialize, Debug, SerializedBytes)]
#[serde(rename_all = "camelCase")]
pub struct InputArgumentDTO {
    pub content: String,
}

// It is recommended to send back the zome function result via a serializable struct
#[derive(Clone, Serialize, Deserialize, Debug, SerializedBytes)]
#[serde(rename_all = "camelCase")]
pub struct HelloWorldResultDTO {
    pub data: String,
}
#[hdk_extern]
pub fn hello_world(input: InputArgumentDTO) -> ExternResult<HelloWorldResultDTO> {
    let result = HelloWorldResultDTO {
        data: input.content,
    };
    Ok(result)
}

#[hdk_extern]
pub fn foo(_: ()) -> ExternResult<String> {
    Ok(String::from("foo"))
}
