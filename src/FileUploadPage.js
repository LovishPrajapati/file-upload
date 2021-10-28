import React, { useState, useEffect } from 'react';
export default function FileUploadPage() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [overSize, setOverSize] = useState(false);
	const [res, setResult] = useState(null);
	const [loading, setloading] = useState(false);

	const changeHandler = (event) => {
		event.preventDefault();
		if (event.target.files[0].size > 5000000) {
			setOverSize(true);
		} else {
			setSelectedFile(event.target.files[0]);
			setOverSize(false);
		}
	};

	useEffect(() => {
		if (selectedFile) {
			setloading(true);
			const formData = new FormData();

			formData.append('file', selectedFile);
			formData.append(
				'expires',
				new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
			);

			fetch(`https://file.io/`, {
				method: 'POST',
				body: formData,
			})
				.then((response) => response.json())
				.then((result) => {
					setloading(false);
					if (result.success) setResult(result);
					else throw new Error(result.message);
				})
				.catch((error) => {
					setloading(false);
					console.error('Error:', error);
				});
		}
	}, [selectedFile]);

	return (
		<div className="container main-div">
			<div className="file-icon">
				<i className="fa fa-5x fa-cloud-upload" aria-hidden="true"></i>
			</div>
			<p className="title-text">Share.io</p>
			<div>
				<p className="text text-center">
					{' '}
					Super simple file sharing Convenient, anonymous and secure
				</p>
			</div>
			<div className="form-container">
				<form>
					<div className="form-group">
						<input type="file" id="upload" onChange={changeHandler} />
					</div>
					<div className="btn btn-success btn-lg">
						{loading ? (
							<span
								class="spinner-border spinner-border-sm"
								role="status"
								aria-hidden="true"
							></span>
						) : (
							<i className="fas fa-upload" style={{ marginRight: '5px' }}></i>
						)}
						<label htmlFor="upload">Choose File</label>
					</div>
					<span style={{ color: 'red' }}>
						{overSize ? <p>File size too large.</p> : ''}
					</span>
				</form>
			</div>
			{res ? (
				<div className="file-details">
					<h5>Download File Details:</h5>
					<p>
						Download Link: <a href={res.link}>{res.link}</a>
					</p>
					<p>Key: {res.key}</p>
				</div>
			) : (
				<p className="file-details">Select a file to upload less than 5 MB </p>
			)}
		</div>
	);
}
