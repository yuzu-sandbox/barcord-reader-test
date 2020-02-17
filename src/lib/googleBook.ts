import fetch from "node-fetch"

export type BookInfo = {
  volumeInfo: {
    title: string
    subtitle: string
    authors: string[]
    publishedDate: string
    description: string
    industryIdentifiers: {
      type: "ISBN_10" | "ISBN_13"
      identifier: string
    }[]
    imageLinks: {
      smallThumbnail: string
      thumbnail: string
    }
    canonicalVolumeLink: string
  }
}

type GBookResponse = {
  totalItems: number
  items: BookInfo[]
}

export async function getBookInfo(isbn: string): Promise<GBookResponse> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
  return fetch(url).then(res => res.json())
}
