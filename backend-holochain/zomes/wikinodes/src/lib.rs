use hdk::prelude::*;

#[hdk_extern]
pub fn foo(_: ()) -> ExternResult<String> {
    Ok(String::from("foo"))
}

// returns the current agent info
#[hdk_extern]
fn whoami(_: ()) -> ExternResult<AgentInfo> {
    Ok(agent_info()?)
}
