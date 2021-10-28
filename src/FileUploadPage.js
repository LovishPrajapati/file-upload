import React, { useState } from 'react';
export default function FileUploadPage() {
	const [selectedFile, setSelectedFile] = useState({});
	const [isFilePicked, setIsFilePicked] = useState(false);
	const [overSize, setOverSize] = useState(false);
	const [res, setResult] = useState(null);
	const [loading, setloading] = useState(false);

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		if (event.target.files[0].size > 5000000) {
			setOverSize(true);
		} else {
			setOverSize(false);
		}
		setIsFilePicked(true);
	};

	const handleSubmission = (event) => {
		event.preventDefault();
		setloading(true);
		const formData = new FormData();

		formData.append('file', selectedFile);
		formData.append(
			'expires',
			new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
		);

		fetch(`https://file.io/?key=${process.env.REACT_APP_KEY}`, {
			method: 'POST',
			body: formData,
		})
			.then((response) => response.json())
			.then((result) => {
				console.log('Success:');
				setloading(false);
				setResult(result);
				setIsFilePicked(false);
			})
			.catch((error) => {
				setloading(false);
				console.error('Error:', error);
			});
	};

	return (
		<div className="container mt-5">
			<div className="file-icon">
				<i className="fa fa-5x fa-cloud-upload" aria-hidden="true"></i>
			</div>
			<div className="form-container">
				<form onSubmit={handleSubmission}>
					<div className="form-group">
						<input
							type="file"
							className="form-control-file"
							onChange={changeHandler}
						/>
					</div>
					<button
						type="submit"
						className="btn btn-success"
						disabled={!isFilePicked || overSize}
					>
						{loading ? (
							<span
								class="spinner-border spinner-border-sm"
								role="status"
								aria-hidden="true"
							></span>
						) : (
							''
						)}
						Upload
					</button>
				</form>
			</div>
			{isFilePicked ? (
				<div className="file-details">
					<p>Filename: {selectedFile.name}</p>
					<p>Filetype: {selectedFile.type}</p>
					<p>Size in bytes: {selectedFile.size} Bytes</p>
					<p>
						Last Modified Date:{' '}
						{new Date(selectedFile.lastModified).toDateString()}
					</p>
				</div>
			) : res ? null : (
				<p className="file-details">Select a file to upload less than 5 MB </p>
			)}
			{res ? (
				<div className="file-details">
					<h5>Download File Details:</h5>
					<p>
						Download Link: <a href={res.link}>{res.link}</a>
					</p>
					<p>Key: {res.key}</p>
				</div>
			) : null}
		</div>
	);
}
