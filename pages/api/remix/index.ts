import { NFTStorage } from "nft.storage"
/* eslint-disable class-methods-use-this */
import { createHandler, Post, Body } from "next-api-decorators"
import path from "path"
import { readFileSync } from "fs"
import { Blob } from "buffer"

const client = new NFTStorage({
  token: `${process?.env?.NEXT_PUBLIC_NFT_STORAGE_TOKEN}`,
})

const ffmpegStatic = require("ffmpeg-static")
const ffmpeg = require("fluent-ffmpeg")

ffmpeg.setFfmpegPath(ffmpegStatic)

const mixAudio = (track1: string, track2: string, output: string) =>
  new Promise((resolve, reject) => {
    ffmpeg()
      .input(track1)
      .input(track2)
      .outputOptions("-filter_complex", "amix=inputs=2:duration=longest")
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
  async remix(@Body() body: { track1: string; track2: string }) {
    console.log("hitting api")
    const { track1, track2 } = body
    console.log("track1", track1)
    console.log("track2", track2)
    const currentPath = path.resolve(process.cwd())
    console.log("currentPath", currentPath)
    const outputFile = path.join(currentPath, "output.wav")
    await mixAudio(track1, track2, outputFile)
    console.log("mixed audio")
    const audioFile = readFileSync(outputFile)
    const fileToBlob = new Blob([audioFile], { type: "audio/wav" })
    const CID = await client.storeBlob(fileToBlob as any)
    return { CID }
  }
}

export default createHandler(Remix)
