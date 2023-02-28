import { NFTStorage } from "nft.storage"
/* eslint-disable class-methods-use-this */
import { createHandler, Post, Body } from "next-api-decorators"
import { readFileSync } from "fs"
import { Blob } from "buffer"
import { randomUUID } from "crypto"
import getIpfsLink from "../../../lib/getIpfsLink"

const client = new NFTStorage({
  token: `${process?.env?.NEXT_PUBLIC_NFT_STORAGE_TOKEN}`,
})

const ffmpegStatic = require("ffmpeg-static")
const ffmpeg = require("fluent-ffmpeg")

ffmpeg.setFfmpegPath(ffmpegStatic)

const mixAudio = (tracks: string[], output: string) =>
  new Promise((resolve, reject) => {
    const mergedAudio = ffmpeg()
    tracks.forEach((track: string) => {
      mergedAudio.input(track)
    })
    mergedAudio
      .outputOptions("-filter_complex", `amix=inputs=${tracks.length}:duration=longest`)
      .saveToFile(output)
      // Log the percentage of work completed
      .on("progress", () => null)
      // The callback that is run when FFmpeg is finished
      .on("end", () => resolve("done"))

      // The callback that is run when FFmpeg encountered an error
      .on("error", (error) => reject(error))
  })
class Remix {
  @Post()
  async remix(@Body() body: { tracks: string[] }) {
    const { tracks } = body
    const uuid = randomUUID()
    const outputFile = `/tmp/${uuid}.wav`
    try {
      await mixAudio(tracks, outputFile)
      const audioFile = readFileSync(outputFile)
      const fileToBlob = new Blob([audioFile], { type: "audio/wav" })
      const CID = await client.storeBlob(fileToBlob as any)
      return { CID, audioURL: getIpfsLink(`ipfs://${CID}`) }
    } catch (e) {
      throw new Error(e)
    }
  }
}

export default createHandler(Remix)
