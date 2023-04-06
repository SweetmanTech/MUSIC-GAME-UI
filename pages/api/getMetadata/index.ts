/* eslint-disable class-methods-use-this */
import { Body, createHandler, Post } from "next-api-decorators"
import getURI from "../../../lib/getURI"

class GetStakedTracks {
  @Post()
  async getStakedTracks(@Body() body: { tokenIDs: number[] }) {
    const { tokenIDs } = body
    const response = await getURI(tokenIDs)
    return response
  }
}

export default createHandler(GetStakedTracks)
