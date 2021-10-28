import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import FileUploadPage from './FileUploadPage';
require('dotenv').config();

ReactDOM.render(
	<React.StrictMode>
		<FileUploadPage />
	</React.StrictMode>,
	document.getElementById('root')
);
