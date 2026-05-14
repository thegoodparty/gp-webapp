class PcmEncoderProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super()
    const params = (options && options.processorOptions) || {}
    this.targetSampleRate = params.targetSampleRate || 16000
    this.frameSize = params.frameSize || 2048
    this.inputSampleRate = sampleRate
    this.ratio = this.inputSampleRate / this.targetSampleRate
    this.resampleBuffer = []
    this.outputBuffer = new Int16Array(this.frameSize)
    this.outputIndex = 0
  }

  process(inputs) {
    const input = inputs[0]
    if (!input || input.length === 0) {
      return true
    }
    const channel = input[0]
    if (!channel || channel.length === 0) {
      return true
    }
    for (let i = 0; i < channel.length; i++) {
      this.resampleBuffer.push(channel[i])
    }
    while (this.resampleBuffer.length >= this.ratio) {
      const sample = this.resampleBuffer.shift()
      const skip = Math.floor(this.ratio) - 1
      for (let s = 0; s < skip && this.resampleBuffer.length > 0; s++) {
        this.resampleBuffer.shift()
      }
      const clamped = Math.max(-1, Math.min(1, sample))
      this.outputBuffer[this.outputIndex++] =
        clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff
      if (this.outputIndex >= this.frameSize) {
        const copy = new Int16Array(this.outputBuffer)
        this.port.postMessage(copy.buffer, [copy.buffer])
        this.outputIndex = 0
      }
    }
    return true
  }
}

registerProcessor('pcm-encoder-processor', PcmEncoderProcessor)
