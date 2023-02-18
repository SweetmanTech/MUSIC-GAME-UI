/* eslint-disable class-methods-use-this */
import { createHandler, Post, Body } from "next-api-decorators"

const ffmpegStatic = require("ffmpeg-static")
const ffmpeg = require("fluent-ffmpeg")

ffmpeg.setFfmpegPath(ffmpegStatic)

const mixAudio = (track1: string, track2: string) =>
  new Promise((resolve, reject) => {
    ffmpeg()
      .input(track1)
      .input(track2)
      .outputOptions("-filter_complex", "amix=inputs=2:duration=longest")
      .saveToFile("output.wav")
      // Log the percentage of work completed
      .on("progress", (progress) => {
        if (progress.percent) {
          console.log(`Processing: ${Math.floor(progress.percent)}% done`)
        }
      })
      // The callback that is run when FFmpeg is finished
      .on("end", () => resolve("done"))

      // The callback that is run when FFmpeg encountered an error
      .on("error", (error) => reject(error))
  })
class Remix {
  @Post()
  async remix(@Body() body: { track1: string; track2: string }) {
    const { track1, track2 } = body

    const response = await mixAudio(track1, track2)

    return response
  }
}

export default createHandler(Remix)
