# ATS Resume Optimizer

An AI-powered application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS).

## Features

- **Resume Analysis**: Analyze your resume against job descriptions to identify missing keywords and improvement areas
- **ATS Compatibility Score**: Get a compatibility score to understand how well your resume matches the job requirements
- **Optimization Suggestions**: Receive AI-powered suggestions to improve your resume
- **User-Friendly Interface**: Modern, responsive UI with dark mode support
- **Focus Mode**: Reduce UI distractions when working on resume improvements
- **Multiple File Formats**: Support for PDF, DOCX, and TXT resume formats

## Technology Stack

- **Frontend**: React, TypeScript, Redux, Material UI
- **Backend**: Node.js, Express, OpenAI API
- **Document Processing**: PDF-parse, Mammoth (DOCX)

## Getting Started

### Prerequisites

- Node.js v16+
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/rohith2h2/ats.git
cd ats
```

2. Install dependencies for both client and server
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables
- Create a `.env` file in the server directory
- Add your OpenAI API key: `OPENAI_API_KEY=your_api_key_here`

4. Start the development servers
```bash
# Start the backend server (from the server directory)
npm run dev

# Start the frontend server (from the client directory)
npm run dev
```

5. Access the application at `http://localhost:5173` (or whatever port Vite configures)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the GPT-4 API
- Material-UI team for the excellent component library
- All contributors and supporters of this project 