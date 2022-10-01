import React, { useState } from "react"

import GetDeck from "./GetDeck"

function App(){
  const [decklist, setDecklist] = useState<deck | null>(null)

  const transmitDecklist = (decklist: deck) => {
    console.log('hehe')
    console.log(decklist)
    setDecklist(decklist)
  }

  return(<div><GetDeck transmitDecklist={transmitDecklist}/></div>)
}

export default App