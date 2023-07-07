import * as qr from 'qrcode'
import { FunctionComponent, useEffect, useRef } from 'react'

export type JoinCodeProps = {
  href: string
}

export const JoinCode: FunctionComponent<JoinCodeProps> = ({ href }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      qr.toCanvas(canvasRef.current, href).then(
        () => console.log('successfully rendered qr code'),
        (err) => console.error(err),
      )
    }
  }, [canvasRef, href])

  return (
    <p>
      <a href={href} target="_blank">
        <canvas ref={canvasRef} />
      </a>
    </p>
  )
}
