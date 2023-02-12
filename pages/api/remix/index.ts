/* eslint-disable class-methods-use-this */
import { createHandler, Post, Body } from "next-api-decorators"
import Crunker from "crunker"

const Downloader = require("nodejs-file-downloader")

const MusicURLs = {
  drums: [
    "https://drive.google.com/file/d/1ELjwSiRnQk6Hn3A5PH1k1mRBv_MHck1S/view?usp=sharing",
    "https://drive.google.com/file/d/1PumwUeCjOhR5AMsbyhG-vOoR7QTj6f5A/view?usp=sharing",
    "https://drive.google.com/file/d/1zrAiKojjzDq9eSpo9IkpGFsaiMUa5YGS/view?usp=sharing",
    "https://drive.google.com/file/d/17abwdDpnIjgWIFPHEslYBKxoycuyfPj6/view?usp=sharing",
    "https://drive.google.com/file/d/1N00BxiC6o-NwpMdDwMblKfs79-YX_tOI/view?usp=sharing",
  ],
  vocal: [
    "https://drive.google.com/file/d/1Ofut1nYmKKDgnzljDx3BijJckkvhUVMo/view?usp=sharing",
    "https://drive.google.com/file/d/1Kf0OZstoDyAlIaDk3a23OB-LiqLT4do-/view?usp=sharing",
  ],
  guitar: [
    "https://drive.google.com/file/d/1QnEHrhowGSM2DtbV4xkNnywxU6BPqO3u/view?usp=sharing",
    "https://drive.google.com/file/d/1pmm70KxUkDFts70uT6CEYLXH89KZ06He/view?usp=sharing",
  ],
  bass: [
    "https://drive.google.com/file/d/13Wr1tCQe43sYPCvsgQg-OB2xiGyA6uGs/view?usp=sharing",
    "https://drive.google.com/file/d/1pmm70KxUkDFts70uT6CEYLXH89KZ06He/view?usp=sharing",
  ],
}
const downloadFile = async (url: string) => {
  const urlID = url.split("/d/")[1].split("/view")[0]
  console.log(urlID)
  const downloader = new Downloader({
    url: `https://drive.google.com/uc?export=download&id=${urlID}`, // If the file name already exists, a new file with the name 200MB1.zip is created.
    directory: "./tracks", // This folder will be created, if it doesn't exist.
  })
  try {
    const { filePath, downloadStatus } = await downloader.download() // Downloader.download() resolves with some useful properties.

    console.log("All done")
    return { filePath, downloadStatus }
  } catch (error) {
    // IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
    // Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
    console.log("Download failed", error)
    return error
  }
}
class RemixHandler {
  @Post()
  async remixTracks() {
    const audio = new AudioContext()
    const [track1, track2] = await Promise.all([
      downloadFile(MusicURLs.drums[0]),
      downloadFile(MusicURLs.vocal[0]),
    ])
    const OutgoingAudioMediaStream = new MediaStream()
    OutgoingAudioMediaStream.addTrack(track1.filePath)
    const incomingAudioMediaStream = new MediaStream()
    incomingAudioMediaStream.addTrack(track2.filePath)
    const audioIn01 = audio.createMediaStreamSource(OutgoingAudioMediaStream)
    const audioIn02 = audio.createMediaStreamSource(incomingAudioMediaStream)
    const dest = audio.createMediaStreamDestination()
    audioIn01.connect(dest)
    audioIn02.connect(dest)
  }
}

export default createHandler(RemixHandler)
