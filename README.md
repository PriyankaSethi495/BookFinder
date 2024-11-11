# Book Finder App

A simple web app for searching books using the [Open Library API](https://openlibrary.org/developers/api). The app provides both basic and advanced search options, along with multiple filters. Users can search for books using both the modes, view book details, and navigate through search results with pagination.

## Features

- **Basic Search**: Search for books by title, author, or subject with filters for language.
- **Advanced Search**: Search for books with multiple filters, including author, title, publisher, subject, and first publication year.
- **Language Filter**: Choose a language for your search results (available for both basic and advanced search).
- **Pagination**: Browse through pages of search results.
- **Book Details**: View additional information about each book in a modal.
- **Toggle Between Basic and Advanced Search**: Switch seamlessly between basic and advanced search modes.
- **Responsive**: The app is responsive and adapts to different screen sizes, providing an optimal user experience on mobile, tablet, and desktop devices.

## Tech Stack

- **Frontend**: React, JavaScript, CSS
- **Styling**: Custom CSS
- **API**: Open Library API
- **State Management**: React useState hook


## Getting Started

### Prerequisites

Ensure that you have the following installed:

- [Node.js](https://nodejs.org/) (>= 16.x)
- [npm](https://www.npmjs.com/) (package manager for Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/book-finder-app.git
   cd book-finder-app

2. Install dependencies:

    ```bash
    npm install

3. Run the development server:

    ```bash
    npm start

  Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Usage
- **Basic Search**:
  - Select the search type (All, Title, Author, Subject)
  - Enter a search term in the search bar.
  - Click on Search button to fetch results.
  - Choose a language filter if needed and click "Search".

- **Advanced Search**:
  - Toggle the "Show Advanced Search" button.
  - Fill out additional filters such as author, title, publisher, and publication year.
  - Click on Search button to fetch results.
  - Choose a language if needed and click "Search".

- **View Book Details**:
  - Click on any book card to view more details in a modal.

- **Pagination**:
  - Navigate through the search results using the "Previous" and "Next" buttons.
 

Future versions could include infinite scrolling and sorting of the results.

