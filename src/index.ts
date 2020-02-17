import Quagga from "quagga"
import { getBookInfo, BookInfo } from "./lib/googleBook"

const bookSet = new Set<string>()

async function main() {
  if (!(typeof navigator?.mediaDevices?.getUserMedia === "function")) {
    alert("Not supported browser")
    return
  }

  Quagga.init(
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.getElementById("quagga-elm")
      },
      decoder: {
        readers: ["ean_reader"]
      }
    },
    function(err: Error) {
      if (err) {
        console.error(err)
        return
      }
      console.log("Initialization finished. Ready to start")
      Quagga.start()
    }
  )
}

const update = (book: BookInfo) => {
  const { title, authors } = book.volumeInfo

  const elm = document.createElement("li")
  elm.innerText = `title:${title} author:${authors.join(", ")}`

  const target = document.getElementById("display")
  target?.appendChild(elm)
}

const calc = (isbn: string): boolean => {
  const arrIsbn = isbn
    .toString()
    .split("")
    .map(num => parseInt(num))
  let remainder = 0
  const checkDigit = arrIsbn.pop()

  arrIsbn.forEach((num, index) => {
    remainder += num * (index % 2 === 0 ? 1 : 3)
  })
  remainder %= 10
  remainder = remainder === 0 ? 0 : 10 - remainder

  return checkDigit === remainder
}

Quagga.onDetected(async (success: QuaggaOnDetected) => {
  const { code } = success.codeResult
  if (bookSet.has(code)) {
    // すでに検索済みなので何もしない
    return
  }

  if (!calc(code)) {
    return // checksumがおかしい
  }

  bookSet.add(code)
  if (bookSet.size >= 5) {
    // きりがないので5件取得したら切る
    Quagga.stop()
  }

  const books = await getBookInfo(code)
  if (books.totalItems >= 1) {
    books.items.forEach(b => {
      update(b)
    })
  }
})

main()
