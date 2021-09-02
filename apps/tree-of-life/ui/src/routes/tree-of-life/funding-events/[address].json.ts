import {FundingEvent} from '../../../models/FundingEvent'

export async function get({ params }): Promise<{ body }> {
  const { address } = params

  const fundingEvent = FundingEvent.find({ address })

  if (fundingEvent) {
    return {
      body: {
        fundingEvent.asJson(),
      },
    }
  } else {
    return {
      headers: { Location: '/tree-of-life' },
      status: 302,
    }
  }
}
