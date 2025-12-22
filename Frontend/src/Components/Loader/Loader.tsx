import "./Loader.css"
import React from 'react'

type LoaderProps = {
	size?: number
	text?: string
	fullscreen?: boolean
}

export default function Loader({ size = 48, text, fullscreen = true }: LoaderProps){
	const sizePx = Math.max(20, Math.min(120, size))
	const style: React.CSSProperties = { ['--loader-size' as any]: `${sizePx}px` }
	return (
		<div className={`apnisec-loader ${fullscreen ? 'fullscreen' : 'inline'}`} style={style} role="status" aria-live="polite">
			<div className="loader-inner">
				<div className="ring" aria-hidden="true" />
				{text && <div className="loader-text">{text}</div>}
			</div>
		</div>
	)
}