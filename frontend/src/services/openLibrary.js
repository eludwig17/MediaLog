const openLibrary = 'https://openlibrary.org'

const sample_isbns = [
    '9780756404741', // The Name of the Wind
    '9780062316097', // Sapiens
    '9780743273565', // The Great Gatsby
    '9780316769174', // The Catcher in the Rye
]

// test statuses for the books
const status = ['reading', 'done', 'want', 'want']

export async function fetchPlaceholderBooks() {
    const results = await Promise.allSettled(
        sample_isbns.map(isbn =>
            fetch(`${openLibrary}/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`)
                .then(res => res.json())
                .then(data => {
                    const key = `ISBN:${isbn}`
                    const book = data[key]
                    if (!book) return null

                    const author = book.authors?.[0]?.name || 'Unknown Author'
                    const subject = book.subjects?.[0]?.name || ''
                    const genre = subject.split(' -- ')[0] || 'General'

                    return {
                        _id: isbn,
                        isbn,
                        title: book.title,
                        author,
                        genre: genre.length > 20 ? 'General' : genre,
                        status: status[sample_isbns.indexOf(isbn)],
                        pagesRead: 0,
                        pagesTotal: book.number_of_pages || 0,
                        rating: null,
                        cover: book.cover?.medium || null,
                    }
                })
        )
    )

    return results
        .filter(r => r.status === 'fulfilled' && r.value !== null)
        .map(r => r.value)
}