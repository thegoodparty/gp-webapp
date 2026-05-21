// AudioWorkletProcessor that resamples its input down to `targetSampleRate`
// (16 kHz mono by default), encodes it as 16-bit signed little-endian PCM,
// and posts frames of `frameSize` samples back to the main thread.
//
// The resampler uses linear interpolation with a fractional read position so
// it stays correct for non-integer ratios (e.g. 44100/16000 = 2.756). An
// earlier implementation that consumed `Math.floor(ratio)` samples per output
// sample produced audio at the wrong rate whenever the browser ignored our
// requested sampleRate (Safari and some Firefox versions do this).
class PcmEncoderProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super()
    const params = (options && options.processorOptions) || {}
    this.targetSampleRate = params.targetSampleRate || 16000
    this.frameSize = params.frameSize || 2048
    this.inputSampleRate = sampleRate
    this.ratio = this.inputSampleRate / this.targetSampleRate
    // Fractional position (in input-sample units) where the next output
    // sample should be drawn from. Starts at 0 = "use input sample 0".
    this.readPosition = 0
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

    // We need samples at indices floor(readPosition) and floor(readPosition)+1
    // to interpolate. Keep producing while both are available.
    while (this.readPosition + 1 < this.resampleBuffer.length) {
      const baseIndex = Math.floor(this.readPosition)
      const frac = this.readPosition - baseIndex
      const a = this.resampleBuffer[baseIndex]
      const b = this.resampleBuffer[baseIndex + 1]
      const sample = a + (b - a) * frac
      const clamped = Math.max(-1, Math.min(1, sample))
      this.outputBuffer[this.outputIndex++] =
        clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff
      if (this.outputIndex >= this.frameSize) {
        const copy = new Int16Array(this.outputBuffer)
        this.port.postMessage(copy.buffer, [copy.buffer])
        this.outputIndex = 0
      }
      this.readPosition += this.ratio
    }

    // Drop input samples we'll never read again. We keep one sample of
    // lookbehind so the next iteration can still interpolate against the
    // sample at floor(readPosition).
    const safeToDrop = Math.max(0, Math.floor(this.readPosition))
    if (safeToDrop > 0) {
      this.resampleBuffer.splice(0, safeToDrop)
      this.readPosition -= safeToDrop
    }

    return true
  }
}

registerProcessor('pcm-encoder-processor', PcmEncoderProcessor)
