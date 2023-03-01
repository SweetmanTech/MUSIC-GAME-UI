/* eslint-disable class-methods-use-this */
import { createHandler, Get } from "next-api-decorators"
import getStakedTracksLib from "../../../lib/getStakedTracks"

class GetStakedTracks {
  @Get()
  async getStakedTracks() {
    const response = await getStakedTracksLib()
    return response
  }
}

export default createHandler(GetStakedTracks)
