"use client";

import Image from "next/image";
import Chat from "./components/Chat";

export default function Home() {
	return (
		<main className='App'>
			<div className='container'>
				<div className='logoBox'>
					<Image
						src='/logo.jpg'
						alt='SuperViral.ai logo'
						width='80'
						height='100'
					/>
					<h3>
						This is an interface to talk to an AI personal productivity coach
						with a focus on actionable advice.
					</h3>
				</div>
				<Chat />
			</div>
		</main>
	);
}
