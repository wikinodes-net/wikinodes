import { FundingEvent } from '../../../models/FundingEvent'

export async function get({ params }: { params: any }): Promise<object> {
  const { address } = params

  const fundingEvent = await FundingEvent.find({ address })

  if (fundingEvent) {
    return {
      body: fundingEvent.asJson(),
    }
  } else {
    return {
      // headers: {  },
      status: 404,
    }
  }
}
