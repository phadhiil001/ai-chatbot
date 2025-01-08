import { useState } from "react";
import { useChat } from "ai/react";
import Image from "next/image";

const Chat = () => {
	const [submitType, setSubmitType] = useState<"text" | "image">("text");
	const [imageUrl, setImageUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const { messages, input, handleInputChange, handleSubmit } = useChat({
		api: "/api/openai",
	});

	const getImageData = async () => {
		try {
			const response = await fetch("/api/replicate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt: input }),
			});
			const { imageUrl } = await response.json();
			setImageUrl(imageUrl);
			setError("");
			handleInputChange({
				target: { value: "" },
			} as React.ChangeEvent<HTMLInputElement>);
		} catch (e) {
			setError(`An error occurred calling the API: ${e}`);
		} finally {
			setLoading(false);
		}
	};

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (submitType === "text") {
			handleSubmit(event);
		} else {
			setLoading(true);
			setImageUrl("");
			getImageData().then();
		}
	};

	const renderResponse = () => {
		if (submitType === "text") {
			return (
				<div className='response'>
					{messages.map((m, index) => (
						<div
							key={index}
							className={`chat-message ${
								m.role === "user" ? "user" : "assistant"
							}`}>
							<Image
								src={m.role === "user" ? "/download.png" : "/logo.jpg"}
								width={30}
								height={30}
								alt={m.role === "user" ? "User Avatar" : "Assistant Avatar"}
								className='avatar'
							/>
							{m.content}
						</div>
					))}
				</div>
			);
		} else {
			return (
				<div className='response'>
					{loading && (
						<div className='loading-container'>
							<div className='loading-spinner'></div>
							<p className='loading-text'>Generating...</p>
						</div>
					)}
					{imageUrl && (
						<div className='assistant image-message'>
							<Image
								src={imageUrl}
								alt='Generated'
								width={400}
								height={400}
								className='fade-in-image'
							/>
						</div>
					)}
					{error && <p className='error-message'>{error}</p>}
				</div>
			);
		}
	};

	return (
		<>
			{renderResponse()}
			<form
				onSubmit={onSubmit}
				className='mainForm'>
				<input
					name='input-field'
					placeholder='Say anything'
					onChange={handleInputChange}
					value={input}
				/>
				<button
					type='submit'
					className='mainButton'
					disabled={loading}
					onClick={() => setSubmitType("text")}>
					TEXT
				</button>
				<button
					type='submit'
					className='secondaryButton'
					disabled={loading}
					onClick={() => setSubmitType("image")}>
					IMAGE
				</button>
			</form>
		</>
	);
};

export default Chat;
